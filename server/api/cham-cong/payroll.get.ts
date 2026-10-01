import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const month = (query.month as string) || currentMonth;

  // 1. Get salary settings
  const settings = await prisma.salarySetting.findUnique({
    where: { id: 'default' },
  });

  const salaryPerDay = settings?.salaryPerDay ?? 50000;
  const allowancePerDay = settings?.allowancePerDay ?? 50000;
  const tripAllowance = settings?.tripAllowance ?? 50000;
  const otherAllowance = settings?.otherAllowance ?? 0;
  const otherAllowanceNote = settings?.otherAllowanceNote ?? 'Phụ cấp khác';

  // 2. Get all active agents/employees
  const employees = await prisma.agent.findMany({
    orderBy: { createdAt: 'asc' },
  });

  // 3. Get attendance for the month
  const attendances = await prisma.attendance.findMany({
    where: {
      date: { startsWith: month },
    },
  });

  // 4. Get adjustments reported by leaders for this month
  const adjustments = await prisma.payrollAdjustment.findMany({
    where: { month },
  });
  const adjMap = new Map<string, any>();
  for (const adj of adjustments) {
    adjMap.set(adj.userId, adj);
  }

  // 5. Calculate for each employee
  const payrollList = employees.map((emp) => {
    const userAtts = attendances.filter((a) => a.userId === emp.id);

    // Ngày làm việc thực tế (có mặt, đi trễ, hoặc công tác)
    const workDays = userAtts.filter((a) => a.status === 'present' || a.status === 'late' || a.status === 'trip').length;
    // Số ngày đi công tác ghi nhận qua hệ thống điểm danh
    const tripDays = userAtts.filter((a) => a.isTrip || a.status === 'trip').length;
    // Số lần đi trễ
    const lateDays = userAtts.filter((a) => a.isLate || a.status === 'late').length;

    // Khoản điều chỉnh thực tế do Leader báo lại (nếu có)
    const adj = adjMap.get(emp.id);
    const hasTripAdjustment = adj && adj.tripAllowance !== null && adj.tripAllowance !== undefined;
    const hasOtherAdjustment = adj && adj.otherAllowance !== null && adj.otherAllowance !== undefined;

    // 4 KHOẢN TÍNH LƯƠNG:
    // (1) Lương chuẩn ngày văn phòng (50.000 đ/ngày làm việc)
    const baseSalary = workDays * salaryPerDay;
    // (2) Phụ cấp cố định (nếu có)
    const allowance = workDays * allowancePerDay;
    // (3) Chi phí công tác: Nếu Leader đã báo số tiền cụ thể thì lấy số Leader báo; nếu chưa thì tính theo số ngày công tác * định mức ngày
    const tripPay = hasTripAdjustment ? Number(adj.tripAllowance) : tripDays * tripAllowance;
    // (4) Chi phí khác: Nếu Leader đã báo số tiền thì lấy số Leader báo; nếu chưa thì lấy định mức mặc định nếu có làm việc
    const otherPay = hasOtherAdjustment ? Number(adj.otherAllowance) : (workDays > 0 ? otherAllowance : 0);

    const totalSalary = baseSalary + allowance + tripPay + otherPay;

    return {
      userId: emp.id,
      userCode: emp.code || 'NV001',
      name: emp.name,
      role: emp.role,
      avatar: emp.avatar,
      officeId: emp.officeId || 'VP1',
      departmentId: emp.departmentId || '',
      isStarred: emp.isStarred,
      month,
      workDays,
      tripDays,
      lateDays,
      salaryPerDay,
      allowancePerDay,
      tripAllowance,
      otherAllowance,
      baseSalary,
      allowance,
      tripPay,
      otherPay,
      totalSalary,
      hasTripAdjustment,
      hasOtherAdjustment,
      adjustmentNote: adj?.note || '',
    };
  });

  return {
    month,
    rates: {
      salaryPerDay,
      allowancePerDay,
      tripAllowance,
      otherAllowance,
      otherAllowanceNote,
    },
    payrollList,
  };
});
