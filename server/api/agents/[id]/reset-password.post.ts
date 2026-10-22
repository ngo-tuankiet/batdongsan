import { prisma } from '../../../utils/prisma';
import { requireAdminAuth } from '../../../utils/auth';
import { hashPassword } from '../../../controllers/auth.controller';
import { PUBLIC_AGENT_SELECT } from '../../../controllers/agent.controller';

export default defineEventHandler(async (event) => {
  requireAdminAuth(event);

  const id = getRouterParam(event, 'id');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Thiếu ID nhân viên.' });

  const body = await readBody(event).catch(() => ({}));
  const newPassword = body.password && body.password.trim() ? body.password.trim() : '123456';

  const decodedId = decodeURIComponent(id);
  const agent = await prisma.agent.findFirst({
    where: {
      OR: [{ id: decodedId }, { code: decodedId }],
    },
  });

  if (!agent) {
    throw createError({ statusCode: 404, statusMessage: 'Không tìm thấy nhân viên.' });
  }

  const updated = await prisma.agent.update({
    where: { id: agent.id },
    data: {
      password: hashPassword(newPassword),
    },
    select: PUBLIC_AGENT_SELECT,
  });

  return {
    success: true,
    agent: updated,
    newPassword,
    message: `Đã reset mật khẩu cho nhân viên "${agent.name}" (${agent.code || agent.username}) thành công! Mật khẩu mới: ${newPassword}`,
  };
});
