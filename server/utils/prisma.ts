import { PrismaClient } from '@prisma/client';
import path from 'node:path';

function getDatabaseUrl() {
  const envUrl = process.env.DATABASE_URL;
  if (!envUrl) {
    return 'file:./dev.db';
  }
  if (envUrl.includes('prisma/dev.db')) {
    return 'file:./dev.db';
  }
  return envUrl;
}

const dbUrl = getDatabaseUrl();

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
