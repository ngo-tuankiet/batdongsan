const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('--- Bắt đầu thêm 5 nhân viên và 6 BĐS / Dự án mới ---');

  // 1. Thêm 5 nhân viên / chuyên viên mới
  const agents = [
    {
      id: 'agent-tran-ngoc-anh',
      name: 'Trần Ngọc Ánh',
      role: 'Trưởng Ban Tư Vấn Căn Hộ Cao Cấp & Penthouse',
      phone: '0912131329',
      phoneDisplay: '0912.131.329',
      zalo: '0912131329',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      exp: '8 Năm',
      deals: '65+ Giao Dịch',
      slogan: 'Tận tâm tư vấn giải pháp an cư & đầu tư sinh lời vượt trội',
      bio: 'Chuyên gia am hiểu sâu phân khúc căn hộ hạng sang, Penthouse trung tâm Sài Gòn và đại đô thị sinh thái.',
      tag: 'Trưởng Phòng',
    },
    {
      id: 'agent-le-hoang-nam',
      name: 'Lê Hoàng Nam',
      role: 'Chuyên Viên Phân Phối Đại Dự Án Vinhomes',
      phone: '0912131329',
      phoneDisplay: '0912.131.329',
      zalo: '0912131329',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
      exp: '6 Năm',
      deals: '50+ Giao Dịch',
      slogan: 'Nắm giữ quỹ căn vị trí hoa hậu tại Vinhomes Cần Giờ & Hóc Môn',
      bio: 'Chuyên sâu phân tích tiềm năng tăng giá đón sóng hạ tầng cảng biển và quy hoạch đô thị.',
      tag: 'Chuyên Viên VIP',
    },
    {
      id: 'agent-nguyen-thanh-tam',
      name: 'Nguyễn Thanh Tâm',
      role: 'Chuyên Gia Nhà Phố Mặt Tiền & Kinh Doanh Quận 11',
      phone: '0912131329',
      phoneDisplay: '0912.131.329',
      zalo: '0912131329',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      exp: '9 Năm',
      deals: '80+ Giao Dịch',
      slogan: 'Định giá chính xác - Pháp lý sổ hồng sang tên trong 24h',
      bio: 'Thổ địa nhà phố mặt tiền các tuyến đường Lãnh Binh Thăng, Hòa Bình, 3 Tháng 2, Lê Đại Hành - Quận 11.',
      tag: 'Thổ Địa Q.11',
    },
    {
      id: 'agent-pham-minh-duc',
      name: 'Phạm Minh Đức',
      role: 'Chuyên Viên Đầu Tư Biệt Thự & Shophouse Thương Mại',
      phone: '0912131329',
      phoneDisplay: '0912.131.329',
      zalo: '0912131329',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
      exp: '7 Năm',
      deals: '45+ Giao Dịch',
      slogan: 'Bảo mật thông tin gia chủ - Tối ưu hóa dòng tiền cho thuê',
      bio: 'Kết nối trực tiếp quỹ căn ngoại giao từ các chủ đầu tư danh tiếng.',
      tag: 'Chuyên Gia Đầu Tư',
    },
    {
      id: 'agent-vo-thi-bich-ngoc',
      name: 'Võ Thị Bích Ngọc',
      role: 'Chuyên Viên Tư Vấn Pháp Lý & Thẩm Định Tài Sản',
      phone: '0912131329',
      phoneDisplay: '0912.131.329',
      zalo: '0912131329',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
      exp: '10 Năm',
      deals: '110+ Giao Dịch',
      slogan: 'Kiểm tra quy hoạch lộ giới chuẩn 100% trước khi xuống cọc',
      bio: 'Tư vấn thủ tục thừa kế, hoàn công nhà phố khó và chuyển đổi mục đích sử dụng đất.',
      tag: 'Luật Sư & Thẩm Định',
    },
  ];

  for (const a of agents) {
    await prisma.agent.upsert({
      where: { id: a.id },
      update: a,
      create: a,
    });
    console.log(`+ Đã thêm/cập nhật nhân viên: ${a.name} (${a.tag})`);
  }

  // 2. Thêm 6 căn hộ, nhà phố & dự án mới
  const properties = [
    {
      id: 'Q11-LBT-01',
      categoryId: 'nha-pho',
      province: 'TP. Hồ Chí Minh',
      ward: 'Phường Bình Thới, Quận 11',
      title: 'Nhà Phố Mặt Tiền Kinh Doanh Sầm Uất Đường Lãnh Binh Thăng - Quận 11',
      location: 'Mặt tiền Lãnh Binh Thăng, Phường Bình Thới, Quận 11, TP.HCM',
      price: '32.5 Tỷ',
      priceRaw: 32.5,
      area: '140 m²',
      dimensions: '6m x 23.5m',
      structure: '1 Trệt 4 Lầu Sân Thượng, Có Thang Máy Nhập Khẩu',
      bedrooms: 6,
      bathrooms: 7,
      direction: 'Đông Nam',
      legal: 'Sổ hồng hoàn công đầy đủ, công chứng ngay',
      rentIncome: '85 Triệu/tháng',
      badge: 'Vị Trí Vàng Q11',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
      ]),
      agentId: 'agent-nguyen-thanh-tam',
      description: 'Tọa lạc ngay cung đường thương mại sầm uất bậc nhất Quận 11, vỉa hè 5m rộng rãi thuận tiện kinh doanh thẩm mỹ viện, phòng khám, ngân hàng hoặc cho thuê thu nhập dòng tiền cao.',
    },
    {
      id: 'Q11-3T2-02',
      categoryId: 'nha-pho',
      province: 'TP. Hồ Chí Minh',
      ward: 'Phường 11, Quận 11',
      title: 'Tòa Nhà Góc 2 Mặt Tiền Đường 3 Tháng 2 - Vòng Xoay Cây Gõ Quận 11',
      location: 'Đường 3 Tháng 2, Phường 11, Quận 11, TP.HCM',
      price: '48 Tỷ',
      priceRaw: 48,
      area: '210 m²',
      dimensions: '8.5m x 25m',
      structure: '1 Hầm 6 Lầu Thang Máy, Hệ Thống PCCC Chuẩn Tòa Nhà',
      bedrooms: 10,
      bathrooms: 12,
      direction: 'Nam',
      legal: 'Sổ hồng chính chủ, sẵn sàng giao dịch',
      rentIncome: '150 Triệu/tháng',
      badge: 'Góc 2 Mặt Tiền',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
      ]),
      agentId: 'agent-nguyen-thanh-tam',
      description: 'Vị trí kim cương ngay tuyến giao thương huyết mạch nối Quận 10 - Quận 11 - Quận 5. Đang cho chuỗi nha khoa và showroom thời trang thuê dài hạn.',
    },
    {
      id: 'CH-FLE-01',
      categoryId: 'nha-pho',
      province: 'TP. Hồ Chí Minh',
      ward: 'Phường 15, Quận 11',
      title: 'Căn Hộ Duplex Cao Cấp The Flemington Lê Đại Hành - View Trường Đua Phú Thọ',
      location: '182 Lê Đại Hành, Phường 15, Quận 11, TP.HCM',
      price: '16.8 Tỷ',
      priceRaw: 16.8,
      area: '218 m²',
      dimensions: 'Thông tầng Duplex',
      structure: 'Duplex 2 Tầng Siêu Sang, Full Nội Thất Châu Âu Tân Cổ Điển',
      bedrooms: 4,
      bathrooms: 4,
      direction: 'Đông',
      legal: 'Sổ hồng vĩnh viễn',
      rentIncome: '45 Triệu/tháng',
      badge: 'Duplex Siêu Sang',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80'
      ]),
      agentId: 'agent-tran-ngoc-anh',
      description: 'Căn hộ Penthouse Duplex đỉnh cao tại tòa tháp phong cách hoàng gia The Flemington. Tầm view panorama 360 độ ngắm trọn trường đua Phú Thọ và trung tâm Sài Gòn.',
    },
    {
      id: 'CH-GMR-02',
      categoryId: 'nha-pho',
      province: 'TP. Hồ Chí Minh',
      ward: 'Phường Bến Nghé, Quận 1',
      title: 'Căn Hộ Hàng Hiệu Grand Marina Saigon Marriott - Trực Diện Bến Du Thuyền Ba Son',
      location: 'Số 2 Tôn Đức Thắng, Phường Bến Nghé, Quận 1, TP.HCM',
      price: '28.5 Tỷ',
      priceRaw: 28.5,
      area: '110 m²',
      dimensions: 'Căn góc 2 Phòng Ngủ VIP',
      structure: 'Nội Thất Tiêu Chuẩn 5 Sao Marriott Quốc Tế',
      bedrooms: 2,
      bathrooms: 2,
      direction: 'Đông Nam Trực Diện Sông Sài Gòn',
      legal: 'Hợp đồng mua bán trực tiếp CĐT Masterise Homes',
      rentIncome: '70 Triệu/tháng',
      badge: 'Hàng Hiệu Marriott',
      image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80'
      ]),
      agentId: 'agent-tran-ngoc-anh',
      description: 'Căn hộ Branded Residences mang thương hiệu Marriott đầu tiên tại Việt Nam. Dịch vụ quản gia cao cấp, bến du thuyền riêng, hồ bơi vô cực ngắm trọn sông Sài Gòn.',
    },
    {
      id: 'DA-VH-CANGIO',
      categoryId: 'du-an',
      province: 'TP. Hồ Chí Minh',
      ward: 'Xã Long Hòa, Huyện Cần Giờ',
      title: 'Siêu Dự Án Đại Đô Thị Lấn Biển Vinhomes Green Paradise Cần Giờ',
      location: 'Xã Long Hòa & Thị trấn Cần Thạnh, Huyện Cần Giờ, TP.HCM',
      price: '18.5 Tỷ (Dự Kiến)',
      priceRaw: 18.5,
      area: '2,870 ha',
      dimensions: 'Biệt thự đơn lập, song lập, shophouse biển',
      structure: 'Đại Đô Thị Sinh Thái Đẳng Cấp Quốc Tế',
      bedrooms: 4,
      bathrooms: 5,
      direction: 'Hướng Biển',
      legal: 'Quy hoạch 1/500, Phê duyệt Thủ Tướng',
      rentIncome: 'Tiềm năng tăng giá 300% đón Cầu Cần Giờ & Cảng Quốc Tế',
      badge: 'Siêu Dự Án Quốc Tế',
      image: '/images/hero-vinhome-cangio.jpg',
      images: JSON.stringify([
        '/images/hero-vinhome-cangio.jpg',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
      ]),
      agentId: 'agent-le-hoang-nam',
      description: 'Siêu dự án lấn biển quy mô 2.870 ha đẳng cấp số 1 Đông Nam Á với tháp biểu tượng 108 tầng, sân golf quốc tế, vịnh biển ngọc thiên đường và quần thể biệt thự nghỉ dưỡng xa xỉ.',
    },
    {
      id: 'DA-VH-HOCMON',
      categoryId: 'du-an',
      province: 'TP. Hồ Chí Minh',
      ward: 'Xã Tân Thới Nhì, Huyện Hóc Môn',
      title: 'Đại Đô Thị Sinh Thái Thông Minh Vinhomes Hóc Môn (Vinhomes Green Park)',
      location: 'Tân Thới Nhì, Huyện Hóc Môn, TP.HCM (Kết nối Vành Đai 3)',
      price: '8.2 Tỷ',
      priceRaw: 8.2,
      area: '924 ha',
      dimensions: 'Liền kề 5x20m, Biệt thự vườn 10x20m',
      structure: 'Khu Đô Thị Sinh Thái Thông Minh Đa Tiện Ích',
      bedrooms: 4,
      bathrooms: 4,
      direction: 'Đông Nam',
      legal: 'Sổ hồng sở hữu lâu dài',
      rentIncome: 'Đón sóng đường Vành Đai 3 và Cao tốc TP.HCM - Mộc Bài',
      badge: 'Đón Đầu Vành Đai 3',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
      ]),
      agentId: 'agent-le-hoang-nam',
      description: 'Quần thể đô thị sinh thái thông minh kiểu mẫu phía Tây Bắc TP.HCM quy mô hơn 900 ha với công viên hồ trung tâm 36 ha, hệ thống bệnh viện Vinmec, trường liên cấp Vinschool và Vincom Mega Mall.',
    },
  ];

  for (const p of properties) {
    await prisma.property.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    });
    console.log(`+ Đã thêm/cập nhật BĐS: ${p.title} (${p.price})`);
  }

  // 3. Thêm/Cập nhật Banners
  const banners = [
    {
      id: 'home-banner-1',
      name: 'Banner Trang Chủ 1 - Vinhomes Cần Giờ',
      title: 'SIÊU DỰ ÁN CẦN GIỜ',
      badge: 'HOT NHẤT 2026',
      badgeIcon: 'fa-fire-flame-curved',
      imageUrl: '/images/hero-vinhome-cangio.jpg',
      linkUrl: '/du-an',
      btnText: 'Xem Dự Án',
      isActive: true,
      page: 'home',
    },
    {
      id: 'home-banner-2',
      name: 'Banner Trang Chủ 2 - Grand Marina Ba Son',
      title: 'GRAND MARINA SAIGON',
      badge: 'CĂN HỘ 5 SAO',
      badgeIcon: 'fa-gem',
      imageUrl: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/nha-pho',
      btnText: 'Xem Quỹ Căn',
      isActive: true,
      page: 'home',
    },
    {
      id: 'home-banner-3',
      name: 'Banner Trang Chủ 3 - Vinhomes Hóc Môn',
      title: 'VINHOMES HÓC MÔN',
      badge: 'ĐÓN VÀNH ĐAI 3',
      badgeIcon: 'fa-city',
      imageUrl: '/images/hero-vinhome-hocmon.jpg',
      linkUrl: '/du-an',
      btnText: 'Xem Chi Tiết',
      isActive: true,
      page: 'home',
    },
    {
      id: 'home-banner-4',
      name: 'Banner Trang Chủ 4 - Nhà Phố Q11',
      title: 'NHÀ PHỐ MẶT TIỀN Q11',
      badge: 'SỔ HỒNG TRAO TAY',
      badgeIcon: 'fa-shield-halved',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/nha-pho',
      btnText: 'Xem Nhà Ngay',
      isActive: true,
      page: 'home',
    },
    {
      id: 'nha-pho',
      name: 'Banner Nhà Phố Tiêu Biểu',
      title: 'NHÀ PHỐ TIÊU BIỂU',
      badge: 'TIÊU BIỂU',
      badgeIcon: 'fa-crown',
      imageUrl: '/images/banner-poster-nhapho.jpg',
      linkUrl: '/#properties',
      btnText: 'Xem Quỹ Căn',
      isActive: true,
      page: 'nha-pho',
    },
    {
      id: 'du-an',
      name: 'Banner Dự Án Hot',
      title: 'DỰ ÁN NỔI BẬT',
      badge: 'HOT',
      badgeIcon: 'fa-fire',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      linkUrl: '/#projects',
      btnText: 'Khám Phá Ngay',
      isActive: true,
      page: 'du-an',
    },
  ];

  for (const b of banners) {
    await prisma.banner.upsert({
      where: { id: b.id },
      update: b,
      create: b,
    });
    console.log(`+ Đã thêm/cập nhật Banner: ${b.name} (${b.page})`);
  }

  const totalAgents = await prisma.agent.count();
  const totalProps = await prisma.property.count();
  const totalBanners = await prisma.banner.count();
  console.log(`\n===> Hoàn tất: Tổng ${totalAgents} nhân viên, ${totalProps} BĐS/dự án, ${totalBanners} banners trong hệ thống!`);
}

seed().finally(() => prisma.$disconnect());
