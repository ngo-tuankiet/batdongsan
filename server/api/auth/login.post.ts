import { AuthController } from '../../controllers/auth.controller';

// BỘ NHỚ LƯU TRỮ RATE LIMIT CHO TRANG ĐĂNG NHẬP (15 PHÚT)
interface LoginAttemptRecord {
  count: number;
  resetAt: number;
}
const loginAttempts = new Map<string, LoginAttemptRecord>();

// Dọn dẹp cache hết hạn mỗi 15 phút
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of loginAttempts.entries()) {
    if (now > record.resetAt) {
      loginAttempts.delete(key);
    }
  }
}, 15 * 60 * 1000);

export default defineEventHandler(async (event) => {
  const clientIp = getRequestIP(event, { xForwardedFor: true }) || 
    event.node.req.socket.remoteAddress || 
    'unknown_ip';

  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 phút
  const maxAttempts = 5; // Tối đa 5 lần thử đăng nhập sai

  let record = loginAttempts.get(clientIp);
  if (record && now <= record.resetAt && record.count >= maxAttempts) {
    const remainingMinutes = Math.ceil((record.resetAt - now) / 60000);
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: `Bạn đã thử đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ${remainingMinutes} phút để bảo vệ tài khoản.`,
    });
  }

  const body = await readBody(event);

  try {
    const result = await AuthController.login(body);

    // Đăng nhập thành công -> Xóa bộ đếm vi phạm của IP này
    loginAttempts.delete(clientIp);

    if (result && result.token) {
      setCookie(event, 'bds_admin_token', result.token, {
        path: '/',
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 30, // 30 days (Giữ nguyên theo yêu cầu)
        sameSite: 'lax',
      });
    }

    return result;
  } catch (err: any) {
    // Đăng nhập thất bại -> Tăng số lần thử
    if (!record || now > record.resetAt) {
      record = { count: 1, resetAt: now + windowMs };
    } else {
      record.count++;
    }
    loginAttempts.set(clientIp, record);

    throw err;
  }
});
