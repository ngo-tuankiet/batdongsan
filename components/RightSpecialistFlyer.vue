<template>
  <div class="right-flyer-wrapper">
    <!-- DASHBOARD CHUYÊN VIÊN BÊN PHẢI ĐANG MỞ -->
    <transition name="flyer-fade-right">
      <aside 
        v-if="isOpen" 
        class="vertical-right-flyer" 
        role="complementary" 
        aria-label="Dashboard Chuyên Viên Tư Vấn Bến Thành Land"
      >
        <!-- THANH TIÊU ĐỀ TRÊN CÙNG -->
        <div class="flyer-top-bar">
          <span class="flyer-badge-title">
            <i class="fa-solid fa-id-badge"></i> DASHBOARD TƯ VẤN
          </span>
          <button 
            type="button"
            class="flyer-close-btn" 
            @click.stop="closeFlyer" 
            title="Đóng dashboard tư vấn"
            aria-label="Đóng bảng tư vấn"
          >
            <span class="close-label">TẮT</span>
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- PHẦN CHỌN NHÂN VIÊN TRỰC TIẾP TRÊN DASHBOARD -->
        <div class="agent-selector-dashboard">
          <div class="selector-header">
            <span class="selector-title">
              <i class="fa-solid fa-users"></i> CHỌN CHUYÊN VIÊN PHỤ TRÁCH:
            </span>
            <span class="agent-counter-badge">{{ agentsList.length }} nhân sự</span>
          </div>

          <!-- DANH SÁCH AVATAR TABS ĐỂ NGƯỜI DÙNG CLICK CHỌN NGƯỜI THÍCH -->
          <div class="agent-tabs-track">
            <button 
              v-for="ag in agentsList" 
              :key="ag.id"
              type="button"
              class="agent-tab-item"
              :class="{ 'active': currentAgentId === ag.id }"
              @click="selectAgent(ag)"
              :title="'Chọn chuyên viên ' + ag.name"
            >
              <div class="tab-avatar-wrapper">
                <img :src="ag.avatar" :alt="ag.name" class="tab-avatar-img" />
                <span v-if="currentAgentId === ag.id" class="tab-check-badge">
                  <i class="fa-solid fa-check"></i>
                </span>
              </div>
              <span class="tab-short-name">{{ getShortName(ag.name) }}</span>
            </button>
          </div>
        </div>

        <!-- THẺ CHI TIẾT CHUYÊN VIÊN ĐANG ĐƯỢC CHỌN -->
        <div class="flyer-specialist-card" v-if="activeAgent">
          <!-- AVATAR LỚN & STATUS ONLINE -->
          <div class="flyer-avatar-box">
            <div class="flyer-avatar-ring">
              <img 
                :src="activeAgent.avatar" 
                :alt="activeAgent.name" 
                class="flyer-agent-avatar"
              />
              <span class="flyer-online-dot" title="Đang trực tuyến sẵn sàng tư vấn"></span>
            </div>
            <span class="flyer-role-tag">{{ activeAgent.tag || 'Chuyên Gia' }}</span>
          </div>

          <!-- TÊN & CHỨC VỤ -->
          <div class="flyer-agent-meta">
            <h4 class="flyer-agent-name">{{ activeAgent.name }}</h4>
            <p class="flyer-agent-role">{{ activeAgent.role }}</p>
            
            <div class="flyer-stats-mini">
              <span><i class="fa-solid fa-business-time"></i> {{ activeAgent.exp || '5+ Năm' }}</span>
              <span class="dot-sep">•</span>
              <span><i class="fa-solid fa-handshake-simple"></i> {{ activeAgent.deals || '90+ Giao Dịch' }}</span>
            </div>
          </div>

          <!-- SLOGAN / CAM KẾT -->
          <p v-if="activeAgent.slogan" class="flyer-slogan">
            <i class="fa-solid fa-quote-left"></i> {{ activeAgent.slogan }}
          </p>

          <!-- QUỸ CĂN PHỤ TRÁCH -->
          <div class="flyer-portfolio-badge">
            <i class="fa-solid fa-key"></i>
            <span>Nắm giữ <strong>quỹ căn giá gốc & căn kín</strong></span>
          </div>

          <!-- NÚT GỌI HOTLINE TRỰC TIẾP -->
          <div class="flyer-action-stack">
            <a 
              :href="`tel:${cleanPhone(activeAgent.phone)}`" 
              class="flyer-btn-call"
              :title="'Gọi ngay hotline cho ' + activeAgent.name"
            >
              <i class="fa-solid fa-phone-volume"></i>
              <div class="btn-call-text">
                <small>Hotline Chuyên Viên</small>
                <strong>{{ activeAgent.phoneDisplay || activeAgent.phone }}</strong>
              </div>
            </a>

            <!-- NÚT NHẮN ZALO NHẬN SỔ & BÁO GIÁ -->
            <a 
              :href="activeAgent.zalo || 'https://zalo.me'" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="flyer-btn-zalo"
              title="Nhắn tin Zalo trực tiếp nhận sổ hồng"
            >
              <i class="fa-solid fa-comment-dots"></i>
              <span>Nhắn Zalo Nhận Báo Giá & Sổ</span>
            </a>
          </div>

          <!-- FOOTER CAM KẾT NHANH -->
          <div class="flyer-card-footer">
            <span><i class="fa-solid fa-shield-halved"></i> Pháp Lý Chuẩn 100%</span>
            <span><i class="fa-solid fa-bolt"></i> Phản Hồi Sau 3 Phút</span>
          </div>
        </div>
      </aside>
    </transition>

    <!-- NÚT TAB MỞ LẠI BÊN PHẢI KHI ĐÃ TẮT -->
    <transition name="tab-slide-right">
      <button 
        v-if="!isOpen" 
        type="button"
        class="flyer-reopen-tab-right" 
        @click="isOpen = true" 
        title="Mở lại Dashboard Chuyên Viên Tư Vấn"
        aria-label="Mở lại chuyên viên"
      >
        <span class="tab-pulse-ring"></span>
        <i class="fa-solid fa-users"></i>
        <span class="tab-label">Chọn Chuyên Viên</span>
      </button>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = withDefaults(defineProps<{
  agents?: any[];
  defaultAgentId?: string;
}>(), {
  agents: () => [],
  defaultAgentId: 'tuankiet',
});

const emit = defineEmits<{
  (e: 'agent-select', agent: any): void;
}>();

const isOpen = ref(true);
const currentAgentId = ref(props.defaultAgentId || 'tuankiet');

const fallbackAgents = [
  {
    id: 'tuankiet',
    name: 'Ngô Tuấn Kiệt',
    role: 'Chuyên Viên Nhà Phố & Tòa Nhà Q.1',
    phone: '0901234567',
    phoneDisplay: '0901.234.567',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    tag: 'Top Producer',
    exp: '6+ Năm',
    deals: '135+ Căn',
    slogan: 'Tận Tâm - Minh Bạch - Đồng Hành Cùng Quyết Định Đầu Tư Của Bạn',
    zalo: 'https://zalo.me/0901234567'
  },
  {
    id: 'vantam',
    name: 'Nguyễn Văn Tâm',
    role: 'Chuyên Viên Biệt Thự & Khách Sạn Q.1',
    phone: '0912131329',
    phoneDisplay: '0912.131.329',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    tag: 'Leader',
    exp: '8+ Năm',
    deals: '180+ Căn',
    slogan: 'Nắm giữ quỹ căn độc quyền giá gốc từ gia tộc & chủ đầu tư',
    zalo: 'https://zalo.me/0912131329'
  },
  {
    id: 'minhduc',
    name: 'Trần Minh Đức',
    role: 'Chuyên Gia Căn Hộ Hạng Sang & Dự Án',
    phone: '0918777666',
    phoneDisplay: '0918.777.666',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    tag: 'Chuyên Sâu',
    exp: '5+ Năm',
    deals: '90+ Căn',
    slogan: 'Nâng Tầm Trải Nghiệm Sống Hàng Hiệu Chuẩn Quốc Tế',
    zalo: 'https://zalo.me/0918777666'
  }
];

const agentsList = computed(() => {
  if (props.agents && props.agents.length > 0) {
    return props.agents;
  }
  return fallbackAgents;
});

const activeAgent = computed(() => {
  const found = agentsList.value.find(a => a.id === currentAgentId.value);
  return found || agentsList.value[0];
});

watch(() => props.defaultAgentId, (newVal) => {
  if (newVal) currentAgentId.value = newVal;
});

const selectAgent = (ag: any) => {
  currentAgentId.value = ag.id;
  emit('agent-select', ag);
};

const getShortName = (fullName: string = '') => {
  const parts = fullName.trim().split(' ');
  return parts[parts.length - 1];
};

const closeFlyer = () => {
  isOpen.value = false;
};

const cleanPhone = (phone: string = '') => {
  return phone.replace(/[^0-9]/g, '');
};
</script>

<style scoped>
.right-flyer-wrapper {
  position: relative;
  z-index: 99998;
}

/* KHUNG DASHBOARD CỐ ĐỊNH BÊN MÉP PHẢI (CAO 620PX, RỘNG 260PX ĐỒNG BỘ BANNER TRÁI) */
.vertical-right-flyer {
  position: fixed;
  right: 16px;
  top: 80px;
  width: 260px;
  height: 620px;
  display: flex;
  flex-direction: column;
  z-index: 99998;
  border-radius: 12px;
  box-shadow: 0 16px 45px rgba(0, 0, 0, 0.85), 0 0 25px rgba(212, 175, 55, 0.35);
  border: 2px solid var(--gold-primary, #dfb76c);
  background: #070e1b;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  animation: flyerSlideInRight 0.4s ease-out;
}

@keyframes flyerSlideInRight {
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.vertical-right-flyer:hover {
  transform: translateY(-3px) scale(1.015);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.95), 0 0 32px rgba(212, 175, 55, 0.5);
}

/* THANH TIÊU ĐỀ TRÊN CÙNG */
.flyer-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #152238 0%, #0a1428 100%);
  padding: 7px 10px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.4);
  flex-shrink: 0;
}

.flyer-badge-title {
  font-size: 0.68rem;
  font-weight: 900;
  color: var(--gold-primary, #dfb76c);
  letter-spacing: 0.6px;
  display: flex;
  align-items: center;
  gap: 5px;
  text-transform: uppercase;
}

/* NÚT TẮT (X) */
.flyer-close-btn {
  background: #ef4444;
  border: none;
  color: #ffffff;
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
  transition: all 0.2s ease;
}

.flyer-close-btn:hover {
  background: #dc2626;
  transform: scale(1.08);
}

.close-label {
  font-size: 0.62rem;
  letter-spacing: 0.4px;
}

/* BẢNG CHỌN NHÂN VIÊN NHIỀU NGƯỜI */
.agent-selector-dashboard {
  background: #091325;
  padding: 8px 10px 6px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.25);
  flex-shrink: 0;
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.selector-title {
  font-size: 0.6rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.agent-counter-badge {
  font-size: 0.58rem;
  background: rgba(212, 175, 55, 0.15);
  color: var(--gold-primary, #dfb76c);
  padding: 1px 5px;
  border-radius: 8px;
  font-weight: 700;
}

.agent-tabs-track {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.agent-tab-item {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 4px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
}

.agent-tab-item:hover {
  background: rgba(212, 175, 55, 0.12);
  border-color: rgba(212, 175, 55, 0.4);
  transform: translateY(-1px);
}

.agent-tab-item.active {
  background: linear-gradient(180deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.08) 100%);
  border-color: var(--gold-primary, #dfb76c);
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
}

.tab-avatar-wrapper {
  position: relative;
  width: 34px;
  height: 34px;
  border-radius: 50%;
}

.tab-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.tab-check-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 13px;
  height: 13px;
  background: #10b981;
  color: #fff;
  border-radius: 50%;
  font-size: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #070e1b;
}

.tab-short-name {
  font-size: 0.62rem;
  font-weight: 700;
  color: #cbd5e1;
  white-space: nowrap;
}

.agent-tab-item.active .tab-short-name {
  color: var(--gold-primary, #dfb76c);
  font-weight: 800;
}

/* THẺ CHI TIẾT CHUYÊN VIÊN */
.flyer-specialist-card {
  padding: 10px 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  background: radial-gradient(circle at top, #111d33 0%, #070e1b 100%);
  overflow-y: auto;
}

.flyer-avatar-box {
  position: relative;
  margin-bottom: 6px;
}

.flyer-avatar-ring {
  position: relative;
  width: 74px;
  height: 74px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, #dfb76c 0%, #aa771c 100%);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
}

.flyer-agent-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  background: #0d1a2d;
}

.flyer-online-dot {
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 14px;
  height: 14px;
  background: #10b981;
  border: 2.5px solid #070e1b;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.8);
  animation: pulseDot 1.6s infinite;
}

@keyframes pulseDot {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 5px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.flyer-role-tag {
  display: inline-block;
  margin-top: 4px;
  background: rgba(223, 183, 108, 0.15);
  border: 1px solid var(--gold-primary, #dfb76c);
  color: var(--gold-primary, #dfb76c);
  font-size: 0.6rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.flyer-agent-meta {
  margin-bottom: 6px;
}

.flyer-agent-name {
  font-size: 0.98rem;
  font-weight: 800;
  color: #ffffff;
  margin: 3px 0 2px 0;
  letter-spacing: 0.2px;
}

.flyer-agent-role {
  font-size: 0.68rem;
  color: #94a3b8;
  margin-bottom: 5px;
  line-height: 1.3;
}

.flyer-stats-mini {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  font-size: 0.64rem;
  color: var(--gold-primary, #dfb76c);
  font-weight: 700;
  background: rgba(255, 255, 255, 0.04);
  padding: 2px 8px;
  border-radius: 6px;
}

.dot-sep {
  color: #475569;
}

.flyer-slogan {
  font-size: 0.64rem;
  font-style: italic;
  color: #cbd5e1;
  line-height: 1.35;
  background: rgba(0, 0, 0, 0.3);
  padding: 5px 8px;
  border-radius: 6px;
  border-left: 2px solid var(--gold-primary, #dfb76c);
  margin-bottom: 6px;
  text-align: left;
  width: 100%;
}

.flyer-portfolio-badge {
  background: rgba(16, 185, 129, 0.1);
  border: 1px dashed rgba(16, 185, 129, 0.35);
  color: #34d399;
  font-size: 0.62rem;
  padding: 3px 6px;
  border-radius: 6px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  justify-content: center;
}

/* NÚT THAO TÁC LIÊN HỆ */
.flyer-action-stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  margin-bottom: 8px;
}

.flyer-btn-call {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
  transition: all 0.2s ease;
}

.flyer-btn-call i {
  font-size: 1.1rem;
  animation: shakePhone 2s infinite ease-in-out;
}

@keyframes shakePhone {
  0%, 100% { transform: rotate(0deg); }
  10%, 30% { transform: rotate(-15deg); }
  20%, 40% { transform: rotate(15deg); }
  50% { transform: rotate(0deg); }
}

.flyer-btn-call:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.5);
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
}

.btn-call-text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.btn-call-text small {
  font-size: 0.58rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.btn-call-text strong {
  font-size: 0.88rem;
  letter-spacing: 0.4px;
}

.flyer-btn-zalo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #0284c7;
  color: #ffffff;
  text-decoration: none;
  padding: 6px 8px;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  transition: all 0.2s ease;
  box-shadow: 0 3px 10px rgba(2, 132, 199, 0.3);
}

.flyer-btn-zalo:hover {
  background: #0369a1;
  transform: translateY(-2px);
}

/* FOOTER */
.flyer-card-footer {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
  padding-top: 6px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  font-size: 0.58rem;
  color: #64748b;
  text-align: center;
  flex-shrink: 0;
}

.flyer-card-footer span {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.flyer-card-footer i {
  color: var(--gold-primary, #dfb76c);
}

/* NÚT TAB MỞ LẠI BÊN PHẢI */
.flyer-reopen-tab-right {
  position: fixed;
  right: 0;
  top: 180px;
  z-index: 99998;
  background: linear-gradient(135deg, #aa771c 0%, #d4af37 100%);
  color: #070e1b;
  border: none;
  padding: 9px 10px 9px 14px;
  border-radius: 10px 0 0 10px;
  font-weight: 800;
  font-size: 0.78rem;
  box-shadow: 0 4px 18px rgba(212, 175, 55, 0.45);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.flyer-reopen-tab-right:hover {
  padding-right: 14px;
  padding-left: 18px;
  background: linear-gradient(135deg, #d4af37 0%, #fde68a 100%);
}

.tab-pulse-ring {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.35);
  animation: pulseDot 1.5s infinite;
}

/* HIỆU ỨNG CHUYỂN CẢNH */
.flyer-fade-right-enter-active,
.flyer-fade-right-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.flyer-fade-right-enter-from,
.flyer-fade-right-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

.tab-slide-right-enter-active,
.tab-slide-right-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.tab-slide-right-enter-from,
.tab-slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* RESPONSIVE */
@media (max-width: 1280px) {
  .vertical-right-flyer {
    width: 230px;
    height: 560px;
    top: 85px;
    right: 8px;
  }
}

@media (max-width: 992px) {
  .vertical-right-flyer,
  .flyer-reopen-tab-right {
    display: none !important;
  }
}
</style>
