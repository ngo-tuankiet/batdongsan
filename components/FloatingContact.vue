<template>
  <div>
    <!-- KHUNG CỬA SỔ CHAT TƯ VẤN TRỰC TUYẾN (CHATBOX) -->
    <transition name="chat-slide">
      <div v-if="isChatOpen" class="live-chat-window">
        <!-- Chat Header -->
        <div class="chat-header">
          <div class="chat-advisor-info">
            <div class="advisor-avatar-box">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80" alt="Advisor">
              <span class="online-indicator"></span>
            </div>
            <div>
              <div class="advisor-title">Tư Vấn BĐS Bến Thành</div>
              <div class="advisor-status">
                <span class="pulsing-green-dot"></span> Đang trực tuyến • Phản hồi ngay
              </div>
            </div>
          </div>

          <div class="chat-header-actions">
            <a href="https://zalo.me/0912131329" target="_blank" class="header-action-icon zalo" title="Chat qua Zalo">
              <i class="fa-solid fa-comment-dots"></i>
            </a>
            <button class="header-action-icon close" @click="isChatOpen = false" title="Đóng khung chat">
              &times;
            </button>
          </div>
        </div>

        <!-- Chat Messages Body -->
        <div ref="chatBodyRef" class="chat-messages-body">
          <div class="chat-date-divider">
            <span>Hôm nay</span>
          </div>

          <div 
            v-for="(msg, idx) in messages" 
            :key="idx" 
            class="message-row" 
            :class="msg.sender === 'user' ? 'user-msg' : 'bot-msg'"
          >
            <!-- Avatar nếu là bot -->
            <div v-if="msg.sender === 'bot'" class="bot-msg-avatar">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80" alt="Advisor">
            </div>

            <div class="msg-bubble-wrap">
              <div class="msg-bubble">
                <p v-html="msg.text"></p>
              </div>
              <span class="msg-time">{{ msg.time }}</span>

              <!-- Các gợi ý trả lời nhanh (Quick Chips) -->
              <div v-if="msg.chips && msg.chips.length > 0" class="quick-chips-wrap">
                <button 
                  v-for="(chip, cIdx) in msg.chips" 
                  :key="cIdx"
                  class="quick-chip-btn"
                  @click="handleSendChip(chip)"
                >
                  {{ chip }}
                </button>
              </div>
            </div>
          </div>

          <!-- Typing indicator khi đang phản hồi -->
          <div v-if="isTyping" class="message-row bot-msg">
            <div class="bot-msg-avatar">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80" alt="Advisor">
            </div>
            <div class="msg-bubble typing-bubble">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        </div>

        <!-- Chat Input Footer -->
        <form @submit.prevent="handleSendMessage" class="chat-footer-form">
          <input 
            v-model="inputMsg" 
            type="text" 
            placeholder="Nhập tin nhắn hoặc để lại SĐT..."
            class="chat-input-field"
            required
          >
          <button type="submit" class="chat-send-btn" title="Gửi tin nhắn">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </transition>

    <!-- NÚT GỌI & BẬT CHAT NỔI (FLOATING BAR) -->
    <div class="floating-contact-bar">
      <!-- Nút Gọi Hotline Trực Tiếp -->
      <a href="tel:0912131329" class="float-circle-btn call" title="Gọi Hotline 0912.131.329">
        <i class="fa-solid fa-phone"></i>
      </a>

      <!-- Nút Mở Live Chatbox -->
      <button class="float-circle-btn chat" @click="toggleChat" title="Chat tư vấn trực tuyến">
        <i v-if="!isChatOpen" class="fa-solid fa-comment-dots"></i>
        <i v-else class="fa-solid fa-xmark"></i>
        <span v-if="!isChatOpen" class="chat-unread-badge">1</span>
      </button>
    </div>

    <!-- Toast Notification Global -->
    <div v-if="toastMsg" class="modal-overlay" style="background: transparent; pointer-events: none; z-index: 3000; justify-content: flex-end; align-items: flex-start; padding: 25px;">
      <div style="background: #10b981; color: #fff; padding: 14px 22px; border-radius: var(--radius-sm); box-shadow: var(--shadow-md); font-size: 0.92rem; font-weight: 600; display: flex; align-items: center; gap: 10px; pointer-events: auto;">
        <i class="fa-solid fa-circle-check"></i> {{ toastMsg }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { toastMsg, showToast } = useToast();

const isChatOpen = ref(false);
const inputMsg = ref('');
const isTyping = ref(false);
const chatBodyRef = ref<HTMLElement | null>(null);

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  time: string;
  chips?: string[];
}

const getCurrentTime = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

// Tin nhắn khởi tạo
const messages = ref<ChatMessage[]>([
  {
    sender: 'bot',
    text: 'Xin chào quý khách! Tôi là trợ lý tư vấn của <strong>Sàn Bất Động Sản Bến Thành</strong>.<br>Quý khách đang quan tâm đến dòng sản phẩm nào tại Quận 1 ạ?',
    time: getCurrentTime(),
    chips: [
      '🏠 Xem quỹ căn Nhà Phố',
      '🏢 Dự Án căn hộ cao cấp',
      '💰 Tư vấn dòng tiền & lãi suất',
      '📞 Yêu cầu gọi lại tư vấn',
    ],
  },
]);

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
  if (isChatOpen.value) {
    scrollToBottom();
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatBodyRef.value) {
      chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight;
    }
  });
};

const handleSendChip = (chipText: string) => {
  sendMessage(chipText);
};

const handleSendMessage = () => {
  if (!inputMsg.value.trim()) return;
  const text = inputMsg.value.trim();
  inputMsg.value = '';
  sendMessage(text);
};

const sendMessage = async (userText: string) => {
  // 1. Thêm tin nhắn của User
  messages.value.push({
    sender: 'user',
    text: userText,
    time: getCurrentTime(),
  });
  scrollToBottom();

  // 2. Kiểm tra nếu tin nhắn có chứa SỐ ĐIỆN THOẠI -> TỰ ĐỘNG TẠO LEAD VÀO DATABASE
  const phoneMatch = userText.match(/(0[3|5|7|8|9][0-9]{8})/);
  if (phoneMatch) {
    const phoneNumber = phoneMatch[0];
    try {
      await $fetch('/api/leads', {
        method: 'POST',
        body: {
          name: 'Khách Live Chat',
          phone: phoneNumber,
          demand: userText,
          propertyInterest: 'Chatbox tư vấn trực tuyến',
          note: 'Khách để lại số điện thoại qua Chatbox trang chủ',
        },
      });
      showToast('Đã ghi nhận số điện thoại của quý khách!');
    } catch (e) {
      console.warn('Lưu lead chatbox lỗi:', e);
    }

    isTyping.value = true;
    setTimeout(() => {
      isTyping.value = false;
      messages.value.push({
        sender: 'bot',
        text: `Dạ em đã nhận được số điện thoại <strong>${phoneNumber}</strong> của quý khách!<br>Chuyên viên phụ trách khu vực Quận 1 sẽ gọi điện và gửi file PDF quỹ căn chi tiết qua Zalo cho mình trong 5 phút nữa ạ.`,
        time: getCurrentTime(),
      });
      scrollToBottom();
    }, 900);
    return;
  }

  // 3. Phản hồi thông minh theo kịch bản tư vấn
  isTyping.value = true;
  setTimeout(() => {
    isTyping.value = false;
    let botReply = '';
    let followUpChips: string[] = [];

    const lower = userText.toLowerCase();

    if (lower.includes('nhà phố') || lower.includes('nha pho')) {
      botReply = 'Dạ hiện Sàn Bến Thành đang có các căn <strong>Nhà Phố mặt tiền & hẻm xe hơi</strong> tại P. Bến Thành, Đa Kao, Tân Định giá từ <strong>23.5 Tỷ - 85 Tỷ</strong> (đang có sẵn HĐ thuê từ 60 - 150 triệu/tháng).<br>Quý khách có thể để lại <strong>Số Điện Thoại</strong> để nhận bảng vẽ quy hoạch và lịch xem nhà thực tế nhé!';
      followUpChips = ['📞 090... (Để lại SĐT)', '📍 Xem nhà P. Bến Thành', '📍 Xem nhà P. Đa Kao'];
    } else if (lower.includes('dự án') || lower.includes('du an') || lower.includes('căn hộ')) {
      botReply = 'Dạ các dự án căn hộ hạng sang trọng điểm hiện tại gồm <strong>Grand Marina Saigon (Bến Nghé)</strong> và <strong>D1 Mension Somerset (Bến Thành/Cầu Kho)</strong> giá từ <strong>14.8 Tỷ - 52 Tỷ</strong>.<br>Quý khách muốn xem căn mấy phòng ngủ hoặc để lại <strong>Số Điện Thoại</strong> em gửi bảng giá gốc nhé!';
      followUpChips = ['📞 Để lại SĐT nhận báo giá', '🏢 Căn 2 Phòng Ngủ', '🏢 Duplex Penthouse'];
    } else if (lower.includes('dòng tiền') || lower.includes('lãi suất') || lower.includes('vay') || lower.includes('đòn bẩy')) {
      botReply = 'Dạ bên em có bảng phân tích công thức <strong>Đòn Bẩy Tài Chính 30-70</strong> và tính toán dòng tiền cho thuê bù lãi ngân hàng an toàn tuyệt đối.<br>Quý khách nhắn lại <strong>Số Điện Thoại</strong> để chuyên gia tài chính gửi bảng tính Excel cho mình nhé!';
      followUpChips = ['📞 Để lại Số Điện Thoại'];
    } else if (lower.includes('gọi lại') || lower.includes('tư vấn') || lower.includes('hotline')) {
      botReply = 'Dạ quý khách chỉ cần nhập <strong>Số Điện Thoại</strong> tại đây hoặc gọi trực tiếp Hotline Sàn: <a href="tel:0912131329" style="color:var(--gold-primary); font-weight:700;">0912.131.329</a> (24/7) để được hỗ trợ nhanh nhất ạ!';
    } else {
      botReply = 'Cảm ơn quý khách đã nhắn tin! Quý khách vui lòng để lại <strong>Số Điện Thoại</strong> hoặc nhu cầu mức tài chính dự kiến để Chuyên viên phụ trách liên hệ hỗ trợ chu đáo nhất nhé!';
      followUpChips = ['📞 Để lại SĐT liên hệ'];
    }

    messages.value.push({
      sender: 'bot',
      text: botReply,
      time: getCurrentTime(),
      chips: followUpChips,
    });
    scrollToBottom();
  }, 800);
};
</script>

<style scoped>
/* FLOATING BUTTONS */
.floating-contact-bar {
  position: fixed;
  bottom: 25px;
  right: 25px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.float-circle-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.35rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  position: relative;
  text-decoration: none;
}

.float-circle-btn.call {
  background: #10b981;
  animation: pulse-green 2s infinite;
}

.float-circle-btn.chat {
  background: var(--gold-gradient);
  color: #000;
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
}

.float-circle-btn:hover {
  transform: scale(1.1);
}

.chat-unread-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #ef4444;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}

@keyframes pulse-green {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { box-shadow: 0 0 0 14px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

/* LIVE CHAT WINDOW */
.live-chat-window {
  position: fixed;
  bottom: 95px;
  right: 25px;
  width: 360px;
  height: 500px;
  max-width: calc(100vw - 30px);
  max-height: calc(100vh - 120px);
  background: var(--bg-card);
  border: 1px solid var(--border-gold);
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: var(--font-body);
}

/* TRANSITION */
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chat-slide-enter-from,
.chat-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* CHAT HEADER */
.chat-header {
  padding: 14px 16px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, var(--bg-secondary) 100%);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-advisor-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.advisor-avatar-box {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  overflow: hidden;
  border: 1.5px solid var(--gold-primary);
  flex-shrink: 0;
}

.advisor-avatar-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 9px;
  height: 9px;
  background: #10b981;
  border-radius: 50%;
  border: 1.5px solid #000;
}

.advisor-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-main);
}

.advisor-status {
  font-size: 0.72rem;
  color: #10b981;
  display: flex;
  align-items: center;
  gap: 4px;
}

.pulsing-green-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  display: inline-block;
}

.chat-header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-action-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: var(--text-main);
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: none;
  transition: var(--transition);
}

.header-action-icon.zalo {
  background: #0068ff;
  color: #fff;
  font-size: 0.85rem;
}

.header-action-icon.close {
  font-size: 1.3rem;
  line-height: 1;
}

.header-action-icon:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* CHAT MESSAGES BODY */
.chat-messages-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--bg-primary);
}

.chat-date-divider {
  text-align: center;
  margin: 4px 0 8px;
}

.chat-date-divider span {
  font-size: 0.7rem;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.04);
  padding: 2px 10px;
  border-radius: 999px;
}

.message-row {
  display: flex;
  gap: 8px;
  max-width: 88%;
}

.message-row.bot-msg {
  align-self: flex-start;
}

.message-row.user-msg {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.bot-msg-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid var(--border-gold);
  flex-shrink: 0;
  margin-top: 2px;
}

.bot-msg-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.msg-bubble-wrap {
  display: flex;
  flex-direction: column;
}

.msg-bubble {
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 0.85rem;
  line-height: 1.45;
  box-shadow: var(--shadow-sm);
}

.bot-msg .msg-bubble {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  border-top-left-radius: 4px;
}

.user-msg .msg-bubble {
  background: var(--gold-gradient);
  color: #000;
  font-weight: 500;
  border-top-right-radius: 4px;
}

.msg-bubble p {
  margin: 0;
}

.msg-time {
  font-size: 0.68rem;
  color: var(--text-muted);
  margin-top: 3px;
  padding: 0 4px;
}

.user-msg .msg-time {
  text-align: right;
}

/* QUICK CHIPS */
.quick-chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.quick-chip-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-gold);
  color: var(--gold-primary);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 20px;
  cursor: pointer;
  transition: var(--transition);
  text-align: left;
}

.quick-chip-btn:hover {
  background: var(--gold-primary);
  color: #000;
}

/* TYPING INDICATOR */
.typing-bubble {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 14px;
}

.typing-bubble .dot {
  width: 6px;
  height: 6px;
  background: var(--gold-primary);
  border-radius: 50%;
  animation: typingBounce 1.2s infinite ease-in-out;
}

.typing-bubble .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-bubble .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingBounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-5px); opacity: 1; }
}

/* CHAT FOOTER FORM */
.chat-footer-form {
  padding: 10px 12px;
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-input-field {
  flex: 1;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 9px 12px;
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  outline: none;
  transition: var(--transition);
}

.chat-input-field:focus {
  border-color: var(--gold-primary);
}

.chat-send-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--gold-gradient);
  color: #000;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.85rem;
  transition: var(--transition);
  flex-shrink: 0;
}

.chat-send-btn:hover {
  transform: scale(1.08);
}
</style>
