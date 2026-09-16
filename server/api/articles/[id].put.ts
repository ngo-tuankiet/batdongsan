export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Thiếu ID bài viết' });
  }

  const updated = await prisma.article.update({
    where: { id },
    data: {
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      image: body.image,
      category: body.category,
      author: body.author,
      readTime: body.readTime,
      isPublished: body.isPublished,
      isFeatured: body.isFeatured,
      source: body.source,
      sourceUrl: body.sourceUrl,
    },
  });

  return updated;
});
