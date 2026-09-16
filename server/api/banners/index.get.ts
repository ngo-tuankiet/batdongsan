import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = query.page as string | undefined;

  try {
    // Check if banners table is empty, auto-seed defaults if needed
    const count = await prisma.banner.count();
    if (count === 0) {
      await prisma.banner.createMany({
        data: [
          {
            id: 'nha-pho',
            name: 'Banner Nhà Phố Trung Tâm',
            title: 'NHÀ PHỐ QUẬN 1',
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
        name: 'Banner Nhà Phố Trung Tâm',
        title: 'NHÀ PHỐ QUẬN 1',
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
