import { LeadController } from '../../controllers/lead.controller';

// BỘ NHỚ LƯU TRỮ RATE LIMIT THEO IP (10 PHÚT)
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const ipRateLimits = new Map<string, RateLimitRecord>();

// Dọn dẹp cache mỗi 15 phút
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRateLimits.entries()) {
    if (now > record.resetAt) {
      ipRateLimits.delete(ip);
    }
  }
}, 15 * 60 * 1000);

export default defineEventHandler(async (event) => {
  const clientIp = getRequestIP(event, { xForwardedFor: true }) || 
    event.node.req.socket.remoteAddress || 
    'unknown_ip';

  // 1. RATE LIMITING: Tối đa 5 lần gửi / 10 phút từ 1 IP
  const now = Date.now();
  const limitWindow = 10 * 60 * 1000; // 10 phút
  const maxAttempts = 5;

  let record = ipRateLimits.get(clientIp);
  if (!record || now > record.resetAt) {
    record = { count: 1, resetAt: now + limitWindow };
    ipRateLimits.set(clientIp, record);
  } else {
    record.count++;
    if (record.count > maxAttempts) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Bạn đã gửi thông tin quá thường xuyên. Vui lòng chờ 10 phút trước khi thử lại.',
      });
    }
  }

  // 2. ĐỌC DỮ LIỆU GỬI LÊN
  const body = await readBody(event);
  if (!body || typeof body !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dữ liệu không hợp lệ.',
    });
  }

  // 3. HONEYPOT TRAP (BẪY BOT TỰ ĐỘNG)
  // Các bot spam thường tự động điền tất cả các input ẩn mà chúng tìm thấy trong HTML
  if (body._hp_check || body.website || body.fax_number) {
    console.warn(`[Anti-Spam] Bot trapped from IP ${clientIp}. Honeypot filled:`, body._hp_check || body.website);
    // Trả về thành công ảo để bot không tiếp tục thử các cách khác, không lưu vào database
    return {
      success: true,
      message: 'Hồ sơ đã được gửi thành công.',
    };
  }

  // 4. KIỂM TRA XÁC THỰC CLOUDFLARE TURNSTILE / RECAPTCHA
  const turnstileSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  if (turnstileSecret && body.turnstileToken) {
    try {
      const verifyRes: any = await $fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: {
          secret: turnstileSecret,
          response: body.turnstileToken,
          remoteip: clientIp,
        },
      });

      if (!verifyRes?.success) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Xác thực bảo mật Cloudflare Turnstile thất bại. Vui lòng thử lại.',
        });
      }
    } catch (err: any) {
      if (err?.statusCode === 403) throw err;
      console.warn('Turnstile verification error:', err);
    }
  }

  // 5. KIỂM TRA THỜI GIAN NHẬP LIỆU (ANTI-BOT TIMING CHALLENGE)
  // Người thật cần ít nhất 2 - 3 giây để điền form, bot tự động sẽ POST trong vòng < 1 giây
  if (body._submitted_at && typeof body._submitted_at === 'number') {
    const elapsed = Date.now() - body._submitted_at;
    if (elapsed < 1500) {
      console.warn(`[Anti-Spam] Bot submission too fast (${elapsed}ms) from IP ${clientIp}`);
      return {
        success: true,
        message: 'Hồ sơ đã được gửi thành công.',
      };
    }
  }

  // 6. KIỂM TRA ĐỊNH DẠNG SỐ ĐIỆN THOẠI VIỆT NAM (10 SỐ)
  const phone = (body.phone || '').toString().trim().replace(/[\s.-]/g, '');
  const vnPhoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
  if (!vnPhoneRegex.test(phone)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam gồm 10 chữ số (VD: 0901.355.446).',
    });
  }

  // 7. VỆ SINH TÊN KHÁCH HÀNG & PHÒNG CHỐNG SPAM TỪ KHÓA
  const name = (body.name || '').toString().trim().replace(/[<>]/g, '');
  if (name.length < 2 || name.length > 100) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Họ tên phải từ 2 đến 100 ký tự.',
    });
  }

  const spamKeywords = [
    'http://', 'https://', 'www.', '.ru', '.xyz', '.top',
    'crypto', 'bitcoin', 'casino', 'viagra', 'telegram', 't.me/',
    'hack', 'vape', 'seo agency', 'backlink'
  ];
  const combinedText = `${name} ${body.propertyInterest || ''} ${body.note || ''}`.toLowerCase();
  for (const kw of spamKeywords) {
    if (combinedText.includes(kw)) {
      console.warn(`[Anti-Spam] Spam keyword "${kw}" detected from IP ${clientIp}`);
      return {
        success: true,
        message: 'Hồ sơ đã được gửi thành công.',
      };
    }
  }

  // 8. KIỂM TRA ĐỊA CHỈ & HÌNH ẢNH HỢP LỆ
  let cleanImages: string[] | null = null;
  if (Array.isArray(body.images)) {
    // Chỉ chấp nhận các đường dẫn ảnh nội bộ bắt đầu bằng /uploads/
    cleanImages = body.images
      .filter((img: any) => typeof img === 'string' && img.startsWith('/uploads/') && !img.includes('..'))
      .slice(0, 10);
  }

  // 9. LƯU VÀO DATABASE QUA CONTROLLER
  const sanitizedData = {
    name,
    phone,
    demand: (body.demand || 'Ký gửi BĐS').toString().slice(0, 100),
    budget: (body.budget || '').toString().slice(0, 100),
    propertyInterest: (body.propertyInterest || 'Bến Thành Land').toString().slice(0, 300),
    images: cleanImages,
    note: (body.note || '').toString().slice(0, 500),
    agentId: body.agentId || null,
  };

  return await LeadController.createLead(sanitizedData);
});
