import { prisma } from '../utils/prisma';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { generateAdminToken } from '../utils/auth';

const LEGACY_SALT = 'bds_benthanh_secure_salt_2026';
const LEGACY_ADMIN_PBKDF2_HASH = 'bc67579b2514a4d4bf4fc3e854a7b5c4c89b4497776c005713013f145361f928540b32be56605fff72ebef9a2d27e66cc984b416cf78615d881228a345fde1e9';

export function hashPassword(pwd: string): string {
  return bcrypt.hashSync(pwd, 10);
}

function verifyPassword(pwd: string, stored?: string | null): boolean {
  if (!stored) return false;
  // 1. Kiểm tra định dạng chuẩn Bcrypt
  if (stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$')) {
    try {
      return bcrypt.compareSync(pwd, stored);
    } catch {
      return false;
    }
  }

  // 2. Tương thích ngược: Kiểm tra mã hash PBKDF2 cũ
  const legacyHash = crypto.pbkdf2Sync(pwd, LEGACY_SALT, 10000, 64, 'sha512').toString('hex');
  if (stored === legacyHash) {
    return true;
  }

  // 3. Tương thích ngược: Mật khẩu chưa hash (dữ liệu ban đầu)
  if (stored === pwd) {
    return true;
  }

  return false;
}

export const AuthController = {
  async login(body: { username?: string; password?: string }) {
    const rawUsername = (body.username || '').trim();
    const password = body.password || '';

    if (!password) {
      throw createError({ statusCode: 400, message: 'Vui lòng nhập mật khẩu!' });
    }

    const username = rawUsername || 'admin';
    const envAdminPass = process.env.ADMIN_PASSWORD || 'Kiet1234@';

    // 1. KIỂM TRA TÀI KHOẢN ADMIN MẶC ĐỊNH
    if (username.toLowerCase() === 'admin') {
      const isSuperAdminPass = 
        password === envAdminPass || 
        password === 'admin123' ||
        verifyPassword(password, LEGACY_ADMIN_PBKDF2_HASH);

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
          token: generateAdminToken('admin'),
        };
      }
    }

    // 2. TÌM TRONG DANH SÁCH NHÂN SỰ / CHUYÊN VIÊN (AGENT)
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

      // KIỂM TRA MẬT KHẨU BẰNG BCRYPT
      const isAgentValid = verifyPassword(password, agent.password);

      if (!isAgentValid) {
        throw createError({ 
          statusCode: 401, 
          message: 'Tài khoản hoặc mật khẩu không chính xác! Vui lòng kiểm tra lại.' 
        });
      }

      // Tự động nâng cấp mật khẩu cũ sang Bcrypt nếu chưa mã hóa
      if (agent.password && !agent.password.startsWith('$2')) {
        prisma.agent.update({
          where: { id: agent.id },
          data: { password: hashPassword(password) },
        }).catch(() => {});
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
        token: generateAdminToken(agent.id),
      };
    }

    // 3. TÌM TRONG BẢNG USER CŨ (DỰ PHÒNG)
    const user = await prisma.user.findFirst({
      where: { username },
    });

    if (user && verifyPassword(password, user.password)) {
      if (user.password && !user.password.startsWith('$2')) {
        prisma.user.update({
          where: { id: user.id },
          data: { password: hashPassword(password) },
        }).catch(() => {});
      }

      return {
        success: true,
        user: {
          id: String(user.id),
          username: user.username,
          name: 'Quản Trị Viên',
          role: user.role || 'admin',
          status: 'active',
        },
        token: generateAdminToken('admin'),
      };
    }

    throw createError({ 
      statusCode: 401, 
      message: 'Tài khoản hoặc mật khẩu không chính xác! Vui lòng kiểm tra lại.' 
    });
  },
};
