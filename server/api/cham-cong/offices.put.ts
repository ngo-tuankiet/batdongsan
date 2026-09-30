import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.id || !body.name) {
    throw createError({ statusCode: 400, statusMessage: 'Vui lòng nhập ID và tên văn phòng.' });
  }

  const updated = await prisma.office.upsert({
    where: { id: body.id },
    update: {
      name: body.name,
      address: body.address || '',
      ssid: body.ssid || null,
      networks: typeof body.networks === 'string' ? body.networks : JSON.stringify(body.networks || []),
      active: body.active !== false,
      workStart: body.workStart || '09:30',
      workEnd: body.workEnd || '12:00',
      lateGraceMinutes: Number(body.lateGraceMinutes) || 15,
    },
    create: {
      id: body.id,
      name: body.name,
      address: body.address || '',
      ssid: body.ssid || null,
      networks: typeof body.networks === 'string' ? body.networks : JSON.stringify(body.networks || []),
      active: body.active !== false,
      workStart: body.workStart || '09:30',
      workEnd: body.workEnd || '12:00',
      lateGraceMinutes: Number(body.lateGraceMinutes) || 15,
    },
  });

  return { success: true, office: updated, message: 'Đã lưu cấu hình văn phòng & WiFi thành công!' };
});
