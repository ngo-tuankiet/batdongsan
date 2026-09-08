<template>
  <main>
    <!-- HERO SECTION & SEARCH FILTER -->
    <section id="hero" class="master-hero">
      <div class="container">
        <p class="section-subtitle">HỆ THỐNG MÔI GIỚI BĐS HÀNG ĐẦU QUẬN 1</p>
        <h1 class="hero-main-title">
          Khẳng Định Đẳng Cấp Tại <br><span class="gold-text">Trái Tim Sài Gòn</span>
        </h1>
        <p class="hero-main-sub">
          Nắm giữ quỹ căn độc quyền nhà phố mặt tiền, tòa nhà thương mại, biệt thự và căn hộ siêu sang khu vực Chợ Bến Thành - Quận 1.
        </p>

        <!-- Search Box Filter -->
        <div class="search-filter-box">
          <input 
            v-model="filters.keyword" 
            type="text" 
            class="filter-input" 
            placeholder="Nhập tên đường (CMT8, Nguyễn Trãi, Lý Tự Trọng...)..."
            @keyup.enter="handleSearch"
          >
          
          <select v-model="filters.category" class="filter-select">
            <option value="all">Tất cả loại BĐS</option>
            <option value="nha-pho">Nhà phố trung tâm</option>
            <option value="can-ho">Căn hộ cao cấp</option>
            <option value="mat-bang">Tòa nhà / Mặt bằng</option>
            <option value="khach-san">Khách sạn du lịch</option>
          </select>

          <select v-model="filters.priceRange" class="filter-select">
            <option value="all">Mức giá: Tất cả</option>
            <option value="under20">Dưới 20 Tỷ</option>
            <option value="20to50">20 - 50 Tỷ</option>
            <option value="above50">Trên 50 Tỷ</option>
          </select>

          <button class="btn btn-gold" style="width: 100%;" @click="handleSearch">
            <i class="fa-solid fa-magnifying-glass"></i> Tìm Kiếm
          </button>
        </div>

        <div v-if="searchCountText" class="search-results-alert" style="display: block; margin-top: 14px;">
          <i class="fa-solid fa-check-circle"></i> {{ searchCountText }}
        </div>
      </div>
    </section>

    <!-- PROPERTIES LISTINGS -->
    <section id="properties" class="properties-section">
      <div class="container">
        <div class="section-header">
          <p class="section-subtitle">QUỸ HÀNG SÀN BẾN THÀNH</p>
          <h2 class="section-title">Bất Động Sản Tiêu Biểu Đang Mở Bán</h2>
          <p class="section-desc">Toàn bộ giỏ hàng đã được thẩm định pháp lý 100%, có sẵn hợp đồng khai thác dòng tiền cho thuê.</p>
        </div>

        <!-- Category Tabs -->
        <div class="category-tabs">
          <button 
            v-for="cat in categoryList" 
            :key="cat.id" 
            class="category-tab" 
            :class="{ active: filters.category === cat.id }"
            @click="selectCategory(cat.id)"
          >
            {{ cat.name }}
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loadingProps" style="text-align: center; padding: 50px; color: var(--gold-primary);">
          <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem;"></i>
          <p style="margin-top: 10px; color: var(--text-muted);">Đang tải giỏ hàng bất động sản...</p>
        </div>

        <!-- Grid Cards BĐS -->
        <div v-else-if="properties.length > 0" class="properties-grid">
          <PropertyCard 
            v-for="prop in properties" 
            :key="prop.id" 
            :property="prop" 
            @select="selectedProperty = prop" 
          />
        </div>

        <!-- Empty State -->
        <div v-else style="text-align: center; color: var(--text-muted); padding: 50px 20px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <i class="fa-solid fa-house-chimney-crack" style="font-size: 2.5rem; color: var(--gold-primary); margin-bottom: 12px; display: block;"></i>
          <h4 style="color: var(--text-main); margin-bottom: 6px;">Không tìm thấy bất động sản phù hợp</h4>
          <p style="font-size: 0.9rem;">Quý khách vui lòng liên hệ hotline để nhận quỹ căn kín mới nhất chưa công khai.</p>
        </div>
      </div>
    </section>

    <!-- AGENTS & TEAM DIRECTORY -->
    <section id="team" class="team-section">
      <div class="container">
        <div class="section-header">
          <p class="section-subtitle">ĐỘI NGŨ CHUYÊN GIA</p>
          <h2 class="section-title">Đội Ngũ Chuyên Viên Tư Vấn Xuất Sắc</h2>
          <p class="section-desc">
            Mỗi chuyên viên đều sở hữu hồ sơ năng lực và trang cá nhân riêng biệt, am hiểu sâu từng ngõ ngách và phân khúc cụ thể để phục vụ quý khách tốt nhất.
          </p>
        </div>

        <div class="team-grid">
          <AgentCard 
            v-for="agent in agents" 
            :key="agent.id" 
            :agent="agent" 
          />
        </div>
      </div>
    </section>

    <!-- CONSIGNMENT -->
    <ConsignmentForm />

    <!-- ABOUT -->
    <section id="about" style="padding: 80px 0;">
      <div class="container" style="max-width: 900px; text-align: center;">
        <p class="section-subtitle">VỀ CHÚNG TÔI</p>
        <h2 class="section-title">Sàn Giao Dịch Bất Động Sản Bến Thành</h2>
        <p style="color: var(--text-sub); font-size: 1rem; line-height: 1.8; margin-top: 20px;">
          Được thành lập với sứ mệnh kết nối những bất động sản giá trị nhất tại trung tâm Sài Gòn với những chủ nhân xứng tầm. Với mạng lưới chuyên viên thực chiến giàu kinh nghiệm cùng triết lý <strong>"Minh bạch - Bảo mật - Hiệu quả"</strong>, chúng tôi tự hào là đối tác tin cậy của hơn 1.000+ nhà đầu tư trong và ngoài nước.
        </p>
      </div>
    </section>

    <!-- Modal Xem Chi Tiết BĐS -->
    <PropertyDetailModal 
      :property="selectedProperty" 
      @close="selectedProperty = null" 
    />
  </main>
</template>

<script setup lang="ts">
const filters = reactive({
  keyword: '',
  category: 'all',
  priceRange: 'all'
});

const categoryList = [
  { id: 'all', name: 'Tất Cả Sản Phẩm' },
  { id: 'nha-pho', name: 'Nhà Phố Trung Tâm' },
  { id: 'can-ho', name: 'Căn Hộ Cao Cấp' },
  { id: 'mat-bang', name: 'Tòa Nhà / Mặt Bằng' },
  { id: 'khach-san', name: 'Khách Sạn' }
];

const selectedProperty = ref<any>(null);
const searchCountText = ref('');
const loadingProps = ref(false);

// Load data từ Backend SQLite qua Nitro API
const { data: propertiesData, refresh: refreshProps } = await useFetch('/api/properties', {
  query: filters,
});

const { data: agentsData } = await useFetch('/api/agents');

const properties = computed(() => propertiesData.value || []);
const agents = computed(() => agentsData.value || []);

const selectCategory = (catId: string) => {
  filters.category = catId;
  handleSearch();
};

const handleSearch = async () => {
  loadingProps.value = true;
  await refreshProps();
  loadingProps.value = false;

  if (filters.keyword || filters.category !== 'all' || filters.priceRange !== 'all') {
    searchCountText.value = `Tìm thấy ${properties.value.length} bất động sản phù hợp với yêu cầu của bạn.`;
  } else {
    searchCountText.value = '';
  }

  // Cuộn xuống danh sách
  if (import.meta.client) {
    document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>
