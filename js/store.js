/**
 * BẤT ĐỘNG SẢN BẾN THÀNH - DATA STORE & STATE MANAGEMENT
 * Hỗ trợ lưu trữ bền vững trong LocalStorage, khôi phục mặc định và CRUD thời gian thực
 */

const SEED_AGENTS = [
  {
    id: "tuankiet",
    name: "Ngô Tuấn Kiệt",
    role: "Chuyên Viên Nhà Phố & Tòa Nhà Q.1",
    phone: "0901234567",
    phone_display: "0901.234.567",
    zalo: "https://zalo.me/0901234567",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    exp: "6+ Năm",
    deals: "135+ Căn",
    slogan: "Tận Tâm - Minh Bạch - Đồng Hành Cùng Quyết Định Đầu Tư Triệu Đô",
    bio: "Hơn 6 năm chuyên sâu khu vực Bến Thành - Quận 1. Am hiểu quy hoạch lộ giới, pháp lý công chứng và đàm phán giá gốc.",
    tag: "Top Producer"
  },
  {
    id: "vantam",
    name: "Nguyễn Văn Tâm",
    role: "Giám Đốc Quỹ Căn Biệt Thự & Khách Sạn",
    phone: "0938888999",
    phone_display: "0938.888.999",
    zalo: "https://zalo.me/0938888999",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    exp: "10+ Năm",
    deals: "250+ Căn",
    slogan: "Bảo Mật Thông Tin - Quỹ Căn Độc Quyền Triệu Đô",
    bio: "Trực tiếp phụ trách nguồn hàng kín từ các chủ sở hữu tập đoàn và ngân hàng phát mãi.",
    tag: "Leader"
  },
  {
    id: "minhduc",
    name: "Trần Minh Đức",
    role: "Chuyên Gia Căn Hộ Hạng Sang & Penthouse",
    phone: "0918777666",
    phone_display: "0918.777.666",
    zalo: "https://zalo.me/0918777666",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    exp: "5+ Năm",
    deals: "90+ Căn",
    slogan: "Nâng Tầm Trải Nghiệm Sống Hàng Hiệu Chuẩn Quốc Tế",
    bio: "Chuyên sâu các dự án căn hộ thương hiệu Marriott, D1 Mension, The Grand Manhattan.",
    tag: "Chuyên Sâu"
  }
];

const SEED_PROPERTIES = [
  {
    id: "BT-01",
    agentId: "tuankiet",
    category: "nha-pho",
    badge: "Hàng Hiếm",
    title: "Mặt Tiền Cách Mạng Tháng 8, P. Bến Thành, Q.1",
    location: "Mặt tiền CMT8, P. Bến Thành, Q.1",
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
    description: "Vị trí cực đắc địa cách Chợ Bến Thành 400m, tuyến đường kinh doanh sầm uất đa ngành nghề. Thang máy nhập khẩu, hợp đồng thuê dài hạn giữ tiền cực tốt.",
    features: ["Thang máy", "Hầm để xe", "Mặt tiền kinh doanh", "Hợp đồng thuê sẵn", "Sổ hồng riêng"]
  },
  {
    id: "BT-02",
    agentId: "minhduc",
    category: "can-ho",
    badge: "Căn Góc View Đẹp",
    title: "Căn Hộ D1 Mension Somerset Bến Thành - Q.1",
    location: "Võ Văn Kiệt - P. Cầu Kho (gần Bến Thành)",
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
    description: "Căn hộ siêu sang quản lý bởi Somerset. Full nội thất nhập khẩu Ý, hồ bơi nước ấm vô cực, phòng gym chuẩn 5 sao.",
    features: ["Hồ bơi nước ấm tràn bờ", "Quản lý 5 sao", "Full nội thất nhập khẩu", "Tặng slot ô tô"]
  },
  {
    id: "BT-03",
    agentId: "tuankiet",
    category: "nha-pho",
    badge: "Giá Ngộp",
    title: "Nhà Phố Hẻm Xe Hơi Lý Tự Trọng, P. Bến Thành",
    location: "Hẻm 6m Lý Tự Trọng, P. Bến Thành, Q.1",
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
    description: "Khu vực dân trí cao, hẻm nhựa 6m thông thoáng. Thích hợp vừa ở vừa làm văn phòng hoặc căn hộ dịch vụ cao cấp.",
    features: ["Hẻm xe hơi tránh nhau", "Gần chợ Bến Thành", "Nội thất cao cấp", "Công chứng trong ngày"]
  },
  {
    id: "BT-04",
    agentId: "tuankiet",
    category: "mat-bang",
    badge: "Độc Quyền",
    title: "Tòa Nhà Văn Phòng Mặt Tiền Nguyễn Trãi, P. Bến Thành",
    location: "Mặt tiền Nguyễn Trãi, P. Bến Thành, Q.1",
    price: "62 Tỷ",
    price_raw: 62,
    area: "165 m²",
    dimensions: "7.5m x 22m",
    structure: "1 Hầm, 7 Tầng, PCCC chuẩn",
    bedrooms: 10,
    bathrooms: 8,
    direction: "Đông Bắc",
    legal: "Sổ hồng hoàn công công trình cấp 2",
    rent_income: "Đang cho thẩm mỹ viện thuê 180 Triệu/tháng",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    description: "Bề ngang 7.5m cực đẹp hiếm có tại Bến Thành. Hệ thống PCCC nghiệm thu đầy đủ, thang máy tốc độ cao, dòng tiền đều đặn.",
    features: ["Mặt tiền 7.5m", "PCCC nghiệm thu", "Dòng tiền 180tr/tháng", "Thang máy tốc độ cao"]
  },
  {
    id: "BT-05",
    agentId: "vantam",
    category: "khach-san",
    badge: "Dòng Tiền Khủng",
    title: "Khách Sạn 3 Sao Phố Tây Bùi Viện - Bến Thành",
    location: "Khu Bùi Viện - P. Bến Thành, Q.1",
    price: "85 Tỷ",
    price_raw: 85,
    area: "180 m²",
    dimensions: "8m x 22.5m",
    structure: "1 Hầm, 8 Tầng, 32 Phòng khép kín",
    bedrooms: 32,
    bathrooms: 35,
    direction: "Đông Nam",
    legal: "Sổ hồng riêng, giấy phép kinh doanh KS đầy đủ",
    rent_income: "Doanh thu khai thác 260 Triệu/tháng",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    description: "Khách sạn hoạt động ổn định, công suất phòng luôn đạt trên 85%. Đầy đủ thang máy, hệ thống PCCC tự động, bar tầng thượng.",
    features: ["32 phòng cao cấp", "Sky bar sân thượng", "Giấy phép khách sạn", "Dòng tiền 260tr/tháng"]
  },
  {
    id: "BT-06",
    agentId: "minhduc",
    category: "can-ho",
    badge: "Penthouse",
    title: "Penthouse Duplex Grand Marina Saigon Bến Nghé - Bến Thành",
    location: "Bến Nghé - Bến Thành, Q.1",
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
    description: "Bất động sản hàng hiệu Marriott. View trực diện sông Sài Gòn và bến du thuyền, dịch vụ quản gia cá nhân chuẩn Hoàng Gia.",
    features: ["Bến du thuyền tư nhân", "Dịch vụ Marriott 24/7", "View sông trực diện", "Trần cao 7m"]
  }
];

const AppStore = {
  // --- PROPERTIES ---
  getProperties() {
    try {
      const data = localStorage.getItem("bds_properties");
      if (data) return JSON.parse(data);
    } catch (e) {}
    this.saveProperties(SEED_PROPERTIES);
    return SEED_PROPERTIES;
  },

  saveProperties(list) {
    localStorage.setItem("bds_properties", JSON.stringify(list));
  },

  addOrUpdateProperty(prop) {
    const list = this.getProperties();
    const index = list.findIndex(p => p.id === prop.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...prop };
    } else {
      list.unshift(prop);
    }
    this.saveProperties(list);
    return list;
  },

  deleteProperty(id) {
    const list = this.getProperties().filter(p => p.id !== id);
    this.saveProperties(list);
    return list;
  },

  // --- AGENTS ---
  getAgents() {
    try {
      const data = localStorage.getItem("bds_agents");
      if (data) return JSON.parse(data);
    } catch (e) {}
    this.saveAgents(SEED_AGENTS);
    return SEED_AGENTS;
  },

  saveAgents(list) {
    localStorage.setItem("bds_agents", JSON.stringify(list));
  },

  addOrUpdateAgent(agent) {
    const list = this.getAgents();
    const index = list.findIndex(a => a.id === agent.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...agent };
    } else {
      list.push(agent);
    }
    this.saveAgents(list);
    return list;
  },

  deleteAgent(id) {
    const list = this.getAgents().filter(a => a.id !== id);
    this.saveAgents(list);
    return list;
  },

  // --- LEADS ---
  getLeads() {
    try {
      return JSON.parse(localStorage.getItem("bds_leads") || "[]");
    } catch (e) {
      return [];
    }
  },

  addLead(lead) {
    const leads = this.getLeads();
    leads.unshift({ ...lead, id: Date.now(), createdAt: new Date().toLocaleString('vi-VN') });
    localStorage.setItem("bds_leads", JSON.stringify(leads));
    return leads;
  },

  // --- THEME ---
  getTheme() {
    return localStorage.getItem("bds_theme") || "dark";
  },

  setTheme(theme) {
    localStorage.setItem("bds_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  },

  toggleTheme() {
    const current = this.getTheme();
    const next = current === "dark" ? "light" : "dark";
    this.setTheme(next);
    return next;
  },

  // --- RESET TO SEED ---
  resetDefaults() {
    this.saveProperties(SEED_PROPERTIES);
    this.saveAgents(SEED_AGENTS);
  }
};
