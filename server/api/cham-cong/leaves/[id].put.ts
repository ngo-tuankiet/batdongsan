import { prisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Thiếu ID đơn xin vắng.' });

  const body = await readBody(event);

  const updated = await prisma.leaveRequest.update({
    where: { id },
    data: {
      status: body.status, // 'approved', 'rejected', 'pending'
      note: body.note,
    },
  });

  return { success: true, leave: updated, message: `Đã ${body.status === 'approved' ? 'DUYỆT' : 'TỪ CHỐI'} đơn thành công!` };
});
