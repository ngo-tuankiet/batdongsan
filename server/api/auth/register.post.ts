import { prisma } from '../../utils/prisma';
import { AgentController } from '../../controllers/agent.controller';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.name || !body.phone) {
    throw createError({ statusCode: 400, statusMessage: 'Vui lòng nhập họ và tên và số điện thoại!' });
  }

  // Kiểm tra số điện thoại hoặc username đã tồn tại chưa
  const username = (body.username || body.phone).trim();
  const existing = await prisma.agent.findFirst({
    where: {
      OR: [
        { phone: body.phone.trim() },
        { username: username },
      ],
    },
  });

  if (existing) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: `Số điện thoại hoặc tài khoản "${username}" đã tồn tại trên hệ thống!` 
    });
  }

  const agent = await AgentController.createAgent({
    name: body.name.trim(),
    phone: body.phone.trim(),
    username: username,
    password: body.password || '123456',
    userRole: 'user',
    officeId: body.officeId || 'VP1',
    departmentId: body.departmentId || 'PB01',
    role: body.role || 'Chuyên Viên Tư Vấn BĐS',
    status: 'active',
  });

  return {
    success: true,
    agent,
    message: `Chúc mừng bạn! Tài khoản đã được tạo thành công với Mã Nhân Viên: ${agent.code}. Bạn có thể đăng nhập ngay!`,
  };
});
