import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const date = query.date as string | undefined;
  const month = query.month as string | undefined;
  const userId = query.userId as string | undefined;
  const officeId = query.officeId as string | undefined;

  const where: any = {};
  if (date) {
    where.date = date;
  } else if (month) {
    where.date = { startsWith: month }; // 'YYYY-MM'
  }
  if (userId && userId !== 'all') {
    where.userId = userId;
  }
  if (officeId && officeId !== 'all') {
    where.officeId = officeId;
  }

  return await prisma.attendance.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    include: {
      agent: {
        select: {
          id: true,
          code: true,
          name: true,
          role: true,
          officeId: true,
          departmentId: true,
          avatar: true,
          isStarred: true,
        },
      },
    },
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
  });
});
