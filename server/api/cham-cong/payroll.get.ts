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

  // 4. Calculate for each employee
  const payrollList = employees.map((emp) => {
    const userAtts = attendances.filter((a) => a.userId === emp.id);

    // Ngày làm việc thực tế (có mặt, đi trễ, hoặc công tác)
    const workDays = userAtts.filter((a) => a.status === 'present' || a.status === 'late' || a.status === 'trip').length;
    // Số ngày đi công tác
    const tripDays = userAtts.filter((a) => a.isTrip || a.status === 'trip').length;
    // Số lần đi trễ
    const lateDays = userAtts.filter((a) => a.isLate || a.status === 'late').length;

    // 4 KHOẢN TÍNH LƯƠNG:
    const baseSalary = workDays * salaryPerDay;
    const allowance = workDays * allowancePerDay;
    const tripPay = tripDays * tripAllowance;
    const otherPay = workDays > 0 ? otherAllowance : 0;

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
