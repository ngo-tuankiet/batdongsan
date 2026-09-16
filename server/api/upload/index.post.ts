import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event);
  if (!files || files.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Vui lòng chọn file ảnh để tải lên.',
    });
  }

  const uploadDir = path.resolve(process.cwd(), 'public/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const uploadedUrls: string[] = [];

  for (const file of files) {
    if (!file.filename || !file.data) continue;

    // Sanitize filename & create unique timestamped name
    const ext = path.extname(file.filename) || '.jpg';
    const cleanName = path.basename(file.filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const newFilename = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}_${cleanName}${ext}`;
    const filePath = path.join(uploadDir, newFilename);

    fs.writeFileSync(filePath, file.data);
    uploadedUrls.push(`/uploads/${newFilename}`);
  }

  if (uploadedUrls.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Không có file ảnh hợp lệ được tải lên.',
    });
  }

  return {
    success: true,
    url: uploadedUrls[0],
    urls: uploadedUrls,
  };
});
