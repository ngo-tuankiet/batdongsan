export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const where: any = {};

  if (query.published === 'true') {
    where.isPublished = true;
  }

  if (query.category && query.category !== 'all') {
    where.category = String(query.category);
  }

  if (query.search) {
    where.OR = [
      { title: { contains: String(query.search) } },
      { excerpt: { contains: String(query.search) } },
    ];
  }

  const articles = await prisma.article.findMany({
    where,
    orderBy: [
      { isFeatured: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  return articles;
});
