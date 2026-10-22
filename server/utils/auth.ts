import crypto from 'node:crypto';
import type { H3Event } from 'h3';

const AUTH_SECRET = process.env.AUTH_SECRET || 'bds_benthanh_token_secret_2026_super_secure';

export function generateAdminToken(payloadData: string = 'admin'): string {
  const timestamp = Date.now();
  const payload = `${payloadData}:${timestamp}`;
  const hmac = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64url');
}

export function verifyAdminToken(token?: string | null): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;
    const [user, timestampStr, hmac] = parts;
    const payload = `${user}:${timestampStr}`;
    const expectedHmac = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
    if (hmac !== expectedHmac) return false;
    const timestamp = parseInt(timestampStr, 10);
    // Token valid for 30 days (Yêu cầu người dùng giữ nguyên 30 ngày)
    if (Date.now() - timestamp > 30 * 24 * 60 * 60 * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

export function requireAdminAuth(event: H3Event) {
  const cookieToken = getCookie(event, 'bds_admin_token');
  const authHeader = getHeader(event, 'authorization');
  const customHeader = getHeader(event, 'x-admin-token');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const token = cookieToken || bearerToken || customHeader;

  if (!verifyAdminToken(token)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Phiên làm việc đã hết hạn hoặc bạn không có quyền truy cập. Vui lòng đăng nhập quản trị!',
    });
  }
}
