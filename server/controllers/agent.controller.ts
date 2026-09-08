import { prisma } from '../utils/prisma';

export const AgentController = {
  // GET /api/agents
  async getAgents() {
    return await prisma.agent.findMany({
      include: {
        properties: {
          select: { id: true, title: true, price: true, location: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  },

  // GET /api/agents/:id
  async getAgentById(id: string) {
    return await prisma.agent.findUnique({
      where: { id },
      include: {
        properties: {
          include: { category: true },
        },
      },
    });
  },

  // POST /api/agents
  async createAgent(data: any) {
    const id = data.id || `agent_${Date.now()}`;
    const phone = data.phone;
    const phoneDisplay = data.phoneDisplay || phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1.$2.$3');

    return await prisma.agent.create({
      data: {
        id,
        name: data.name,
        role: data.role,
        phone,
        phoneDisplay,
        zalo: data.zalo || `https://zalo.me/${phone}`,
        avatar: data.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
        exp: data.exp || '5+ Năm',
        deals: data.deals || '50+ Căn',
        slogan: data.slogan,
        bio: data.bio,
        tag: data.tag || 'Chuyên Viên',
      },
    });
  },

  // PUT /api/agents/:id
  async updateAgent(id: string, data: any) {
    const phone = data.phone;
    const phoneDisplay = data.phoneDisplay || phone?.replace(/(\d{4})(\d{3})(\d{3})/, '$1.$2.$3');

    return await prisma.agent.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        phone,
        phoneDisplay,
        zalo: data.zalo,
        avatar: data.avatar,
        exp: data.exp,
        deals: data.deals,
        slogan: data.slogan,
        bio: data.bio,
        tag: data.tag,
      },
    });
  },

  // DELETE /api/agents/:id
  async deleteAgent(id: string) {
    return await prisma.agent.delete({
      where: { id },
    });
  },

  // POST /api/agents/:id/assign (Phân công dự án / BĐS cho nhân viên)
  async assignProperties(agentId: string, propertyIds: string[]) {
    // 1. Xóa gán cũ của các căn thuộc agent này mà không nằm trong danh sách mới
    await prisma.property.updateMany({
      where: {
        agentId,
        id: { notIn: propertyIds },
      },
      data: {
        agentId: null,
      },
    });

    // 2. Gán agentId mới cho tất cả propertyIds được chọn
    if (propertyIds.length > 0) {
      await prisma.property.updateMany({
        where: {
          id: { in: propertyIds },
        },
        data: {
          agentId,
        },
      });
    }

    return { success: true, agentId, assignedCount: propertyIds.length };
  },
};
