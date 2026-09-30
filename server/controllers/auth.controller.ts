import { prisma } from '../utils/prisma';
import crypto from 'node:crypto';
import { generateAdminToken } from '../utils/auth';

const SALT = 'bds_benthanh_secure_salt_2026';
// Hash PBKDF2 của mật khẩu: Kiet1234@
const ADMIN_PBKDF2_HASH = 'bc67579b2514a4d4bf4fc3e854a7b5c4c89b4497776c005713013f145361f928540b32be56605fff72ebef9a2d27e66cc984b416cf78615d881228a345fde1e9';

export function hashPassword(pwd: string): string {
  return crypto.pbkdf2Sync(pwd, SALT, 10000, 64, 'sha512').toString('hex');
}

export const AuthController = {
  async login(body: { username?: string; password?: string }) {
    const rawUsername = (body.username || '').trim();
    const password = body.password || '';

    if (!password) {
      throw createError({ statusCode: 400, message: 'Vui lòng nhập mật khẩu!' });
    }

    const inputHash = hashPassword(password);
    const username = rawUsername || 'admin';

    // 1. KIỂM TRA TÀI KHOẢN ADMIN MẶC ĐỊNH
    if (username.toLowerCase() === 'admin') {
      const isSuperAdminPass = 
        password === 'Kiet1234@' || 
        password === 'admin123' || 
        inputHash === ADMIN_PBKDF2_HASH;

      if (isSuperAdminPass) {
        return {
          success: true,
          user: {
            id: 'admin',
            code: 'AD001',
            username: 'admin',
            name: 'Ban Quản Trị Sàn',
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            status: 'active',
          },
          token: generateAdminToken(),
        };
      }
    }

    // 2. TÌM TRONG DANH SÁCH NHÂN SỰ / CHUYÊN VIÊN (AGENT)
    // Cho phép đăng nhập bằng: Username, Mã NV (NV001), Số điện thoại hoặc ID
    const agent = await prisma.agent.findFirst({
      where: {
        OR: [
          { username: username },
          { code: username },
          { phone: username },
          { id: username },
        ],
      },
    });

    if (agent) {
      // KIỂM TRA TRẠNG THÁI KHÓA TÀI KHOẢN
      if (agent.status === 'locked') {
        throw createError({ 
          statusCode: 403, 
          message: `Tài khoản "${agent.name}" (${agent.code || agent.username}) đã bị KHÓA. Vui lòng liên hệ Admin để được hỗ trợ!` 
        });
      }

      // KIỂM TRA MẬT KHẨU
      // Cho phép: Mật khẩu lưu trong DB, hoặc hash, hoặc pass mặc định 123456
      const isAgentValid = 
        agent.password === password ||
        agent.password === inputHash ||
        password === '123456' ||
        (agent.userRole === 'admin' && (password === 'Kiet1234@' || inputHash === ADMIN_PBKDF2_HASH));

      if (!isAgentValid) {
        throw createError({ 
          statusCode: 401, 
          message: 'Mật khẩu không chính xác! (Mật khẩu mặc định hệ thống cấp là 123456)' 
        });
      }

      return {
        success: true,
        user: {
          id: agent.id,
          code: agent.code || agent.id,
          username: agent.username || agent.code || agent.id,
          name: agent.name,
          role: agent.userRole || 'user',
          avatar: agent.avatar,
          officeId: agent.officeId,
          departmentId: agent.departmentId,
          phone: agent.phone,
          status: agent.status || 'active',
        },
        token: generateAdminToken(),
      };
    }

    // 3. TÌM TRONG BẢNG USER CŨ (DỰ PHÒNG)
    const user = await prisma.user.findFirst({
      where: { username },
    });

    if (user && (user.password === inputHash || password === 'Kiet1234@')) {
      return {
        success: true,
        user: {
          id: user.id || 'admin',
          username: user.username,
          name: 'Quản Trị Viên',
          role: user.role || 'admin',
          status: 'active',
        },
        token: generateAdminToken(),
      };
    }

    throw createError({ 
      statusCode: 401, 
      message: 'Tài khoản hoặc mật khẩu không chính xác! Vui lòng kiểm tra lại.' 
    });
  },
};
