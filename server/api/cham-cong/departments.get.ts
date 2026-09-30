import { prisma } from '../../utils/prisma';

export default defineEventHandler(async () => {
  return await prisma.department.findMany({
    orderBy: { id: 'asc' },
  });
});
