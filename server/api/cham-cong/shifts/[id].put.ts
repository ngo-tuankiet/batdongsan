import { prisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Thiếu ID khung giờ.' });

  const body = await readBody(event);

  const updated = await prisma.workShift.update({
    where: { id },
    data: {
      name: body.name,
      workStart: body.workStart,
      workEnd: body.workEnd,
      lateGraceMinutes: Number(body.lateGraceMinutes) || 15,
      isDefault: Boolean(body.isDefault),
      officeId: body.officeId || null,
      departmentIds: body.departmentIds ? (Array.isArray(body.departmentIds) ? body.departmentIds.join(',') : String(body.departmentIds)) : null,
      note: body.note || null,
    },
  });

  return { success: true, shift: updated, message: 'Đã cập nhật khung giờ làm việc!' };
});
