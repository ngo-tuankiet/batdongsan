import { prisma } from '../utils/prisma';

export const PropertyController = {
  // GET /api/properties
  async getProperties(query: { category?: string; province?: string; ward?: string; keyword?: string; priceRange?: string; agentId?: string }) {
    const where: any = {};

    if (query.category && query.category !== 'all') {
      where.categoryId = query.category;
    }

    if (query.province && query.province !== 'all') {
      where.province = query.province;
    }

    if (query.ward && query.ward !== 'all') {
      where.ward = query.ward;
    }

    if (query.agentId) {
      where.agentId = query.agentId;
    }

    if (query.keyword) {
      const kw = query.keyword.toLowerCase();
      where.OR = [
        { title: { contains: kw } },
        { location: { contains: kw } },
        { province: { contains: kw } },
        { ward: { contains: kw } },
        { description: { contains: kw } },
      ];
    }

    if (query.priceRange) {
      if (query.priceRange === 'under20') where.priceRaw = { lt: 20 };
      else if (query.priceRange === '20to50') where.priceRaw = { gte: 20, lte: 50 };
      else if (query.priceRange === 'above50') where.priceRaw = { gt: 50 };
    }

    return await prisma.property.findMany({
      where,
      include: {
        agent: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // GET /api/properties/:id
  async getPropertyById(id: string) {
    return await prisma.property.findUnique({
      where: { id },
      include: {
        agent: true,
        category: true,
      },
    });
  },

  // POST /api/properties
  async createProperty(data: any) {
    const id = data.id || `BT-${Date.now().toString().slice(-4)}`;
    return await prisma.property.create({
      data: {
        id,
        title: data.title,
        categoryId: data.categoryId || data.category,
        province: data.province || 'TP. Hồ Chí Minh',
        ward: data.ward || null,
        price: data.price,
        priceRaw: parseFloat(data.priceRaw) || 0,
        area: data.area,
        location: data.location,
        dimensions: data.dimensions,
        structure: data.structure,
        bedrooms: parseInt(data.bedrooms) || 0,
        bathrooms: parseInt(data.bathrooms) || 0,
        direction: data.direction,
        legal: data.legal,
        rentIncome: data.rentIncome,
        badge: data.badge || 'Đang Bán',
        image: data.image,
        images: typeof data.images === 'string' ? data.images : (Array.isArray(data.images) ? JSON.stringify(data.images) : null),
        mapUrl: data.mapUrl || null,
        features: typeof data.features === 'string' ? data.features : JSON.stringify(data.features || []),
        description: data.description,
        agentId: data.agentId || null,
        status: data.status || 'available',
      },
    });
  },

  // PUT /api/properties/:id
  async updateProperty(id: string, data: any) {
    return await prisma.property.update({
      where: { id },
      data: {
        title: data.title,
        categoryId: data.categoryId || data.category,
        province: data.province !== undefined ? data.province : undefined,
        ward: data.ward !== undefined ? data.ward : undefined,
        price: data.price,
        priceRaw: parseFloat(data.priceRaw) || 0,
        area: data.area,
        location: data.location,
        dimensions: data.dimensions,
        structure: data.structure,
        bedrooms: parseInt(data.bedrooms) || 0,
        bathrooms: parseInt(data.bathrooms) || 0,
        direction: data.direction,
        legal: data.legal,
        rentIncome: data.rentIncome,
        badge: data.badge,
        image: data.image,
        images: data.images !== undefined ? (typeof data.images === 'string' ? data.images : JSON.stringify(data.images)) : undefined,
        mapUrl: data.mapUrl !== undefined ? data.mapUrl : undefined,
        features: typeof data.features === 'string' ? data.features : JSON.stringify(data.features || []),
        description: data.description,
        agentId: data.agentId || null,
        status: data.status,
      },
    });
  },

  // DELETE /api/properties/:id
  async deleteProperty(id: string) {
    try {
      const decodedId = decodeURIComponent(id);
      const res = await prisma.property.deleteMany({
        where: { id: decodedId },
      });
      return { success: true, count: res.count, message: 'Đã xóa bất động sản thành công' };
    } catch (err: any) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Lỗi khi xóa bất động sản: ' + (err.message || 'Lỗi server'),
      });
    }
  },
};
