<template>
  <main>
    <!-- BANNER VÈ BÊN TRÁI CHUYỂN ĐỘNG 2.5S / ẢNH (CHỈ HIỆN KHI CUỘN XUỐNG KHU VỰC BĐS) -->
    <LeftFlyerBanner 
      :slides="homepageLeftFlyerSlides"
      reopenLabel="Banner Dự Án Hot"
      :scrollThreshold="320"
    />

    <!-- HERO SECTION WITH BACKGROUND SLIDESHOW & SEARCH FILTER -->
    <section id="hero" class="master-hero">
      <!-- Background Slideshow Layer -->
      <div class="hero-bg-container">
        <div 
          v-for="(slide, sIdx) in heroSlides" 
          :key="sIdx"
          class="hero-bg-slide"
          :class="{ active: sIdx === activeHeroSlideIndex }"
          :style="{ backgroundImage: `url('${slide.image}')` }"
        ></div>
        <div class="hero-bg-overlay"></div>
      </div>

      <div class="container hero-content-layer">
        <p class="section-subtitle">HỆ THỐNG MÔI GIỚI BĐS HÀNG ĐẦU QUẬN 11 &amp; ĐẠI LÝ F1 VINHOMES</p>
        <h1 class="hero-main-title">
          Khẳng Định Đẳng Cấp Tại <br><span class="gold-text">Trái Tim Sài Gòn</span>
        </h1>
        <p class="hero-main-sub">
          Nắm giữ quỹ căn độc quyền nhà phố mặt tiền Quận 11, các siêu dự án Vinhomes Hóc Môn &amp; Vinhomes Cần Giờ.
        </p>

        <!-- Search Box Filter -->
        <div class="search-filter-box">
          <input 
            v-model="filters.keyword" 
            type="text" 
            class="filter-input" 
            placeholder="Nhập tên đường, địa chỉ hoặc từ khóa..."
            @keyup.enter="handleSearch"
          >
          
          <select v-model="filters.category" class="filter-select" @change="handleSearch">
            <option value="all">Tất cả loại BĐS</option>
            <option value="nha-pho">Nhà Phố</option>
            <option value="du-an">Dự Án</option>
          </select>

          <!-- Dropdown lọc Tỉnh Thành -->
          <select v-model="filters.province" class="filter-select" @change="() => { filters.ward = 'all'; handleSearch(); }">
            <option value="all">Tất cả Tỉnh Thành</option>
            <option v-for="prov in distinctProvinces" :key="prov" :value="prov">{{ prov }}</option>
          </select>

          <!-- Dropdown lọc Quận / Phường -->
          <select v-model="filters.ward" class="filter-select" @change="handleSearch">
            <option value="all">Tất cả Quận / Phường</option>
            <option v-for="w in distinctWards" :key="w" :value="w">{{ w }}</option>
          </select>

          <select v-model="filters.priceRange" class="filter-select">
            <option value="all">Mức giá: Tất cả</option>
            <option value="under20">Dưới 20 Tỷ</option>
            <option value="20to50">20 - 50 Tỷ</option>
            <option value="above50">Trên 50 Tỷ</option>
          </select>

          <button class="btn btn-gold filter-search-btn" @click="handleSearch">
            <i class="fa-solid fa-magnifying-glass"></i> Tìm Kiếm
          </button>
        </div>

        <div v-if="searchCountText" class="search-results-alert" style="display: block; margin-top: 14px;">
          <i class="fa-solid fa-check-circle"></i> {{ searchCountText }}
        </div>

        <!-- Hero Slideshow Indicator Pills -->
        <div class="hero-slide-nav-pills">
          <button 
            v-for="(slide, sIdx) in heroSlides" 
            :key="sIdx"
            class="hero-pill-btn"
            :class="{ active: sIdx === activeHeroSlideIndex }"
            @click="activeHeroSlideIndex = sIdx"
          >
            <i :class="slide.icon"></i> {{ slide.title }}
          </button>
        </div>
      </div>
    </section>

    <!-- PROPERTIES LISTINGS -->
    <section id="properties" class="properties-section">
      <div class="container">
        <div class="section-header">
          <p class="section-subtitle">QUỸ HÀNG SÀN BẾN THÀNH LAND</p>
          <h2 class="section-title">Bất Động Sản Tiêu Biểu Đang Mở Bán</h2>
          <p class="section-desc">Toàn bộ giỏ hàng đã được thẩm định pháp lý 100%, phân loại chuẩn Nhà Phố trung tâm và Dự Án cao cấp.</p>
        </div>

        <!-- Chuyển hướng sang chuyên trang Nhà Phố & Dự Án -->
        <div class="category-tabs" style="display: flex; justify-content: center; gap: 16px; margin: 20px 0 35px; flex-wrap: wrap;">
          <NuxtLink to="/nha-pho" class="category-tab" style="display: inline-flex; align-items: center; gap: 10px; text-decoration: none; padding: 12px 28px; font-size: 0.95rem; font-weight: 600;">
            <i class="fa-solid fa-house-chimney" style="color: var(--gold-primary);"></i>
            Xem Giỏ Hàng Nhà Phố
            <i class="fa-solid fa-arrow-right" style="font-size: 0.8rem; opacity: 0.8;"></i>
          </NuxtLink>
          <NuxtLink to="/du-an" class="category-tab" style="display: inline-flex; align-items: center; gap: 10px; text-decoration: none; padding: 12px 28px; font-size: 0.95rem; font-weight: 600;">
            <i class="fa-solid fa-building" style="color: var(--gold-primary);"></i>
            Xem Danh Mục Dự Án
            <i class="fa-solid fa-arrow-right" style="font-size: 0.8rem; opacity: 0.8;"></i>
          </NuxtLink>
        </div>

        <!-- Loading State -->
        <div v-if="loadingProps" style="text-align: center; padding: 50px; color: var(--gold-primary);">
          <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem;"></i>
          <p style="margin-top: 10px; color: var(--text-muted);">Đang tải giỏ hàng bất động sản...</p>
        </div>

        <!-- Grid Cards BĐS Tiêu Điểm (Top 6) -->
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

        <!-- CTA Chuyển Trang Chuyên Biệt -->
        <div style="text-align: center; margin-top: 36px; display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
          <NuxtLink to="/nha-pho" class="btn btn-gold" style="padding: 13px 28px; font-size: 0.95rem; font-weight: 700;">
            <i class="fa-solid fa-house-chimney"></i> Khám Phá Toàn Bộ Giỏ Hàng Nhà Phố
            <i class="fa-solid fa-arrow-right" style="margin-left: 6px;"></i>
          </NuxtLink>
          <NuxtLink to="/du-an" class="btn btn-outline-gold" style="padding: 13px 28px; font-size: 0.95rem; font-weight: 700;">
            <i class="fa-solid fa-building"></i> Xem Danh Mục Dự Án Vinhomes
            <i class="fa-solid fa-arrow-right" style="margin-left: 6px;"></i>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- GÓC NHÌN ĐẦU TƯ THỰC CHIẾN (MARKET INSIGHTS & JOURNAL) -->
    <section id="insights" class="insights-section" style="padding: 75px 0; background: rgba(255, 255, 255, 0.015); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 36px;">
          <p class="section-subtitle" style="color: var(--gold-primary); font-weight: 700; letter-spacing: 1px; font-size: 0.82rem;">
            <i class="fa-solid fa-book-open"></i> GÓC NHÌN CHUYÊN GIA BẾN THÀNH
          </p>
          <h2 class="section-title" style="font-size: 2rem; margin: 8px 0 12px;">Câu Chuyện Đầu Tư Bất Động Sản Thực Chiến</h2>
          <p class="section-desc" style="max-width: 720px; margin: 0 auto; color: var(--text-muted); font-size: 0.95rem;">
            Phân tích chuyên sâu về đòn bẩy tài chính, kiểm tra quy hoạch lộ giới và bài học đắt giá từ 12 năm kinh nghiệm thực tế tại Quận 1.
          </p>
        </div>

        <!-- 3 Articles Cards Grid -->
        <div class="home-insights-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 26px; margin-bottom: 35px;">
          <article 
            v-for="art in homeArticles" 
            :key="art.id"
            class="home-art-card"
          >
            <NuxtLink :to="`/tin-tuc/${art.slug || art.id}`" class="home-art-thumb">
              <img :src="art.image" :alt="art.title" loading="lazy">
              <span class="home-art-pill">{{ art.category }}</span>
              <span v-if="art.isFeatured" class="home-art-star"><i class="fa-solid fa-star"></i> Tiêu điểm</span>
            </NuxtLink>
            
            <div class="home-art-content">
              <div class="home-art-meta">
                <span><i class="fa-regular fa-clock"></i> {{ art.readTime }}</span>
                <span>•</span>
                <span><i class="fa-regular fa-eye"></i> {{ art.views }} lượt đọc</span>
              </div>

              <h3 class="home-art-title">
                <NuxtLink :to="`/tin-tuc/${art.slug || art.id}`">
                  {{ art.title }}
                </NuxtLink>
              </h3>

              <p class="home-art-excerpt">
                {{ art.excerpt }}
              </p>

              <NuxtLink :to="`/tin-tuc/${art.slug || art.id}`" class="home-art-link">
                Đọc bài viết <i class="fa-solid fa-arrow-right"></i>
              </NuxtLink>
            </div>
          </article>
        </div>

        <!-- Nút Xem Tất Cả Bài Viết -->
        <div style="text-align: center;">
          <NuxtLink to="/tin-tuc" class="btn btn-gold" style="padding: 13px 32px; font-size: 0.95rem; font-weight: 700;">
            <i class="fa-solid fa-newspaper"></i> Xem Toàn Bộ Tin Tức & Kinh Nghiệm Đầu Tư
            <i class="fa-solid fa-arrow-right" style="margin-left: 6px;"></i>
          </NuxtLink>
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

        <!-- Nút Xem Tất Cả Chuyên Viên -->
        <div style="text-align: center; margin-top: 36px;">
          <NuxtLink to="/doi-ngu-chuyen-vien" class="btn btn-gold" style="padding: 13px 32px; font-size: 0.95rem; font-weight: 700;">
            <i class="fa-solid fa-users"></i> Xem Toàn Bộ Đội Ngũ Chuyên Viên ({{ totalAgentsCount }}+ Chuyên Gia)
            <i class="fa-solid fa-arrow-right" style="margin-left: 6px;"></i>
          </NuxtLink>
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
        <div style="margin-top: 28px;">
          <NuxtLink to="/ve-chung-toi" class="btn btn-gold" style="padding: 13px 32px; font-size: 0.95rem; font-weight: 700;">
            <i class="fa-solid fa-circle-info"></i> Xem Chi Tiết Về Bến Thành Land
            <i class="fa-solid fa-arrow-right" style="margin-left: 6px;"></i>
          </NuxtLink>
        </div>
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
  province: 'all',
  ward: 'all',
  priceRange: 'all'
});

const categoryList = [
  { id: 'all', name: 'Tất Cả Sản Phẩm' },
  { id: 'nha-pho', name: 'Nhà Phố' },
  { id: 'du-an', name: 'Dự Án' }
];

const selectedProperty = ref<any>(null);
const searchCountText = ref('');
const loadingProps = ref(false);

// Load data từ Backend SQLite qua Nitro API
const { data: propertiesData, refresh: refreshProps } = useFetch('/api/properties', {
  query: filters,
});

// Toàn bộ danh sách gốc để lấy danh sách các khu vực/tỉnh thành
const { data: allPropsData } = useFetch('/api/properties');

const distinctProvinces = computed(() => {
  const set = new Set<string>();
  (allPropsData.value || []).forEach((p: any) => {
    if (p.province && p.province.trim()) {
      set.add(p.province.trim());
    }
  });
  return Array.from(set);
});

const distinctWards = computed(() => {
  const set = new Set<string>();
  (allPropsData.value || []).forEach((p: any) => {
    if (filters.province !== 'all' && p.province !== filters.province) return;
    if (p.ward && p.ward.trim()) {
      set.add(p.ward.trim());
    }
  });
  return Array.from(set);
});

const { data: agentsData } = useFetch('/api/agents');
const { data: articlesData } = useFetch('/api/articles?published=true');

const properties = computed(() => (propertiesData.value || []).slice(0, 6));
const totalPropertiesCount = computed(() => (allPropsData.value || []).length);
const agents = computed(() => (agentsData.value || []).slice(0, 4));
const totalAgentsCount = computed(() => (agentsData.value || []).length);
const homeArticles = computed(() => (articlesData.value || []).slice(0, 3));

const selectCategory = (catId: string) => {
  filters.category = catId;
  handleSearch();
};

const selectProvince = (prov: string) => {
  filters.province = prov;
  filters.ward = 'all';
  handleSearch();
};

const selectWard = (w: string) => {
  filters.ward = w;
  handleSearch();
};

const handleCategoryChange = () => {
  handleSearch();
};

// --- HERO BACKGROUND SLIDESHOW ---
const heroSlides = [
  {
    image: '/images/hero-vinhome-hocmon.jpg',
    title: 'Vinhomes Hóc Môn',
    icon: 'fa-solid fa-tree-city',
    sub: 'Đại đô thị sinh thái thông minh phía Tây Bắc TP.HCM'
  },
  {
    image: '/images/hero-vinhome-cangio.jpg',
    title: 'Vinhomes Cần Giờ',
    icon: 'fa-solid fa-water',
    sub: 'Siêu đô thị biển nghỉ dưỡng quốc tế 2.870ha'
  },
  {
    image: '/images/banner-nha-pho.jpg',
    title: 'Nhà Phố Quận 11',
    icon: 'fa-solid fa-house-chimney',
    sub: 'Quỹ căn mặt tiền kinh doanh và hẻm xe hơi VIP'
  },
  {
    image: '/images/hero-vinhome.jpg',
    title: 'Vinhomes Grand Park',
    icon: 'fa-solid fa-city',
    sub: 'Đại đô thị đẳng cấp quốc tế trung tâm TP. Thủ Đức'
  }
];

const activeHeroSlideIndex = ref(0);
let heroSlideTimer: any = null;

const startHeroSlideTimer = () => {
  if (import.meta.client) {
    if (heroSlideTimer) clearInterval(heroSlideTimer);
    heroSlideTimer = setInterval(() => {
      activeHeroSlideIndex.value = (activeHeroSlideIndex.value + 1) % heroSlides.length;
    }, 4500);
  }
};

// Load Banners quản lý từ Admin CMS
const { data: homeBannersData } = useFetch('/api/banners?page=home');

// --- BANNER VÈ BÊN TRÁI TRANG CHỦ (Tự động chuyển slide 2.5s / ảnh & Quản lý qua Admin CMS) ---
const defaultHomeSlides = [
  {
    title: 'VINHOMES HÓC MÔN',
    imageSrc: '/images/hero-vinhome-hocmon.jpg',
    badgeIcon: 'fa-tree-city',
    btnText: 'Dự Án Hóc Môn',
    link: '/du-an'
  },
  {
    title: 'VINHOMES CẦN GIỜ',
    imageSrc: '/images/hero-vinhome-cangio.jpg',
    badgeIcon: 'fa-water',
    btnText: 'Dự Án Cần Giờ',
    link: '/du-an'
  },
  {
    title: 'NHÀ PHỐ QUẬN 11',
    imageSrc: '/images/banner-poster-nhapho.jpg',
    badgeIcon: 'fa-crown',
    btnText: 'Giỏ Hàng Q.11',
    link: '/nha-pho'
  },
  {
    title: 'KÝ GỬI NHÀ ĐẤT',
    imageSrc: '/images/banner-du-an.jpg',
    badgeIcon: 'fa-handshake',
    btnText: 'Ký Gửi BĐS VIP',
    link: '/ky-gui'
  }
];

const homepageLeftFlyerSlides = computed(() => {
  const list = homeBannersData.value || [];
  const activeList = list.filter((b: any) => b.isActive);
  if (activeList.length > 0) {
    return activeList.map((b: any) => ({
      title: b.title,
      imageSrc: b.imageUrl,
      badgeIcon: b.badgeIcon || 'fa-crown',
      btnText: b.btnText || 'Xem Chi Tiết',
      link: b.linkUrl || '/du-an'
    }));
  }
  return defaultHomeSlides;
});

onMounted(() => {
  startHeroSlideTimer();
});

onUnmounted(() => {
  if (heroSlideTimer) clearInterval(heroSlideTimer);
});

const handleSearch = async () => {
  loadingProps.value = true;
  await refreshProps();
  loadingProps.value = false;

  if (filters.keyword || filters.category !== 'all' || filters.ward !== 'all' || filters.priceRange !== 'all') {
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

<style scoped>
.ward-tab-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  color: var(--text-sub);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}
.ward-tab-btn:hover {
  border-color: var(--border-gold);
  color: var(--gold-primary);
  background: rgba(212, 175, 55, 0.08);
}
.ward-tab-btn.active {
  background: var(--gold-primary);
  color: #0b0f19;
  border-color: var(--gold-primary);
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
}

/* HOME INSIGHTS SECTION */
.home-art-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: var(--transition);
}
.home-art-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-gold);
  box-shadow: var(--shadow-gold);
}
.home-art-thumb {
  position: relative;
  height: 200px;
  overflow: hidden;
  display: block;
}
.home-art-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.home-art-card:hover .home-art-thumb img {
  transform: scale(1.06);
}
.home-art-pill {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  border: 1px solid var(--border-gold);
  color: var(--gold-primary);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 4px;
}
.home-art-star {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--gold-gradient);
  color: #000;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 4px;
}
.home-art-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.home-art-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.home-art-title {
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 10px;
}
.home-art-title a {
  color: var(--text-main);
  text-decoration: none;
  transition: var(--transition);
}
.home-art-title a:hover {
  color: var(--gold-primary);
}
.home-art-excerpt {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.55;
  margin-bottom: 18px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.home-art-link {
  margin-top: auto;
  color: var(--gold-primary);
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: var(--transition);
}
.home-art-link:hover {
  transform: translateX(4px);
}
</style>
