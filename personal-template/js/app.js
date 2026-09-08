/**
 * BẤT ĐỘNG SẢN BẾN THÀNH - PERSONAL TEMPLATE APP ENGINE
 */

// Fallback data khi mở trực tiếp file HTML (file://) mà không qua local web server
const DEFAULT_PROFILE = {
  agent: {
    name: "Ngô Tuấn Kiệt",
    title: "Chuyên Viên Tư Vấn Bất Động Sản Cao Cấp",
    agency: "Bất Động Sản Bến Thành",
    phone: "0901234567",
    phone_display: "0901.234.567",
    zalo: "https://zalo.me/0901234567",
    facebook: "https://facebook.com",
    email: "tuankiet.bdsbenthanh@gmail.com",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    slogan: "Tận Tâm - Minh Bạch - Đồng Hành Cùng Quyết Định Đầu Tư Triệu Đô",
    bio: "Với hơn 6 năm gắn bó sâu sát với thị trường BĐS Trung tâm Quận 1 & Bến Thành, tôi cam kết mang đến giỏ hàng độc quyền, giá gốc từ chủ nhà và hỗ trợ trọn gói pháp lý sang tên an toàn tuyệt đối.",
    stats: [
      { label: "Năm kinh nghiệm", value: "6+" },
      { label: "Giao dịch thành công", value: "135+" },
      { label: "Tổng giá trị chốt", value: "850+ Tỷ" },
      { label: "Khách hàng hài lòng", value: "99%" }
    ],
    commitments: [
      {
        icon: "fa-shield-halved",
        title: "Pháp Lý Chuẩn 100%",
        desc: "Kiểm tra quy hoạch, lộ giới, tình trạng thế chấp trước khi gửi đến quý khách."
      },
      {
        icon: "fa-tags",
        title: "Nguồn Hàng Độc Quyền",
        desc: "Làm việc trực tiếp chính chủ, thương lượng giá tốt nhất thị trường."
      },
      {
        icon: "fa-handshake",
        title: "Đồng Hành Trọn Đời",
        desc: "Hỗ trợ công chứng, hoàn công, sang tên và khai thác cho thuê sinh dòng tiền."
      }
    ],
    lead_config: {
      telegram_enabled: true,
      telegram_bot_token: "YOUR_BOT_TOKEN_HERE",
      telegram_chat_id: "YOUR_CHAT_ID_HERE",
      google_sheet_webhook: ""
    }
  },
  properties: [
    {
      id: "BT-01",
      category: "nha-pho",
      badge: "Hàng Hiếm",
      title: "Mặt Tiền Cách Mạng Tháng 8, P. Bến Thành, Q.1",
      price: "38.5 Tỷ",
      price_raw: 38.5,
      area: "112 m²",
      dimensions: "4.8m x 23.5m",
      structure: "1 Hầm, 5 Tầng, Thang máy",
      bedrooms: 6,
      bathrooms: 6,
      direction: "Đông Nam",
      legal: "Sổ hồng hoàn công đầy đủ",
      rent_income: "Đang có HĐ thuê 85 Triệu/tháng",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      description: "Vị trí cực đắc địa cách Chợ Bến Thành 400m, tuyến đường kinh doanh sầm uất đa ngành nghề. Nhà mới thiết kế hiện đại, thang máy nhập khẩu, đang có hợp đồng thuê dài hạn giữ tiền cực tốt.",
      features: ["Thang máy", "Hầm để xe", "Mặt tiền kinh doanh", "Hợp đồng thuê sẵn", "Sổ hồng riêng"]
    },
    {
      id: "BT-02",
      category: "can-ho",
      badge: "Căn Góc View Đẹp",
      title: "Căn Hộ D1 Mension Somerset Bến Thành - Q.1",
      price: "14.8 Tỷ",
      price_raw: 14.8,
      area: "103 m²",
      dimensions: "Căn góc 3 view thoáng",
      structure: "Tầng cao, 3 Phòng Ngủ",
      bedrooms: 3,
      bathrooms: 2,
      direction: "Tây Nam",
      legal: "Sổ hồng lâu dài",
      rent_income: "Giá thuê 3.200 USD/tháng",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      description: "Căn hộ siêu sang quản lý bởi tập đoàn quốc tế Somerset. Nội thất bàn giao full nhập khẩu từ Ý, hồ bơi vô cực trên không, phòng gym chuẩn 5 sao.",
      features: ["Hồ bơi nước ấm tràn bờ", "Quản lý 5 sao", "Full nội thất nhập khẩu", "Tặng slot ô tô"]
    },
    {
      id: "BT-03",
      category: "nha-pho",
      badge: "Giá Ngộp",
      title: "Nhà Phố Hẻm Xe Hơi Lý Tự Trọng, P. Bến Thành",
      price: "23.5 Tỷ",
      price_raw: 23.5,
      area: "78 m²",
      dimensions: "4.2m x 18.5m",
      structure: "Trệt, 3 Lầu, Sân thượng",
      bedrooms: 4,
      bathrooms: 5,
      direction: "Chính Nam",
      legal: "Sổ hồng chính chủ, công chứng ngay",
      rent_income: "Khai thác Airbnb 45 Triệu/tháng",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      description: "Khu vực dân trí cao, an ninh 24/7, hẻm nhựa 6m thông thoáng. Thích hợp vừa ở vừa làm văn phòng công ty hoặc kinh doanh căn hộ dịch vụ cao cấp.",
      features: ["Hẻm xe hơi tránh nhau", "Gần chợ Bến Thành", "Nội thất cao cấp", "Công chứng trong ngày"]
    },
    {
      id: "BT-04",
      category: "mat-bang",
      badge: "Độc Quyền",
      title: "Tòa Nhà Văn Phòng Mặt Tiền Nguyễn Trãi, P. Bến Thành",
      price: "62 Tỷ",
      price_raw: 62,
      area: "165 m²",
      dimensions: "7.5m x 22m",
      structure: "1 Hầm, 7 Tầng, PCCC chuẩn",
      bedrooms: 10,
      bathrooms: 8,
      direction: "Đông Bắc",
      legal: "Sổ hồng hoàn công công trình cấp 2",
      rent_income: "Đang cho chuỗi thẩm mỹ viện thuê 180 Triệu/tháng",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
      description: "Khuôn đất lớn hiếm hoi tại Bến Thành có bề ngang 7.5m cực đẹp. Tòa nhà xây dựng chuẩn văn phòng cao cấp, hệ thống PCCC nghiệm thu đầy đủ, dòng tiền cho thuê ổn định.",
      features: ["Mặt tiền 7.5m", "PCCC nghiệm thu", "Dòng tiền 180tr/tháng", "Thang máy tốc độ cao"]
    },
    {
      id: "BT-05",
      category: "can-ho",
      badge: "Penthouse",
      title: "Penthouse Duplex Grand Marina Saigon Bến Nghé - Bến Thành",
      price: "52 Tỷ",
      price_raw: 52,
      area: "240 m²",
      dimensions: "Thông tầng trần 7m",
      structure: "Duplex 2 tầng, 4 Phòng Ngủ",
      bedrooms: 4,
      bathrooms: 5,
      direction: "Đông Nam",
      legal: "HĐMB trực tiếp CĐT Masterise",
      rent_income: "Tiềm năng cho chuyên gia thuê 6.000 USD",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      description: "Bất động sản hàng hiệu Marriott lớn nhất thế giới. View trực diện sông Sài Gòn và bến du thuyền, dịch vụ quản gia cá nhân chuẩn Hoàng Gia 24/7.",
      features: ["Bến du thuyền tư nhân", "Dịch vụ Marriott 24/7", "View sông trực diện", "Trần cao 7m"]
    }
  ],
  testimonials: [
    {
      name: "Anh Trần Đức Trọng",
      role: "Nhà đầu tư BĐS Phố Cổ",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      comment: "Làm việc với Tuấn Kiệt tôi rất an tâm về mặt pháp lý. Căn nhà phố Nguyễn Trãi Kiệt hỗ trợ đàm phán giảm được gần 2 tỷ so với giá chủ ban đầu đưa ra. Thủ tục sang tên chỉ mất đúng 10 ngày."
    },
    {
      name: "Chị Hoàng Mai Lan",
      role: "CEO Công ty Mỹ phẩm",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      comment: "Mình tìm căn hộ 3PN ở trung tâm suốt 3 tháng không ưng ý, qua Kiệt tư vấn đúng 2 căn là chốt được căn D1 Mension ưng ý cả về view lẫn dòng tiền cho thuê."
    },
    {
      name: "Bác Lê Quang Vĩnh",
      role: "Cán bộ hưu trí Bến Thành",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      comment: "Nhờ cháu Kiệt ký gửi căn nhà hẻm CMT8, chỉ sau 3 tuần đã có khách chốt cọc với mức giá rất hợp lý. Làm việc nhanh nhẹn, lễ phép và rất có tâm."
    }
  ]
};

let currentData = DEFAULT_PROFILE;

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Tải dữ liệu config
  await loadProfileConfig();

  // 2. Render toàn bộ trang
  renderAgentBranding();
  renderStats();
  renderCommitments();
  renderProperties("all");
  renderTestimonials();
  setupEventListeners();
});

async function loadProfileConfig() {
  try {
    const res = await fetch("config/profile.json");
    if (res.ok) {
      currentData = await res.json();
    }
  } catch (err) {
    console.log("Sử dụng fallback profile data:", err);
  }
}

function renderAgentBranding() {
  const { agent } = currentData;
  if (!agent) return;

  // Title và Meta
  document.title = `${agent.name} - ${agent.title} | ${agent.agency}`;

  // Logo & Header
  const headerAgentName = document.getElementById("header-agent-name");
  if (headerAgentName) headerAgentName.innerText = agent.name;
  
  const headerPhoneBtn = document.getElementById("header-phone-btn");
  if (headerPhoneBtn) {
    headerPhoneBtn.href = `tel:${agent.phone}`;
    headerPhoneBtn.innerHTML = `<i class="fa-solid fa-phone"></i> ${agent.phone_display || agent.phone}`;
  }

  // Hero Section
  setText("hero-agent-name", agent.name);
  setText("hero-agent-title", agent.title);
  setText("hero-agency", agent.agency);
  setText("hero-slogan", `"${agent.slogan}"`);
  setText("hero-bio", agent.bio);

  // Profile Card
  const avatarImg = document.getElementById("profile-avatar");
  if (avatarImg && agent.avatar) {
    avatarImg.src = agent.avatar;
    avatarImg.alt = agent.name;
  }
  setText("card-agent-name", agent.name);
  setText("card-agent-title", agent.title);
  setText("card-agent-phone", agent.phone_display || agent.phone);
  setText("card-agent-email", agent.email);

  // CTA Buttons (Phone, Zalo)
  setLinkAndHref("cta-call-btn", `tel:${agent.phone}`, `<i class="fa-solid fa-phone-volume"></i> Gọi Ngay: ${agent.phone_display || agent.phone}`);
  setLinkAndHref("cta-zalo-btn", agent.zalo, `<i class="fa-solid fa-comment-dots"></i> Chat Zalo Ngay`);

  // Floating Bar
  setLinkAndHref("float-call-btn", `tel:${agent.phone}`, `<i class="fa-solid fa-phone"></i> Gọi Điện`);
  setLinkAndHref("float-zalo-btn", agent.zalo, `<i class="fa-solid fa-comment-dots"></i> Nhắn Zalo`);
  setLinkAndHref("desktop-float-call", `tel:${agent.phone}`);
  setLinkAndHref("desktop-float-zalo", agent.zalo);

  // Footer
  setText("footer-agent-name", agent.name);
  setText("footer-agent-agency", agent.agency);
  setText("footer-phone", agent.phone_display || agent.phone);
  setText("footer-email", agent.email);
}

function renderStats() {
  const statsContainer = document.getElementById("stats-container");
  if (!statsContainer || !currentData.agent?.stats) return;

  statsContainer.innerHTML = currentData.agent.stats.map(s => `
    <div class="stat-item">
      <div class="stat-number">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join("");
}

function renderCommitments() {
  const container = document.getElementById("commitments-container");
  if (!container || !currentData.agent?.commitments) return;

  container.innerHTML = currentData.agent.commitments.map(c => `
    <div class="commitment-card">
      <div class="commitment-icon">
        <i class="fa-solid ${c.icon}"></i>
      </div>
      <h3 class="commitment-title">${c.title}</h3>
      <p class="commitment-desc">${c.desc}</p>
    </div>
  `).join("");
}

function renderProperties(filterCategory = "all") {
  const grid = document.getElementById("properties-grid");
  if (!grid || !currentData.properties) return;

  const filtered = filterCategory === "all" 
    ? currentData.properties 
    : currentData.properties.filter(p => p.category === filterCategory);

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">Hiện tại chưa có bất động sản thuộc danh mục này. Vui lòng liên hệ để kiểm tra quỹ căn mới nhất.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="prop-card">
      <div class="prop-img-wrap">
        <img src="${p.image}" alt="${p.title}" class="prop-img" loading="lazy">
        <span class="prop-badge">${p.badge || 'Đang Bán'}</span>
        <span class="prop-price-tag">${p.price}</span>
      </div>
      <div class="prop-body">
        <div class="prop-location">
          <i class="fa-solid fa-location-dot"></i> ${p.location || 'Phường Bến Thành, Q.1'}
        </div>
        <h3 class="prop-title" title="${p.title}">${p.title}</h3>
        <div class="prop-meta-grid">
          <div class="prop-meta-item">
            <span>Diện tích</span>
            <strong>${p.area}</strong>
          </div>
          <div class="prop-meta-item">
            <span>Kết cấu</span>
            <strong>${p.structure || p.dimensions}</strong>
          </div>
          <div class="prop-meta-item">
            <span>Pháp lý</span>
            <strong>${p.legal.includes('Sổ') ? 'Sổ hồng riêng' : 'Chuẩn'}</strong>
          </div>
        </div>
        <div class="prop-card-actions">
          <button class="btn btn-outline-gold" onclick="openPropertyModal('${p.id}')">
            <i class="fa-regular fa-eye"></i> Chi Tiết
          </button>
          <a href="tel:${currentData.agent.phone}" class="btn btn-gold">
            <i class="fa-solid fa-phone"></i> Xem Nhà
          </a>
        </div>
      </div>
    </div>
  `).join("");
}

function renderTestimonials() {
  const container = document.getElementById("testimonials-container");
  if (!container || !currentData.testimonials) return;

  container.innerHTML = currentData.testimonials.map(t => `
    <div class="testimonial-card">
      <div class="stars-row">
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
      </div>
      <p class="testimonial-quote">"${t.comment}"</p>
      <div class="client-info">
        <img src="${t.avatar}" alt="${t.name}" class="client-avatar">
        <div class="client-meta">
          <h4>${t.name}</h4>
          <span>${t.role}</span>
        </div>
      </div>
    </div>
  `).join("");
}

// Setup Event Listeners
function setupEventListeners() {
  // Filter tabs
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      renderProperties(filter);
    });
  });

  // Lead Form Submission
  const leadForm = document.getElementById("lead-form");
  if (leadForm) {
    leadForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById("lead-submit-btn");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi yêu cầu...`;
      submitBtn.disabled = true;

      const leadData = {
        name: document.getElementById("lead-name").value.trim(),
        phone: document.getElementById("lead-phone").value.trim(),
        demand: document.getElementById("lead-demand").value,
        budget: document.getElementById("lead-budget").value,
        propertyInterest: document.getElementById("lead-property-interest")?.value || "Chung",
        note: document.getElementById("lead-note")?.value.trim() || ""
      };

      // Gửi qua LeadCollector
      await LeadCollector.sendLead(leadData, currentData.agent.lead_config);

      // Hiển thị Toast thông báo
      showToast(`Đã nhận thông tin! Chuyên viên ${currentData.agent.name} sẽ liên hệ anh/chị ngay.`);
      leadForm.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
  }

  // Modal Backdrop click to close
  const modal = document.getElementById("property-modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closePropertyModal();
    });
  }
}

// Modal Chi tiết căn hộ
window.openPropertyModal = function(propId) {
  const p = currentData.properties?.find(item => item.id === propId);
  if (!p) return;

  const modal = document.getElementById("property-modal");
  const modalBody = document.getElementById("modal-body-content");

  modalBody.innerHTML = `
    <img src="${p.image}" alt="${p.title}" class="modal-hero-img">
    <div class="modal-inner-body">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; margin-bottom: 12px;">
        <span class="prop-badge">${p.badge || 'Đang Bán'}</span>
        <span style="font-size: 1.4rem; font-weight: 800; color: var(--gold-light);">${p.price}</span>
      </div>
      <h2 style="font-size: 1.35rem; margin-bottom: 10px; color: #fff;">${p.title}</h2>
      <div style="color: var(--gold-primary); font-size: 0.9rem; margin-bottom: 20px;">
        <i class="fa-solid fa-location-dot"></i> ${p.location}
      </div>

      <p style="color: #cbd5e1; font-size: 0.92rem; line-height: 1.6; margin-bottom: 20px;">
        ${p.description}
      </p>

      <h4 style="font-size: 1rem; color: var(--gold-primary); margin-bottom: 10px;">THÔNG TIN CHI TIẾT</h4>
      <table class="modal-specs-table">
        <tbody>
          <tr><td>Diện tích:</td><td>${p.area}</td></tr>
          <tr><td>Kích thước:</td><td>${p.dimensions}</td></tr>
          <tr><td>Kết cấu:</td><td>${p.structure}</td></tr>
          <tr><td>Số phòng:</td><td>${p.bedrooms} Phòng ngủ - ${p.bathrooms} WC</td></tr>
          <tr><td>Hướng nhà:</td><td>${p.direction}</td></tr>
          <tr><td>Pháp lý:</td><td><span style="color: #10b981;">✓ ${p.legal}</span></td></tr>
          <tr><td>Dòng tiền / Khai thác:</td><td><strong style="color: var(--gold-light);">${p.rent_income}</strong></td></tr>
        </tbody>
      </table>

      <h4 style="font-size: 1rem; color: var(--gold-primary); margin: 15px 0 10px;">TIỆN ÍCH NỔI BẬT</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 25px;">
        ${(p.features || []).map(f => `<span style="background: rgba(212,175,55,0.12); border: 1px solid rgba(212,175,55,0.3); color: var(--gold-light); padding: 5px 12px; border-radius: 9999px; font-size: 0.8rem;">✓ ${f}</span>`).join("")}
      </div>

      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <a href="tel:${currentData.agent.phone}" class="btn btn-call" style="flex: 1;">
          <i class="fa-solid fa-phone"></i> Gọi Tư Vấn: ${currentData.agent.phone_display || currentData.agent.phone}
        </a>
        <a href="${currentData.agent.zalo}" target="_blank" class="btn btn-zalo" style="flex: 1;">
          <i class="fa-solid fa-comment-dots"></i> Nhận Bảng Pháp Lý Qua Zalo
        </a>
      </div>
    </div>
  `;

  modal.classList.add("show");
};

window.closePropertyModal = function() {
  const modal = document.getElementById("property-modal");
  if (modal) modal.classList.remove("show");
};

// Helper Functions
function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text !== undefined) el.innerText = text;
}

function setLinkAndHref(id, href, html) {
  const el = document.getElementById(id);
  if (el) {
    if (href) el.href = href;
    if (html) el.innerHTML = html;
  }
}

function showToast(message) {
  let toast = document.getElementById("toast-notification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notification";
    toast.className = "toast-msg";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 5000);
}
