export default defineEventHandler(async (event) => {
  const param = getRouterParam(event, 'id');
  if (!param) {
    throw createError({ statusCode: 400, statusMessage: 'Thiếu ID bài viết' });
  }

  // Tìm theo id hoặc slug
  let article = await prisma.article.findFirst({
    where: {
      OR: [
        { id: param },
        { slug: param },
      ],
    },
  });

  if (!article) {
    throw createError({ statusCode: 404, statusMessage: 'Không tìm thấy bài viết' });
  }

  // Tăng lượt xem (increment views)
  try {
    article = await prisma.article.update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
    });
  } catch (e) {
    // ignore
  }

  return article;
});
