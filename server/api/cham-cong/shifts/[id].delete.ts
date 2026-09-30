import { prisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Thiếu ID khung giờ.' });

  await prisma.workShift.delete({
    where: { id },
  });

  return { success: true, message: 'Đã xóa khung giờ làm việc!' };
});
