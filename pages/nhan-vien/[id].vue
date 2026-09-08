<template>
  <main style="padding: 110px 0 80px;">
    <div class="container">
      <!-- Loading State -->
      <div v-if="pending" style="text-align: center; padding: 60px;">
        <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; color: var(--gold-primary);"></i>
        <p style="margin-top: 10px; color: var(--text-muted);">Đang tải thông tin chuyên viên...</p>
      </div>

      <!-- Agent Profile Found -->
      <div v-else-if="agent">
        <!-- Action Buttons Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; flex-wrap: wrap; gap: 12px;">
          <NuxtLink to="/" class="btn btn-outline-gold">
            <i class="fa-solid fa-arrow-left"></i> Quay Lại Web Tổng Bến Thành
          </NuxtLink>
          <button class="btn btn-admin" @click="copyShareLink">
            <i class="fa-solid fa-share-nodes"></i> Sao Chép Link Trang Cá Nhân
          </button>
        </div>

        <!-- Hero Banner Cá Nhân Hóa (như Hình 2) -->
        <div class="agent-hero-banner">
          <div class="agent-hero-grid">
            <div class="agent-large-avatar">
              <img :src="agent.avatar" :alt="agent.name">
            </div>

            <div class="agent-hero-info">
              <h2 class="gold-text">{{ agent.name }}</h2>
              <p class="agent-hero-title">{{ agent.role }}</p>
              <p class="agent-hero-slogan">"{{ agent.slogan || 'Tận tâm - Uy tín - Minh bạch' }}"</p>
              <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 16px;">
                {{ agent.bio || 'Chuyên viên tư vấn bất động sản cao cấp trung tâm Bến Thành - Quận 1.' }}
              </p>
              
              <div class="agent-stats-badges" style="display: flex; flex-wrap: wrap; gap: 10px;">
                <span class="agent-tag" style="position: static;">Kinh nghiệm: {{ agent.exp }}</span>
                <span class="agent-tag" style="position: static;">Đã giao dịch: {{ agent.deals }}</span>
                <span class="agent-tag" style="position: static;">{{ agent.properties?.length || 0 }} căn phụ trách</span>
                <span class="agent-tag" style="position: static;">BĐS Bến Thành - Q.1</span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px; min-width: 220px;">
              <a :href="`tel:${agent.phone.replace(/[^0-9]/g, '')}`" class="btn btn-call" style="width: 100%;">
                <i class="fa-solid fa-phone"></i> Gọi Ngay: {{ agent.phoneDisplay || agent.phone }}
              </a>
              <a :href="agent.zalo || 'https://zalo.me'" target="_blank" class="btn btn-zalo" style="width: 100%;">
                <i class="fa-solid fa-comment-dots"></i> Chat Zalo Riêng
              </a>
            </div>
          </div>
        </div>

        <!-- Danh sách Quỹ căn riêng của nhân viên -->
        <div class="section-header" style="margin-bottom: 30px; text-align: left;">
          <p class="section-subtitle">GIỎ HÀNG PHỤ TRÁCH</p>
          <h3 class="section-title" style="font-size: 1.6rem;">
            Các Bất Động Sản Do {{ agent.name }} Trực Tiếp Quản Lý & Phân Phối
          </h3>
        </div>

        <!-- Grid Quỹ căn -->
        <div v-if="agent.properties && agent.properties.length > 0" class="properties-grid">
          <PropertyCard 
            v-for="prop in agent.properties" 
            :key="prop.id" 
            :property="prop" 
            @select="selectedProperty = prop" 
          />
        </div>

        <!-- Empty State nếu chưa phân công căn nào -->
        <div v-else style="text-align: center; color: var(--text-muted); padding: 50px 20px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <i class="fa-solid fa-house-chimney" style="font-size: 2.5rem; color: var(--gold-primary); margin-bottom: 12px; display: block;"></i>
          <h4 style="color: var(--text-main); margin-bottom: 6px;">Hiện tại chuyên viên đang cập nhật thêm quỹ căn mới</h4>
          <p style="font-size: 0.9rem;">Vui lòng liên hệ trực tiếp qua số điện thoại hoặc Zalo bên trên để nhận giỏ hàng kín sớm nhất.</p>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else style="text-align: center; padding: 70px 20px;">
        <h2 style="color: var(--gold-primary); margin-bottom: 12px;">Không tìm thấy chuyên viên</h2>
        <p style="color: var(--text-muted); margin-bottom: 25px;">Chuyên viên này không tồn tại hoặc đã được cập nhật lại.</p>
        <NuxtLink to="/" class="btn btn-gold">Quay lại trang chủ</NuxtLink>
      </div>

      <!-- Modal Chi Tiết BĐS -->
      <PropertyDetailModal 
        :property="selectedProperty" 
        @close="selectedProperty = null" 
      />
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute();
const id = route.params.id as string;
const { showToast } = useToast();

const selectedProperty = ref<any>(null);

const { data: agent, pending } = await useFetch(`/api/agents/${id}`);

const copyShareLink = () => {
  if (import.meta.client) {
    navigator.clipboard.writeText(window.location.href);
    showToast('Đã sao chép link website cá nhân! Bạn có thể gửi link này cho khách hàng.');
  }
};

useHead({
  title: agent.value ? `${agent.value.name} - ${agent.value.role} | BĐS Bến Thành` : 'Chuyên Viên Tư Vấn BĐS Bến Thành',
  meta: [
    { name: 'description', content: agent.value?.bio || 'Chuyên viên tư vấn BĐS cao cấp Bến Thành - Quận 1.' },
  ],
});
</script>
