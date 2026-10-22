import { prisma } from '../../../utils/prisma';
import { requireAdminAuth } from '../../../utils/auth';
import { PUBLIC_AGENT_SELECT } from '../../../controllers/agent.controller';

export default defineEventHandler(async (event) => {
  requireAdminAuth(event);

  const id = getRouterParam(event, 'id');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Thiếu ID nhân viên.' });

  const decodedId = decodeURIComponent(id);
  const agent = await prisma.agent.findFirst({
    where: {
      OR: [{ id: decodedId }, { code: decodedId }],
    },
  });

  if (!agent) {
    throw createError({ statusCode: 404, statusMessage: 'Không tìm thấy nhân viên.' });
  }

  // Chuyển đổi trạng thái: active <-> locked
  const newStatus = agent.status === 'locked' ? 'active' : 'locked';

  const updated = await prisma.agent.update({
    where: { id: agent.id },
    data: {
      status: newStatus,
    },
    select: PUBLIC_AGENT_SELECT,
  });

  const actionText = newStatus === 'locked' ? 'Đã KHÓA tài khoản' : 'Đã MỞ KHÓA tài khoản';

  return {
    success: true,
    agent: updated,
    status: newStatus,
    message: `${actionText} "${agent.name}" (${agent.code || agent.username}) thành công!`,
  };
});
