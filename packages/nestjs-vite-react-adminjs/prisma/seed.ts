import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("123qwe", 10);
  await prisma.adminUser.upsert({
    where: { username: "ethan" },
    update: {},
    create: { username: "ethan", password: hashedPassword },
  });

  const existingDeals = await prisma.deal.count();
  if (existingDeals === 0) {
    await prisma.deal.create({
      data: {
        name: "Bob's Pianos",
        description: "Need the new piano moved on March 31st at 8pm",
        address: "123 Main Street, Saratoga Springs, UT",
        status: "pending",
      },
    });
    await prisma.deal.create({
      data: {
        name: "Bob Jones — Roof Trusses",
        description: "New roof trusses for his new house",
        address: "456 Oak Avenue, Provo, UT",
        status: "pending",
      },
    });
  }
  console.log("Seed completed.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
