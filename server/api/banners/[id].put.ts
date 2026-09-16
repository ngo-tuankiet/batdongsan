import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Thiếu ID banner.' });
  }

  const body = await readBody(event);

  try {
    const updated = await prisma.banner.upsert({
      where: { id },
      update: {
        name: body.name,
        title: body.title,
        badge: body.badge,
        badgeIcon: body.badgeIcon,
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl,
        btnText: body.btnText,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
        page: body.page || 'nha-pho',
      },
      create: {
        id,
        name: body.name || 'Banner mới',
        title: body.title || 'TIÊU BIỂU',
        badge: body.badge || 'TIÊU BIỂU',
        badgeIcon: body.badgeIcon || 'fa-crown',
        imageUrl: body.imageUrl || '/images/banner-poster-nhapho.jpg',
        linkUrl: body.linkUrl || '/#properties',
        btnText: body.btnText || 'Xem Chi Tiết',
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
        page: body.page || 'nha-pho',
      },
    });

    return {
      success: true,
      banner: updated,
      message: 'Cập nhật banner thành công!',
    };
  } catch (err: any) {
    console.error('Lỗi cập nhật banner:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Không thể cập nhật banner: ' + err.message,
    });
  }
});
