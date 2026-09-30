import { prisma } from '../../utils/prisma';

export default defineEventHandler(async () => {
  let setting = await prisma.salarySetting.findUnique({
    where: { id: 'default' },
  });

  if (!setting) {
    setting = await prisma.salarySetting.create({
      data: {
        id: 'default',
        companyName: 'Công Ty Bến Thành',
        salaryPerDay: 50000,
        allowancePerDay: 50000,
        tripAllowance: 50000,
        otherAllowance: 0,
        otherAllowanceNote: 'Phụ cấp xăng xe, điện thoại, hỗ trợ công việc',
        lateGraceMinutes: 15,
        workStart: '09:30',
        workEnd: '12:00',
      },
    });
  }

  return setting;
});
