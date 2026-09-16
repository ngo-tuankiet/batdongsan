import fs from 'node:fs';
import path from 'node:path';

const mimeMap: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  if (!slug) {
    throw createError({ statusCode: 404, statusMessage: 'File not found' });
  }

  // Prevent directory traversal
  const safeSlug = path.normalize(slug).replace(/^(\.\.[\/\\])+/, '');
  
  // Try public/uploads in process.cwd() or /var/www/batdongsan/public/uploads
  let filePath = path.resolve(process.cwd(), 'public/uploads', safeSlug);
  if (!fs.existsSync(filePath)) {
    // Also check absolute path if running on VPS
    const vpsPath = path.join('/var/www/batdongsan/public/uploads', safeSlug);
    if (fs.existsSync(vpsPath)) {
      filePath = vpsPath;
    } else {
      throw createError({ statusCode: 404, statusMessage: 'Image not found' });
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeType = mimeMap[ext] || 'application/octet-stream';

  setHeader(event, 'Content-Type', mimeType);
  setHeader(event, 'Cache-Control', 'public, max-age=2592000, immutable');

  return fs.readFileSync(filePath);
});
