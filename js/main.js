/**
 * BẤT ĐỘNG SẢN BẾN THÀNH - MAIN APPLICATION CONTROLLER
 * Bao gồm: Điều khiển giao diện, Theme Sáng/Tối, Routing xem Profile Nhân viên, Bộ lọc, Admin Dashboard CMS
 */

let currentFilter = {
  keyword: "",
  category: "all",
  priceRange: "all"
};

let currentAgentViewId = null;
let editingPropertyId = null;
let editingAgentId = null;
let isAdminLoggedIn = false;

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  handleRouting();
  renderAll();
  setupEventListeners();
  setupHashListener();
});

// --- 1. THEME MANAGEMENT (SÁNG / TỐI) ---
function initTheme() {
  const theme = AppStore.getTheme();
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById("theme-toggle-icon");
  if (icon) {
    icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    icon.setAttribute("title", theme === "dark" ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối");
  }
}

function toggleTheme() {
  const newTheme = AppStore.toggleTheme();
  updateThemeIcon(newTheme);
  showToast(`Đã chuyển sang giao diện ${newTheme === 'dark' ? 'Tối sang trọng' : 'Sáng thanh lịch'}`);
}

// --- 2. ROUTING (WEB TỔNG VS TRANG PROFILE NHÂN VIÊN) ---
function handleRouting() {
  const hash = window.location.hash;
  if (hash.startsWith("#agent-")) {
    const agentId = hash.replace("#agent-", "");
    openAgentProfileView(agentId, false);
  } else {
    showMainPortalView();
  }
}

function setupHashListener() {
  window.addEventListener("hashchange", () => {
    handleRouting();
  });
}

function openAgentProfileView(agentId, updateHistory = true) {
  const agents = AppStore.getAgents();
  const agent = agents.find(a => a.id === agentId);
  if (!agent) {
    showMainPortalView();
    return;
  }

  currentAgentViewId = agentId;
  if (updateHistory) {
    window.location.hash = `#agent-${agentId}`;
  }

  // Ẩn Web Tổng, Hiện Agent Profile View
  document.getElementById("main-portal-view").style.display = "none";
  const agentView = document.getElementById("agent-profile-view");
  agentView.style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Render Hero Thông Tin Nhân Viên (như hình 2)
  document.getElementById("agent-hero-avatar").src = agent.avatar;
  document.getElementById("agent-hero-name").innerText = agent.name;
  document.getElementById("agent-hero-role").innerText = agent.role;
  document.getElementById("agent-hero-slogan").innerText = `"${agent.slogan || 'Tận tâm phục vụ quý khách'}"`;
  document.getElementById("agent-hero-bio").innerText = agent.bio || "";
  document.getElementById("agent-exp-badge").innerText = `Kinh nghiệm: ${agent.exp}`;
  document.getElementById("agent-deals-badge").innerText = `Đã giao dịch: ${agent.deals}`;
  
  // Nút gọi & Zalo
  const callBtn = document.getElementById("agent-call-btn");
  callBtn.href = `tel:${agent.phone.replace(/[^0-9]/g, '')}`;
  callBtn.innerHTML = `<i class="fa-solid fa-phone"></i> Gọi Ngay: ${agent.phone_display || agent.phone}`;

  const zaloBtn = document.getElementById("agent-zalo-btn");
  zaloBtn.href = agent.zalo;

  // Render Quỹ căn mà nhân viên này phụ trách
  const allProperties = AppStore.getProperties();
  const agentProperties = allProperties.filter(p => p.agentId === agentId);
  renderPropertiesGrid("agent-properties-grid", agentProperties, agent);
}

function showMainPortalView() {
  currentAgentViewId = null;
  if (window.location.hash.startsWith("#agent-")) {
    window.location.hash = "";
  }
  document.getElementById("agent-profile-view").style.display = "none";
  document.getElementById("main-portal-view").style.display = "block";
  renderMasterListings();
}

function copyAgentShareLink() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    showToast("Đã sao chép đường link trang cá nhân! Bạn có thể gửi cho khách hàng.");
  });
}

// --- 3. RENDER DỮ LIỆU ---
function renderAll() {
  renderAgents();
  renderMasterListings();
}

function renderAgents() {
  const container = document.getElementById("agents-grid");
  if (!container) return;

  const agents = AppStore.getAgents();
  container.innerHTML = agents.map(a => `
    <div class="team-card">
      <span class="team-tag">${a.tag || 'Chuyên Viên'}</span>
      <div class="team-avatar-box">
        <img src="${a.avatar}" alt="${a.name}" onerror="this.src='https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80'">
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
        <button class="btn btn-gold" onclick="openAgentProfileView('${a.id}')">
          <i class="fa-solid fa-id-badge"></i> Xem Website Cá Nhân
        </button>
        <a href="tel:${a.phone.replace(/[^0-9]/g, '')}" class="btn btn-outline-gold" style="font-size: 0.82rem; padding: 8px;">
          <i class="fa-solid fa-phone"></i> Hotline: ${a.phone_display || a.phone}
        </a>
      </div>
    </div>
  `).join("");
}

function renderMasterListings() {
  const container = document.getElementById("master-properties-grid");
  if (!container) return;

  const allProperties = AppStore.getProperties();
  const agents = AppStore.getAgents();

  // Lọc theo currentFilter
  const filtered = allProperties.filter(p => {
    const matchKeyword = !currentFilter.keyword || 
      p.title.toLowerCase().includes(currentFilter.keyword) || 
      p.location.toLowerCase().includes(currentFilter.keyword) ||
      (p.features && p.features.some(f => f.toLowerCase().includes(currentFilter.keyword)));

    const matchCategory = currentFilter.category === "all" || p.category === currentFilter.category;

    let matchPrice = true;
    if (currentFilter.priceRange === "under20") matchPrice = p.price_raw < 20;
    else if (currentFilter.priceRange === "20to50") matchPrice = p.price_raw >= 20 && p.price_raw <= 50;
    else if (currentFilter.priceRange === "above50") matchPrice = p.price_raw > 50;

    return matchKeyword && matchCategory && matchPrice;
  });

  renderPropertiesGrid("master-properties-grid", filtered);

  // Hiển thị thông báo số lượng tìm kiếm
  const alertBox = document.getElementById("search-results-alert");
  if (alertBox) {
    if (currentFilter.keyword || currentFilter.category !== "all" || currentFilter.priceRange !== "all") {
      alertBox.style.display = "block";
      alertBox.innerHTML = `<i class="fa-solid fa-check-circle"></i> Tìm thấy <strong>${filtered.length}</strong> bất động sản phù hợp với yêu cầu của bạn.`;
    } else {
      alertBox.style.display = "none";
    }
  }
}

function renderPropertiesGrid(containerId, list, fallbackAgent = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 50px 20px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
        <i class="fa-solid fa-house-chimney-crack" style="font-size: 2.5rem; color: var(--gold-primary); margin-bottom: 12px; display: block;"></i>
        <h4 style="color: var(--text-main); margin-bottom: 6px;">Không tìm thấy bất động sản phù hợp</h4>
        <p style="font-size: 0.9rem;">Quý khách vui lòng liên hệ hotline để nhận quỹ căn kín mới nhất chưa công khai.</p>
      </div>
    `;
    return;
  }

  const agents = AppStore.getAgents();

  container.innerHTML = list.map(p => {
    const agent = fallbackAgent || agents.find(a => a.id === p.agentId) || { name: "Bến Thành Land", phone: "0938888999", phone_display: "0938.888.999" };
    return `
      <div class="prop-card">
        <div class="prop-img-wrap">
          <img src="${p.image}" alt="${p.title}" class="prop-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'">
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
              <strong>${p.structure || p.dimensions || 'Chuẩn'}</strong>
            </div>
            <div class="prop-meta-item">
              <span>Pháp lý</span>
              <strong>${p.legal ? 'Sổ hồng' : 'Chuẩn'}</strong>
            </div>
          </div>

          <div class="prop-agent-tag">
            <i class="fa-solid fa-user-tie" style="color: var(--gold-primary);"></i>
            <span>Phụ trách: <strong>${agent.name}</strong></span>
          </div>

          <div class="prop-actions">
            <button class="btn btn-outline-gold" onclick="openPropertyModal('${p.id}')">
              <i class="fa-regular fa-eye"></i> Chi Tiết
            </button>
            <a href="tel:${agent.phone.replace(/[^0-9]/g, '')}" class="btn btn-gold">
              <i class="fa-solid fa-phone"></i> Xem Nhà
            </a>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// --- 4. MODAL CHI TIẾT BẤT ĐỘNG SẢN ---
window.openPropertyModal = function(id) {
  const p = AppStore.getProperties().find(item => item.id === id);
  if (!p) return;

  const agent = AppStore.getAgents().find(a => a.id === p.agentId) || { name: "Bến Thành Land", phone: "0938888999", phone_display: "0938.888.999", zalo: "https://zalo.me" };

  const modal = document.getElementById("property-detail-modal");
  const body = document.getElementById("property-detail-body");

  body.innerHTML = `
    <img src="${p.image}" alt="${p.title}" style="width: 100%; height: 300px; object-fit: cover;">
    <div style="padding: 26px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 15px;">
        <span class="prop-badge" style="position: static;">${p.badge || 'Đang Bán'}</span>
        <span style="font-size: 1.5rem; font-weight: 800; color: var(--gold-primary);">${p.price}</span>
      </div>

      <h2 style="font-size: 1.4rem; margin-bottom: 10px; color: var(--text-main);">${p.title}</h2>
      <div style="color: var(--gold-primary); font-size: 0.9rem; margin-bottom: 20px;">
        <i class="fa-solid fa-location-dot"></i> ${p.location}
      </div>

      <p style="color: var(--text-sub); font-size: 0.94rem; line-height: 1.6; margin-bottom: 20px;">
        ${p.description}
      </p>

      <h4 style="font-size: 1rem; color: var(--gold-primary); margin-bottom: 10px;">THÔNG TIN KỸ THUẬT & PHÁP LÝ</h4>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.9rem;">
        <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted); width: 40%;">Diện tích:</td><td style="font-weight: 600;">${p.area}</td></tr>
        <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Kích thước:</td><td style="font-weight: 600;">${p.dimensions || 'Đầy đủ'}</td></tr>
        <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Kết cấu:</td><td style="font-weight: 600;">${p.structure || 'Chuẩn'}</td></tr>
        <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Pháp lý:</td><td style="font-weight: 600; color: #10b981;">✓ ${p.legal || 'Sổ hồng riêng'}</td></tr>
        <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Dòng tiền khai thác:</td><td style="font-weight: 700; color: var(--gold-primary);">${p.rent_income || 'Thương lượng'}</td></tr>
        <tr><td style="padding: 8px 0; color: var(--text-muted);">Chuyên viên phụ trách:</td><td style="font-weight: 600;">${agent.name} (${agent.phone_display || agent.phone})</td></tr>
      </table>

      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <a href="tel:${agent.phone.replace(/[^0-9]/g, '')}" class="btn btn-call" style="flex: 1;">
          <i class="fa-solid fa-phone"></i> Gọi Tư Vấn: ${agent.phone_display || agent.phone}
        </a>
        <a href="${agent.zalo}" target="_blank" class="btn btn-zalo" style="flex: 1;">
          <i class="fa-solid fa-comment-dots"></i> Nhận Bảng Pháp Lý Qua Zalo
        </a>
      </div>
    </div>
  `;

  modal.classList.add("active");
};

window.closePropertyModal = function() {
  document.getElementById("property-detail-modal").classList.remove("active");
};

// --- 5. EVENT LISTENERS & SEARCH ---
function setupEventListeners() {
  // Theme Toggle Button
  const themeBtn = document.getElementById("theme-toggle-btn");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  // Search Button
  const searchBtn = document.getElementById("btn-search");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      currentFilter.keyword = document.getElementById("search-keyword").value.toLowerCase().trim();
      currentFilter.category = document.getElementById("search-category").value;
      currentFilter.priceRange = document.getElementById("search-price").value;

      // Đổi active tab danh mục nếu có
      updateCategoryTabsUI(currentFilter.category);

      renderMasterListings();

      // Cuộn mượt xuống danh sách căn
      document.getElementById("properties").scrollIntoView({ behavior: "smooth" });
    });
  }

  // Category Tabs
  const categoryTabs = document.querySelectorAll(".category-tab");
  categoryTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const cat = tab.getAttribute("data-category");
      currentFilter.category = cat;
      document.getElementById("search-category").value = cat;
      updateCategoryTabsUI(cat);
      renderMasterListings();
    });
  });

  // Consignment Form
  const consForm = document.getElementById("consignment-form");
  if (consForm) {
    consForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const lead = {
        name: document.getElementById("cons-name").value.trim(),
        phone: document.getElementById("cons-phone").value.trim(),
        demand: "Ký gửi BĐS",
        propertyInterest: document.getElementById("cons-address").value.trim(),
        budget: document.getElementById("cons-price").value.trim()
      };
      AppStore.addLead(lead);
      showToast("Đã gửi hồ sơ ký gửi thành công! Ban Quản Lý Sàn Bến Thành sẽ liên hệ thẩm định trong 2 giờ.");
      consForm.reset();
    });
  }

  // Modal close when clicking overlay
  const modals = document.querySelectorAll(".modal-overlay");
  modals.forEach(m => {
    m.addEventListener("click", (e) => {
      if (e.target === m) m.classList.remove("active");
    });
  });
}

function updateCategoryTabsUI(cat) {
  document.querySelectorAll(".category-tab").forEach(t => {
    if (t.getAttribute("data-category") === cat) t.classList.add("active");
    else t.classList.remove("active");
  });
}

// --- 6. ADMIN DASHBOARD & CMS LOGIC ---
window.openAdminModal = function() {
  if (isAdminLoggedIn) {
    showAdminDashboard();
  } else {
    document.getElementById("admin-login-modal").classList.add("active");
  }
};

window.closeAdminLoginModal = function() {
  document.getElementById("admin-login-modal").classList.remove("active");
};

window.handleAdminLogin = function(e) {
  e.preventDefault();
  const pass = document.getElementById("admin-password").value;
  if (pass === "admin123" || pass === "123456" || pass === "benthanh") {
    isAdminLoggedIn = true;
    closeAdminLoginModal();
    showAdminDashboard();
    showToast("Đăng nhập Admin thành công!");
  } else {
    alert("Sai mật khẩu Admin! (Mật khẩu mặc định: admin123)");
  }
};

function showAdminDashboard() {
  const modal = document.getElementById("admin-dashboard-modal");
  renderAdminPropertiesTable();
  renderAdminAgentsTable();
  renderAdminLeadsTable();
  populateAdminAgentSelect();
  modal.classList.add("active");
}

window.closeAdminDashboard = function() {
  document.getElementById("admin-dashboard-modal").classList.remove("active");
};

window.switchAdminTab = function(tabName) {
  document.querySelectorAll(".admin-tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".admin-content-pane").forEach(pane => pane.classList.remove("active"));

  document.getElementById(`tab-btn-${tabName}`).classList.add("active");
  document.getElementById(`pane-${tabName}`).classList.add("active");
};

// Admin: Quản lý Bất Động Sản (CRUD)
function renderAdminPropertiesTable() {
  const tbody = document.getElementById("admin-properties-tbody");
  if (!tbody) return;

  const list = AppStore.getProperties();
  const agents = AppStore.getAgents();

  tbody.innerHTML = list.map(p => {
    const agent = agents.find(a => a.id === p.agentId);
    return `
      <tr>
        <td><strong>${p.id}</strong></td>
        <td>
          <div style="font-weight: 600; color: var(--text-main);">${p.title}</div>
          <small style="color: var(--text-muted);">${p.location}</small>
        </td>
        <td><strong style="color: var(--gold-primary);">${p.price}</strong></td>
        <td>${p.category}</td>
        <td>${agent ? agent.name : 'Chung'}</td>
        <td>
          <button class="btn btn-outline-gold" style="padding: 4px 10px; font-size: 0.78rem;" onclick="editProperty('${p.id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-call" style="background:#ef4444; padding: 4px 10px; font-size: 0.78rem;" onclick="deletePropertyItem('${p.id}')"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `;
  }).join("");
}

window.openNewPropertyForm = function() {
  editingPropertyId = null;
  document.getElementById("property-form-title").innerText = "Thêm Bất Động Sản Mới";
  document.getElementById("form-property").reset();
  document.getElementById("admin-property-form-modal").classList.add("active");
};

window.editProperty = function(id) {
  const p = AppStore.getProperties().find(item => item.id === id);
  if (!p) return;

  editingPropertyId = id;
  document.getElementById("property-form-title").innerText = "Chỉnh Sửa Bất Động Sản";
  document.getElementById("prop-form-id").value = p.id;
  document.getElementById("prop-form-title").value = p.title;
  document.getElementById("prop-form-category").value = p.category;
  document.getElementById("prop-form-price").value = p.price;
  document.getElementById("prop-form-priceraw").value = p.price_raw || 0;
  document.getElementById("prop-form-area").value = p.area;
  document.getElementById("prop-form-location").value = p.location;
  document.getElementById("prop-form-structure").value = p.structure || "";
  document.getElementById("prop-form-image").value = p.image;
  document.getElementById("prop-form-agent").value = p.agentId || "";
  document.getElementById("prop-form-desc").value = p.description || "";
  document.getElementById("prop-form-legal").value = p.legal || "";
  document.getElementById("prop-form-rent").value = p.rent_income || "";

  document.getElementById("admin-property-form-modal").classList.add("active");
};

window.savePropertyForm = function(e) {
  e.preventDefault();
  const id = editingPropertyId || `BT-${Date.now().toString().slice(-4)}`;
  const prop = {
    id: id,
    title: document.getElementById("prop-form-title").value.trim(),
    category: document.getElementById("prop-form-category").value,
    price: document.getElementById("prop-form-price").value.trim(),
    price_raw: parseFloat(document.getElementById("prop-form-priceraw").value) || 0,
    area: document.getElementById("prop-form-area").value.trim(),
    location: document.getElementById("prop-form-location").value.trim(),
    structure: document.getElementById("prop-form-structure").value.trim(),
    image: document.getElementById("prop-form-image").value.trim() || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    agentId: document.getElementById("prop-form-agent").value,
    description: document.getElementById("prop-form-desc").value.trim(),
    legal: document.getElementById("prop-form-legal").value.trim(),
    rent_income: document.getElementById("prop-form-rent").value.trim()
  };

  AppStore.addOrUpdateProperty(prop);
  document.getElementById("admin-property-form-modal").classList.remove("active");
  renderAdminPropertiesTable();
  renderMasterListings();
  showToast("Đã lưu thông tin bất động sản thành công!");
};

window.deletePropertyItem = function(id) {
  if (confirm(`Bạn có chắc chắn muốn xóa BĐS mã [${id}] không?`)) {
    AppStore.deleteProperty(id);
    renderAdminPropertiesTable();
    renderMasterListings();
    showToast("Đã xóa bất động sản!");
  }
};

// Admin: Quản lý Nhân Viên (CRUD) & Phân công Dự án / Quỹ căn
let currentAssigningAgentId = null;

function renderAdminAgentsTable() {
  const tbody = document.getElementById("admin-agents-tbody");
  if (!tbody) return;

  const agents = AppStore.getAgents();
  const allProperties = AppStore.getProperties();

  tbody.innerHTML = agents.map(a => {
    const assignedProps = allProperties.filter(p => p.agentId === a.id);
    const propBadges = assignedProps.map(p => 
      `<span style="display:inline-block; background:rgba(212,175,55,0.15); border:1px solid rgba(212,175,55,0.3); color:var(--gold-primary); padding:2px 7px; border-radius:4px; font-size:0.75rem; margin:2px;" title="${p.title}">${p.id}</span>`
    ).join("");

    return `
      <tr>
        <td>
          <img src="${a.avatar}" style="width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-gold);" onerror="this.src='https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80'">
        </td>
        <td>
          <strong style="font-size:0.95rem;">${a.name}</strong>
          <div style="font-size: 0.78rem; color: var(--gold-primary);">${a.role}</div>
        </td>
        <td><strong style="color:var(--text-main); font-size:0.85rem;">${a.phone_display || a.phone}</strong></td>
        <td>
          <div style="margin-bottom: 4px;">
            <strong style="color:var(--text-main);">${assignedProps.length}</strong> căn phụ trách
          </div>
          <div>${propBadges || '<span style="color:var(--text-muted); font-size:0.75rem;">Chưa gán</span>'}</div>
        </td>
        <td>${a.deals}</td>
        <td>
          <div style="display: flex; gap: 5px;">
            <button class="btn btn-outline-gold" style="padding: 5px 8px; font-size: 0.76rem;" onclick="openAssignModal('${a.id}')" title="Phân công dự án / căn cho nhân viên này">
              <i class="fa-solid fa-house-chimney-user"></i> Giao Căn
            </button>
            <button class="btn btn-outline-gold" style="padding: 5px 9px; font-size: 0.76rem;" onclick="editAgent('${a.id}')" title="Sửa thông tin"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-call" style="background:#ef4444; padding: 5px 9px; font-size: 0.76rem;" onclick="deleteAgentItem('${a.id}')" title="Xóa nhân viên"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

window.openAssignModal = function(agentId) {
  const agent = AppStore.getAgents().find(a => a.id === agentId);
  if (!agent) return;

  currentAssigningAgentId = agentId;
  document.getElementById("assign-agent-title").innerHTML = `Chọn các Bất Động Sản giao cho chuyên viên: <strong style="color:var(--gold-primary); font-size:1.05rem;">${agent.name}</strong> (${agent.role})`;

  const allProps = AppStore.getProperties();
  const listContainer = document.getElementById("assign-properties-list");

  listContainer.innerHTML = allProps.map(p => {
    const isAssigned = p.agentId === agentId;
    return `
      <label style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s ease;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <input type="checkbox" value="${p.id}" class="prop-assign-checkbox" ${isAssigned ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--gold-primary); cursor: pointer;">
          <div>
            <strong style="color: var(--text-main); font-size: 0.9rem;">[${p.id}] ${p.title}</strong>
            <div style="font-size: 0.78rem; color: var(--text-muted);">${p.location} • <span style="color:var(--gold-primary); font-weight:600;">${p.price}</span></div>
          </div>
        </div>
        <span style="font-size: 0.75rem; color: ${isAssigned ? '#10b981' : 'var(--text-muted)'}; font-weight: 600;">
          ${isAssigned ? '✓ Đang phụ trách' : ''}
        </span>
      </label>
    `;
  }).join("");

  document.getElementById("admin-assign-modal").classList.add("active");
};

window.saveAgentPropertyAssignments = function() {
  if (!currentAssigningAgentId) return;

  const checkboxes = document.querySelectorAll(".prop-assign-checkbox");
  const selectedPropIds = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);

  const allProps = AppStore.getProperties();
  allProps.forEach(p => {
    if (selectedPropIds.includes(p.id)) {
      p.agentId = currentAssigningAgentId;
    } else if (p.agentId === currentAssigningAgentId) {
      // Nếu bỏ chọn căn đã từng gán cho nhân viên này
      p.agentId = "";
    }
  });

  AppStore.saveProperties(allProps);
  document.getElementById("admin-assign-modal").classList.remove("active");
  renderAdminAgentsTable();
  renderMasterListings();
  if (currentAgentViewId === currentAssigningAgentId) {
    openAgentProfileView(currentAssigningAgentId, false);
  }
  showToast("Đã lưu phân công dự án cho nhân viên thành công!");
};

window.openNewAgentForm = function() {
  editingAgentId = null;
  document.getElementById("agent-form-title").innerText = "Thêm Nhân Viên Mới";
  document.getElementById("form-agent").reset();
  document.getElementById("admin-agent-form-modal").classList.add("active");
};

window.editAgent = function(id) {
  const a = AppStore.getAgents().find(item => item.id === id);
  if (!a) return;

  editingAgentId = id;
  document.getElementById("agent-form-title").innerText = "Chỉnh Sửa Nhân Viên";
  document.getElementById("agent-form-name").value = a.name;
  document.getElementById("agent-form-role").value = a.role;
  document.getElementById("agent-form-phone").value = a.phone;
  document.getElementById("agent-form-zalo").value = a.zalo;
  document.getElementById("agent-form-avatar").value = a.avatar;
  document.getElementById("agent-form-exp").value = a.exp;
  document.getElementById("agent-form-deals").value = a.deals;
  document.getElementById("agent-form-slogan").value = a.slogan || "";
  document.getElementById("agent-form-tag").value = a.tag || "Chuyên Viên";

  document.getElementById("admin-agent-form-modal").classList.add("active");
};

window.saveAgentForm = function(e) {
  e.preventDefault();
  const id = editingAgentId || `agent_${Date.now()}`;
  const phone = document.getElementById("agent-form-phone").value.trim();
  const agent = {
    id: id,
    name: document.getElementById("agent-form-name").value.trim(),
    role: document.getElementById("agent-form-role").value.trim(),
    phone: phone,
    phone_display: phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1.$2.$3'),
    zalo: document.getElementById("agent-form-zalo").value.trim() || `https://zalo.me/${phone}`,
    avatar: document.getElementById("agent-form-avatar").value.trim() || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    exp: document.getElementById("agent-form-exp").value.trim(),
    deals: document.getElementById("agent-form-deals").value.trim(),
    slogan: document.getElementById("agent-form-slogan").value.trim(),
    tag: document.getElementById("agent-form-tag").value.trim()
  };

  AppStore.addOrUpdateAgent(agent);
  document.getElementById("admin-agent-form-modal").classList.remove("active");
  renderAdminAgentsTable();
  renderAgents();
  populateAdminAgentSelect();
  showToast("Đã lưu thông tin nhân viên!");
};

window.deleteAgentItem = function(id) {
  if (confirm(`Bạn có chắc muốn xóa nhân viên này?`)) {
    AppStore.deleteAgent(id);
    renderAdminAgentsTable();
    renderAgents();
    populateAdminAgentSelect();
    showToast("Đã xóa nhân viên!");
  }
};

function populateAdminAgentSelect() {
  const select = document.getElementById("prop-form-agent");
  if (!select) return;
  const agents = AppStore.getAgents();
  select.innerHTML = agents.map(a => `<option value="${a.id}">${a.name} (${a.role})</option>`).join("");
}

// Admin: Quản lý Leads
function renderAdminLeadsTable() {
  const tbody = document.getElementById("admin-leads-tbody");
  if (!tbody) return;
  const leads = AppStore.getLeads();

  if (leads.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 25px; color: var(--text-muted);">Chưa có khách hàng nào để lại thông tin.</td></tr>`;
    return;
  }

  tbody.innerHTML = leads.map(l => `
    <tr>
      <td>${l.createdAt}</td>
      <td><strong>${l.name}</strong></td>
      <td><a href="tel:${l.phone}" style="color: var(--gold-primary); font-weight: 600;">${l.phone}</a></td>
      <td>${l.demand || 'Tư vấn'}</td>
      <td>${l.propertyInterest || l.budget || ''}</td>
    </tr>
  `).join("");
}

window.resetAppDefaults = function() {
  if (confirm("Khôi phục toàn bộ danh sách nhà đất và nhân viên về dữ liệu gốc ban đầu?")) {
    AppStore.resetDefaults();
    renderAll();
    renderAdminPropertiesTable();
    renderAdminAgentsTable();
    showToast("Đã khôi phục dữ liệu mặc định!");
  }
};

// Helper: Toast notification
function showToast(msg) {
  let toast = document.getElementById("toast-box");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-box";
    toast.className = "toast-notice";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
}
