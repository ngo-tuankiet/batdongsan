<template>
  <div class="left-flyer-wrapper">
    <!-- BANNER VÈ BÊN TRÁI ĐANG MỞ (CHỈ HIỆN KHI ĐÃ CUỘN XUỐNG NẾU CÓ scrollThreshold) -->
    <transition name="flyer-fade">
      <aside 
        v-if="isOpen && isScrolledPast" 
        class="vertical-left-flyer" 
        role="complementary" 
        :aria-label="currentSlide.title"
        @mouseenter="pauseRotation"
        @mouseleave="resumeRotation"
      >
        <!-- THANH TIÊU ĐỀ & NÚT TẮT NỔI BẬT -->
        <div class="flyer-top-bar">
          <span class="flyer-badge-title">
            <i :class="['fa-solid', currentSlide.badgeIcon || 'fa-crown']"></i> {{ currentSlide.title }}
          </span>
          <button 
            type="button"
            class="flyer-close-btn" 
            @click.stop="closeBanner" 
            title="Đóng banner quảng cáo"
            aria-label="Đóng banner"
          >
            <span class="close-label">TẮT</span>
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- THẺ HÌNH ẢNH BANNER POSTER CÓ HIỆU ỨNG CHUYỂN SLIDE 2.5S -->
        <div class="flyer-card" @click="handleFlyerClick" title="Bấm xem chi tiết">
          <div class="flyer-image-stage">
            <transition name="flyer-slide-crossfade" mode="out-in">
              <img 
                :key="currentSlideIndex"
                :src="currentSlide.imageSrc" 
                :alt="currentSlide.title" 
                class="flyer-img"
                loading="eager"
                fetchpriority="high"
              />
            </transition>

            <!-- Quick Prev/Next Arrow on hover if multi-slides -->
            <button 
              v-if="activeSlides.length > 1" 
              type="button" 
              class="flyer-nav-arrow prev" 
              @click.stop="prevSlide" 
              title="Slide trước"
            >
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button 
              v-if="activeSlides.length > 1" 
              type="button" 
              class="flyer-nav-arrow next" 
              @click.stop="nextSlide" 
              title="Slide sau"
            >
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <div class="flyer-bottom-action">
            <span class="flyer-btn-text">
              {{ currentSlide.btnText || 'Xem Chi Tiết' }} <i class="fa-solid fa-circle-arrow-right"></i>
            </span>

            <!-- Slide Dots Indicator if multi-slide -->
            <div v-if="activeSlides.length > 1" class="flyer-dots-bar">
              <span 
                v-for="(_, idx) in activeSlides" 
                :key="idx"
                class="flyer-dot-pill"
                :class="{ active: idx === currentSlideIndex }"
                @click.stop="currentSlideIndex = idx"
              ></span>
            </div>
          </div>
        </div>
      </aside>
    </transition>

    <!-- NÚT TAB MỞ LẠI KHI NGƯỜI DÙNG ĐÃ TẮT BANNER -->
    <transition name="tab-slide-left">
      <button 
        v-if="!isOpen && isScrolledPast" 
        type="button"
        class="flyer-reopen-tab" 
        @click="isOpen = true" 
        :title="'Mở lại ' + currentSlide.title"
        aria-label="Mở lại banner"
      >
        <span class="tab-pulse-ring"></span>
        <i class="fa-solid fa-bullhorn"></i>
        <span class="tab-label">{{ reopenLabel }}</span>
      </button>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

export interface FlyerSlide {
  title: string;
  imageSrc: string;
  badgeIcon?: string;
  btnText?: string;
  targetId?: string;
  link?: string;
}

const router = useRouter();

const props = withDefaults(defineProps<{
  title?: string;
  imageSrc?: string;
  badgeIcon?: string;
  btnText?: string;
  reopenLabel?: string;
  targetId?: string;
  link?: string;
  slides?: FlyerSlide[];
  intervalMs?: number;
  scrollThreshold?: number;
}>(), {
  title: 'NHÀ PHỐ TIÊU BIỂU',
  imageSrc: '/images/banner-poster-nhapho.jpg',
  badgeIcon: 'fa-crown',
  btnText: 'Xem Quỹ Căn',
  reopenLabel: 'Banner Hot',
  targetId: 'properties-list',
  intervalMs: 2500, // 2.5 seconds per slide
  scrollThreshold: 0,
});

const isOpen = ref(true);
const isScrolledPast = ref(props.scrollThreshold === 0);
const currentSlideIndex = ref(0);
let rotationTimer: any = null;

const handleScroll = () => {
  if (props.scrollThreshold > 0 && import.meta.client) {
    isScrolledPast.value = window.scrollY >= props.scrollThreshold;
  }
};

const activeSlides = computed<FlyerSlide[]>(() => {
  if (props.slides && props.slides.length > 0) {
    return props.slides;
  }
  return [{
    title: props.title,
    imageSrc: props.imageSrc,
    badgeIcon: props.badgeIcon,
    btnText: props.btnText,
    targetId: props.targetId,
    link: props.link
  }];
});

const currentSlide = computed(() => {
  return activeSlides.value[currentSlideIndex.value] || activeSlides.value[0];
});

const startRotation = () => {
  if (import.meta.client && activeSlides.value.length > 1) {
    if (rotationTimer) clearInterval(rotationTimer);
    rotationTimer = setInterval(() => {
      currentSlideIndex.value = (currentSlideIndex.value + 1) % activeSlides.value.length;
    }, props.intervalMs);
  }
};

const pauseRotation = () => {
  if (rotationTimer) {
    clearInterval(rotationTimer);
    rotationTimer = null;
  }
};

const resumeRotation = () => {
  startRotation();
};

const prevSlide = () => {
  currentSlideIndex.value = (currentSlideIndex.value - 1 + activeSlides.value.length) % activeSlides.value.length;
};

const nextSlide = () => {
  currentSlideIndex.value = (currentSlideIndex.value + 1) % activeSlides.value.length;
};

const closeBanner = () => {
  isOpen.value = false;
  pauseRotation();
};

const handleFlyerClick = () => {
  const slide = currentSlide.value;
  if (slide.link) {
    router.push(slide.link);
    return;
  }
  if (slide.targetId) {
    const el = document.getElementById(slide.targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
  }
  window.scrollTo({ top: 350, behavior: 'smooth' });
};

onMounted(() => {
  startRotation();
  if (props.scrollThreshold > 0 && import.meta.client) {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
});

onUnmounted(() => {
  pauseRotation();
  if (import.meta.client) {
    window.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style scoped>
.left-flyer-wrapper {
  position: relative;
  z-index: 99998;
}

/* KHUNG BANNER VÈ CỐ ĐỊNH BÊN MÉP TRÁI */
.vertical-left-flyer {
  position: fixed;
  left: 16px;
  top: 80px;
  width: 215px;
  z-index: 99998;
  border-radius: 12px;
  box-shadow: 0 16px 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(212, 175, 55, 0.35);
  border: 2px solid var(--gold-primary, #dfb76c);
  background: #070e1b;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  animation: flyerSlideInLeft 0.4s ease-out;
}

@keyframes flyerSlideInLeft {
  from {
    transform: translateX(-120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.vertical-left-flyer:hover {
  transform: translateY(-3px) scale(1.015);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), 0 0 32px rgba(212, 175, 55, 0.5);
}

/* THANH TIÊU ĐỀ TRÊN CÙNG CỦA BANNER */
.flyer-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #0a1428 0%, #152238 100%);
  padding: 7px 10px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.4);
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

/* NÚT TẮT BANNER (X) */
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

/* THẺ BANNER NỘI DUNG */
.flyer-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  background: #070e1b;
}

.flyer-image-stage {
  position: relative;
  width: 100%;
  height: 520px;
  overflow: hidden;
  background: #000;
}

.flyer-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
}

/* Nav arrows on flyer hover */
.flyer-nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid var(--border-gold);
  color: var(--gold-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
  opacity: 0;
  transition: opacity 0.2s ease, background 0.2s ease;
  z-index: 5;
}

.flyer-card:hover .flyer-nav-arrow {
  opacity: 1;
}

.flyer-nav-arrow:hover {
  background: var(--gold-primary);
  color: #070e1b;
}

.flyer-nav-arrow.prev {
  left: 6px;
}

.flyer-nav-arrow.next {
  right: 6px;
}

.flyer-bottom-action {
  background: linear-gradient(180deg, #0a1428 0%, #050b16 100%);
  border-top: 1px solid rgba(212, 175, 55, 0.4);
  padding: 8px 10px;
  text-align: center;
}

.flyer-btn-text {
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--gold-primary, #dfb76c);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.3px;
}

.flyer-dots-bar {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 6px;
}

.flyer-dot-pill {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  transition: all 0.25s ease;
  cursor: pointer;
}

.flyer-dot-pill.active {
  width: 16px;
  border-radius: 4px;
  background: var(--gold-primary);
}

/* NÚT TAB MỞ LẠI KHI ĐÃ TẮT BANNER */
.flyer-reopen-tab {
  position: fixed;
  left: 0;
  top: 180px;
  z-index: 99998;
  background: linear-gradient(135deg, #d4af37 0%, #aa771c 100%);
  color: #070e1b;
  border: none;
  padding: 9px 14px 9px 10px;
  border-radius: 0 10px 10px 0;
  font-weight: 800;
  font-size: 0.78rem;
  box-shadow: 0 4px 18px rgba(212, 175, 55, 0.45);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.flyer-reopen-tab:hover {
  padding-left: 14px;
  padding-right: 18px;
  background: linear-gradient(135deg, #fde68a 0%, #d4af37 100%);
}

.tab-pulse-ring {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.35);
  animation: pulseDot 1.5s infinite;
}

@keyframes pulseDot {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

/* HIỆU ỨNG CHUYỂN CẢNH */
.flyer-fade-enter-active,
.flyer-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.flyer-fade-enter-from,
.flyer-fade-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.flyer-slide-crossfade-enter-active,
.flyer-slide-crossfade-leave-active {
  transition: opacity 0.45s ease;
}

.flyer-slide-crossfade-enter-from,
.flyer-slide-crossfade-leave-to {
  opacity: 0;
}

.tab-slide-left-enter-active,
.tab-slide-left-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.tab-slide-left-enter-from,
.tab-slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* RESPONSIVE: Ẩn trên màn hình hẹp để không che chữ */
@media (max-width: 1200px) {
  .vertical-left-flyer {
    width: 160px;
    top: 90px;
    left: 8px;
  }
  .flyer-image-stage {
    height: 380px;
  }
}

@media (max-width: 992px) {
  .vertical-left-flyer,
  .flyer-reopen-tab {
    display: none !important;
  }
}
</style>
