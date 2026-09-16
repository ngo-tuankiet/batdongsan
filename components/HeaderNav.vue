<template>
  <header class="site-header">
    <div class="container header-container">
      <NuxtLink to="/" class="brand-logo" @click="handleLogoClick" title="Bến Thành Land - Lên đầu trang">
        <div class="logo-img-wrapper">
          <img src="/images/logo-ben-thanh.png" alt="Bến Thành Land" class="header-brand-img" />
        </div>
        <div class="logo-words">
          <h1>BẾN THÀNH <span class="gold-text">LAND</span></h1>
        </div>
      </NuxtLink>

      <ul class="main-nav">
        <li><NuxtLink to="/" class="nav-link">Trang Chủ</NuxtLink></li>
        <li><NuxtLink to="/nha-pho" class="nav-link">Nhà Phố</NuxtLink></li>
        <li><NuxtLink to="/du-an" class="nav-link">Dự Án</NuxtLink></li>
        <li><NuxtLink to="/tin-tuc" class="nav-link">Tin Tức</NuxtLink></li>
        <li><a href="/#team" class="nav-link">Đội Ngũ Chuyên Viên</a></li>
        <li><a href="/#consignment" class="nav-link">Ký Gửi Nhà Đất</a></li>
        <li><a href="/#about" class="nav-link">Về Chúng Tôi</a></li>
      </ul>

      <div class="header-actions">
        <!-- Nút Đổi Theme Sáng / Tối -->
        <button class="theme-toggle-btn" @click="toggleTheme" :title="theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'">
          <i :class="theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
        </button>

        <!-- Nút Quản Trị Admin -->
        <NuxtLink to="/admin" class="btn btn-admin" title="Bảng quản trị">
          <i class="fa-solid fa-user-shield"></i> <span class="header-admin-text">Quản Trị</span>
        </NuxtLink>

        <!-- Hotline Sàn -->
        <a href="tel:0912131329" class="btn btn-gold header-hotline-btn" style="padding: 9px 18px; font-size: 0.85rem;">
          <i class="fa-solid fa-phone"></i> 0912.131.329
        </a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { theme, toggleTheme, initTheme } = useTheme();

const handleLogoClick = (e: MouseEvent) => {
  if (route.path === '/') {
    e.preventDefault();
    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else {
    router.push('/');
    if (import.meta.client) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }
};

onMounted(() => {
  initTheme();
});
</script>
