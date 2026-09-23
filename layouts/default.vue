<template>
  <div>
    <HeaderNav />
    
    <slot />

    <footer class="site-footer">
      <div class="container">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 35px; margin-bottom: 40px;">
          <div>
            <h3 style="font-size: 1.3rem; margin-bottom: 12px; color: var(--text-main);">
              BẾN THÀNH <span class="gold-text">LAND</span>
            </h3>
            <p style="font-size: 0.88rem; line-height: 1.6;">
              Giải pháp bất động sản mua bán ký gửi Quận 11 và các dự án cao cấp. Nơi hội tụ đội ngũ hỗ trợ tư vấn giàu kinh nghiệm, nắm giữ quỹ căn độc quyền giá gốc.
            </p>
          </div>

          <div>
            <h4 style="color: var(--gold-primary); margin-bottom: 12px; font-size: 1rem;">DANH MỤC TRỌNG TÂM</h4>
            <p style="margin-bottom: 6px;"><NuxtLink to="/nha-pho">Nhà phố quận 11</NuxtLink></p>
            <p style="margin-bottom: 6px;"><NuxtLink to="/du-an">Dự án Vinhome Hóc Môn</NuxtLink></p>
            <p style="margin-bottom: 6px;"><NuxtLink to="/du-an">Dự án Vinhome Cần Giờ</NuxtLink></p>
          </div>

          <div>
            <h4 style="color: var(--gold-primary); margin-bottom: 12px; font-size: 1rem;">THÔNG TIN LIÊN HỆ</h4>
            <p style="margin-bottom: 6px;"><i class="fa-solid fa-location-dot" style="color: var(--gold-primary);"></i> 6 Đường Số 5A, Phường Bình Thới, TP. Hồ Chí Minh</p>
            <p style="margin-bottom: 6px;"><i class="fa-solid fa-phone" style="color: var(--gold-primary);"></i> Hotline: <a href="tel:0901355446" style="color: inherit; font-weight: 700;">0901.355.446</a></p>
            <p style="margin-bottom: 6px;"><i class="fa-solid fa-envelope" style="color: var(--gold-primary);"></i> contact@benthanhland.vn</p>
          </div>
        </div>

        <div style="text-align: center; border-top: 1px solid var(--border-color); padding-top: 20px; font-size: 0.8rem;">
          © 2026 Bản quyền thuộc về Bến Thành Land. Toàn bộ quyền được bảo lưu.
        </div>
      </div>
    </footer>

    <FloatingContact />

    <!-- SMART HOVER BADGE (TƯƠNG TÁC THÔNG MINH KHI RÊ VÀO THẺ) -->
    <div 
      class="cursor-hover-badge" 
      :class="{ visible: badgeVisible }"
      :style="{ transform: `translate3d(${badgeX}px, ${badgeY}px, 0) translate(18px, 18px) scale(${badgeVisible ? 1 : 0})` }"
    >
      <span>{{ badgeText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import HeaderNav from '~/components/HeaderNav.vue';
import FloatingContact from '~/components/FloatingContact.vue';

// Tọa độ thẻ nhãn thông minh bay theo chuột
const badgeX = ref(-300);
const badgeY = ref(-300);
const badgeVisible = ref(false);
const badgeText = ref('✦ Xem Chi Tiết');

let cardObserver: IntersectionObserver | null = null;
let mutationObserver: MutationObserver | null = null;

const setupCardObserver = () => {
  if (!import.meta.client || typeof IntersectionObserver === 'undefined') return;
  if (cardObserver) cardObserver.disconnect();
  
  cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  const cards = document.querySelectorAll('.prop-card, .home-art-card, .team-card, .agent-card, .home-article-card, .article-grid-card, .team-member-card');
  cards.forEach(c => cardObserver?.observe(c));
};

const handleMouseMove = (e: MouseEvent) => {
  badgeX.value = e.clientX;
  badgeY.value = e.clientY;

  // 3D Card Tilt & Specular Glare Tracking (BĐS, Tin Tức, Nhân Viên)
  const card = (e.target as HTMLElement)?.closest('.prop-card, .home-art-card, .team-card, .agent-card, .home-article-card, .article-grid-card, .team-member-card') as HTMLElement | null;
  if (card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-14px) scale(1.08)`;

    const glare = card.querySelector('.card-glare') as HTMLElement | null;
    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.setProperty('--glare-x', `${glareX.toFixed(1)}%`);
      glare.style.setProperty('--glare-y', `${glareY.toFixed(1)}%`);
    }
  }
};

const handleMouseOut = (e: MouseEvent) => {
  const card = (e.target as HTMLElement)?.closest('.prop-card, .home-art-card, .team-card, .agent-card, .home-article-card, .article-grid-card, .team-member-card') as HTMLElement | null;
  if (card && (!e.relatedTarget || !card.contains(e.relatedTarget as Node))) {
    card.style.transform = '';
  }
};

const handleMouseOver = (e: MouseEvent) => {
  const target = (e.target as HTMLElement)?.closest('.prop-card, .home-art-card, .team-card, .agent-card, .team-member-card, .article-grid-card, [data-hover-badge]') as HTMLElement | null;
  if (target) {
    if (target.classList.contains('prop-card')) {
      badgeText.value = '✦ Xem Nhà';
    } else if (target.classList.contains('home-art-card') || target.classList.contains('article-grid-card') || target.classList.contains('home-article-card')) {
      badgeText.value = '✦ Đọc Bài';
    } else if (target.classList.contains('team-card') || target.classList.contains('agent-card') || target.classList.contains('team-member-card')) {
      badgeText.value = '✦ Tư Vấn';
    } else if (target.dataset.hoverBadge) {
      badgeText.value = target.dataset.hoverBadge;
    }
    badgeVisible.value = true;
  } else {
    badgeVisible.value = false;
  }
};

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  document.addEventListener('mouseover', handleMouseOver, { passive: true });
  document.addEventListener('mouseout', handleMouseOut, { passive: true });

  setupCardObserver();

  // Tự động gắn observer khi data load xong
  if (typeof MutationObserver !== 'undefined') {
    mutationObserver = new MutationObserver(() => {
      setupCardObserver();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
  }
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseover', handleMouseOver);
  document.removeEventListener('mouseout', handleMouseOut);
  if (cardObserver) cardObserver.disconnect();
  if (mutationObserver) mutationObserver.disconnect();
});
</script>
