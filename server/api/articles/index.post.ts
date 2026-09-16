export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tiêu đề bài viết là bắt buộc',
    });
  }

  // Tạo slug từ tiêu đề
  const slug = body.slug || body.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-4);

  const newArticle = await prisma.article.create({
    data: {
      slug,
      title: body.title,
      excerpt: body.excerpt || '',
      content: body.content || '',
      image: body.image || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      category: body.category || 'Kinh nghiệm thực chiến',
      author: body.author || 'Ban Chuyên Gia Bến Thành',
      readTime: body.readTime || '5 phút đọc',
      isPublished: body.isPublished ?? true,
      isFeatured: body.isFeatured ?? false,
      source: body.source || 'BĐS Bến Thành',
      sourceUrl: body.sourceUrl || null,
    },
  });

  return newArticle;
});
