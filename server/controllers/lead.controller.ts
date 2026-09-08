import { prisma } from '../utils/prisma';

export const LeadController = {
  // GET /api/leads
  async getLeads() {
    return await prisma.lead.findMany({
      include: { agent: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  // POST /api/leads
  async createLead(data: any) {
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        demand: data.demand,
        budget: data.budget,
        propertyInterest: data.propertyInterest,
        note: data.note,
        agentId: data.agentId || null,
      },
    });

    // Bắn thông báo Telegram nếu có bot token trong biến môi trường
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      try {
        const text = `🔥 *CÓ KHÁCH HÀNG MỚI ĐĂNG KÝ BĐS!* 🔥\n\n` +
          `👤 *Khách hàng:* ${lead.name}\n` +
          `📞 *Số điện thoại:* [${lead.phone}](tel:${lead.phone})\n` +
          `🎯 *Nhu cầu:* ${lead.demand || 'Tư vấn'}\n` +
          `💰 *Ngân sách:* ${lead.budget || 'Thương lượng'}\n` +
          `🏠 *Quan tâm:* ${lead.propertyInterest || 'Chung'}\n` +
          `⏰ *Thời gian:* ${new Date().toLocaleString('vi-VN')}`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: 'Markdown',
          }),
        });
      } catch (err) {
        console.warn('Telegram notify error:', err);
      }
    }

    return lead;
  },
};
