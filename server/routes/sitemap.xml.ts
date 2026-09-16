import { prisma } from '../utils/prisma';

export default defineEventHandler(async (event) => {
  const baseUrl = 'https://benthanhland.com';

  const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/nha-pho', changefreq: 'daily', priority: '0.9' },
    { url: '/du-an', changefreq: 'daily', priority: '0.9' },
    { url: '/tin-tuc', changefreq: 'daily', priority: '0.8' },
    { url: '/ky-gui', changefreq: 'weekly', priority: '0.8' },
    { url: '/ve-chung-toi', changefreq: 'monthly', priority: '0.7' },
  ];

  let properties: any[] = [];
  let articles: any[] = [];

  try {
    properties = await prisma.property.findMany({
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    });
  } catch (err) {
    console.error('Sitemap: Failed to load properties', err);
  }

  try {
    articles = await prisma.article.findMany({
      where: { isPublished: true },
      select: { id: true, slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    });
  } catch (err) {
    console.error('Sitemap: Failed to load articles', err);
  }

  const now = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static pages
  for (const page of staticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Dynamic properties
  for (const p of properties) {
    const lastmod = p.updatedAt ? new Date(p.updatedAt).toISOString() : now;
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/bat-dong-san/${p.id}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  // Dynamic articles
  for (const a of articles) {
    const lastmod = a.updatedAt ? new Date(a.updatedAt).toISOString() : now;
    const path = a.slug ? `/tin-tuc/${a.slug}` : `/tin-tuc/${a.id}`;
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${path}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600');

  return xml;
});
