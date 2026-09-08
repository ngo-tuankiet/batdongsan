/**
 * Lead Collector - Tự động thu thập và gửi Lead về Telegram & Google Sheets
 */
const LeadCollector = {
  async sendLead(leadData, config) {
    const results = { telegram: false, googleSheet: false };
    
    // 1. Gửi về Telegram Bot (nếu bật cấu hình)
    if (config?.telegram_enabled && config?.telegram_bot_token && config?.telegram_chat_id && config.telegram_bot_token !== "YOUR_BOT_TOKEN_HERE") {
      try {
        const text = `🔥 *CÓ KHÁCH HÀNG MỚI ĐĂNG KÝ BĐS!* 🔥\n\n` +
          `👤 *Khách hàng:* ${leadData.name}\n` +
          `📞 *Số điện thoại:* [${leadData.phone}](tel:${leadData.phone})\n` +
          `🎯 *Nhu cầu:* ${leadData.demand || 'Tư vấn tổng quan'}\n` +
          `💰 *Tài chính dự kiến:* ${leadData.budget || 'Thương lượng'}\n` +
          `🏠 *Căn quan tâm:* ${leadData.propertyInterest || 'Chung'}\n` +
          `📝 *Ghi chú:* ${leadData.note || 'Không có'}\n` +
          `⏰ *Thời gian:* ${new Date().toLocaleString('vi-VN')}\n` +
          `🌐 *Nguồn web:* ${window.location.href}`;

        const telegramUrl = `https://api.telegram.org/bot${config.telegram_bot_token}/sendMessage`;
        const res = await fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: config.telegram_chat_id,
            text: text,
            parse_mode: 'Markdown'
          })
        });
        if (res.ok) results.telegram = true;
      } catch (err) {
        console.warn("Gửi Telegram lỗi:", err);
      }
    }

    // 2. Gửi về Google Sheets qua Apps Script Webhook (nếu có)
    if (config?.google_sheet_webhook && config.google_sheet_webhook.startsWith("http")) {
      try {
        await fetch(config.google_sheet_webhook, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...leadData,
            timestamp: new Date().toISOString(),
            source_url: window.location.href
          })
        });
        results.googleSheet = true;
      } catch (err) {
        console.warn("Gửi Google Sheets lỗi:", err);
      }
    }

    // Giữ 1 bản sao lưu trong LocalStorage của trình duyệt để không bao giờ mất lead
    try {
      const history = JSON.parse(localStorage.getItem("bds_leads_backup") || "[]");
      history.unshift({ ...leadData, time: new Date().toISOString() });
      localStorage.setItem("bds_leads_backup", JSON.stringify(history.slice(0, 50)));
    } catch (e) {}

    return results;
  }
};
