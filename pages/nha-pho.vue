<template>
  <main class="specialized-page">
    <!-- BANNER VÈ BÊN TRÁI DÀNH RIÊNG CHO TRANG NHÀ PHỐ (QUẢN LÝ QUA ADMIN) -->
    <LeftFlyerBanner 
      v-if="currentBanner && currentBanner.isActive"
      :imageSrc="currentBanner.imageUrl || '/images/banner-poster-nhapho.jpg'"
      :title="currentBanner.title || 'NHÀ PHỐ QUẬN 1'"
      :badgeIcon="currentBanner.badgeIcon || 'fa-crown'"
      :btnText="currentBanner.btnText || 'Xem Quỹ Căn'"
      reopenLabel="Banner Nhà Phố"
      targetId="properties-list-top"
    />

    <!-- PANEL CHUYÊN VIÊN BÊN PHẢI (CỐ ĐỊNH ĐỐI XỨNG BANNER TRÁI) -->
    <RightSpecialistFlyer 
      :agents="agents"
      defaultAgentId="agent-nguyen-van-phu"
    />

    <div class="container">
      <!-- BREADCRUMB -->
      <nav class="detail-breadcrumb" style="margin-bottom: 20px;">
        <NuxtLink to="/">Trang Chủ</NuxtLink>
        <i class="fa-solid fa-chevron-right"></i>
        <span class="active-crumb">Nhà Phố Trung Tâm</span>
      </nav>

      <!-- PAGE HEADER: TIÊU ĐỀ + BỘ LỌC TÌM KIẾM -->
      <div id="properties-list-top" class="page-header-bar">
        <div>
          <p class="section-subtitle">DANH SÁCH GIỎ HÀNG</p>
          <h1 class="page-main-title">Nhà Phố Trung Tâm Đang Mở Bán</h1>
          <p class="page-sub-desc">Quỹ căn nhà phố mặt tiền Quận 1 – pháp lý chuẩn sổ hồng riêng, giá gốc chủ đầu tư.</p>
        </div>
        <div class="filter-controls-row">
          <input
            v-model="searchKeyword"
            type="text"
            class="filter-input"
            placeholder="Tên đường, quận, từ khóa..."
          />
          <select v-model="filterPrice" class="filter-select">
            <option value="all">Mức giá: Tất cả</option>
            <option value="under20">Dưới 20 Tỷ</option>
            <option value="20to50">20 – 50 Tỷ</option>
            <option value="above50">Trên 50 Tỷ</option>
          </select>
        </div>
      </div>

      <!-- MAIN CONTENT: GRID BẤT ĐỘNG SẢN RỘNG RÃI & THUẬN MẮT -->
      <div class="properties-main-section">
        <!-- Loading -->
        <div v-if="pending" style="text-align:center; padding:60px; color:var(--gold-primary);">
          <i class="fa-solid fa-spinner fa-spin" style="font-size:2.2rem;"></i>
          <p style="margin-top:12px; color:var(--text-muted); font-size: 0.95rem;">Đang tải quỹ căn nhà phố...</p>
        </div>

        <!-- Grid BĐS 3 Cột Sang Trọng -->
        <div v-else-if="visibleProperties.length > 0" class="properties-grid-full">
          <PropertyCard
            v-for="prop in visibleProperties"
            :key="prop.id"
            :property="prop"
            @select="selectedProperty = prop"
          />
        </div>

        <!-- Nút Tải Thêm (Load More) Tránh Kéo Mỏi Tay -->
        <div v-if="hasMore" style="text-align: center; margin: 36px 0;">
          <button class="btn btn-outline-gold" style="padding: 13px 36px; font-size: 0.95rem; font-weight: 700;" @click="loadMore">
            <i class="fa-solid fa-plus-circle" style="margin-right: 6px;"></i> Xem Thêm Căn Nhà Phố (Còn {{ filteredProperties.length - displayLimit }} căn)
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredProperties.length === 0" class="empty-state-box">
          <i class="fa-solid fa-house-chimney-crack" style="font-size:2.8rem; color:var(--gold-primary); margin-bottom:12px; display:block;"></i>
          <h4>Không tìm thấy căn nhà phố phù hợp tiêu chí</h4>
          <p>Quý khách vui lòng liên hệ trực tiếp chuyên viên tư vấn để nhận quỹ căn kín chưa công khai trên thị trường.</p>
          <button class="btn btn-gold" style="margin-top:15px;" @click="resetFilters">Xem Tất Cả Quỹ Căn</button>
        </div>

        <!-- Consignment Form Dành Cho Khách Hàng Muốn Ký Gửi -->
        <div class="consignment-section-wrap">
          <ConsignmentForm />
        </div>
      </div>

    </div>

    <!-- MODAL CHI TIẾT BĐS -->
    <PropertyDetailModal
      :property="selectedProperty"
      @close="selectedProperty = null"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import LeftFlyerBanner from '~/components/LeftFlyerBanner.vue';
import RightSpecialistFlyer from '~/components/RightSpecialistFlyer.vue';
import PropertyCard from '~/components/PropertyCard.vue';
import PropertyDetailModal from '~/components/PropertyDetailModal.vue';
import ConsignmentForm from '~/components/ConsignmentForm.vue';

const selectedProperty = ref<any>(null);
const searchKeyword = ref('');
const filterPrice = ref('all');

// Lấy danh sách BĐS với categoryId = 'nha-pho'
const { data: propertiesData, pending } = await useFetch('/api/properties', {
  query: { category: 'nha-pho' },
});

// Lấy danh sách Agents từ sàn Bến Thành Land
const { data: agentsData } = await useFetch('/api/agents');

// Lấy Banner từ hệ thống quản trị CMS
const { data: bannersData } = await useFetch('/api/banners', {
  query: { page: 'nha-pho' },
});

const properties = computed(() => propertiesData.value || []);
const agents = computed(() => agentsData.value || []);
const currentBanner = computed(() => {
  if (!bannersData.value || bannersData.value.length === 0) return null;
  return bannersData.value.find((b: any) => b.id === 'nha-pho') || bannersData.value[0];
});

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
  title: 'Giỏ Hàng Nhà Phố Mặt Tiền & Kinh Doanh Quận 11 | Bến Thành Land',
  meta: [
    { name: 'description', content: 'Chuyên trang Nhà phố mặt tiền, biệt thự và tòa nhà kinh doanh Quận 11, TP.HCM. Pháp lý sổ hồng chuẩn 100%, thương lượng giá trực tiếp gia chủ.' },
    { property: 'og:title', content: 'Giỏ Hàng Nhà Phố Mặt Tiền & Kinh Doanh Quận 11 | Bến Thành Land' },
  ],
});
</script>

<style scoped>
.specialized-page {
  padding: 100px 0 80px;
  position: relative;
  min-height: 100vh;
}

/* ===== PAGE HEADER: TIÊU ĐỀ + BỘ LỌC ===== */
.page-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 18px;
  margin-bottom: 30px;
  padding-bottom: 22px;
  border-bottom: 1px solid var(--border-color, rgba(255,255,255,0.08));
}

.page-main-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text-main, #fff);
  margin: 6px 0 4px;
  font-family: var(--font-heading);
  letter-spacing: -0.5px;
}

.page-sub-desc {
  font-size: 0.92rem;
  color: var(--text-muted, #94a3b8);
  margin: 0;
}

.filter-controls-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-input {
  background: var(--bg-card, #0f1c30);
  border: 1px solid var(--border-color, rgba(255,255,255,0.12));
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  min-width: 240px;
  outline: none;
  transition: border-color 0.2s ease;
}

.filter-input:focus {
  border-color: var(--gold-primary, #dfb76c);
}

.filter-select {
  background: var(--bg-card, #0f1c30);
  border: 1px solid var(--border-color, rgba(255,255,255,0.12));
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  min-width: 170px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  border-color: var(--gold-primary, #dfb76c);
}

/* ===== GRID BĐS RỘNG RÃI & SANG TRỌNG ===== */
.properties-main-section {
  width: 100%;
}

.properties-grid-full {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 28px;
  margin-bottom: 50px;
}

/* Empty State */
.empty-state-box {
  text-align: center;
  padding: 70px 20px;
  background: var(--bg-card, #0f1c30);
  border: 1px dashed var(--border-color, rgba(255,255,255,0.15));
  border-radius: 12px;
  margin-bottom: 40px;
}

.empty-state-box h4 {
  font-size: 1.25rem;
  color: #ffffff;
  margin-bottom: 8px;
}

.empty-state-box p {
  color: var(--text-muted, #94a3b8);
  font-size: 0.9rem;
  max-width: 500px;
  margin: 0 auto;
}

.consignment-section-wrap {
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px solid var(--border-color, rgba(255,255,255,0.08));
}

@media (max-width: 768px) {
  .page-main-title {
    font-size: 1.65rem;
  }
  .properties-grid-full {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
