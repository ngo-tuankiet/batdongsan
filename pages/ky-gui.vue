<template>
  <main class="specialized-page">
    <div class="container">
      <!-- BREADCRUMB -->
      <nav class="detail-breadcrumb" style="margin-bottom: 24px;">
        <NuxtLink to="/">Trang Chủ</NuxtLink>
        <i class="fa-solid fa-chevron-right"></i>
        <span class="active-crumb">Ký Gửi Nhà Đất</span>
      </nav>

      <!-- PAGE HEADER -->
      <div class="section-header" style="text-align: center; margin-bottom: 36px;">
        <p class="section-subtitle">
          <i class="fa-solid fa-handshake-angle"></i> DỊCH VỤ MÔI GIỚI & PHÂN PHỐI CHUYÊN NGHIỆP
        </p>
        <h1 class="page-main-title" style="font-size: 2.2rem; margin-top: 8px;">
          Ký Gửi Bất Động Sản Bến Thành Land
        </h1>
        <p class="section-desc" style="max-width: 820px; margin: 12px auto 0;">
          Chúng tôi sở hữu tệp hơn <strong>1.000+ Nhà Đầu Tư VIP</strong> sẵn sàng thanh toán nhanh trong 7 - 14 ngày cho các bất động sản giá tốt, pháp lý rõ ràng tại Quận 11 và khu vực lân cận.
        </p>
      </div>

      <!-- 4-STEP CONSIGNMENT PROCESS -->
      <div class="consignment-process-grid">
        <div class="process-card">
          <div class="process-step-num">01</div>
          <div class="process-icon"><i class="fa-solid fa-clipboard-list"></i></div>
          <h3 class="process-title">Tiếp Nhận Thông Tin</h3>
          <p class="process-desc">Tiếp nhận yêu cầu ký gửi, khảo sát hiện trạng thực tế và kiểm tra vị trí lộ giới quy hoạch trong 2 giờ làm việc.</p>
        </div>

        <div class="process-card">
          <div class="process-step-num">02</div>
          <div class="process-icon"><i class="fa-solid fa-scale-balanced"></i></div>
          <h3 class="process-title">Thẩm Định & Định Giá</h3>
          <p class="process-desc">Tư vấn mức giá bán hoặc cho thuê sát giá thị trường nhất, tối đa hóa lợi nhuận mà vẫn đảm bảo thanh khoản nhanh.</p>
        </div>

        <div class="process-card">
          <div class="process-step-num">03</div>
          <div class="process-icon"><i class="fa-solid fa-bullhorn"></i></div>
          <h3 class="process-title">Truyền Thông & Khớp Khách</h3>
          <p class="process-desc">Tiếp cận tệp khách hàng mua thực, nhà đầu tư VIP và chạy chiến dịch tiếp thị độc quyền trên toàn hệ thống.</p>
        </div>

        <div class="process-card">
          <div class="process-step-num">04</div>
          <div class="process-icon"><i class="fa-solid fa-file-signature"></i></div>
          <h3 class="process-title">Công Chứng & Hoàn Tất</h3>
          <p class="process-desc">Đồng hành pháp lý, soạn thảo hợp đồng đặt cọc, công chứng mua bán và hỗ trợ thủ tục sang tên sổ hồng trọn gói.</p>
        </div>
      </div>

      <!-- MAIN FORM SECTION -->
      <div style="margin-top: 50px;">
        <ConsignmentForm />
      </div>

      <!-- COMMITMENTS & TRUST BADGES -->
      <div class="commitments-section">
        <h2 class="commitments-title">Cam Kết Của Bến Thành Land Khi Quý Khách Ký Gửi</h2>
        <div class="commitments-grid">
          <div class="commitment-item">
            <i class="fa-solid fa-shield-halved"></i>
            <div>
              <h4>Bảo Mật Tuyệt Đối</h4>
              <p>Mọi thông tin cá nhân và số điện thoại của chủ nhà được bảo mật 100%, không bị làm phiền bởi môi giới tự do.</p>
            </div>
          </div>

          <div class="commitment-item">
            <i class="fa-solid fa-tags"></i>
            <div>
              <h4>Bán Đúng Giá Chủ Nhà Đưa Ra</h4>
              <p>Cam kết không kê chênh, không nâng giá khống làm mất uy tín và giảm tính thanh khoản của bất động sản.</p>
            </div>
          </div>

          <div class="commitment-item">
            <i class="fa-solid fa-gavel"></i>
            <div>
              <h4>Hỗ Trợ Pháp Lý Miễn Phí</h4>
              <p>Kiểm tra quy hoạch, giải tỏa, thẩm định hoàn công và hỗ trợ tính thuế TNCN, trước bạ hoàn toàn miễn phí.</p>
            </div>
          </div>

          <div class="commitment-item">
            <i class="fa-solid fa-bolt-lightning"></i>
            <div>
              <h4>Tốc Độ Thanh Khoản Vượt Trội</h4>
              <p>Mạng lưới liên kết 50+ sàn liên kết và 8 chuyên viên thực chiến túc trực tại địa bàn 24/7.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ SECTION -->
      <div class="faq-section">
        <h2 class="faq-title">Câu Hỏi Thường Gặp Khi Ký Gửi Nhà Đất</h2>
        <div class="faq-grid">
          <div class="faq-item">
            <h4><i class="fa-regular fa-circle-question" style="color: var(--gold-primary);"></i> Ký gửi tại Bến Thành Land có mất phí ban đầu không?</h4>
            <p>Hoàn toàn KHÔNG. Chúng tôi chỉ nhận phí hoa hồng môi giới theo thỏa thuận khi giao dịch mua bán hoặc thuê thành công tại phòng công chứng.</p>
          </div>
          <div class="faq-item">
            <h4><i class="fa-regular fa-circle-question" style="color: var(--gold-primary);"></i> Thời gian bán được nhà thường mất bao lâu?</h4>
            <p>Đối với các bất động sản định giá đúng thị trường và pháp lý sạch, thời gian chốt cọc trung bình từ 7 đến 30 ngày.</p>
          </div>
          <div class="faq-item">
            <h4><i class="fa-regular fa-circle-question" style="color: var(--gold-primary);"></i> Tôi ở xa hoặc ở nước ngoài có ký gửi được không?</h4>
            <p>Có. Quý khách chỉ cần gửi hình ảnh sổ hồng và thông tin qua Zalo/Hotline, chuyên viên sẽ đại diện khảo sát và báo cáo trực tiếp định kỳ.</p>
          </div>
          <div class="faq-item">
            <h4><i class="fa-regular fa-circle-question" style="color: var(--gold-primary);"></i> Có hỗ trợ thủ tục vay ngân hàng cho người mua không?</h4>
            <p>Chúng tôi có đối tác ngân hàng chiến lược (Vietcombank, MBBank, TPBank...) hỗ trợ thẩm định và giải ngân nhanh cho bên mua.</p>
          </div>
        </div>
      </div>

      <!-- DIRECT CONTACT BAR -->
      <div class="direct-contact-cta">
        <div class="cta-inner">
          <h3>Quý Khách Cần Tư Vấn Ký Gửi Trực Tiếp?</h3>
          <p>Đội ngũ chuyên gia pháp lý và định giá sẵn sàng hỗ trợ quý vị 24/7 qua Hotline hoặc Zalo.</p>
          <div class="cta-btns">
            <a href="tel:0912131329" class="btn btn-gold" style="padding: 13px 28px; font-weight: 700;">
              <i class="fa-solid fa-phone"></i> Hotline: 0912.131.329
            </a>
            <a href="https://zalo.me/0912131329" target="_blank" class="btn btn-outline-gold" style="padding: 13px 28px; font-weight: 700;">
              <i class="fa-solid fa-comment-dots"></i> Chat Zalo Ngay
            </a>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'Ký Gửi Mua Bán Nhà Đất Nhanh Chóng | Bến Thành Land',
  meta: [
    { name: 'description', content: 'Dịch vụ ký gửi nhà phố mặt tiền Quận 11, căn hộ và dự án cao cấp. Thẩm định giá nhanh, bảo mật thông tin, kết nối hơn 1.000+ nhà đầu tư sẵn tài chính. Hotline: 0912.131.329.' },
    { property: 'og:title', content: 'Ký Gửi Mua Bán Nhà Đất Nhanh Chóng | Bến Thành Land' },
    { property: 'og:description', content: 'Thẩm định giá chuẩn xác, bảo mật 100%, thanh khoản nhanh chóng cùng Bến Thành Land.' },
    { property: 'og:url', content: 'https://benthanhland.com/ky-gui' }
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

/* 4-Step Process */
.consignment-process-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.process-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 28px 22px;
  position: relative;
  transition: var(--transition);
}

.process-card:hover {
  transform: translateY(-4px);
  border-color: var(--gold-primary);
  box-shadow: var(--shadow-sm);
}

.process-step-num {
  position: absolute;
  top: 16px;
  right: 18px;
  font-size: 1.6rem;
  font-weight: 800;
  color: rgba(212, 175, 55, 0.2);
  font-family: var(--font-heading);
}

.process-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(212, 175, 55, 0.12);
  color: var(--gold-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  margin-bottom: 16px;
}

.process-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 10px;
}

.process-desc {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* Commitments */
.commitments-section {
  margin-top: 60px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 40px 32px;
}

.commitments-title {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 30px;
  color: var(--text-main);
}

.commitments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.commitment-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.commitment-item i {
  font-size: 1.5rem;
  color: var(--gold-primary);
  background: rgba(212, 175, 55, 0.12);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.commitment-item h4 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 6px;
}

.commitment-item p {
  font-size: 0.86rem;
  color: var(--text-muted);
  line-height: 1.55;
}

/* FAQ */
.faq-section {
  margin-top: 60px;
}

.faq-title {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 30px;
  color: var(--text-main);
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.faq-item {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 24px;
}

.faq-item h4 {
  font-size: 0.98rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.faq-item p {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* Direct CTA */
.direct-contact-cta {
  margin-top: 60px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(7, 14, 27, 0.95) 100%);
  border: 1px solid var(--border-gold);
  border-radius: var(--radius-lg);
  padding: 40px 24px;
  text-align: center;
}

.cta-inner h3 {
  font-size: 1.5rem;
  color: var(--text-main);
  margin-bottom: 10px;
}

.cta-inner p {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-bottom: 24px;
}

.cta-btns {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
