/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// prisma/seed.ts
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Create a dummy Organization
  const org = await prisma.organization.create({
    data: {
      name: 'TechCorp International',
    },
  });

  console.log(`Created Organization: ${org.id}`);

  // 2. Create the Chart of Accounts
  const accounts = [
    { name: 'Chase Business Checking', type: 'ASSET' },
    { name: 'Accounts Payable', type: 'LIABILITY' },
    { name: 'Sales Revenue', type: 'REVENUE' },
    { name: 'Office Rent', type: 'EXPENSE' },
  ];

  for (const acc of accounts) {
    await prisma.account.create({
      data: {
        name: acc.name,
        type: acc.type,
        organizationId: org.id,
        currentBalance: 0, // Start fresh
      },
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
