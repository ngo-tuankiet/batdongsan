<template>
  <main class="specialized-page">
    <div class="container">
      <!-- BREADCRUMB -->
      <nav class="detail-breadcrumb" style="margin-bottom: 24px;">
        <NuxtLink to="/">Trang Chủ</NuxtLink>
        <i class="fa-solid fa-chevron-right"></i>
        <span class="active-crumb">Về Chúng Tôi</span>
      </nav>

      <!-- HERO INTRO -->
      <div class="about-hero-card">
        <div class="about-hero-content">
          <p class="section-subtitle">
            <i class="fa-solid fa-landmark"></i> BẾN THÀNH LAND - NƠI TRAO GỬI NIỀM TIN
          </p>
          <h1 class="page-main-title" style="font-size: 2.3rem; margin-top: 10px; line-height: 1.3;">
            Hệ Thống Phân Phối BĐS Cao Cấp &amp; Nhà Phố Trung Tâm Sài Gòn
          </h1>
          <p class="about-lead-text">
            Thành lập từ năm 2012, <strong>Bến Thành Land</strong> tự hào là một trong những sàn giao dịch bất động sản uy tín hàng đầu, tiên phong trong việc cung cấp các sản phẩm nhà phố mặt tiền Quận 11 và phân phối đại lý F1 các đại đô thị Vinhomes Cần Giờ, Vinhomes Hóc Môn.
          </p>
          <div class="about-hero-stats">
            <div class="stat-box">
              <span class="stat-num">12+</span>
              <span class="stat-label">Năm Kinh Nghiệm</span>
            </div>
            <div class="stat-box">
              <span class="stat-num">1.500+</span>
              <span class="stat-label">Giao Dịch Thành Công</span>
            </div>
            <div class="stat-box">
              <span class="stat-num">850+ Tỷ</span>
              <span class="stat-label">Tổng Giá Trị Giao Dịch</span>
            </div>
            <div class="stat-box">
              <span class="stat-num">100%</span>
              <span class="stat-label">Pháp Lý Thẩm Định</span>
            </div>
          </div>
        </div>
      </div>

      <!-- CORE VALUES -->
      <div class="values-section">
        <div class="section-header" style="text-align: center; margin-bottom: 36px;">
          <p class="section-subtitle">TRIẾT LÝ KINH DOANH</p>
          <h2 class="section-title">3 Giá Trị Cốt Lõi Tạo Nên Thương Hiệu</h2>
          <p class="section-desc">Chúng tôi đặt lợi ích và sự an toàn tài chính của khách hàng lên vị trí cao nhất trong mọi giao dịch.</p>
        </div>

        <div class="values-grid">
          <div class="value-card">
            <div class="value-icon"><i class="fa-solid fa-gem"></i></div>
            <h3>Minh Bạch</h3>
            <p>Mọi thông tin về quy hoạch lộ giới, pháp lý hoàn công, hiện trạng và giá bán từ chủ nhà luôn được công khai, rõ ràng, không kê giá hay mập mờ.</p>
          </div>

          <div class="value-card">
            <div class="value-icon"><i class="fa-solid fa-user-lock"></i></div>
            <h3>Bảo Mật</h3>
            <p>Tuyệt đối bảo mật danh tính, tài sản và các giao dịch ngoại giao của khách hàng VIP, gia đình chủ nhà và nhà đầu tư cá nhân.</p>
          </div>

          <div class="value-card">
            <div class="value-icon"><i class="fa-solid fa-chart-line"></i></div>
            <h3>Hiệu Quả</h3>
            <p>Tối ưu hóa thời gian và dòng tiền, tư vấn chiến lược đầu tư mang lại tỷ suất sinh lời vượt trội và thanh khoản nhanh chóng nhất.</p>
          </div>
        </div>
      </div>

      <!-- SPECIALIZATION PILLARS -->
      <div class="specialization-section">
        <div class="section-header" style="text-align: center; margin-bottom: 36px;">
          <p class="section-subtitle">LĨNH VỰC HOẠT ĐỘNG CHÍNH</p>
          <h2 class="section-title">Thế Mạnh Đột Phá Của Bến Thành Land</h2>
        </div>

        <div class="pillars-grid">
          <div class="pillar-card">
            <div class="pillar-img-box">
              <i class="fa-solid fa-house-chimney-window"></i>
            </div>
            <div class="pillar-info">
              <h3>Nhà Phố Mặt Tiền &amp; Hẻm Xe Hơi Quận 11</h3>
              <p>Nắm giữ quỹ căn độc quyền tại các trục đường huyết mạch như 3 Tháng 2, Lãnh Binh Thăng, Minh Phụng, Bình Thới, Lê Đại Hành. Nguồn hàng chuẩn chính chủ, pháp lý đầy đủ.</p>
              <NuxtLink to="/nha-pho" class="pillar-link">Xem giỏ hàng nhà phố <i class="fa-solid fa-arrow-right"></i></NuxtLink>
            </div>
          </div>

          <div class="pillar-card">
            <div class="pillar-img-box">
              <i class="fa-solid fa-city"></i>
            </div>
            <div class="pillar-info">
              <h3>Đại Đô Thị Biển Vinhomes Cần Giờ &amp; Hóc Môn</h3>
              <p>Phân phối quỹ căn ngoại giao giai đoạn 1 với chính sách chiết khấu tốt nhất, hỗ trợ nhà đầu tư đón đầu làn sóng hạ tầng siêu dự án nghỉ dưỡng & sinh thái.</p>
              <NuxtLink to="/du-an" class="pillar-link">Khám phá danh mục dự án <i class="fa-solid fa-arrow-right"></i></NuxtLink>
            </div>
          </div>

          <div class="pillar-card">
            <div class="pillar-img-box">
              <i class="fa-solid fa-scale-unbalanced"></i>
            </div>
            <div class="pillar-info">
              <h3>Thẩm Định Giá &amp; Hỗ Trợ Pháp Lý BĐS</h3>
              <p>Hỗ trợ kiểm tra quy hoạch lộ giới, kiểm tra tranh chấp ngăn chặn, thủ tục sang tên, đóng thuế và giải ngân tín dụng ngân hàng tốc hành.</p>
              <NuxtLink to="/ky-gui" class="pillar-link">Ký gửi thẩm định ngay <i class="fa-solid fa-arrow-right"></i></NuxtLink>
            </div>
          </div>

          <div class="pillar-card">
            <div class="pillar-img-box">
              <i class="fa-solid fa-users-viewfinder"></i>
            </div>
            <div class="pillar-info">
              <h3>Đội Ngũ 8+ Chuyên Viên Thực Chiến</h3>
              <p>Mỗi chuyên viên là một "thổ địa" am hiểu tường tận từng góc phố, luôn túc trực hỗ trợ xem nhà trực tiếp và đàm phán giá tốt nhất.</p>
              <NuxtLink to="/doi-ngu-chuyen-vien" class="pillar-link">Gặp gỡ đội ngũ chuyên viên <i class="fa-solid fa-arrow-right"></i></NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- COMPANY INFO & HQ CARD -->
      <div class="hq-card">
        <div class="hq-info">
          <p class="section-subtitle" style="color: var(--gold-primary);">TRỤ SỞ GIAO DỊCH</p>
          <h2 style="font-size: 1.8rem; margin: 8px 0 16px; color: var(--text-main);">Sàn Bất Động Sản Bến Thành Land</h2>
          <ul class="hq-list">
            <li>
              <i class="fa-solid fa-location-dot"></i>
              <div>
                <strong>Địa chỉ:</strong> 6 Đường Số 5A, Phường Bình Thới, TP. Hồ Chí Minh
              </div>
            </li>
            <li>
              <i class="fa-solid fa-phone-volume"></i>
              <div>
                <strong>Hotline tư vấn 24/7:</strong> <a href="tel:0901355446" style="color: var(--gold-primary); font-weight: 700;">0901.355.446</a>
              </div>
            </li>
            <li>
              <i class="fa-solid fa-envelope"></i>
              <div>
                <strong>Email liên hệ:</strong> contact@benthanhland.vn
              </div>
            </li>
            <li>
              <i class="fa-solid fa-clock"></i>
              <div>
                <strong>Thời gian làm việc:</strong> 08:00 - 20:00 (Tất cả các ngày trong tuần kể cả Thứ 7 &amp; Chủ Nhật)
              </div>
            </li>
          </ul>

          <div style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
            <a href="tel:0901355446" class="btn btn-gold" style="padding: 12px 24px; font-weight: 700;">
              <i class="fa-solid fa-phone"></i> Gọi Hotline Ngay
            </a>
            <a href="https://zalo.me/0901355446" target="_blank" class="btn btn-outline-gold" style="padding: 12px 24px; font-weight: 700;">
              <i class="fa-solid fa-comment-dots"></i> Kết Nối Zalo
            </a>
          </div>
        </div>

        <div class="hq-highlight-box">
          <div class="highlight-inner">
            <i class="fa-solid fa-award" style="font-size: 3rem; color: var(--gold-primary); margin-bottom: 12px;"></i>
            <h3>Cam Kết Chất Lượng Dịch Vụ</h3>
            <p>100% bất động sản được thẩm định thực tế trước khi giới thiệu đến quý khách. Không quảng cáo ảo, không làm mất thời gian của khách hàng.</p>
            <NuxtLink to="/doi-ngu-chuyen-vien" class="btn btn-gold" style="margin-top: 16px; font-size: 0.88rem; width: 100%;">
              Khám Phá Đội Ngũ Chuyên Viên
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'Về Chúng Tôi | Sàn Giao Dịch Bất Động Sản Bến Thành Land',
  meta: [
    { name: 'description', content: 'Tìm hiểu về Bến Thành Land - Hệ thống môi giới bất động sản hàng đầu Quận 11 và đại lý F1 dự án Vinhomes Cần Giờ, Vinhomes Hóc Môn. Triết lý Minh bạch - Bảo mật - Hiệu quả. Hotline: 0901.355.446.' },
    { property: 'og:title', content: 'Về Chúng Tôi | Sàn Giao Dịch Bất Động Sản Bến Thành Land' },
    { property: 'og:description', content: '12+ năm kinh nghiệm thực chiến tại Quận 11, 1.500+ giao dịch thành công. Cam kết pháp lý 100%.' },
    { property: 'og:url', content: 'https://benthanhland.com/ve-chung-toi' }
  ]
});
</script>

<style scoped>
.specialized-page {
  padding: 40px 0 80px;
  min-height: 80vh;
}

.detail-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--text-muted);
}
.detail-breadcrumb a {
  color: var(--gold-primary);
  text-decoration: none;
}
.detail-breadcrumb .active-crumb {
  color: var(--text-main);
  font-weight: 600;
}

/* About Hero Card */
.about-hero-card {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, var(--bg-card) 100%);
  border: 1px solid var(--border-gold);
  border-radius: var(--radius-lg);
  padding: 48px 36px;
  margin-bottom: 50px;
  box-shadow: var(--shadow-md);
}

.about-lead-text {
  font-size: 1.05rem;
  color: var(--text-sub);
  line-height: 1.8;
  margin-top: 16px;
  max-width: 900px;
}

.about-hero-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
  margin-top: 36px;
  padding-top: 30px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.stat-box {
  text-align: center;
  background: rgba(0, 0, 0, 0.15);
  padding: 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.stat-num {
  display: block;
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--gold-primary);
  font-family: var(--font-heading);
}

.stat-label {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-top: 4px;
  display: block;
}

/* Values */
.values-section {
  margin-bottom: 60px;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.value-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 32px 24px;
  text-align: center;
  transition: var(--transition);
}

.value-card:hover {
  transform: translateY(-4px);
  border-color: var(--gold-primary);
  box-shadow: var(--shadow-sm);
}

.value-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.12);
  color: var(--gold-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 18px;
}

.value-card h3 {
  font-size: 1.25rem;
  color: var(--text-main);
  margin-bottom: 12px;
}

.value-card p {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.65;
}

/* Pillars */
.specialization-section {
  margin-bottom: 60px;
}

.pillars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.pillar-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 28px 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: var(--transition);
}

.pillar-card:hover {
  border-color: var(--gold-primary);
  transform: translateY(-3px);
}

.pillar-img-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(212, 175, 55, 0.15);
  color: var(--gold-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  margin-bottom: 16px;
}

.pillar-info h3 {
  font-size: 1.15rem;
  color: var(--text-main);
  margin-bottom: 10px;
  line-height: 1.4;
}

.pillar-info p {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 16px;
}

.pillar-link {
  color: var(--gold-primary);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.pillar-link:hover {
  text-decoration: underline;
}

/* HQ Card */
.hq-card {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 30px;
  background: var(--bg-card);
  border: 1px solid var(--border-gold);
  border-radius: var(--radius-lg);
  padding: 40px;
  align-items: center;
}

@media (max-width: 860px) {
  .hq-card {
    grid-template-columns: 1fr;
  }
}

.hq-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.hq-list li {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.hq-list li i {
  color: var(--gold-primary);
  font-size: 1.1rem;
  margin-top: 3px;
  flex-shrink: 0;
}

.hq-highlight-box {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(0, 0, 0, 0.4) 100%);
  border: 1px dashed var(--border-gold);
  border-radius: var(--radius-md);
  padding: 30px 24px;
  text-align: center;
}

.highlight-inner h3 {
  font-size: 1.2rem;
  color: var(--text-main);
  margin-bottom: 10px;
}

.highlight-inner p {
  font-size: 0.86rem;
  color: var(--text-muted);
  line-height: 1.6;
}
</style>
