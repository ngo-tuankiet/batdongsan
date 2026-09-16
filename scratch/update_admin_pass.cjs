const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();
const hash = crypto.pbkdf2Sync('Kiet1234@', 'bds_benthanh_secure_salt_2026', 10000, 64, 'sha512').toString('hex');

async function main() {
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: hash },
    create: { username: 'admin', password: hash, role: 'admin' },
  });
  console.log('✅ Admin password updated with secure PBKDF2 hash:', hash);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
