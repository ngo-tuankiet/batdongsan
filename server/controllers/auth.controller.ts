import { prisma } from '../utils/prisma';
import crypto from 'node:crypto';

const SALT = 'bds_benthanh_secure_salt_2026';
// Hash PBKDF2 của mật khẩu: Kiet1234@
const ADMIN_PBKDF2_HASH = 'bc67579b2514a4d4bf4fc3e854a7b5c4c89b4497776c005713013f145361f928540b32be56605fff72ebef9a2d27e66cc984b416cf78615d881228a345fde1e9';

export function hashPassword(pwd: string): string {
  return crypto.pbkdf2Sync(pwd, SALT, 10000, 64, 'sha512').toString('hex');
}

export const AuthController = {
  async login(body: { username?: string; password?: string }) {
    const { username = 'admin', password } = body;

    if (!password) {
      throw createError({ statusCode: 400, message: 'Vui lòng nhập mật khẩu!' });
    }

    const inputHash = hashPassword(password);

    // Tìm user trong database
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    let isValid = false;

    if (user) {
      if (user.password === inputHash) {
        isValid = true;
      }
    }

    // Nếu user chưa có trong DB hoặc DB có lỗi, kiểm tra trực tiếp với hash chuẩn của Kiet1234@
    if (!isValid && inputHash === ADMIN_PBKDF2_HASH) {
      isValid = true;
      try {
        await prisma.user.upsert({
          where: { username: 'admin' },
          update: { password: ADMIN_PBKDF2_HASH },
          create: { username: 'admin', password: ADMIN_PBKDF2_HASH, role: 'admin' },
        });
      } catch (e) {}
    }

    if (!isValid) {
      throw createError({ statusCode: 401, message: 'Mật khẩu quản trị không chính xác!' });
    }

    return {
      success: true,
      user: {
        username: user?.username || 'admin',
        role: user?.role || 'admin',
      },
      token: 'admin-session-token-' + Date.now(),
    };
  },
};
