<template>
  <main class="specialized-page">
    <!-- BANNER VÈ BÊN TRÁI DÀNH CHO TRANG DỰ ÁN (QUẢN LÝ QUA ADMIN) -->
    <LeftFlyerBanner 
      v-if="currentBanner && currentBanner.isActive"
      :imageSrc="currentBanner.imageUrl || '/images/banner-poster-vertical.png'"
      :title="currentBanner.title || 'DỰ ÁN TIÊU BIỂU'"
      :badgeIcon="currentBanner.badgeIcon || 'fa-gem'"
      :btnText="currentBanner.btnText || 'Xem Dự Án Hot'"
      reopenLabel="Banner Dự Án"
    />

    <!-- PANEL CHUYÊN VIÊN BÊN PHẢI (CỐ ĐỊNH ĐỐI XỨNG BANNER TRÁI) -->
    <RightSpecialistFlyer 
      :agents="agents"
      defaultAgentId="minhduc"
    />

    <div class="container">
      
      <!-- BREADCRUMB -->
      <nav class="detail-breadcrumb" style="margin-bottom: 20px;">
        <NuxtLink to="/">Trang Chủ</NuxtLink>
        <i class="fa-solid fa-chevron-right"></i>
        <span class="active-crumb">Dự Án Cao Cấp</span>
      </nav>

      <!-- HERO SPLIT SECTION: BÊN TRÁI LÀ BANNER, BÊN PHẢI LÀ LIÊN HỆ NGƯỜI ĐƯỢC PHÂN BỔ CÓ BUTTON ĐỔI NGƯỜI -->
      <section class="split-hero-container">
        <!-- BÊN TRÁI: BANNER HÌNH ẢNH CAO CẤP DỰ ÁN -->
        <div class="split-hero-banner">
          <div class="banner-media-wrap">
            <img 
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80" 
              alt="Danh mục Dự Án Bến Thành" 
              class="banner-bg-img"
            />
            <div class="banner-gradient-overlay"></div>
          </div>

          <div class="banner-content">
            <span class="hero-tag-badge" style="background: rgba(16, 185, 129, 0.2); border-color: var(--accent-green); color: #34d399;">
              <i class="fa-solid fa-gem"></i> DỰ ÁN HÀNG HIỆU & NGHỈ DƯỠNG
            </span>
            <h1 class="banner-title">
              Danh Mục Dự Án Cao Cấp & Căn Hộ Hạng Sang
            </h1>
            <p class="banner-desc">
              Hệ thống các dự án căn hộ thương hiệu quốc tế, đại đô thị sinh thái và bất động sản nghỉ dưỡng cao cấp. Chính sách bán hàng trực tiếp từ Chủ Đầu Tư cùng quỹ căn ngoại giao vị trí đẹp nhất.
            </p>

            <div class="banner-key-points">
              <div class="key-point-item">
                <i class="fa-solid fa-building-shield"></i>
                <span>Chủ Đầu Tư Uy Tín</span>
              </div>
              <div class="key-point-item">
                <i class="fa-solid fa-percent"></i>
                <span>Ân Hạn Gốc Lãi 0%</span>
              </div>
              <div class="key-point-item">
                <i class="fa-solid fa-chart-line"></i>
                <span>Tiềm Năng Sinh Lời Vượt Trội</span>
              </div>
            </div>

            <div class="banner-stats-counter">
              <span class="stat-badge">
                <i class="fa-solid fa-fire"></i> Đang mở bán: <strong>{{ properties.length }}</strong> dự án
              </span>
            </div>
          </div>
        </div>

        <!-- BÊN PHẢI: THÔNG TIN LIÊN HỆ CỦA NGƯỜI ĐƯỢC PHÂN BỔ + BUTTON CHỌN NGƯỜI -->
        <div class="split-hero-agent-card">
          <div class="agent-card-header">
            <span class="agent-duty-badge">
              <i class="fa-solid fa-shield-halved"></i> CHUYÊN VIÊN ĐƯỢC PHÂN BỔ
            </span>
            <span class="agent-online-status">
              <span class="pulse-dot"></span> Trực tuyến
            </span>
          </div>

          <!-- Thông tin chuyên viên đang được phân bổ -->
          <div v-if="assignedAgent" class="assigned-agent-body">
            <div class="assigned-avatar-wrap">
              <img :src="assignedAgent.avatar" :alt="assignedAgent.name" class="assigned-avatar">
              <span class="assigned-tag-pill">{{ assignedAgent.tag || 'Chuyên Gia' }}</span>
            </div>

            <div class="assigned-main-info">
              <h3 class="assigned-name">{{ assignedAgent.name }}</h3>
              <p class="assigned-role">{{ assignedAgent.role }}</p>

              <div class="assigned-stats-row">
                <span><i class="fa-solid fa-business-time"></i> {{ assignedAgent.exp }}</span>
                <span>•</span>
                <span><i class="fa-solid fa-handshake-simple"></i> {{ assignedAgent.deals }}</span>
              </div>

              <p v-if="assignedAgent.slogan" class="assigned-slogan">
                "{{ assignedAgent.slogan }}"
              </p>
            </div>

            <!-- Nút liên hệ nhanh -->
            <div class="assigned-action-buttons">
              <a :href="`tel:${assignedAgent.phone.replace(/[^0-9]/g, '')}`" class="btn btn-call" style="width: 100%;">
                <i class="fa-solid fa-phone"></i> Hotline Dự Án: {{ assignedAgent.phoneDisplay || assignedAgent.phone }}
              </a>
              <a :href="assignedAgent.zalo || 'https://zalo.me'" target="_blank" class="btn btn-zalo" style="width: 100%;">
                <i class="fa-solid fa-comment-dots"></i> Nhận Bảng Giá & CSBH (Zalo)
              </a>
            </div>

            <!-- BUTTON ĐỂ CHỌN / ĐỔI NGƯỜI (THEO YÊU CẦU CỦA BẠN) -->
            <div class="agent-switch-wrap">
              <button 
                type="button" 
                class="btn btn-outline-gold btn-switch-agent"
                @click="showAgentModal = true"
              >
                <i class="fa-solid fa-users-gear"></i> Chọn / Đổi Chuyên Viên Khác
              </button>
              <p class="agent-switch-note">
                Quý khách có thể tự do chọn chuyên viên ưng ý nhất để đồng hành
              </p>
            </div>
          </div>

          <!-- Loading State for Agent -->
          <div v-else style="text-align: center; padding: 40px; color: var(--text-muted);">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 1.5rem; color: var(--gold-primary);"></i>
            <p style="margin-top: 8px;">Đang kết nối chuyên viên phụ trách...</p>
          </div>
        </div>
      </section>

      <!-- BỘ LỌC TÌM KIẾM QUỸ CĂN DỰ ÁN -->
      <section class="properties-list-section" style="margin-top: 50px;">
        <div class="section-header" style="text-align: left; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 25px;">
          <div>
            <p class="section-subtitle">DANH SÁCH DỰ ÁN</p>
            <h2 class="section-title" style="font-size: 1.8rem; margin: 0;">
              Dự Án Cao Cấp Đang Mở Bán
            </h2>
          </div>

          <!-- Thanh tìm kiếm nhanh & lọc mức giá -->
          <div class="filter-controls-row" style="display: flex; gap: 10px; flex-wrap: wrap;">
            <input 
              v-model="searchKeyword" 
              type="text" 
              class="filter-input" 
              placeholder="Nhập tên dự án, vị trí..." 
              style="min-width: 220px;"
            />
            <select v-model="filterPrice" class="filter-select" style="min-width: 150px;">
              <option value="all">Mức giá: Tất cả</option>
              <option value="under20">Dưới 20 Tỷ</option>
              <option value="20to50">20 - 50 Tỷ</option>
              <option value="above50">Trên 50 Tỷ</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="pending" style="text-align: center; padding: 60px; color: var(--gold-primary);">
          <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem;"></i>
          <p style="margin-top: 10px; color: var(--text-muted);">Đang tải danh mục dự án...</p>
        </div>

        <!-- Grid Cards Dự Án -->
        <div v-else-if="visibleProperties.length > 0" class="properties-grid">
          <PropertyCard 
            v-for="prop in visibleProperties" 
            :key="prop.id" 
            :property="prop" 
            @select="selectedProperty = prop" 
          />
        </div>

        <!-- Nút Tải Thêm (Load More) -->
        <div v-if="hasMore" style="text-align: center; margin: 36px 0;">
          <button class="btn btn-outline-gold" style="padding: 13px 36px; font-size: 0.95rem; font-weight: 700;" @click="loadMore">
            <i class="fa-solid fa-plus-circle" style="margin-right: 6px;"></i> Xem Thêm Dự Án (Còn {{ filteredProperties.length - displayLimit }} dự án)
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredProperties.length === 0" class="empty-state-box">
          <i class="fa-solid fa-building-circle-exclamation" style="font-size: 2.8rem; color: var(--gold-primary); margin-bottom: 12px; display: block;"></i>
          <h4>Không tìm thấy dự án phù hợp tiêu chí</h4>
          <p>Quý khách vui lòng liên hệ trực tiếp chuyên viên để nhận tài liệu dự án mới sắp công bố.</p>
          <button class="btn btn-gold" style="margin-top: 15px;" @click="resetFilters">
            Xem Tất Cả Dự Án
          </button>
        </div>
      </section>

      <!-- CONSIGNMENT SECTION DÀNH CHO DỰ ÁN -->
      <ConsignmentForm style="margin-top: 60px;" />

    </div>

    <!-- MODAL CHỌN ĐỔI CHUYÊN VIÊN -->
    <AgentSelectorModal 
      :is-open="showAgentModal" 
      :current-agent-id="assignedAgent?.id" 
      :agents="agents" 
      @close="showAgentModal = false" 
      @select="handleSelectAgent" 
    />

    <!-- MODAL CHI TIẾT BĐS -->
    <PropertyDetailModal 
      :property="selectedProperty" 
      @close="selectedProperty = null" 
    />
  </main>
</template>

<script setup lang="ts">
const { showToast } = useToast();
const selectedProperty = ref<any>(null);
const showAgentModal = ref(false);
const searchKeyword = ref('');
const filterPrice = ref('all');

// Lấy danh sách BĐS với categoryId = 'du-an'
const { data: propertiesData, pending } = await useFetch('/api/properties', {
  query: { category: 'du-an' },
});

// Lấy danh sách Agents từ sàn
const { data: agentsData } = await useFetch('/api/agents');

// Lấy Banner từ hệ thống quản trị CMS
const { data: bannersData } = await useFetch('/api/banners', {
  query: { page: 'du-an' },
});

const properties = computed(() => propertiesData.value || []);
const agents = computed(() => agentsData.value || []);
const currentBanner = computed(() => {
  if (!bannersData.value || bannersData.value.length === 0) return null;
  return bannersData.value.find((b: any) => b.id === 'du-an') || bannersData.value[0];
});

// Chuyên viên được phân bổ cho trang Dự Án
const assignedAgent = ref<any>(null);

const initAssignedAgent = () => {
  if (!agents.value || agents.value.length === 0) return;

  // Kiểm tra nếu người dùng đã từng chọn chuyên viên trước đó
  if (import.meta.client) {
    const savedId = localStorage.getItem('assigned_agent_du_an');
    if (savedId) {
      const found = agents.value.find((a: any) => a.id === savedId);
      if (found) {
        assignedAgent.value = found;
        return;
      }
    }
  }

  // Mặc định phân bổ: ưu tiên chuyên viên Dự Án (ví dụ: minhduc hoặc chuyên viên có chữ Dự Án / Căn Hộ)
  const defaultAgent = agents.value.find((a: any) => 
    a.id === 'minhduc' || (a.role && (a.role.toLowerCase().includes('dự án') || a.role.toLowerCase().includes('căn hộ')))
  ) || agents.value[0];

  assignedAgent.value = defaultAgent;
};

watch(agents, () => {
  if (!assignedAgent.value) {
    initAssignedAgent();
  }
}, { immediate: true });

onMounted(() => {
  initAssignedAgent();
});

const handleSelectAgent = (ag: any) => {
  assignedAgent.value = ag;
  if (import.meta.client) {
    localStorage.setItem('assigned_agent_du_an', ag.id);
  }
  showToast(`Đã chọn chuyên viên tư vấn: ${ag.name}`);
};

// Lọc giỏ hàng theo từ khóa và mức giá
const filteredProperties = computed(() => {
  let list = properties.value;
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim().toLowerCase();
    list = list.filter((p: any) => 
      (p.title && p.title.toLowerCase().includes(kw)) ||
      (p.location && p.location.toLowerCase().includes(kw)) ||
      (p.ward && p.ward.toLowerCase().includes(kw)) ||
      (p.province && p.province.toLowerCase().includes(kw))
    );
  }

  if (filterPrice.value === 'under20') {
    list = list.filter((p: any) => (p.priceRaw || 0) < 20);
  } else if (filterPrice.value === '20to50') {
    list = list.filter((p: any) => (p.priceRaw || 0) >= 20 && (p.priceRaw || 0) <= 50);
  } else if (filterPrice.value === 'above50') {
    list = list.filter((p: any) => (p.priceRaw || 0) > 50);
  }

  return list;
});

const displayLimit = ref(6);
const visibleProperties = computed(() => filteredProperties.value.slice(0, displayLimit.value));
const hasMore = computed(() => displayLimit.value < filteredProperties.value.length);
const loadMore = () => {
  displayLimit.value += 6;
};

watch([searchKeyword, filterPrice], () => {
  displayLimit.value = 6;
});

const resetFilters = () => {
  searchKeyword.value = '';
  filterPrice.value = 'all';
  displayLimit.value = 6;
};

useHead({
  title: 'Danh Mục Đại Dự Án Vinhomes & Căn Hộ Hạng Sang | Bến Thành Land',
  meta: [
    { name: 'description', content: 'Chuyên trang Đại đô thị lấn biển Vinhomes Cần Giờ, Vinhomes Hóc Môn và các dự án căn hộ hàng hiệu trung tâm. Quỹ căn ngoại giao giá gốc chủ đầu tư.' },
    { property: 'og:title', content: 'Danh Mục Đại Dự Án Vinhomes & Căn Hộ Hạng Sang | Bến Thành Land' },
  ],
});
</script>

<style scoped>
.specialized-page {
  padding: 100px 0 80px;
}

/* 2-COLUMN SPLIT HERO */
.split-hero-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
  align-items: stretch;
}

@media (min-width: 992px) {
  .split-hero-container {
    grid-template-columns: 1.3fr 1fr;
  }
}

/* BÊN TRÁI: HERO BANNER */
.split-hero-banner {
  position: relative;
  border-radius: var(--radius-lg, 16px);
  overflow: hidden;
  border: 1px solid var(--border-gold, rgba(212, 175, 55, 0.4));
  box-shadow: var(--shadow-md, 0 8px 24px rgba(0,0,0,0.3));
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 440px;
  padding: 36px 32px;
}

.banner-media-wrap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.banner-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.02);
  transition: transform 0.6s ease;
}

.split-hero-banner:hover .banner-bg-img {
  transform: scale(1.06);
}

.banner-gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(7, 14, 27, 0.35) 0%, rgba(7, 14, 27, 0.85) 65%, rgba(7, 14, 27, 0.98) 100%);
}

.banner-content {
  position: relative;
  z-index: 2;
}

.hero-tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: var(--radius-full, 9999px);
  background: rgba(212, 175, 55, 0.2);
  border: 1px solid var(--gold-primary, #dfb76c);
  color: var(--gold-light, #f7e7a9);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.banner-title {
  font-size: 1.85rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.3;
  margin-bottom: 12px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

.banner-desc {
  font-size: 0.92rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 20px;
  max-width: 600px;
}

.banner-key-points {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 18px;
}

.key-point-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(4px);
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.key-point-item i {
  color: var(--gold-primary, #dfb76c);
}

.banner-stats-counter {
  margin-top: 4px;
}

.stat-badge {
  font-size: 0.82rem;
  color: var(--gold-light);
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

/* BÊN PHẢI: ASSIGNED AGENT CARD */
.split-hero-agent-card {
  background: var(--bg-card, #132442);
  border: 1px solid var(--border-gold, rgba(212, 175, 55, 0.4));
  border-radius: var(--radius-lg, 16px);
  box-shadow: var(--shadow-md, 0 8px 24px rgba(0,0,0,0.3));
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.agent-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color, rgba(255,255,255,0.08));
  margin-bottom: 18px;
}

.agent-duty-badge {
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--gold-primary, #dfb76c);
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.agent-online-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.76rem;
  color: var(--accent-green, #10b981);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-green, #10b981);
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  animation: pulseGreen 1.8s infinite;
}

@keyframes pulseGreen {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

.assigned-agent-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.assigned-avatar-wrap {
  position: relative;
  width: 95px;
  height: 95px;
  margin: 0 auto;
}

.assigned-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--gold-primary, #dfb76c);
  box-shadow: var(--shadow-gold);
}

.assigned-tag-pill {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--gold-gradient);
  color: #070e1b;
  font-weight: 800;
  font-size: 0.65rem;
  padding: 2px 8px;
  border-radius: 9999px;
  white-space: nowrap;
}

.assigned-main-info {
  text-align: center;
}

.assigned-name {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-main, #fff);
  margin-bottom: 4px;
}

.assigned-role {
  font-size: 0.85rem;
  color: var(--text-muted, #94a3b8);
  margin-bottom: 8px;
}

.assigned-stats-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--gold-light, #f7e7a9);
  margin-bottom: 10px;
}

.assigned-slogan {
  font-size: 0.82rem;
  font-style: italic;
  color: var(--text-sub, #cbd5e1);
  background: rgba(255, 255, 255, 0.04);
  padding: 8px 12px;
  border-radius: 8px;
  border-left: 3px solid var(--gold-primary);
  text-align: left;
}

.assigned-action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
}

.agent-switch-wrap {
  margin-top: 10px;
  text-align: center;
  padding-top: 14px;
  border-top: 1px dashed var(--border-color, rgba(255,255,255,0.1));
}

.btn-switch-agent {
  width: 100%;
  padding: 10px 18px;
  font-size: 0.88rem;
  font-weight: 600;
}

.agent-switch-note {
  font-size: 0.74rem;
  color: var(--text-muted, #94a3b8);
  margin-top: 6px;
}

.empty-state-box {
  text-align: center;
  color: var(--text-muted);
  padding: 60px 20px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-color);
}
</style>
