import { prisma } from '../utils/prisma';

export const PropertyController = {
  // GET /api/properties
  async getProperties(query: { category?: string; keyword?: string; priceRange?: string; agentId?: string }) {
    const where: any = {};

    if (query.category && query.category !== 'all') {
      where.categoryId = query.category;
    }

    if (query.agentId) {
      where.agentId = query.agentId;
    }

    if (query.keyword) {
      const kw = query.keyword.toLowerCase();
      where.OR = [
        { title: { contains: kw } },
        { location: { contains: kw } },
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
        features: typeof data.features === 'string' ? data.features : JSON.stringify(data.features || []),
        description: data.description,
        agentId: data.agentId || null,
        status: data.status,
      },
    });
  },

  // DELETE /api/properties/:id
  async deleteProperty(id: string) {
    return await prisma.property.delete({
      where: { id },
    });
  },
};
