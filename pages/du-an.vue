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

      <!-- HERO BANNER DỰ ÁN CAO CẤP -->
      <section class="duan-hero-banner">
        <div class="banner-media-wrap">
          <img 
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80" 
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
      </section>

      <!-- BỘ LỌC TÌM KIẾM QUỸ CĂN DỰ ÁN -->
      <section class="properties-list-section" style="margin-top: 40px;">
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

/* DỰ ÁN HERO BANNER FULL-WIDTH */
.duan-hero-banner {
  position: relative;
  border-radius: var(--radius-lg, 16px);
  overflow: hidden;
  border: 1px solid var(--border-gold, rgba(212, 175, 55, 0.4));
  box-shadow: var(--shadow-md, 0 8px 24px rgba(0,0,0,0.3));
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 380px;
  padding: 44px 36px;
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

.duan-hero-banner:hover .banner-bg-img {
  transform: scale(1.05);
}

.banner-gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(7, 14, 27, 0.4) 0%, rgba(7, 14, 27, 0.85) 60%, rgba(7, 14, 27, 0.98) 100%);
}

.banner-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
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
  font-size: 2.1rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.3;
  margin-bottom: 12px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

.banner-desc {
  font-size: 0.96rem;
  color: #cbd5e1;
  line-height: 1.65;
  margin-bottom: 20px;
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
  font-size: 0.84rem;
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(4px);
  padding: 7px 16px;
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
  font-size: 0.84rem;
  color: var(--gold-light);
  background: rgba(0, 0, 0, 0.5);
  padding: 5px 14px;
  border-radius: 6px;
  border: 1px solid rgba(212, 175, 55, 0.3);
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
