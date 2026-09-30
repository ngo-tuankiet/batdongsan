import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.userId || !body.fromDate || !body.reason) {
    throw createError({ statusCode: 400, statusMessage: 'Vui lòng điền đầy đủ nhân viên, ngày và lý do xin vắng/công tác.' });
  }

  const user = await prisma.agent.findUnique({
    where: { id: body.userId },
  });

  const leave = await prisma.leaveRequest.create({
    data: {
      userId: body.userId,
      userName: user ? user.name : null,
      userCode: user ? user.code : null,
      type: body.type || 'leave',
      fromDate: body.fromDate,
      toDate: body.toDate || body.fromDate,
      reason: body.reason,
      status: body.status || 'pending',
      note: body.note || null,
    },
  });

  return { success: true, leave, message: 'Đã gửi đơn xin phép / công tác thành công!' };
});
