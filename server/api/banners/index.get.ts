import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = query.page as string | undefined;

  try {
    // Check if banners table is empty or missing home banners, auto-seed defaults if needed
    const count = await prisma.banner.count();
    if (count === 0) {
      await prisma.banner.createMany({
        data: [
          {
            id: 'home-hocmon',
            name: 'Banner Trang Chủ - Vinhomes Hóc Môn',
            title: 'VINHOMES HÓC MÔN',
            badge: 'MỞ BÁN F1',
            badgeIcon: 'fa-tree-city',
            imageUrl: '/images/hero-vinhome-hocmon.jpg',
            linkUrl: '/du-an',
            btnText: 'Dự Án Hóc Môn',
            isActive: true,
            page: 'home',
          },
          {
            id: 'home-cangio',
            name: 'Banner Trang Chủ - Vinhomes Cần Giờ',
            title: 'VINHOMES CẦN GIỜ',
            badge: 'SIÊU DỰ ÁN',
            badgeIcon: 'fa-water',
            imageUrl: '/images/hero-vinhome-cangio.jpg',
            linkUrl: '/du-an',
            btnText: 'Dự Án Cần Giờ',
            isActive: true,
            page: 'home',
          },
          {
            id: 'home-nhapho',
            name: 'Banner Trang Chủ - Nhà Phố Q.11',
            title: 'NHÀ PHỐ QUẬN 11',
            badge: 'ĐỘC QUYỀN',
            badgeIcon: 'fa-crown',
            imageUrl: '/images/banner-poster-nhapho.jpg',
            linkUrl: '/nha-pho',
            btnText: 'Giỏ Hàng Q.11',
            isActive: true,
            page: 'home',
          },
          {
            id: 'home-kygui',
            name: 'Banner Trang Chủ - Ký Gửi Nhà Đất',
            title: 'KÝ GỬI NHÀ ĐẤT',
            badge: 'THANH KHOẢN VIP',
            badgeIcon: 'fa-handshake',
            imageUrl: '/images/banner-du-an.jpg',
            linkUrl: '/ky-gui',
            btnText: 'Ký Gửi BĐS VIP',
            isActive: true,
            page: 'home',
          },
          {
            id: 'nha-pho',
            name: 'Banner Nhà Phố Trung Tâm',
            title: 'NHÀ PHỐ QUẬN 11',
            badge: 'TIÊU BIỂU',
            badgeIcon: 'fa-crown',
            imageUrl: '/images/banner-poster-nhapho.jpg',
            linkUrl: '/nha-pho#properties-list-top',
            btnText: 'Xem Quỹ Căn',
            isActive: true,
            page: 'nha-pho',
          },
          {
            id: 'du-an',
            name: 'Banner Dự Án Cao Cấp',
            title: 'DỰ ÁN TIÊU BIỂU',
            badge: 'HÀNG HIỆU',
            badgeIcon: 'fa-gem',
            imageUrl: '/images/banner-poster-vertical.png',
            linkUrl: '/du-an#properties',
            btnText: 'Xem Dự Án Hot',
            isActive: true,
            page: 'du-an',
          },
        ],
      });
    }

    if (page) {
      return await prisma.banner.findMany({
        where: {
          OR: [
            { page },
            { page: 'all' },
          ],
        },
        orderBy: { createdAt: 'asc' },
      });
    }

    return await prisma.banner.findMany({
      orderBy: { createdAt: 'asc' },
    });
  } catch (err: any) {
    console.error('Error fetching banners:', err);
    // Fallback if DB is migrating
    return [
      {
        id: 'nha-pho',
        name: 'Banner Nhà Phố Quận 11',
        title: 'NHÀ PHỐ QUẬN 11',
        badge: 'TIÊU BIỂU',
        badgeIcon: 'fa-crown',
        imageUrl: '/images/banner-poster-nhapho.jpg',
        linkUrl: '/nha-pho#properties-list-top',
        btnText: 'Xem Quỹ Căn',
        isActive: true,
        page: 'nha-pho',
      },
      {
        id: 'du-an',
        name: 'Banner Dự Án Cao Cấp',
        title: 'DỰ ÁN TIÊU BIỂU',
        badge: 'HÀNG HIỆU',
        badgeIcon: 'fa-gem',
        imageUrl: '/images/banner-poster-vertical.png',
        linkUrl: '/du-an#properties',
        btnText: 'Xem Dự Án Hot',
        isActive: true,
        page: 'du-an',
      },
    ];
  }
});
