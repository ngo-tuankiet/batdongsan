import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu gieo dữ liệu mẫu (Seeding) vào SQLite...');

  // 1. Categories (Chỉ gồm 2 loại: Nhà Phố & Dự Án)
  const categories = [
    { id: 'nha-pho', name: 'Nhà Phố', description: 'Nhà mặt tiền, nhà phố kinh doanh, hẻm xe hơi trung tâm' },
    { id: 'du-an', name: 'Dự Án', description: 'Dự án căn hộ hạng sang, khu đô thị, phức hợp thương hiệu' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    });
  }

  // 2. Agents
  const agents = [
    {
      id: 'tuankiet',
      name: 'Ngô Tuấn Kiệt',
      role: 'Chuyên Viên Nhà Phố & Tòa Nhà Q.1',
      phone: '0901234567',
      phoneDisplay: '0901.234.567',
      zalo: 'https://zalo.me/0901234567',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
      exp: '6+ Năm',
      deals: '135+ Căn',
      slogan: 'Tận Tâm - Minh Bạch - Đồng Hành Cùng Quyết Định Đầu Tư Triệu Đô',
      bio: 'Hơn 6 năm chuyên sâu khu vực Bến Thành - Quận 1. Am hiểu quy hoạch lộ giới, pháp lý công chứng và đàm phán giá gốc.',
      tag: 'Top Producer',
    },
    {
      id: 'vantam',
      name: 'Nguyễn Văn Tâm',
      role: 'Giám Đốc Quỹ Căn Biệt Thự & Khách Sạn',
      phone: '0938888999',
      phoneDisplay: '0938.888.999',
      zalo: 'https://zalo.me/0938888999',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
      exp: '10+ Năm',
      deals: '250+ Căn',
      slogan: 'Bảo Mật Thông Tin - Quỹ Căn Độc Quyền Triệu Đô',
      bio: 'Trực tiếp phụ trách nguồn hàng kín từ các chủ sở hữu tập đoàn và ngân hàng phát mãi.',
      tag: 'Leader',
    },
    {
      id: 'minhduc',
      name: 'Trần Minh Đức',
      role: 'Chuyên Gia Căn Hộ Hạng Sang & Dự Án Cao Cấp',
      phone: '0918777666',
      phoneDisplay: '0918.777.666',
      zalo: 'https://zalo.me/0918777666',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      exp: '5+ Năm',
      deals: '90+ Căn',
      slogan: 'Nâng Tầm Trải Nghiệm Sống Hàng Hiệu Chuẩn Quốc Tế',
      bio: 'Chuyên sâu các dự án căn hộ thương hiệu Marriott, D1 Mension, The Grand Manhattan.',
      tag: 'Chuyên Sâu',
    },
  ];

  for (const ag of agents) {
    await prisma.agent.upsert({
      where: { id: ag.id },
      update: ag,
      create: ag,
    });
  }

  // 3. Properties (Phân chia thành Nhà Phố có Phường và Dự Án)
  const properties = [
    {
      id: 'BT-01',
      agentId: 'tuankiet',
      categoryId: 'nha-pho',
      ward: 'Phường Bến Thành',
      badge: 'Hàng Hiếm',
      title: 'Mặt Tiền Cách Mạng Tháng 8, P. Bến Thành, Q.1',
      location: 'Mặt tiền CMT8, P. Bến Thành, Q.1',
      price: '38.5 Tỷ',
      priceRaw: 38.5,
      area: '112 m²',
      dimensions: '4.8m x 23.5m',
      structure: '1 Hầm, 5 Tầng, Thang máy',
      bedrooms: 6,
      bathrooms: 6,
      direction: 'Đông Nam',
      legal: 'Sổ hồng hoàn công đầy đủ',
      rentIncome: 'Đang có HĐ thuê 85 Triệu/tháng',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      ]),
      mapUrl: 'https://maps.google.com/maps?q=Cách+Mạng+Tháng+8,+Phường+Bến+Thành,+Quận+1,+Hồ+Chí+Minh&t=&z=16&ie=UTF8&iwloc=&output=embed',
      description: 'Vị trí cực đắc địa cách Chợ Bến Thành 400m, tuyến đường kinh doanh sầm uất đa ngành nghề. Thang máy nhập khẩu, hợp đồng thuê dài hạn giữ tiền cực tốt.',
      features: JSON.stringify(['Thang máy', 'Hầm để xe', 'Mặt tiền kinh doanh', 'Hợp đồng thuê sẵn', 'Sổ hồng riêng']),
    },
    {
      id: 'BT-02',
      agentId: 'minhduc',
      categoryId: 'du-an',
      ward: null,
      badge: 'Dự Án Cao Cấp',
      title: 'Dự Án D1 Mension Somerset Bến Thành - Q.1',
      location: 'Võ Văn Kiệt - P. Cầu Kho (gần Bến Thành), Q.1',
      price: '14.8 Tỷ',
      priceRaw: 14.8,
      area: '103 m²',
      dimensions: 'Căn góc 3 view thoáng',
      structure: 'Tầng cao, 3 Phòng Ngủ',
      bedrooms: 3,
      bathrooms: 2,
      direction: 'Tây Nam',
      legal: 'Sổ hồng lâu dài',
      rentIncome: 'Giá thuê 3.200 USD/tháng',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      ]),
      mapUrl: 'https://maps.google.com/maps?q=D1+Mension,+Võ+Văn+Kiệt,+Cầu+Kho,+Quận+1,+Hồ+Chí+Minh&t=&z=16&ie=UTF8&iwloc=&output=embed',
      description: 'Căn hộ siêu sang thuộc dự án D1 Mension quản lý bởi Somerset. Full nội thất nhập khẩu Ý, hồ bơi nước ấm vô cực, phòng gym chuẩn 5 sao.',
      features: JSON.stringify(['Hồ bơi nước ấm tràn bờ', 'Quản lý 5 sao', 'Full nội thất nhập khẩu', 'Tặng slot ô tô']),
    },
    {
      id: 'BT-03',
      agentId: 'tuankiet',
      categoryId: 'nha-pho',
      ward: 'Phường Bến Thành',
      badge: 'Giá Ngộp',
      title: 'Nhà Phố Hẻm Xe Hơi Lý Tự Trọng, P. Bến Thành',
      location: 'Hẻm 6m Lý Tự Trọng, P. Bến Thành, Q.1',
      price: '23.5 Tỷ',
      priceRaw: 23.5,
      area: '78 m²',
      dimensions: '4.2m x 18.5m',
      structure: 'Trệt, 3 Lầu, Sân thượng',
      bedrooms: 4,
      bathrooms: 5,
      direction: 'Chính Nam',
      legal: 'Sổ hồng chính chủ, công chứng ngay',
      rentIncome: 'Khai thác Airbnb 45 Triệu/tháng',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80',
      ]),
      mapUrl: 'https://maps.google.com/maps?q=Lý+Tự+Trọng,+Phường+Bến+Thành,+Quận+1,+Hồ+Chí+Minh&t=&z=16&ie=UTF8&iwloc=&output=embed',
      description: 'Khu vực dân trí cao, hẻm nhựa 6m thông thoáng. Thích hợp vừa ở vừa làm văn phòng hoặc căn hộ dịch vụ cao cấp.',
      features: JSON.stringify(['Hẻm xe hơi tránh nhau', 'Gần chợ Bến Thành', 'Nội thất cao cấp', 'Công chứng trong ngày']),
    },
    {
      id: 'BT-04',
      agentId: 'tuankiet',
      categoryId: 'nha-pho',
      ward: 'Phường Tân Định',
      badge: 'Độc Quyền',
      title: 'Nhà Phố Mặt Tiền Hai Bà Trưng, P. Tân Định',
      location: 'Mặt tiền Hai Bà Trưng, P. Tân Định, Q.1',
      price: '62 Tỷ',
      priceRaw: 62,
      area: '165 m²',
      dimensions: '7.5m x 22m',
      structure: '1 Hầm, 7 Tầng, PCCC chuẩn',
      bedrooms: 10,
      bathrooms: 8,
      direction: 'Đông Bắc',
      legal: 'Sổ hồng hoàn công công trình cấp 2',
      rentIncome: 'Đang cho thẩm mỹ viện thuê 180 Triệu/tháng',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      ]),
      mapUrl: 'https://maps.google.com/maps?q=Hai+Bà+Trưng,+Phường+Tân+Định,+Quận+1,+Hồ+Chí+Minh&t=&z=16&ie=UTF8&iwloc=&output=embed',
      description: 'Bề ngang 7.5m cực đẹp hiếm có tại P. Tân Định. Hệ thống PCCC nghiệm thu đầy đủ, thang máy tốc độ cao, dòng tiền đều đặn.',
      features: JSON.stringify(['Mặt tiền 7.5m', 'PCCC nghiệm thu', 'Dòng tiền 180tr/tháng', 'Thang máy tốc độ cao']),
    },
    {
      id: 'BT-05',
      agentId: 'vantam',
      categoryId: 'nha-pho',
      ward: 'Phường Đa Kao',
      badge: 'Dòng Tiền Khủng',
      title: 'Nhà Phố Mặt Tiền Điện Biên Phủ, P. Đa Kao',
      location: 'Mặt tiền Điện Biên Phủ, P. Đa Kao, Q.1',
      price: '85 Tỷ',
      priceRaw: 85,
      area: '180 m²',
      dimensions: '8m x 22.5m',
      structure: '1 Hầm, 8 Tầng, 32 Phòng khép kín',
      bedrooms: 32,
      bathrooms: 35,
      direction: 'Đông Nam',
      legal: 'Sổ hồng riêng, giấy phép kinh doanh đầy đủ',
      rentIncome: 'Doanh thu khai thác 260 Triệu/tháng',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      ]),
      mapUrl: 'https://maps.google.com/maps?q=Điện+Biên+Phủ,+Phường+Đa+Kao,+Quận+1,+Hồ+Chí+Minh&t=&z=16&ie=UTF8&iwloc=&output=embed',
      description: 'Nhà phố kinh doanh khách sạn / căn hộ dịch vụ cao cấp P. Đa Kao. Đầy đủ thang máy, hệ thống PCCC tự động, bar tầng thượng.',
      features: JSON.stringify(['32 phòng cao cấp', 'Sky bar sân thượng', 'Giấy phép kinh doanh', 'Dòng tiền 260tr/tháng']),
    },
    {
      id: 'BT-06',
      agentId: 'minhduc',
      categoryId: 'du-an',
      ward: null,
      badge: 'Dự Án Hàng Hiệu',
      title: 'Dự Án Grand Marina Saigon Bến Nghé - Bến Thành',
      location: 'Số 2 Tôn Đức Thắng, P. Bến Nghé, Q.1',
      price: '52 Tỷ',
      priceRaw: 52,
      area: '240 m²',
      dimensions: 'Thông tầng trần 7m',
      structure: 'Duplex 2 tầng, 4 Phòng Ngủ',
      bedrooms: 4,
      bathrooms: 5,
      direction: 'Đông Nam',
      legal: 'HĐMB trực tiếp CĐT Masterise',
      rentIncome: 'Tiềm năng cho chuyên gia thuê 6.000 USD',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
      ]),
      mapUrl: 'https://maps.google.com/maps?q=Grand+Marina+Saigon,+Số+2+Tôn+Đức+Thắng,+Bến+Nghé,+Quận+1,+Hồ+Chí+Minh&t=&z=16&ie=UTF8&iwloc=&output=embed',
      description: 'Dự án bất động sản hàng hiệu Marriott lớn nhất thế giới. View trực diện sông Sài Gòn và bến du thuyền, dịch vụ quản gia cá nhân chuẩn Hoàng Gia.',
      features: JSON.stringify(['Bến du thuyền tư nhân', 'Dịch vụ Marriott 24/7', 'View sông trực diện', 'Trần cao 7m']),
    },
  ];

  for (const prop of properties) {
    await prisma.property.upsert({
      where: { id: prop.id },
      update: prop,
      create: prop,
    });
  }

  // Dọn dẹp danh mục cũ nếu còn
  await prisma.category.deleteMany({
    where: {
      id: { notIn: ['nha-pho', 'du-an'] },
    },
  });

  // 4. Admin User
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'admin123', // Mật khẩu quản trị
      role: 'admin',
    },
  });

  console.log('✅ Đã gieo dữ liệu thành công vào SQLite dev.db!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
