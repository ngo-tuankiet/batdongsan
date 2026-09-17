const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function generate() {
  const baseUrl = 'https://benthanhland.com';
  const now = new Date().toISOString();

  const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/nha-pho', changefreq: 'daily', priority: '0.9' },
    { url: '/du-an', changefreq: 'daily', priority: '0.9' },
    { url: '/doi-ngu-chuyen-vien', changefreq: 'weekly', priority: '0.8' },
    { url: '/tin-tuc', changefreq: 'daily', priority: '0.8' },
    { url: '/ky-gui', changefreq: 'weekly', priority: '0.8' },
    { url: '/ve-chung-toi', changefreq: 'monthly', priority: '0.7' },
  ];

  const properties = await p.property.findMany({
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  });

  const articles = await p.article.findMany({
    where: { isPublished: true },
    select: { id: true, slug: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  });

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const page of staticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  for (const prop of properties) {
    const lastmod = prop.updatedAt ? new Date(prop.updatedAt).toISOString() : now;
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/bat-dong-san/${encodeURIComponent(prop.id)}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  for (const art of articles) {
    const lastmod = art.updatedAt ? new Date(art.updatedAt).toISOString() : now;
    const rawPath = art.slug ? `/tin-tuc/${art.slug}` : `/tin-tuc/${art.id}`;
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${encodeURI(rawPath)}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  const targetFile = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(targetFile, xml, 'utf8');
  console.log('Successfully generated static sitemap at', targetFile);
}

generate().finally(() => p.$disconnect());
