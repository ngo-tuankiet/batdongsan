<template>
  <header class="site-header">
    <div class="container header-container">
      <NuxtLink to="/" class="brand-logo">
        <div class="logo-icon">BT</div>
        <div class="logo-words">
          <h1>BẤT ĐỘNG SẢN <span class="gold-text">BẾN THÀNH</span></h1>
        </div>
      </NuxtLink>

      <ul class="main-nav">
        <li><NuxtLink to="/" class="nav-link">Trang Chủ</NuxtLink></li>
        <li><a href="/#properties" class="nav-link">Quỹ Căn Tổng Hợp</a></li>
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
        <a href="tel:0938888999" class="btn btn-gold header-hotline-btn" style="padding: 9px 18px; font-size: 0.85rem;">
          <i class="fa-solid fa-phone"></i> 0938.888.999
        </a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { theme, toggleTheme, initTheme } = useTheme();

onMounted(() => {
  initTheme();
});
</script>
