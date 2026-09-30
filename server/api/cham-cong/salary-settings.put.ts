import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const updated = await prisma.salarySetting.upsert({
    where: { id: 'default' },
    update: {
      companyName: body.companyName || 'Công Ty Bến Thành',
      salaryPerDay: Number(body.salaryPerDay) || 50000,
      allowancePerDay: Number(body.allowancePerDay) || 50000,
      tripAllowance: Number(body.tripAllowance) || 50000,
      otherAllowance: Number(body.otherAllowance) || 0,
      otherAllowanceNote: body.otherAllowanceNote || 'Phụ cấp xăng xe, điện thoại, hỗ trợ công việc',
      lateGraceMinutes: Number(body.lateGraceMinutes) || 15,
      workStart: body.workStart || '09:30',
      workEnd: body.workEnd || '12:00',
      requireWifi: body.requireWifi !== undefined ? Boolean(body.requireWifi) : true,
      trustProxy: body.trustProxy !== undefined ? Boolean(body.trustProxy) : true,
    },
    create: {
      id: 'default',
      companyName: body.companyName || 'Công Ty Bến Thành',
      salaryPerDay: Number(body.salaryPerDay) || 50000,
      allowancePerDay: Number(body.allowancePerDay) || 50000,
      tripAllowance: Number(body.tripAllowance) || 50000,
      otherAllowance: Number(body.otherAllowance) || 0,
      otherAllowanceNote: body.otherAllowanceNote || 'Phụ cấp xăng xe, điện thoại, hỗ trợ công việc',
      lateGraceMinutes: Number(body.lateGraceMinutes) || 15,
      workStart: body.workStart || '09:30',
      workEnd: body.workEnd || '12:00',
      requireWifi: body.requireWifi !== undefined ? Boolean(body.requireWifi) : true,
      trustProxy: body.trustProxy !== undefined ? Boolean(body.trustProxy) : true,
    },
  });

  return { success: true, setting: updated, message: 'Đã lưu cấu hình định mức lương và giờ làm việc thành công!' };
});
