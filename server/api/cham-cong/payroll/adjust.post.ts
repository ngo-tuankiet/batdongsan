import { defineEventHandler, readBody, createError } from 'h3';
import { prisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { month, userId, tripAllowance, otherAllowance, note } = body;

  if (!month || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu tháng hoặc mã nhân viên để điều chỉnh lương.',
    });
  }

  const record = await prisma.payrollAdjustment.upsert({
    where: {
      month_userId: {
        month,
        userId,
      },
    },
    update: {
      tripAllowance: tripAllowance !== undefined && tripAllowance !== '' && tripAllowance !== null ? Number(tripAllowance) : null,
      otherAllowance: otherAllowance !== undefined && otherAllowance !== '' && otherAllowance !== null ? Number(otherAllowance) : null,
      note: note || '',
    },
    create: {
      month,
      userId,
      tripAllowance: tripAllowance !== undefined && tripAllowance !== '' && tripAllowance !== null ? Number(tripAllowance) : null,
      otherAllowance: otherAllowance !== undefined && otherAllowance !== '' && otherAllowance !== null ? Number(otherAllowance) : null,
      note: note || '',
    },
  });

  return {
    success: true,
    message: 'Đã cập nhật chi phí công tác & chi phí khác thành công!',
    adjustment: record,
  };
});
