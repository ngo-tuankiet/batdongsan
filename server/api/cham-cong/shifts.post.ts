import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.name || !body.workStart || !body.workEnd) {
    throw createError({ statusCode: 400, statusMessage: 'Vui lòng nhập tên khung giờ, giờ vào và giờ ra.' });
  }

  const shift = await prisma.workShift.create({
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

  return { success: true, shift, message: 'Đã thêm khung giờ làm việc mới!' };
});
