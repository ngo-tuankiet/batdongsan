<template>
  <main class="specialized-page">
    <div class="container">
      <!-- BREADCRUMB -->
      <nav class="detail-breadcrumb" style="margin-bottom: 24px;">
        <NuxtLink to="/">Trang Chủ</NuxtLink>
        <i class="fa-solid fa-chevron-right"></i>
        <span class="active-crumb">Đội Ngũ Chuyên Viên Tư Vấn</span>
      </nav>

      <!-- PAGE HEADER -->
      <div class="team-header-section">
        <div class="section-header" style="text-align: center; margin-bottom: 32px;">
          <p class="section-subtitle">
            <i class="fa-solid fa-users-gear"></i> HỘI ĐỒNG CHUYÊN GIA THỰC CHIẾN
          </p>
          <h1 class="page-main-title" style="font-size: 2.2rem; margin-top: 8px;">
            Đội Ngũ Chuyên Viên Tư Vấn Cao Cấp
          </h1>
          <p class="section-desc" style="max-width: 800px; margin: 12px auto 0;">
            Mỗi chuyên viên tại Bến Thành Land đều sở hữu hồ sơ năng lực thực chiến, am hiểu sâu sắc quy hoạch từng tuyến đường Quận 11 và nắm giữ quỹ căn ngoại giao trực tiếp từ các Chủ Đầu Tư danh tiếng.
          </p>
        </div>

        <!-- BỘ LỌC VAI TRÒ / PHÒNG BAN -->
        <div class="team-filter-tabs">
          <button 
            class="team-tab-btn" 
            :class="{ active: selectedTag === 'all' }"
            @click="selectedTag = 'all'"
          >
            Tất Cả Thành Viên ({{ agents.length }})
          </button>
          <button 
            v-for="tag in distinctTags" 
            :key="tag"
            class="team-tab-btn" 
            :class="{ active: selectedTag === tag }"
            @click="selectedTag = tag"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- DANH SÁCH LƯỚI CHUYÊN VIÊN -->
      <div v-if="filteredAgents.length > 0" class="team-grid-container">
        <div 
          v-for="agent in filteredAgents" 
          :key="agent.id"
          class="team-member-card"
        >
          <!-- AVATAR & BADGE -->
          <div class="member-avatar-wrapper">
            <img :src="agent.avatar" :alt="agent.name" class="member-img" />
            <span class="member-tag-badge">
              <i class="fa-solid fa-crown" style="margin-right: 4px;"></i> {{ agent.tag || 'Chuyên Viên' }}
            </span>
          </div>

          <!-- MEMBER INFO -->
          <div class="member-info-content">
            <h3 class="member-name">{{ agent.name }}</h3>
            <p class="member-role">{{ agent.role }}</p>

            <!-- STATS PILLS -->
            <div class="member-stats-row">
              <div class="stat-item">
                <i class="fa-solid fa-business-time"></i>
                <span>{{ agent.exp }} Kinh nghiệm</span>
              </div>
              <div class="stat-item">
                <i class="fa-solid fa-handshake-simple"></i>
                <span>{{ agent.deals }} Thành công</span>
              </div>
            </div>

            <!-- SLOGAN / BIO -->
            <p class="member-slogan" v-if="agent.slogan">
              <i class="fa-solid fa-quote-left" style="color: var(--gold-primary); opacity: 0.7; font-size: 0.8rem; margin-right: 4px;"></i>
              {{ agent.slogan }}
            </p>
            <p class="member-bio" v-if="agent.bio">
              {{ agent.bio }}
            </p>

            <!-- CONTACT ACTIONS -->
            <div class="member-actions">
              <a :href="`tel:${agent.phone || '0912131329'}`" class="btn btn-gold member-btn">
                <i class="fa-solid fa-phone"></i> Gọi: {{ agent.phoneDisplay || agent.phone || '0912.131.329' }}
              </a>
              <a 
                :href="`https://zalo.me/${agent.zalo || agent.phone || '0912131329'}`" 
                target="_blank" 
                class="btn btn-outline-gold member-btn"
              >
                <i class="fa-solid fa-comment-dots"></i> Chat Zalo
              </a>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state-box" style="text-align: center; padding: 60px 20px;">
        <i class="fa-solid fa-user-slash" style="font-size: 3rem; color: var(--gold-primary); margin-bottom: 12px; display: block;"></i>
        <h4>Không có chuyên viên trong danh mục này</h4>
        <button class="btn btn-gold" style="margin-top: 15px;" @click="selectedTag = 'all'">Xem Tất Cả</button>
      </div>

      <!-- KHUNG LIÊN HỆ ĐẶT LỊCH TƯ VẤN NHANH -->
      <div class="team-consultation-banner">
        <div class="consultation-box">
          <div class="consultation-text">
            <h3 style="font-size: 1.5rem; margin-bottom: 8px; color: var(--text-main);">
              Bạn Muốn Kết Nối Trực Tiếp Với Ban Quản Trị Sàn?
            </h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin: 0;">
              Hotline 24/7 của chúng tôi sẵn sàng giải đáp mọi thắc mắc về thẩm định pháp lý và định giá nhà đất Quận 11.
            </p>
          </div>
          <div class="consultation-btn-group">
            <a href="tel:0912131329" class="btn btn-gold" style="padding: 14px 28px; font-size: 1rem;">
              <i class="fa-solid fa-phone-volume"></i> HOTLINE: 0912.131.329
            </a>
            <NuxtLink to="/ky-gui" class="btn btn-outline-gold" style="padding: 14px 28px; font-size: 1rem;">
              <i class="fa-solid fa-file-signature"></i> Gửi Hồ Sơ Ký Gửi
            </NuxtLink>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

useHead({
  title: 'Đội Ngũ Chuyên Viên Tư Vấn BĐS Cao Cấp | Bến Thành Land',
  meta: [
    { name: 'description', content: 'Đội ngũ chuyên gia và môi giới thực chiến Bến Thành Land chuyên tư vấn nhà phố Quận 11, biệt thự và đại dự án Vinhomes Cần Giờ, Hóc Môn. Hotline: 0912.131.329.' },
    { property: 'og:title', content: 'Đội Ngũ Chuyên Viên Tư Vấn BĐS Cao Cấp | Bến Thành Land' },
    { property: 'og:description', content: 'Hội đồng chuyên gia thực chiến am hiểu pháp lý và quy hoạch bất động sản trung tâm.' },
  ]
});

const { data: agentsData } = await useFetch('/api/agents');
const agents = computed(() => agentsData.value || []);

const selectedTag = ref('all');

const distinctTags = computed(() => {
  const set = new Set<string>();
  agents.value.forEach((a: any) => {
    if (a.tag && a.tag.trim()) {
      set.add(a.tag.trim());
    }
  });
  return Array.from(set);
});

const filteredAgents = computed(() => {
  if (selectedTag.value === 'all') return agents.value;
  return agents.value.filter((a: any) => a.tag === selectedTag.value);
});
</script>

<style scoped>
.specialized-page {
  padding: 40px 0 80px;
}

.team-header-section {
  margin-bottom: 40px;
}

.team-filter-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 24px;
}

.team-tab-btn {
  padding: 10px 22px;
  border-radius: var(--radius-full, 9999px);
  border: 1px solid var(--border-gold, #c5a059);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-main, #f8fafc);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.team-tab-btn:hover {
  background: rgba(197, 160, 89, 0.15);
  border-color: var(--gold-primary);
  transform: translateY(-2px);
}

.team-tab-btn.active {
  background: var(--gold-primary, #c5a059);
  color: #0b1120;
  font-weight: 700;
  box-shadow: 0 4px 14px rgba(197, 160, 89, 0.35);
}

.team-grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px;
  margin-bottom: 60px;
}

.team-member-card {
  background: var(--bg-card, #111827);
  border: 1px solid var(--border-gold, rgba(197, 160, 89, 0.3));
  border-radius: var(--radius-lg, 12px);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.team-member-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4);
  border-color: var(--gold-primary);
}

.member-avatar-wrapper {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: #000;
}

.member-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: transform 0.4s ease;
}

.team-member-card:hover .member-img {
  transform: scale(1.04);
}

.member-tag-badge {
  position: absolute;
  bottom: 14px;
  left: 14px;
  background: rgba(11, 17, 32, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid var(--gold-primary);
  color: var(--gold-primary);
  padding: 5px 14px;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
}

.member-info-content {
  padding: 24px 22px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.member-name {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 4px;
}

.member-role {
  font-size: 0.88rem;
  color: var(--gold-primary);
  font-weight: 600;
  margin-bottom: 16px;
  min-height: 22px;
}

.member-stats-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding: 10px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 14px;
}

.stat-item {
  font-size: 0.82rem;
  color: var(--text-sub, #94a3b8);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.stat-item i {
  color: var(--gold-primary);
}

.member-slogan {
  font-size: 0.85rem;
  font-style: italic;
  color: var(--text-main);
  line-height: 1.4;
  margin-bottom: 10px;
  font-weight: 500;
}

.member-bio {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 20px;
  flex: 1;
}

.member-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
}

.member-btn {
  width: 100%;
  padding: 10px 16px;
  font-size: 0.88rem;
  font-weight: 600;
  text-align: center;
  border-radius: var(--radius-md, 8px);
}

.team-consultation-banner {
  background: linear-gradient(135deg, rgba(197, 160, 89, 0.12), rgba(11, 17, 32, 0.95));
  border: 1px solid var(--border-gold);
  border-radius: var(--radius-lg, 12px);
  padding: 36px 32px;
}

.consultation-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.consultation-btn-group {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .consultation-box {
    flex-direction: column;
    text-align: center;
  }
  .consultation-btn-group {
    width: 100%;
    justify-content: center;
  }
}
</style>
