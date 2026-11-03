import ExcelJS from 'exceljs';
import { prisma } from '../../utils/prisma';
import path from 'path';
import fs from 'fs';

function formatVNDate(dStr: string) {
  const [y, m, d] = dStr.split('-');
  return `${d}/${m}/${y}`;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  let fromDate = query.fromDate as string | undefined;
  let toDate = query.toDate as string | undefined;
  const month = query.month as string | undefined;
  const type = ((query.type as string) || 'all').toLowerCase(); // 'all', 'summary', 'detail'

  // Xác định khoảng ngày
  if (!fromDate || !toDate) {
    const targetMonth = month || currentMonthStr;
    const [yStr, mStr] = targetMonth.split('-');
    const y = parseInt(yStr, 10);
    const m = parseInt(mStr, 10);
    const dCount = new Date(y, m, 0).getDate();
    fromDate = `${targetMonth}-01`;
    toDate = `${targetMonth}-${String(dCount).padStart(2, '0')}`;
  }

  // Đảm bảo fromDate <= toDate
  if (fromDate > toDate) {
    const temp = fromDate;
    fromDate = toDate;
    toDate = temp;
  }

  // 1. Tạo danh sách các ngày trong khoảng [fromDate, toDate]
  const [y1, m1, d1] = fromDate.split('-').map(Number);
  const [y2, m2, d2] = toDate.split('-').map(Number);
  const startDate = new Date(y1, m1 - 1, d1);
  const endDate = new Date(y2, m2 - 1, d2);

  const dayCols: { index: number; day: number; month: number; year: number; dayStr: string; isWeekend: boolean; dateKey: string }[] = [];
  const cur = new Date(startDate);
  let dayIdx = 0;
  while (cur <= endDate) {
    const y = cur.getFullYear();
    const m = cur.getMonth() + 1;
    const d = cur.getDate();
    const dateKey = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayOfWeek = cur.getDay(); // 0: CN, 1: T2... 6: T7
    const dayStr = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][dayOfWeek];
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    dayCols.push({ index: dayIdx, day: d, month: m, year: y, dayStr, isWeekend, dateKey });
    cur.setDate(cur.getDate() + 1);
    dayIdx++;
  }

  // Xác định chuỗi tiêu đề thời gian
  let periodTitle = '';
  const isFullMonth = d1 === 1 && y1 === y2 && m1 === m2 && d2 === new Date(y1, m1, 0).getDate();
  if (isFullMonth) {
    periodTitle = `THÁNG ${String(m1).padStart(2, '0')}/${y1}`;
  } else {
    periodTitle = `TỪ NGÀY ${formatVNDate(fromDate)} ĐẾN NGÀY ${formatVNDate(toDate)}`;
  }

  // 2. Lấy dữ liệu từ Database
  const settings = await prisma.salarySetting.findUnique({
    where: { id: 'default' },
  });
  const salaryPerDay = settings?.salaryPerDay ?? 50000;

  // Lấy danh sách nhân sự
  const employees = await prisma.agent.findMany({
    orderBy: { createdAt: 'asc' },
  });

  // Lấy dữ liệu điểm danh trong khoảng ngày
  const attendances = await prisma.attendance.findMany({
    where: {
      date: {
        gte: fromDate,
        lte: toDate,
      },
    },
  });

  // Map điểm danh theo key: `${userId}_${date}`
  const attMap = new Map<string, any>();
  for (const att of attendances) {
    attMap.set(`${att.userId}_${att.date}`, att);
  }

  // Lấy điều chỉnh kê chi phí của Leader trong các tháng liên quan
  const touchedMonths = Array.from(new Set([fromDate.slice(0, 7), toDate.slice(0, 7)]));
  let adjustments: any[] = [];
  try {
    adjustments = await prisma.payrollAdjustment.findMany({
      where: {
        month: { in: touchedMonths },
      },
    });
  } catch (e) {
    // Fallback nếu bảng chưa đồng bộ
  }
  const adjMap = new Map<string, any>();
  for (const adj of adjustments) {
    adjMap.set(adj.userId, adj);
  }

  // Tính toán dữ liệu cho từng nhân viên
  const processedData = employees.map((emp, index) => {
    const daysData: { [dateKey: string]: number | '' } = {};
    let totalWorkDays = 0;

    for (const dInfo of dayCols) {
      const att = attMap.get(`${emp.id}_${dInfo.dateKey}`);
      if (att) {
        let val: number | '' = 1;
        const noteLower = (att.note || '').toLowerCase();

        if (noteLower.includes('1.5') || noteLower.includes('tăng ca')) {
          val = 1.5;
        } else if (att.status === 'leave' || att.status === 'p' || noteLower.includes('phép')) {
          val = 0.5;
        } else if (att.status === 'trip' || att.isTrip) {
          val = 1;
        } else if (att.checkIn || att.status === 'present' || att.status === 'late' || att.status === 'approved') {
          val = 1;
        }
        daysData[dInfo.dateKey] = val;
        totalWorkDays += typeof val === 'number' ? val : 0;
      } else {
        daysData[dInfo.dateKey] = '';
      }
    }

    // Tiền công 50k/ ngày
    const salary = totalWorkDays * salaryPerDay;

    // Phụ cấp xăng xe 200k/ tháng (* Trên 15 ngày phụ cấp xăng xe)
    const adj = adjMap.get(emp.id);
    let fuelAllowance = 0;
    if (adj && adj.otherAllowance !== null && adj.otherAllowance !== undefined) {
      fuelAllowance = Number(adj.otherAllowance);
    } else if (totalWorkDays >= 15) {
      fuelAllowance = 200000;
    }

    const totalPay = salary + fuelAllowance;

    return {
      stt: index + 1,
      userId: emp.id,
      name: emp.name,
      role: emp.role || 'Nhân Viên',
      daysData,
      totalWorkDays,
      salary,
      fuelAllowance,
      totalPay,
    };
  });

  // Tạo file Excel với ExcelJS
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Ben Thanh Construction';

  const headerBgColor = 'FFA6C2D4'; // Xanh xám nhạt thanh lịch
  const weekendBgColor = 'FFD9E1F2'; // Xanh nhạt cho Thứ 7 & Chủ Nhật
  const noteHeaderBgColor = 'FFFCE4D6';
  const totalBgColor = 'FFF2F2F2';

  const borderAllThin: Partial<ExcelJS.Borders> = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  const logoPath = path.resolve(process.cwd(), 'public/images/logo-ben-thanh.png');
  const hasLogo = fs.existsSync(logoPath);

  // =========================================================================
  // 1. TẠO SHEET 1: BẢNG TỔNG HỢP (NẾU type === 'all' HOẶC type === 'summary')
  // =========================================================================
  if (type === 'all' || type === 'summary') {
    const ws1 = wb.addWorksheet('Bảng Tổng Hợp');
    ws1.views = [{ showGridLines: true }];

    if (hasLogo) {
      try {
        const logoId = wb.addImage({
          filename: logoPath,
          extension: 'png',
        });
        ws1.addImage(logoId, {
          tl: { col: 0.2, row: 0.1 },
          ext: { width: 130, height: 42 },
        });
      } catch (e) {}
    }

    ws1.getCell('A1').value = 'Công Ty Cổ Phần TM DV Tư Vấn Thiết Kế và Xây Dựng Bến Thành';
    ws1.getCell('A1').font = { name: 'Arial', size: 11, bold: true };

    ws1.mergeCells('A3:H3');
    const titleCell1 = ws1.getCell('A3');
    titleCell1.value = `BẢNG TỔNG HỢP CHẤM CÔNG VÀ LƯƠNG - ${periodTitle}`;
    titleCell1.font = { name: 'Arial', size: 13, bold: true };
    titleCell1.alignment = { horizontal: 'center', vertical: 'middle' };
    ws1.getRow(3).height = 28;

    const headers1 = [
      { title: 'STT', width: 6, align: 'center' },
      { title: 'Họ và tên', width: 28, align: 'left' },
      { title: 'Chức vụ', width: 32, align: 'left' },
      { title: 'Tổng ngày công', width: 16, align: 'center' },
      { title: `Tiền công\n${Math.round(salaryPerDay / 1000)}k/ ngày`, width: 18, align: 'right' },
      { title: 'Tiền phụ cấp xăng xe\n200k/ tháng', width: 22, align: 'right' },
      { title: 'Tổng nhận', width: 18, align: 'right' },
      { title: 'Ký nhận', width: 14, align: 'center' },
    ];

    ws1.getRow(5).height = 28;
    headers1.forEach((h, idx) => {
      const colNum = idx + 1;
      const cell = ws1.getCell(5, colNum);
      cell.value = h.title;
      cell.font = { name: 'Arial', size: 10, bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerBgColor } };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = borderAllThin;
      ws1.getColumn(colNum).width = h.width;
    });

    let curRow1 = 6;
    processedData.forEach((emp) => {
      ws1.getRow(curRow1).height = 22;

      ws1.getCell(curRow1, 1).value = emp.stt;
      ws1.getCell(curRow1, 1).alignment = { horizontal: 'center', vertical: 'middle' };

      ws1.getCell(curRow1, 2).value = emp.name;
      ws1.getCell(curRow1, 2).alignment = { horizontal: 'left', vertical: 'middle' };

      ws1.getCell(curRow1, 3).value = emp.role;
      ws1.getCell(curRow1, 3).alignment = { horizontal: 'left', vertical: 'middle' };

      ws1.getCell(curRow1, 4).value = emp.totalWorkDays;
      ws1.getCell(curRow1, 4).alignment = { horizontal: 'center', vertical: 'middle' };
      ws1.getCell(curRow1, 4).font = { bold: true };

      ws1.getCell(curRow1, 5).value = emp.salary;
      ws1.getCell(curRow1, 5).alignment = { horizontal: 'right', vertical: 'middle' };
      ws1.getCell(curRow1, 5).numFmt = '#,##0';

      ws1.getCell(curRow1, 6).value = emp.fuelAllowance > 0 ? emp.fuelAllowance : '';
      ws1.getCell(curRow1, 6).alignment = { horizontal: 'right', vertical: 'middle' };
      ws1.getCell(curRow1, 6).numFmt = '#,##0';

      ws1.getCell(curRow1, 7).value = emp.totalPay;
      ws1.getCell(curRow1, 7).alignment = { horizontal: 'right', vertical: 'middle' };
      ws1.getCell(curRow1, 7).font = { bold: true };
      ws1.getCell(curRow1, 7).numFmt = '#,##0';

      ws1.getCell(curRow1, 8).value = '';

      for (let c = 1; c <= 8; c++) {
        ws1.getCell(curRow1, c).border = borderAllThin;
        ws1.getCell(curRow1, c).font = { ...ws1.getCell(curRow1, c).font, name: 'Arial', size: 10 };
      }
      curRow1++;
    });

    // Dòng Total
    ws1.getRow(curRow1).height = 24;
    ws1.mergeCells(`A${curRow1}:C${curRow1}`);
    const totalCell1 = ws1.getCell(`A${curRow1}`);
    totalCell1.value = 'Total';
    totalCell1.font = { name: 'Arial', size: 10, bold: true };
    totalCell1.alignment = { horizontal: 'center', vertical: 'middle' };

    const lastDataRow1 = curRow1 - 1;
    ws1.getCell(curRow1, 4).value = { formula: `SUM(D6:D${lastDataRow1})` };
    ws1.getCell(curRow1, 4).alignment = { horizontal: 'center', vertical: 'middle' };
    ws1.getCell(curRow1, 4).font = { name: 'Arial', size: 10, bold: true };

    ws1.getCell(curRow1, 5).value = { formula: `SUM(E6:E${lastDataRow1})` };
    ws1.getCell(curRow1, 5).alignment = { horizontal: 'right', vertical: 'middle' };
    ws1.getCell(curRow1, 5).font = { name: 'Arial', size: 10, bold: true };
    ws1.getCell(curRow1, 5).numFmt = '#,##0';

    ws1.getCell(curRow1, 6).value = { formula: `SUM(F6:F${lastDataRow1})` };
    ws1.getCell(curRow1, 6).alignment = { horizontal: 'right', vertical: 'middle' };
    ws1.getCell(curRow1, 6).font = { name: 'Arial', size: 10, bold: true };
    ws1.getCell(curRow1, 6).numFmt = '#,##0';

    ws1.getCell(curRow1, 7).value = { formula: `SUM(G6:G${lastDataRow1})` };
    ws1.getCell(curRow1, 7).alignment = { horizontal: 'right', vertical: 'middle' };
    ws1.getCell(curRow1, 7).font = { name: 'Arial', size: 10, bold: true };
    ws1.getCell(curRow1, 7).numFmt = '#,##0';

    for (let c = 1; c <= 8; c++) {
      ws1.getCell(curRow1, c).border = {
        top: { style: 'thin' },
        bottom: { style: 'double' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
      ws1.getCell(curRow1, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: totalBgColor } };
    }

    // 3 Chữ ký
    const sigRow1 = curRow1 + 3;
    ws1.getCell(sigRow1, 2).value = 'Người lập biểu\n(Ký, họ tên)';
    ws1.getCell(sigRow1, 2).font = { name: 'Arial', size: 10, bold: true };
    ws1.getCell(sigRow1, 2).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    ws1.getCell(sigRow1, 5).value = 'Kế Toán\n(Ký, họ tên)';
    ws1.getCell(sigRow1, 5).font = { name: 'Arial', size: 10, bold: true };
    ws1.getCell(sigRow1, 5).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    ws1.getCell(sigRow1, 7).value = 'Giám đốc\n(Ký, họ tên)';
    ws1.getCell(sigRow1, 7).font = { name: 'Arial', size: 10, bold: true };
    ws1.getCell(sigRow1, 7).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  }

  // =========================================================================
  // 2. TẠO SHEET 2: CHẤM CÔNG CHI TIẾT (NẾU type === 'all' HOẶC type === 'detail')
  // =========================================================================
  if (type === 'all' || type === 'detail') {
    const ws2 = wb.addWorksheet('Chấm Công Chi Tiết');
    ws2.views = [{ showGridLines: true }];

    if (hasLogo) {
      try {
        const logoId = wb.addImage({
          filename: logoPath,
          extension: 'png',
        });
        ws2.addImage(logoId, {
          tl: { col: 0.2, row: 0.1 },
          ext: { width: 130, height: 42 },
        });
      } catch (e) {}
    }

    ws2.getCell('A1').value = 'Công Ty Cổ Phần TM DV Tư Vấn Thiết Kế và Xây Dựng Bến Thành';
    ws2.getCell('A1').font = { name: 'Arial', size: 11, bold: true };

    const startDayCol = 4; // Col D = 4
    const endDayCol = startDayCol + dayCols.length - 1;

    const colTotalWorkdays = endDayCol + 1;
    const colSalary = endDayCol + 2;
    const colFuel = endDayCol + 3;
    const colTotalPay = endDayCol + 4;
    const colSign = endDayCol + 5;
    const totalCols = colSign;

    ws2.mergeCells(3, 1, 3, totalCols);
    const titleCell2 = ws2.getCell(3, 1);
    titleCell2.value = `BẢNG CHẤM CÔNG CHI TIẾT - ${periodTitle}`;
    titleCell2.font = { name: 'Arial', size: 13, bold: true };
    titleCell2.alignment = { horizontal: 'center', vertical: 'middle' };
    ws2.getRow(3).height = 28;

    // Headers (Hàng 5, 6, 7)
    ws2.mergeCells(5, 1, 7, 1);
    ws2.getCell(5, 1).value = 'STT';
    ws2.getColumn(1).width = 6;

    ws2.mergeCells(5, 2, 7, 2);
    ws2.getCell(5, 2).value = 'Họ và tên';
    ws2.getColumn(2).width = 24;

    ws2.mergeCells(5, 3, 7, 3);
    ws2.getCell(5, 3).value = 'Chức vụ';
    ws2.getColumn(3).width = 28;

    // Cột Ngày trong khoảng (Hàng 5: gộp toàn bộ ngày)
    ws2.mergeCells(5, startDayCol, 5, endDayCol);
    ws2.getCell(5, startDayCol).value = 'Ngày trong kỳ';

    // Hàng 6: Số ngày (hiển thị ngày trong tháng)
    // Hàng 7: Thứ (T2..CN)
    dayCols.forEach((dInfo, idx) => {
      const c = startDayCol + idx;
      ws2.getColumn(c).width = 4.2;

      const cellDay = ws2.getCell(6, c);
      cellDay.value = dInfo.day;

      const cellWd = ws2.getCell(7, c);
      cellWd.value = dInfo.dayStr;

      if (dInfo.isWeekend) {
        cellDay.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: weekendBgColor } };
        cellWd.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: weekendBgColor } };
      }
    });

    // Các cột tổng hợp phía sau (Gộp hàng 5..7)
    ws2.mergeCells(5, colTotalWorkdays, 7, colTotalWorkdays);
    ws2.getCell(5, colTotalWorkdays).value = 'Tổng\nngày\ncông';
    ws2.getColumn(colTotalWorkdays).width = 9;

    ws2.mergeCells(5, colSalary, 7, colSalary);
    ws2.getCell(5, colSalary).value = `Tiền công\n${Math.round(salaryPerDay / 1000)}k/ ngày`;
    ws2.getColumn(colSalary).width = 13;

    ws2.mergeCells(5, colFuel, 7, colFuel);
    ws2.getCell(5, colFuel).value = 'Tiền phụ\ncấp xăng\nxe 200k/\ntháng';
    ws2.getColumn(colFuel).width = 13;

    ws2.mergeCells(5, colTotalPay, 7, colTotalPay);
    ws2.getCell(5, colTotalPay).value = 'Tổng nhận';
    ws2.getColumn(colTotalPay).width = 14;

    ws2.mergeCells(5, colSign, 7, colSign);
    ws2.getCell(5, colSign).value = 'Ký nhận';
    ws2.getColumn(colSign).width = 10;

    for (let r = 5; r <= 7; r++) {
      ws2.getRow(r).height = r === 5 ? 20 : 18;
      for (let c = 1; c <= totalCols; c++) {
        const cell = ws2.getCell(r, c);
        cell.font = { name: 'Arial', size: 9, bold: true };
        cell.border = borderAllThin;
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        if (!cell.fill) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerBgColor } };
        }
      }
    }

    let curRow2 = 8;
    processedData.forEach((emp) => {
      ws2.getRow(curRow2).height = 20;

      ws2.getCell(curRow2, 1).value = emp.stt;
      ws2.getCell(curRow2, 1).alignment = { horizontal: 'center', vertical: 'middle' };

      ws2.getCell(curRow2, 2).value = emp.name;
      ws2.getCell(curRow2, 2).alignment = { horizontal: 'left', vertical: 'middle' };

      ws2.getCell(curRow2, 3).value = emp.role;
      ws2.getCell(curRow2, 3).alignment = { horizontal: 'left', vertical: 'middle' };

      dayCols.forEach((dInfo, idx) => {
        const c = startDayCol + idx;
        const cell = ws2.getCell(curRow2, c);
        cell.alignment = { horizontal: 'center', vertical: 'middle' };

        if (dInfo.isWeekend) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: weekendBgColor } };
        }

        const val = emp.daysData[dInfo.dateKey];
        if (val !== '') {
          cell.value = val;
        }
      });

      ws2.getCell(curRow2, colTotalWorkdays).value = emp.totalWorkDays;
      ws2.getCell(curRow2, colTotalWorkdays).alignment = { horizontal: 'center', vertical: 'middle' };
      ws2.getCell(curRow2, colTotalWorkdays).font = { bold: true };

      ws2.getCell(curRow2, colSalary).value = emp.salary;
      ws2.getCell(curRow2, colSalary).alignment = { horizontal: 'right', vertical: 'middle' };
      ws2.getCell(curRow2, colSalary).numFmt = '#,##0';

      ws2.getCell(curRow2, colFuel).value = emp.fuelAllowance > 0 ? emp.fuelAllowance : '';
      ws2.getCell(curRow2, colFuel).alignment = { horizontal: 'right', vertical: 'middle' };
      ws2.getCell(curRow2, colFuel).numFmt = '#,##0';

      ws2.getCell(curRow2, colTotalPay).value = emp.totalPay;
      ws2.getCell(curRow2, colTotalPay).alignment = { horizontal: 'right', vertical: 'middle' };
      ws2.getCell(curRow2, colTotalPay).font = { bold: true };
      ws2.getCell(curRow2, colTotalPay).numFmt = '#,##0';

      ws2.getCell(curRow2, colSign).value = '';

      for (let c = 1; c <= totalCols; c++) {
        ws2.getCell(curRow2, c).border = borderAllThin;
        ws2.getCell(curRow2, c).font = { ...ws2.getCell(curRow2, c).font, name: 'Arial', size: 9 };
      }
      curRow2++;
    });

    // Dòng Total cho Sheet 2
    ws2.getRow(curRow2).height = 22;
    ws2.mergeCells(curRow2, 1, curRow2, 3);
    const totalCell2 = ws2.getCell(curRow2, 1);
    totalCell2.value = 'Total';
    totalCell2.font = { name: 'Arial', size: 9, bold: true };
    totalCell2.alignment = { horizontal: 'center', vertical: 'middle' };

    const lastDataRow2 = curRow2 - 1;
    const colTotalWorkdaysLetter = ws2.getColumn(colTotalWorkdays).letter;
    const colSalaryLetter = ws2.getColumn(colSalary).letter;
    const colFuelLetter = ws2.getColumn(colFuel).letter;
    const colTotalPayLetter = ws2.getColumn(colTotalPay).letter;

    ws2.getCell(curRow2, colTotalWorkdays).value = { formula: `SUM(${colTotalWorkdaysLetter}8:${colTotalWorkdaysLetter}${lastDataRow2})` };
    ws2.getCell(curRow2, colTotalWorkdays).alignment = { horizontal: 'center', vertical: 'middle' };
    ws2.getCell(curRow2, colTotalWorkdays).font = { name: 'Arial', size: 9, bold: true };

    ws2.getCell(curRow2, colSalary).value = { formula: `SUM(${colSalaryLetter}8:${colSalaryLetter}${lastDataRow2})` };
    ws2.getCell(curRow2, colSalary).alignment = { horizontal: 'right', vertical: 'middle' };
    ws2.getCell(curRow2, colSalary).font = { name: 'Arial', size: 9, bold: true };
    ws2.getCell(curRow2, colSalary).numFmt = '#,##0';

    ws2.getCell(curRow2, colFuel).value = { formula: `SUM(${colFuelLetter}8:${colFuelLetter}${lastDataRow2})` };
    ws2.getCell(curRow2, colFuel).alignment = { horizontal: 'right', vertical: 'middle' };
    ws2.getCell(curRow2, colFuel).font = { name: 'Arial', size: 9, bold: true };
    ws2.getCell(curRow2, colFuel).numFmt = '#,##0';

    ws2.getCell(curRow2, colTotalPay).value = { formula: `SUM(${colTotalPayLetter}8:${colTotalPayLetter}${lastDataRow2})` };
    ws2.getCell(curRow2, colTotalPay).alignment = { horizontal: 'right', vertical: 'middle' };
    ws2.getCell(curRow2, colTotalPay).font = { name: 'Arial', size: 9, bold: true };
    ws2.getCell(curRow2, colTotalPay).numFmt = '#,##0';

    for (let c = 1; c <= totalCols; c++) {
      ws2.getCell(curRow2, c).border = {
        top: { style: 'thin' },
        bottom: { style: 'double' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
      ws2.getCell(curRow2, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: totalBgColor } };
    }

    // 3 Chữ ký cho Sheet 2
    const sigRow2 = curRow2 + 3;
    ws2.mergeCells(sigRow2, 5, sigRow2, 9);
    ws2.getCell(sigRow2, 5).value = 'Người lập biểu\n(Ký, họ tên)';
    ws2.getCell(sigRow2, 5).font = { name: 'Arial', size: 10, bold: true };
    ws2.getCell(sigRow2, 5).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    ws2.mergeCells(sigRow2, 17, sigRow2, 22);
    ws2.getCell(sigRow2, 17).value = 'Kế Toán\n(Ký, họ tên)';
    ws2.getCell(sigRow2, 17).font = { name: 'Arial', size: 10, bold: true };
    ws2.getCell(sigRow2, 17).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    ws2.mergeCells(sigRow2, colTotalPay - 2, sigRow2, colSign);
    ws2.getCell(sigRow2, colTotalPay - 2).value = 'Giám đốc\n(Ký, họ tên)';
    ws2.getCell(sigRow2, colTotalPay - 2).font = { name: 'Arial', size: 10, bold: true };
    ws2.getCell(sigRow2, colTotalPay - 2).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    // Bảng Ghi Chú Quy Ước ở góc dưới bên trái
    const noteRowStart = curRow2 + 7;
    const noteItems = [
      { label: 'Lên cty', val: '1' },
      { label: 'Nghỉ Có Phép', val: '0,5' },
      { label: 'Nghỉ Không Phép', val: '0' },
      { label: 'Tăng ca', val: '1,5' },
      { label: 'Chuyên cần', val: `${Math.round(salaryPerDay / 1000)}k/ngày` },
      { label: 'Phụ cấp hỗ trợ xăng xe', val: '200k/ tháng' },
    ];

    ws2.mergeCells(noteRowStart, 1, noteRowStart + noteItems.length - 1, 1);
    const noteHeaderCell = ws2.getCell(noteRowStart, 1);
    noteHeaderCell.value = 'Ghi\nchú';
    noteHeaderCell.font = { name: 'Arial', size: 9, bold: true };
    noteHeaderCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    noteHeaderCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: noteHeaderBgColor } };
    noteHeaderCell.border = borderAllThin;

    noteItems.forEach((item, idx) => {
      const r = noteRowStart + idx;
      ws2.mergeCells(r, 2, r, 4);
      const labelCell = ws2.getCell(r, 2);
      labelCell.value = item.label;
      labelCell.font = { name: 'Arial', size: 9 };
      labelCell.border = borderAllThin;
      labelCell.alignment = { horizontal: 'left', vertical: 'middle' };

      ws2.mergeCells(r, 5, r, 7);
      const valCell = ws2.getCell(r, 5);
      valCell.value = item.val;
      valCell.font = { name: 'Arial', size: 9 };
      valCell.border = borderAllThin;
      valCell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    const ruleRow = noteRowStart + noteItems.length;
    ws2.mergeCells(ruleRow, 2, ruleRow, 7);
    const ruleCell = ws2.getCell(ruleRow, 2);
    ruleCell.value = '* Trên 15 ngày phụ cấp xăng xe';
    ruleCell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FFC00000' } };
    ruleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  }

  const buffer = await wb.xlsx.writeBuffer();

  const typeName = type === 'all' ? 'Tron_Bo' : type === 'summary' ? 'Tong_Hop' : 'Chi_Tiet';
  const fileName = `Bang_Cham_Cong_${fromDate}_den_${toDate}_${typeName}.xlsx`;

  setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  setHeader(event, 'Content-Disposition', `attachment; filename="${fileName}"`);
  setHeader(event, 'Content-Length', buffer.byteLength);

  return buffer;
});
