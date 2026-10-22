import { requireAdminAuth } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  requireAdminAuth(event);

  const param = getRouterParam(event, 'id');

  if (!param) {
    throw createError({ statusCode: 400, statusMessage: 'Thiếu ID bài viết' });
  }

  const decoded = decodeURIComponent(param);

  try {
    const res = await prisma.article.deleteMany({
      where: {
        OR: [
          { id: decoded },
          { slug: decoded },
        ],
      },
    });

    return { success: true, count: res.count, message: 'Đã xóa bài viết thành công' };
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Lỗi khi xóa bài viết trong cơ sở dữ liệu',
    });
  }
});
