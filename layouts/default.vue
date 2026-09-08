<template>
  <div>
    <HeaderNav />
    
    <slot />

    <footer class="site-footer">
      <div class="container">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 35px; margin-bottom: 40px;">
          <div>
            <h3 style="font-size: 1.3rem; margin-bottom: 12px; color: var(--text-main);">
              BẤT ĐỘNG SẢN <span class="gold-text">BẾN THÀNH</span>
            </h3>
            <p style="font-size: 0.88rem; line-height: 1.6;">
              Hệ thống phân phối bất động sản trung tâm Quận 11 cao cấp. Nơi hội tụ các chuyên gia tư vấn giàu kinh nghiệm, nắm giữ quỹ căn độc quyền giá gốc.
            </p>
          </div>

          <div>
            <h4 style="color: var(--gold-primary); margin-bottom: 12px; font-size: 1rem;">DANH MỤC TRỌNG TÂM</h4>
            <p style="margin-bottom: 6px;"><a href="/#properties">Nhà phố mặt tiền Bến Thành</a></p>
            <p style="margin-bottom: 6px;"><a href="/#properties">Căn hộ Somerset, Grand Marina</a></p>
            <p style="margin-bottom: 6px;"><a href="/#properties">Tòa nhà văn phòng Nguyễn Trãi</a></p>
            <p style="margin-bottom: 6px;"><a href="/#properties">Khách sạn phố Tây Bùi Viện</a></p>
          </div>

          <div>
            <h4 style="color: var(--gold-primary); margin-bottom: 12px; font-size: 1rem;">THÔNG TIN LIÊN HỆ</h4>
            <p style="margin-bottom: 6px;"><i class="fa-solid fa-location-dot" style="color: var(--gold-primary);"></i> Phường Bến Thành, Quận 1, TP.HCM</p>
            <p style="margin-bottom: 6px;"><i class="fa-solid fa-phone" style="color: var(--gold-primary);"></i> Hotline: <strong>0938.888.999</strong></p>
            <p style="margin-bottom: 6px;"><i class="fa-solid fa-envelope" style="color: var(--gold-primary);"></i> contact@bdsbenthanh.vn</p>
          </div>
        </div>

        <div style="text-align: center; border-top: 1px solid var(--border-color); padding-top: 20px; font-size: 0.8rem;">
          © 2026 Bản quyền thuộc về Bất Động Sản Bến Thành. Toàn bộ quyền được bảo lưu.
        </div>
      </div>
    </footer>

    <FloatingContact />
  </div>
</template>
