// Composable tiện ích tính toán và định dạng Bất Động Sản

export function formatDimensions(dimensions?: string | null): string {
  if (!dimensions || !dimensions.trim()) return '';
  return dimensions.trim();
}

/**
 * Tính toán đơn giá trên m² (VD: ~232.1 Tr/m² hoặc ~1.2 Tỷ/m²)
 * @param priceRaw Giá số bằng Tỷ (VD: 32.5, 16.8)
 * @param areaStr Chuỗi diện tích (VD: "140 m²", "218 m²", "924 ha")
 * @param priceStr Chuỗi giá hiển thị (VD: "32.5 Tỷ", "8.2 Tỷ")
 */
export function calculatePricePerM2(
  priceRaw?: number | null, 
  areaStr?: string | null, 
  priceStr?: string | null
): string {
  if (!areaStr) return '';
  
  const cleanArea = areaStr.trim().toLowerCase();
  
  // Trường hợp quy mô héc-ta (dự án lớn)
  if (cleanArea.includes('ha') || cleanArea.includes('héc ta') || cleanArea.includes('hectare')) {
    return `Quy mô: ${areaStr}`;
  }

  // Trích xuất số diện tích từ chuỗi (VD: "140 m²" -> 140, "210.5 m2" -> 210.5)
  const areaMatch = cleanArea.match(/([0-9]+[.,]?[0-9]*)/);
  if (!areaMatch) return '';
  
  const areaNum = parseFloat(areaMatch[1].replace(',', '.'));
  if (!areaNum || areaNum <= 0) return '';

  let priceInBillion = 0;
  if (typeof priceRaw === 'number' && priceRaw > 0) {
    priceInBillion = priceRaw;
  } else if (priceStr) {
    // Trích xuất từ chuỗi giá nếu priceRaw = 0
    const pMatch = priceStr.toLowerCase().replace(/,/g, '.').match(/([0-9]+[.]?[0-9]*)/);
    if (pMatch) {
      const num = parseFloat(pMatch[1]);
      if (priceStr.toLowerCase().includes('tỷ') || priceStr.toLowerCase().includes('ty')) {
        priceInBillion = num;
      } else if (priceStr.toLowerCase().includes('triệu') || priceStr.toLowerCase().includes('tr')) {
        priceInBillion = num / 1000;
      }
    }
  }

  if (priceInBillion <= 0) return '';

  const priceInMillion = priceInBillion * 1000;
  const pricePerM2 = priceInMillion / areaNum;

  if (pricePerM2 >= 1000) {
    return `~${(pricePerM2 / 1000).toFixed(2)} Tỷ/m²`;
  } else if (pricePerM2 >= 1) {
    // Định dạng số tròn đẹp nếu không có số lẻ, hoặc làm tròn 1 số thập phân
    const formatted = pricePerM2 % 1 === 0 ? pricePerM2.toFixed(0) : pricePerM2.toFixed(1);
    return `~${formatted} Tr/m²`;
  } else if (pricePerM2 > 0) {
    return `~${Math.round(pricePerM2 * 1000).toLocaleString('vi-VN')} đ/m²`;
  }

  return '';
}
