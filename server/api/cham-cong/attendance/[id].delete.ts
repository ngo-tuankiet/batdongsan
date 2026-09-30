import { prisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Thiếu ID chấm công.' });

  await prisma.attendance.delete({
    where: { id },
  });

  return { success: true, message: 'Đã xóa bản ghi chấm công!' };
});
