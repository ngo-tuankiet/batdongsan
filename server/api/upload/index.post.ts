import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// ĐỊNH NGHĨA CÁC GIỚI HẠN BẢO MẬT
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB mỗi file ảnh
const MAX_TOTAL_SIZE = 35 * 1024 * 1024; // 35MB tổng dung lượng mỗi lần upload
const MAX_FILES = 10; // Tối đa 10 file ảnh một lần

// DANH SÁCH MIME & ĐUÔI TỆP HỢP LỆ (WHITELIST)
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.heic',
  '.heif',
]);

/**
 * 1. QUÉT CHỮ KÝ TỆP (MAGIC BYTES)
 * Xác minh cấu trúc nhị phân thực tế để chống việc đổi đuôi file mã độc (.php -> .jpg)
 */
function verifyMagicBytes(buffer: Buffer): { valid: boolean; ext: string } {
  if (!buffer || buffer.length < 12) {
    return { valid: false, ext: '' };
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, ext: '.jpg' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, ext: '.png' };
  }

  // WebP: RIFF .... WEBP
  const riff = buffer.subarray(0, 4).toString('ascii');
  const webp = buffer.subarray(8, 12).toString('ascii');
  if (riff === 'RIFF' && webp === 'WEBP') {
    return { valid: true, ext: '.webp' };
  }

  // HEIC / HEIF: bytes 4-8 là 'ftyp'
  const ftyp = buffer.subarray(4, 8).toString('ascii');
  if (ftyp === 'ftyp') {
    const brand = buffer.subarray(8, 12).toString('ascii').toLowerCase();
    if (['heic', 'mif1', 'msf1', 'heix', 'hevc'].includes(brand)) {
      return { valid: true, ext: '.heic' };
    }
  }

  return { valid: false, ext: '' };
}

/**
 * 2. QUÉT NỘI DUNG NHỊ PHÂN PHÒNG CHỐNG SHELL SCRIPT & MÃ ĐỘC
 * Kiểm tra các chuỗi độc hại thường dùng trong webshell hoặc script injection
 */
function scanMaliciousPayload(buffer: Buffer): boolean {
  // Quét 4KB đầu và 4KB cuối của tệp (nơi mã độc thường tiêm vào)
  const headStr = buffer.subarray(0, Math.min(buffer.length, 4096)).toString('utf-8').toLowerCase();
  const tailStr = buffer.length > 4096 
    ? buffer.subarray(buffer.length - 4096).toString('utf-8').toLowerCase() 
    : '';
  const content = headStr + ' ' + tailStr;

  const dangerousKeywords = [
    '<?php',
    '<?=',
    '<script',
    '#!/bin/',
    'eval(',
    'base64_decode(',
    'passthru(',
    'shell_exec(',
    'system(',
    'proc_open(',
    'popen(',
    'assert(',
    'powershell',
    'cmd.exe',
    '/bin/sh',
    '/bin/bash',
  ];

  return dangerousKeywords.some(keyword => content.includes(keyword));
}

export default defineEventHandler(async (event) => {
  // 1. Đọc dữ liệu multipart form
  const files = await readMultipartFormData(event);
  if (!files || files.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Vui lòng chọn tệp hình ảnh để tải lên.',
    });
  }

  // 2. Kiểm tra số lượng tệp tải lên
  if (files.length > MAX_FILES) {
    throw createError({
      statusCode: 400,
      statusMessage: `Chỉ được tải lên tối đa ${MAX_FILES} hình ảnh cho mỗi yêu cầu.`,
    });
  }

  // 3. Kiểm tra tổng dung lượng toàn bộ batch
  let totalBatchSize = 0;
  for (const f of files) {
    if (f.data) totalBatchSize += f.data.length;
  }
  if (totalBatchSize > MAX_TOTAL_SIZE) {
    throw createError({
      statusCode: 400,
      statusMessage: `Tổng dung lượng tải lên (${(totalBatchSize / 1024 / 1024).toFixed(1)}MB) vượt quá giới hạn tối đa 35MB.`,
    });
  }

  // 4. Chuẩn bị thư mục lưu trữ
  const uploadDir = path.resolve(process.cwd(), 'public/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Đường dẫn phụ nếu chạy trên VPS
  const vpsDir = '/var/www/batdongsan/public/uploads';
  const isVps = fs.existsSync('/var/www/batdongsan') && uploadDir !== vpsDir;

  const uploadedUrls: string[] = [];

  for (const file of files) {
    if (!file.filename || !file.data) continue;

    // A. Kiểm tra dung lượng từng tệp
    if (file.data.length > MAX_FILE_SIZE) {
      throw createError({
        statusCode: 400,
        statusMessage: `Tệp "${file.filename}" vượt quá dung lượng tối đa 10MB (${(file.data.length / 1024 / 1024).toFixed(1)}MB).`,
      });
    }

    // B. Kiểm tra định dạng đuôi tệp (Extension)
    const rawExt = path.extname(file.filename).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(rawExt)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Định dạng tệp "${file.filename}" không được chấp nhận. Chỉ hỗ trợ ảnh JPG, PNG, WEBP, HEIC.`,
      });
    }

    // C. Kiểm tra MIME Type từ header client
    if (file.type && !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
      throw createError({
        statusCode: 400,
        statusMessage: `Loại tệp MIME "${file.type}" không hợp lệ.`,
      });
    }

    // D. Kiểm tra chữ ký số nhị phân (Magic Bytes Verification)
    const magicResult = verifyMagicBytes(file.data);
    if (!magicResult.valid) {
      throw createError({
        statusCode: 400,
        statusMessage: `Tệp "${file.filename}" bị từ chối: Cấu trúc nhị phân không phải là hình ảnh hợp lệ.`,
      });
    }

    // E. Quét phòng chống mã độc / Shell Script
    if (scanMaliciousPayload(file.data)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Phát hiện nội dung tệp "${file.filename}" không an toàn hoặc chứa mã thực thi. Đã chặn tải lên.`,
      });
    }

    // F. VỆ SINH TÊN TỆP (FILENAME SANITIZATION)
    // Hoàn toàn không sử dụng tên gốc từ client để chống path traversal, null bytes & double extensions
    const finalExt = magicResult.ext || rawExt || '.jpg';
    const randomHash = crypto.randomBytes(8).toString('hex');
    const safeFilename = `bds_${Date.now()}_${randomHash}${finalExt}`;

    const targetPath = path.join(uploadDir, safeFilename);
    fs.writeFileSync(targetPath, file.data);

    // Đồng bộ vào thư mục VPS nếu có
    if (isVps) {
      try {
        if (!fs.existsSync(vpsDir)) fs.mkdirSync(vpsDir, { recursive: true });
        fs.writeFileSync(path.join(vpsDir, safeFilename), file.data);
      } catch (e) {
        // Ignored if local
      }
    }

    uploadedUrls.push(`/uploads/${safeFilename}`);
  }

  if (uploadedUrls.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Không có file ảnh hợp lệ được xử lý.',
    });
  }

  return {
    success: true,
    url: uploadedUrls[0],
    urls: uploadedUrls,
    count: uploadedUrls.length,
  };
});
