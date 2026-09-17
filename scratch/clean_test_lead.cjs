const { PrismaClient } = require('/var/www/batdongsan/node_modules/@prisma/client');
const p = new PrismaClient();
p.lead.deleteMany({ where: { phone: '0901234567' } })
  .then(() => console.log('Cleaned QA test lead successfully'))
  .finally(() => p.$disconnect());
