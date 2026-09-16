export default defineEventHandler(async (event) => {
  const param = getRouterParam(event, 'id');

  if (!param) {
    throw createError({ statusCode: 400, statusMessage: 'Thiếu ID bài viết' });
  }

  const decoded = decodeURIComponent(param);
  console.log('API DELETE Article request for ID/Slug:', decoded);

  try {
    const res = await prisma.article.deleteMany({
      where: {
        OR: [
          { id: decoded },
          { slug: decoded },
        ],
      },
    });

    console.log('API DELETE Article success, deleted count:', res.count);
    return { success: true, count: res.count, message: 'Đã xóa bài viết thành công' };
  } catch (err: any) {
    console.error('API DELETE Article error:', err);
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Lỗi khi xóa bài viết trong cơ sở dữ liệu',
    });
  }
});
