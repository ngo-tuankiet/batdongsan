import { prisma } from '../../utils/prisma';

export default defineEventHandler(async () => {
  return await prisma.leaveRequest.findMany({
    include: {
      agent: {
        select: {
          id: true,
          code: true,
          name: true,
          role: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
});
