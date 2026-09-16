<template>
  <main style="padding: 100px 0 80px; min-height: 90vh;">
    <div class="container">
      
      <!-- Loading State -->
      <div v-if="pending" style="text-align: center; padding: 80px 20px;">
        <i class="fa-solid fa-spinner fa-spin" style="font-size: 2.2rem; color: var(--gold-primary);"></i>
        <p style="margin-top: 14px; color: var(--text-muted); font-size: 0.95rem;">Đang tải thông tin bất động sản...</p>
      </div>

      <!-- Property Not Found -->
      <div v-else-if="!property" style="text-align: center; padding: 80px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color); max-width: 600px; margin: 40px auto;">
        <i class="fa-solid fa-house-chimney-crack" style="font-size: 3rem; color: var(--gold-primary); margin-bottom: 16px; display: block;"></i>
        <h2 style="color: var(--text-main); font-size: 1.4rem; margin-bottom: 8px;">Không tìm thấy bất động sản</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px;">Bất động sản này không tồn tại hoặc đã được giao dịch thành công.</p>
        <NuxtLink to="/" class="btn btn-gold">
          <i class="fa-solid fa-arrow-left"></i> Quay Lại Trang Chủ
        </NuxtLink>
      </div>

      <!-- Property Detail Found -->
      <div v-else>
        <!-- 1. Breadcrumbs & Share Bar -->
        <div class="detail-top-bar">
          <nav class="detail-breadcrumbs">
            <NuxtLink to="/" class="bc-link"><i class="fa-solid fa-house"></i> Trang Chủ</NuxtLink>
            <span class="bc-sep">/</span>
            <span class="bc-cat">{{ property.categoryId === 'nha-pho' ? 'Nhà Phố' : 'Dự Án' }}</span>
            <span v-if="property.ward" class="bc-sep">/</span>
            <span v-if="property.ward" class="bc-ward">{{ property.ward }}</span>
            <span class="bc-sep">/</span>
            <span class="bc-current">{{ property.id }}</span>
          </nav>

          <div class="detail-actions-group">
            <button class="btn btn-outline-gold share-btn" @click="copyShareLink">
              <i class="fa-solid fa-share-nodes"></i> {{ shareCopied ? 'Đã Sao Chép Link!' : 'Chia Sẻ' }}
            </button>
            <NuxtLink to="/" class="btn btn-admin" style="font-size: 0.82rem; padding: 7px 14px;">
              <i class="fa-solid fa-arrow-left"></i> Về Trang Chủ 
            </NuxtLink>
          </div>
        </div>

        <!-- 2. Main Title & Quick Header -->
        <div class="detail-header-block">
          <div class="detail-badge-row">
            <span class="prop-badge" style="position: static; font-size: 0.82rem;">{{ property.badge || 'Đang Bán' }}</span>
            <span v-if="property.categoryId === 'nha-pho'" class="prop-type-pill house" style="font-size: 0.82rem; padding: 3px 10px;">
              Nhà Phố <span v-if="property.province || property.ward">• {{ [property.province, property.ward].filter(Boolean).join(' • ') }}</span>
            </span> 
            <span v-else class="prop-type-pill project" style="font-size: 0.82rem; padding: 3px 10px;">
              Dự Án Cao Cấp <span v-if="property.province || property.ward">• {{ [property.province, property.ward].filter(Boolean).join(' • ') }}</span>
            </span>
            <span class="prop-code-badge">MÃ: {{ property.id }}</span>
          </div>

          <h1 class="detail-title">{{ property.title }}</h1>
          
          <div class="detail-sub-meta">
            <div class="meta-location">
              <i class="fa-solid fa-location-dot" style="color: var(--gold-primary);"></i>
              <span>{{ property.location }}</span>
            </div>
            <div class="meta-price-box">
              <span class="price-label">Giá chuyển nhượng:</span>
              <span class="price-val">{{ property.price }}</span>
            </div>
          </div>
        </div>

        <!-- 3. Grid: Left (Gallery + Content + Map) & Right (Sticky Agent Card) -->
        <div class="detail-main-layout">
          
          <!-- LEFT COLUMN: CONTENT -->
          <div class="detail-content-col">
            
            <!-- GALLERY SLIDER -->
            <div class="gallery-container">
              <!-- Main Active Image -->
              <div class="gallery-main-wrap">
                <img :src="activeImage" :alt="property.title" class="gallery-main-img">
                
                <!-- Nav Prev/Next Buttons -->
                <button v-if="galleryImages.length > 1" class="gallery-nav-btn prev" @click="prevImage">
                  <i class="fa-solid fa-chevron-left"></i>
                </button>
                <button v-if="galleryImages.length > 1" class="gallery-nav-btn next" @click="nextImage">
                  <i class="fa-solid fa-chevron-right"></i>
                </button>

                <div class="gallery-counter">
                  <i class="fa-regular fa-image"></i> {{ activeImageIndex + 1 }} / {{ galleryImages.length }}
                </div>
              </div>

              <!-- Thumbnails Row -->
              <div v-if="galleryImages.length > 1" class="gallery-thumbs-row">
                <div 
                  v-for="(img, idx) in galleryImages" 
                  :key="idx" 
                  class="gallery-thumb-item" 
                  :class="{ active: idx === activeImageIndex }"
                  @click="activeImageIndex = idx"
                >
                  <img :src="img" :alt="`Ảnh ${idx + 1}`" loading="lazy">
                </div>
              </div>
            </div>

            <!-- KEY SPECS GRID -->
            <div class="detail-section-card">
              <h3 class="section-card-title">
                <i class="fa-solid fa-clipboard-list" style="color: var(--gold-primary);"></i> Thông Số Kỹ Thuật & Pháp Lý
              </h3>
              
              <div class="specs-grid">
                <div v-if="property.province" class="spec-item">
                  <span class="spec-label">Tỉnh / Thành</span>
                  <strong class="spec-value" style="color: var(--gold-primary);">{{ property.province }}</strong>
                </div>
                <div v-if="property.ward" class="spec-item">
                  <span class="spec-label">Khu vực / Phường</span>
                  <strong class="spec-value">{{ property.ward }}</strong>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Diện tích</span>
                  <strong class="spec-value">{{ property.area }}</strong>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Kích thước</span>
                  <strong class="spec-value">{{ property.dimensions || 'Chuẩn' }}</strong>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Kết cấu</span>
                  <strong class="spec-value">{{ property.structure || 'Chuẩn' }}</strong>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Pháp lý</span>
                  <strong class="spec-value" style="color: #10b981;">✓ {{ property.legal || 'Sổ hồng hoàn công' }}</strong>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Dòng tiền thuê</span>
                  <strong class="spec-value" style="color: var(--gold-primary);">{{ property.rentIncome || 'Thương lượng' }}</strong>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Hướng nhà</span>
                  <strong class="spec-value">{{ property.direction || 'Đông Nam' }}</strong>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Số phòng ngủ</span>
                  <strong class="spec-value">{{ property.bedrooms || 0 }} PN</strong>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Số phòng tắm</span>
                  <strong class="spec-value">{{ property.bathrooms || 0 }} WC</strong>
                </div>
              </div>
            </div>

            <!-- DESCRIPTION & FEATURES -->
            <div class="detail-section-card">
              <h3 class="section-card-title">
                <i class="fa-solid fa-circle-info" style="color: var(--gold-primary);"></i> Mô Tả Chi Tiết
              </h3>
              <div class="detail-desc-text">
                <p>{{ property.description || 'Vị trí đắc địa trung tâm Quận 1, thanh khoản cao, giao dịch an toàn.' }}</p>
              </div>

              <!-- Features checklist -->
              <div v-if="parsedFeatures.length > 0" style="margin-top: 20px;">
                <h4 style="font-size: 0.95rem; color: var(--gold-primary); margin-bottom: 12px;">ĐẶC ĐIỂM & TIỆN ÍCH NỔI BẬT:</h4>
                <div class="features-pill-wrap">
                  <span v-for="(feat, fIdx) in parsedFeatures" :key="fIdx" class="feature-tag">
                    <i class="fa-solid fa-check" style="color: var(--gold-primary); margin-right: 6px;"></i> {{ feat }}
                  </span>
                </div>
              </div>
            </div>

            <!-- GOOGLE MAPS SECTION -->
            <div class="detail-section-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
                <h3 class="section-card-title" style="margin-bottom: 0;">
                  <i class="fa-solid fa-map-location-dot" style="color: var(--gold-primary);"></i> Vị Trí Bất Động Sản (Google Maps)
                </h3>
                <a :href="googleMapsExternalUrl" target="_blank" class="btn btn-outline-gold" style="font-size: 0.8rem; padding: 5px 12px;">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i> Mở Bản Đồ Lớn
                </a>
              </div>
              
              <div class="map-frame-container">
                <iframe 
                  :src="mapEmbedUrl" 
                  width="100%" 
                  height="340" 
                  style="border:0; border-radius: var(--radius-md);" 
                  allowfullscreen="" 
                  loading="lazy" 
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <small style="color: var(--text-muted); display: block; margin-top: 8px; font-size: 0.78rem;">
                * Bản đồ định vị khu vực: {{ property.location }}
              </small>
            </div>

          </div>

          <!-- RIGHT COLUMN: STICKY AGENT & LEAD FORM -->
          <div class="detail-sidebar-col">
            
            <!-- AGENT CONTACT CARD -->
            <div class="agent-contact-sidebar-card">
              <p class="sidebar-sub-heading">CHUYÊN VIÊN PHỤ TRÁCH</p>
              
              <div class="sidebar-agent-profile" v-if="property.agent">
                <img :src="property.agent.avatar" :alt="property.agent.name" class="sidebar-agent-avatar">
                <div>
                  <h4 class="sidebar-agent-name">{{ property.agent.name }}</h4>
                  <p class="sidebar-agent-role">{{ property.agent.role }}</p>
                  <span class="agent-tag" style="position: static; font-size: 0.72rem; padding: 2px 7px; margin-top: 4px; display: inline-block;">
                    {{ property.agent.tag || 'Chuyên Viên' }}
                  </span>
                </div>
              </div>

              <div v-else style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                <div class="logo-icon" style="width: 48px; height: 48px; font-size: 1.2rem;">BT</div>
                <div>
                  <h4 style="color: var(--text-main); font-size: 1rem;">Ban Quản Lý Quỹ Căn</h4>
                  <p style="color: var(--gold-primary); font-size: 0.8rem;">Sàn Giao Dịch Bến Thành</p>
                </div>
              </div>

              <p v-if="property.agent?.slogan" class="sidebar-agent-slogan">
                "{{ property.agent.slogan }}"
              </p>

              <div class="sidebar-agent-actions">
                <a :href="`tel:${hotlinePhone.replace(/[^0-9]/g, '')}`" class="btn btn-call" style="width: 100%; justify-content: center;">
                  <i class="fa-solid fa-phone"></i> Gọi Ngay: {{ displayPhone }}
                </a>
                <a :href="zaloUrl" target="_blank" class="btn btn-zalo" style="width: 100%; justify-content: center;">
                  <i class="fa-solid fa-comment-dots"></i> Nhắn Zalo Nhận Sổ Đỏ
                </a>
              </div>

              <NuxtLink v-if="property.agent" :to="`/nhan-vien/${property.agent.id}`" class="btn btn-outline-gold" style="width: 100%; justify-content: center; font-size: 0.82rem; margin-top: 10px;">
                <i class="fa-solid fa-id-card"></i> Xem Thêm Quỹ Căn Của {{ property.agent.name }}
              </NuxtLink>
            </div>

            <!-- REGISTRATION FORM -->
            <div class="lead-reg-sidebar-card">
              <h4 style="font-size: 1.05rem; color: var(--gold-primary); margin-bottom: 6px;">
                <i class="fa-solid fa-calendar-check"></i> Đăng Ký Xem Nhà & Pháp Lý
              </h4>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 16px;">
                Để lại số điện thoại, chuyên viên phụ trách căn này sẽ gọi lại trong 5 phút.
              </p>

              <form @submit.prevent="submitLead">
                <div style="margin-bottom: 12px;">
                  <input v-model="leadForm.name" type="text" class="filter-input" placeholder="Họ và tên quý khách *" required>
                </div>
                <div style="margin-bottom: 12px;">
                  <input v-model="leadForm.phone" type="tel" class="filter-input" placeholder="Số điện thoại / Zalo *" required>
                </div>
                <div style="margin-bottom: 14px;">
                  <textarea v-model="leadForm.note" rows="2" class="filter-input" placeholder="Ghi chú thêm (VD: Muốn xem nhà lúc 10h sáng)..."></textarea>
                </div>

                <button type="submit" class="btn btn-gold" style="width: 100%; padding: 11px;" :disabled="leadSubmitting">
                  <i class="fa-solid fa-paper-plane"></i> {{ leadSubmitting ? 'Đang gửi...' : 'Gửi Yêu Cầu Tư Vấn' }}
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>

    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute();
const id = route.params.id as string;
const { showToast } = useToast();

const { data: propertyData, pending } = await useFetch<any>(`/api/properties/${id}`);
const property = computed(() => propertyData.value);

// Gallery state
const activeImageIndex = ref(0);

const galleryImages = computed<string[]>(() => {
  if (!property.value) return [];
  const list: string[] = [];
  if (property.value.images) {
    try {
      const parsed = typeof property.value.images === 'string' ? JSON.parse(property.value.images) : property.value.images;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      // ignore parse error
    }
  }
  if (property.value.image) {
    list.push(property.value.image);
  }
  return list.length > 0 ? list : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];
});

const activeImage = computed(() => {
  return galleryImages.value[activeImageIndex.value] || galleryImages.value[0];
});

const prevImage = () => {
  if (galleryImages.value.length === 0) return;
  activeImageIndex.value = (activeImageIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length;
};

const nextImage = () => {
  if (galleryImages.value.length === 0) return;
  activeImageIndex.value = (activeImageIndex.value + 1) % galleryImages.value.length;
};

// Features parsing
const parsedFeatures = computed<string[]>(() => {
  if (!property.value?.features) return [];
  try {
    const f = typeof property.value.features === 'string' ? JSON.parse(property.value.features) : property.value.features;
    return Array.isArray(f) ? f : [];
  } catch (e) {
    return [];
  }
});

// Google Maps Embed & External URLs
const mapEmbedUrl = computed(() => {
  if (!property.value) return '';
  if (property.value.mapUrl && property.value.mapUrl.includes('output=embed')) {
    return property.value.mapUrl;
  }
  const query = `${property.value.location || ''}, Quận 1, TP Hồ Chí Minh`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
});

const googleMapsExternalUrl = computed(() => {
  if (!property.value) return '#';
  const query = `${property.value.location || ''}, Quận 1, TP Hồ Chí Minh`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
});

// Contact info
const hotlinePhone = computed(() => {
  return property.value?.agent?.phone || '0912131329';
});

const displayPhone = computed(() => {
  return property.value?.agent?.phoneDisplay || '0912.131.329';
});

const zaloUrl = computed(() => {
  return property.value?.agent?.zalo || `https://zalo.me/${hotlinePhone.value.replace(/[^0-9]/g, '')}`;
});

// Share link
const shareCopied = ref(false);
const copyShareLink = async () => {
  if (import.meta.client) {
    try {
      await navigator.clipboard.writeText(window.location.href);
      shareCopied.value = true;
      showToast('Đã sao chép link BĐS vào bộ nhớ tạm!');
      setTimeout(() => { shareCopied.value = false; }, 3000);
    } catch (e) {
      showToast('Không thể sao chép liên kết.');
    }
  }
};

// Lead form submission
const leadForm = reactive({
  name: '',
  phone: '',
  note: ''
});
const leadSubmitting = ref(false);

const submitLead = async () => {
  leadSubmitting.value = true;
  try {
    await $fetch('/api/leads', {
      method: 'POST',
      body: {
        name: leadForm.name,
        phone: leadForm.phone,
        demand: 'Đăng ký xem BĐS',
        propertyInterest: `${property.value?.title} (${property.value?.id})`,
        agentId: property.value?.agentId || null,
        note: leadForm.note,
      },
    });
    showToast('Gửi thông tin thành công! Chuyên viên sẽ liên hệ ngay.');
    leadForm.name = '';
    leadForm.phone = '';
    leadForm.note = '';
  } catch (e) {
    showToast('Có lỗi xảy ra, vui lòng gọi trực tiếp hotline.');
  } finally {
    leadSubmitting.value = false;
  }
};

// Meta tags for SEO & OpenGraph
useHead(() => {
  if (!property.value) return {};
  return {
    title: `${property.value.title} - Bất Động Sản Bến Thành`,
    meta: [
      { name: 'description', content: property.value.description || property.value.title },
      { property: 'og:title', content: `${property.value.title} - ${property.value.price}` },
      { property: 'og:description', content: `Diện tích: ${property.value.area} | Vị trí: ${property.value.location} | Giá: ${property.value.price}` },
      { property: 'og:image', content: activeImage.value },
      { property: 'og:type', content: 'article' },
    ]
  };
});
</script>

<style scoped>
.detail-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-color);
}
.detail-breadcrumbs {
  font-size: 0.85rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}
.bc-link {
  color: var(--text-sub);
  text-decoration: none;
}
.bc-link:hover {
  color: var(--gold-primary);
}
.bc-sep {
  color: var(--border-color);
}
.bc-cat {
  color: var(--gold-primary);
  font-weight: 600;
}
.bc-ward {
  color: var(--text-main);
}
.bc-current {
  color: var(--text-muted);
}
.detail-actions-group {
  display: flex;
  gap: 8px;
}

.detail-header-block {
  margin-bottom: 28px;
}
.detail-badge-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.prop-code-badge {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
}
.detail-title {
  font-size: 1.85rem;
  font-family: var(--font-heading);
  color: var(--text-main);
  margin-bottom: 12px;
  line-height: 1.35;
}
.detail-sub-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.meta-location {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: var(--text-sub);
}
.meta-price-box {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.price-label {
  font-size: 0.88rem;
  color: var(--text-muted);
}
.price-val {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--gold-primary);
  font-family: var(--font-heading);
}

/* Main Layout */
.detail-main-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 30px;
  align-items: start;
}

@media (max-width: 960px) {
  .detail-main-layout {
    grid-template-columns: 1fr;
  }
}

/* Gallery */
.gallery-container {
  margin-bottom: 24px;
}
.gallery-main-wrap {
  position: relative;
  width: 100%;
  height: 480px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: #000;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}
@media (max-width: 640px) {
  .gallery-main-wrap {
    height: 280px;
  }
}
.gallery-main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}
.gallery-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(11, 15, 25, 0.7);
  border: 1px solid var(--border-gold);
  color: var(--gold-primary);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s ease;
}
.gallery-nav-btn:hover {
  background: var(--gold-primary);
  color: #0b0f19;
}
.gallery-nav-btn.prev { left: 16px; }
.gallery-nav-btn.next { right: 16px; }

.gallery-counter {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(11, 15, 25, 0.75);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--gold-primary);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.gallery-thumbs-row {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  overflow-x: auto;
  padding-bottom: 6px;
}
.gallery-thumb-item {
  flex: 0 0 90px;
  height: 65px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  opacity: 0.6;
}
.gallery-thumb-item:hover {
  opacity: 0.9;
}
.gallery-thumb-item.active {
  border-color: var(--gold-primary);
  opacity: 1;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
}
.gallery-thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Content Cards */
.detail-section-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-sm);
}
.section-card-title {
  font-size: 1.15rem;
  font-family: var(--font-heading);
  color: var(--text-main);
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Specs Grid */
.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px;
}
.spec-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.spec-label {
  font-size: 0.78rem;
  color: var(--text-muted);
}
.spec-value {
  font-size: 0.95rem;
  color: var(--text-main);
}

.detail-desc-text p {
  color: var(--text-sub);
  font-size: 0.95rem;
  line-height: 1.7;
}

.features-pill-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.feature-tag {
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.25);
  color: var(--text-main);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 500;
}

/* Sidebar */
.agent-contact-sidebar-card {
  background: var(--bg-card);
  border: 1px solid var(--border-gold);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 90px;
}
.sidebar-sub-heading {
  font-size: 0.75rem;
  color: var(--gold-primary);
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-bottom: 14px;
}
.sidebar-agent-profile {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}
.sidebar-agent-avatar {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--gold-primary);
}
.sidebar-agent-name {
  font-size: 1.05rem;
  color: var(--text-main);
  margin-bottom: 2px;
}
.sidebar-agent-role {
  font-size: 0.78rem;
  color: var(--gold-primary);
}
.sidebar-agent-slogan {
  font-size: 0.84rem;
  color: var(--text-muted);
  font-style: italic;
  margin-bottom: 16px;
  line-height: 1.45;
}
.sidebar-agent-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lead-reg-sidebar-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.prop-type-pill {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 4px;
  display: inline-block;
}
.prop-type-pill.house {
  background: rgba(212, 175, 55, 0.15);
  color: var(--gold-primary);
  border: 1px solid rgba(212, 175, 55, 0.35);
}
.prop-type-pill.project {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.35);
}
</style>
