/**
 * BẤT ĐỘNG SẢN BẾN THÀNH - MASTER PORTAL JAVASCRIPT
 */

const AGENTS_LIST = [
  {
    id: "tuankiet",
    name: "Ngô Tuấn Kiệt",
    role: "Chuyên Viên Nhà Phố & Tòa Nhà Q.1",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    phone: "0901.234.567",
    exp: "6+ Năm",
    deals: "135+ Căn",
    landingUrl: "../personal-template/index.html",
    tag: "Top Producer"
  },
  {
    id: "vantam",
    name: "Nguyễn Văn Tâm",
    role: "Giám Đốc Quỹ Căn Biệt Thự & Khách Sạn",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    phone: "0938.888.999",
    exp: "10+ Năm",
    deals: "250+ Căn",
    landingUrl: "../personal-template/index.html",
    tag: "Leader"
  },
  {
    id: "minhduc",
    name: "Trần Minh Đức",
    role: "Chuyên Gia Căn Hộ Hạng Sang & Penthouse",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    phone: "0918.777.666",
    exp: "5+ Năm",
    deals: "90+ Căn",
    landingUrl: "../personal-template/index.html",
    tag: "Chuyên Sâu"
  }
];

const MASTER_LISTINGS = [
  {
    id: "M-01",
    title: "Mặt Tiền Cách Mạng Tháng 8, P. Bến Thành, Q.1",
    category: "nha-pho",
    price: "38.5 Tỷ",
    area: "112 m²",
    structure: "1 Hầm, 5 Tầng, Thang máy",
    location: "Phường Bến Thành, Q.1",
    agentName: "Ngô Tuấn Kiệt",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "M-02",
    title: "Căn Hộ D1 Mension Somerset Bến Thành - Q.1",
    category: "can-ho",
    price: "14.8 Tỷ",
    area: "103 m²",
    structure: "3 Phòng Ngủ, Full nội thất Ý",
    location: "Bến Thành - Q.1",
    agentName: "Trần Minh Đức",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "M-03",
    title: "Tòa Nhà Văn Phòng Mặt Tiền Nguyễn Trãi, P. Bến Thành",
    category: "mat-bang",
    price: "62 Tỷ",
    area: "165 m²",
    structure: "Ngang 7.5m, Hầm 7 Tầng",
    location: "Mặt tiền Nguyễn Trãi, Q.1",
    agentName: "Ngô Tuấn Kiệt",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "M-04",
    title: "Khách Sạn 3 Sao Phố Tây Bùi Viện - Bến Thành",
    category: "khach-san",
    price: "85 Tỷ",
    area: "180 m²",
    structure: "1 Hầm 8 Tầng, 32 Phòng khép kín",
    location: "Phường Phạm Ngũ Lão - Bến Thành",
    agentName: "Nguyễn Văn Tâm",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "M-05",
    title: "Nhà Phố Hẻm Xe Hơi Lý Tự Trọng, P. Bến Thành",
    category: "nha-pho",
    price: "23.5 Tỷ",
    area: "78 m²",
    structure: "Trệt 3 Lầu, Sân thượng",
    location: "Lý Tự Trọng, Q.1",
    agentName: "Ngô Tuấn Kiệt",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "M-06",
    title: "Penthouse Duplex Grand Marina Saigon Bến Nghé - Bến Thành",
    category: "can-ho",
    price: "52 Tỷ",
    area: "240 m²",
    structure: "Duplex 2 tầng, View sông Sài Gòn",
    location: "Quận 1, TP.HCM",
    agentName: "Trần Minh Đức",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  renderAgents();
  renderMasterListings(MASTER_LISTINGS);
  setupSearch();
  setupConsignmentForm();
});

function renderAgents() {
  const container = document.getElementById("agents-grid");
  if (!container) return;

  container.innerHTML = AGENTS_LIST.map(a => `
    <div class="team-card">
      <span class="team-card-top-tag">${a.tag}</span>
      <div class="team-avatar-box">
        <img src="${a.avatar}" alt="${a.name}">
      </div>
      <h3 class="team-name">${a.name}</h3>
      <p class="team-role">${a.role}</p>

      <div class="team-specs">
        <div>
          <span>Kinh nghiệm</span>
          <strong>${a.exp}</strong>
        </div>
        <div>
          <span>Đã giao dịch</span>
          <strong>${a.deals}</strong>
        </div>
      </div>

      <div class="team-actions">
        <a href="${a.landingUrl}" class="btn btn-gold" style="font-size: 0.85rem; padding: 10px;">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Xem Website Cá Nhân
        </a>
        <a href="tel:${a.phone.replace(/[^0-9]/g, '')}" class="btn btn-outline-gold" style="font-size: 0.85rem; padding: 9px;">
          <i class="fa-solid fa-phone"></i> Hotline: ${a.phone}
        </a>
      </div>
    </div>
  `).join("");
}

function renderMasterListings(items) {
  const container = document.getElementById("master-listings-grid");
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 50px;">Không tìm thấy bất động sản phù hợp với bộ lọc.</div>`;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="listing-box">
      <div class="listing-img-box">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <span class="listing-price-badge">${item.price}</span>
      </div>
      <div class="listing-info">
        <div style="font-size: 0.8rem; color: var(--gold-primary);"><i class="fa-solid fa-location-dot"></i> ${item.location}</div>
        <h3 class="listing-title">${item.title}</h3>
        <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 15px;">
          DT: <strong>${item.area}</strong> • ${item.structure}
        </p>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px;">
          <span style="font-size: 0.78rem; color: var(--text-muted);">Phụ trách: <strong style="color: #fff;">${item.agentName}</strong></span>
          <a href="../personal-template/index.html" class="btn btn-gold" style="padding: 6px 14px; font-size: 0.8rem;">Chi tiết</a>
        </div>
      </div>
    </div>
  `).join("");
}

function setupSearch() {
  const btn = document.getElementById("btn-search");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const keyword = document.getElementById("search-keyword")?.value.toLowerCase().trim() || "";
    const category = document.getElementById("search-category")?.value || "all";
    
    const filtered = MASTER_LISTINGS.filter(p => {
      const matchKeyword = !keyword || p.title.toLowerCase().includes(keyword) || p.location.toLowerCase().includes(keyword);
      const matchCategory = category === "all" || p.category === category;
      return matchKeyword && matchCategory;
    });

    renderMasterListings(filtered);
  });
}

function setupConsignmentForm() {
  const form = document.getElementById("consignment-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Cảm ơn quý khách đã gửi thông tin ký gửi! Ban Quản Lý Sàn BĐS Bến Thành sẽ liên hệ thẩm định và tiếp nhận hồ sơ trong 2 giờ.");
    form.reset();
  });
}
