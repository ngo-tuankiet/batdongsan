import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.userId) {
    throw createError({ statusCode: 400, statusMessage: 'Vui lòng chọn nhân viên.' });
  }

  const user = await prisma.agent.findUnique({
    where: { id: body.userId },
  });

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'Không tìm thấy nhân viên này.' });
  }

  const date = body.date || new Date().toISOString().slice(0, 10);

  // Check if attendance record already exists for this user and date
  let record = await prisma.attendance.findFirst({
    where: { userId: user.id, date },
  });

  // Calculate isLate if checkIn is provided
  const checkIn = body.checkIn || (record ? record.checkIn : new Date().toTimeString().slice(0, 5));
  const checkOut = body.checkOut !== undefined ? body.checkOut : (record ? record.checkOut : null);
  const isTrip = body.isTrip !== undefined ? Boolean(body.isTrip) : false;

  // Office & Shift check
  const officeId = body.officeId || user.officeId || 'VP1';
  let officeName = body.officeName;
  if (!officeName) {
    const off = await prisma.office.findUnique({ where: { id: officeId } });
    officeName = off ? off.name : officeId;
  }

  // Get office/shift hours to calculate late
  const settings = await prisma.salarySetting.findUnique({ where: { id: 'default' } });
  
  // Dynamic shift detection for employee department
  let userShift: any = null;
  if (body.shiftId) {
    userShift = await prisma.workShift.findUnique({ where: { id: body.shiftId } });
  } else if (body.shiftName) {
    userShift = await prisma.workShift.findFirst({ where: { name: body.shiftName } });
  }

  if (!userShift && user.departmentId) {
    const allShifts = await prisma.workShift.findMany();
    userShift = allShifts.find((s: any) => s.departmentIds && s.departmentIds.split(',').includes(user.departmentId))
      || allShifts.find((s: any) => s.isDefault);
  }

  const startStandard = userShift?.workStart || settings?.workStart || '09:30';
  const grace = userShift?.lateGraceMinutes ?? (settings?.lateGraceMinutes || 15);
  const activeShiftName = userShift?.name || body.shiftName || 'Ca Chuẩn';

  let isLate = false;
  let lateMinutes = 0;
  if (!isTrip && checkIn) {
    const [h, m] = checkIn.split(':').map(Number);
    const [sh, sm] = startStandard.split(':').map(Number);
    const inTotal = h * 60 + m;
    const limitTotal = sh * 60 + sm + grace;
    if (inTotal > limitTotal) {
      isLate = true;
      lateMinutes = inTotal - (sh * 60 + sm);
    }
  }

  let status = body.status;
  if (!status) {
    if (isTrip) status = 'trip';
    else if (isLate) status = 'late';
    else status = 'present';
  }

  if (record) {
    record = await prisma.attendance.update({
      where: { id: record.id },
      data: {
        checkIn,
        checkOut,
        officeId,
        officeName,
        shiftName: activeShiftName,
        status,
        isLate,
        lateMinutes,
        isTrip,
        tripReason: body.tripReason || record.tripReason,
        note: body.note !== undefined ? body.note : record.note,
      },
    });
  } else {
    record = await prisma.attendance.create({
      data: {
        userId: user.id,
        userName: user.name,
        userCode: user.code || user.id,
        date,
        checkIn,
        checkOut,
        officeId,
        officeName,
        shiftName: activeShiftName,
        status,
        isLate,
        lateMinutes,
        isTrip,
        tripReason: body.tripReason || null,
        note: body.note || null,
      },
    });
  }

  return { success: true, record, message: 'Đã lưu thông tin điểm danh / chấm công thành công!' };
});
