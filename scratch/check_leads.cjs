const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const leads = await p.lead.findMany();
  console.log(JSON.stringify(leads.map(l => ({ id: l.id, name: l.name, phone: l.phone, images: l.images })), null, 2));
}

main().finally(() => p.$disconnect());
