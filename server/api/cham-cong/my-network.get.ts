import { defineEventHandler } from 'h3';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const req = event.node.req;
  
  // 1. Lấy IP của client (hỗ trợ Nginx, Cloudflare reverse proxy hoặc direct connection)
  let ip = (
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.headers['cf-connecting-ip'] ||
    req.socket.remoteAddress ||
    ''
  ) as string;

  if (ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }
  if (ip.startsWith('::ffff:')) {
    ip = ip.slice(7);
  }
  if (ip === '::1') {
    ip = '127.0.0.1';
  }

  // 2. Tính toán dải mạng /24 tự động (VD: 116.109.185.xxx -> 116.109.185.)
  let subnet = ip;
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      subnet = `${parts[0]}.${parts[1]}.${parts[2]}.`;
    }
  }

  // 3. Kiểm tra xem IP hiện tại có khớp với văn phòng nào không
  const offices = await prisma.office.findMany({
    where: { active: true },
  });

  let matchedOffice = null;
  for (const off of offices) {
    if (!off.networks) continue;
    let nets: string[] = [];
    try {
      nets = JSON.parse(off.networks);
    } catch {
      nets = [off.networks];
    }

    const matched = nets.some((net) => {
      const n = net.trim();
      return n && (ip === n || ip.startsWith(n));
    });

    if (matched) {
      matchedOffice = {
        id: off.id,
        name: off.name,
        address: off.address,
        ssid: off.ssid,
      };
      break;
    }
  }

  return {
    success: true,
    ip,
    subnet,
    isLocal: ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.'),
    matchedOffice,
  };
});
