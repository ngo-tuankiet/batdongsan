import { PrismaClient } from '@prisma/client';
import path from 'node:path';

const defaultDbPath = `file:${path.resolve(process.cwd(), 'prisma/dev.db')}`;
const dbUrl = process.env.DATABASE_URL || defaultDbPath;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
