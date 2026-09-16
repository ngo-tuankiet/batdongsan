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
              Hệ thống phân phối bất động sản trung tâm Quận 1 cao cấp. Nơi hội tụ các chuyên gia tư vấn giàu kinh nghiệm, nắm giữ quỹ căn độc quyền giá gốc.
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
            <p style="margin-bottom: 6px;"><i class="fa-solid fa-phone" style="color: var(--gold-primary);"></i> Hotline: <a href="tel:0912131329" style="color: inherit; font-weight: 700;">0912.131.329</a></p>
            <p style="margin-bottom: 6px;"><i class="fa-solid fa-envelope" style="color: var(--gold-primary);"></i> contact@benthanhland.vn</p>
          </div>
        </div>

        <div style="text-align: center; border-top: 1px solid var(--border-color); padding-top: 20px; font-size: 0.8rem;">
          © 2026 Bản quyền thuộc về Bến Thành Land. Toàn bộ quyền được bảo lưu.
        </div>
      </div>
    </footer>

    <FloatingContact />
  </div>
</template>

<script setup lang="ts">
import HeaderNav from '~/components/HeaderNav.vue';
import FloatingContact from '~/components/FloatingContact.vue';
</script>
