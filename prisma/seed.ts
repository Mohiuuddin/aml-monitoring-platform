import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const amlRules = [
  {
    name: "Large Cash Transaction",
    description:
      "Detects cash deposits or withdrawals reaching the applicable BFIU cash transaction reporting threshold within a single day.",
    code: "LARGE_CASH_TRANSACTION",
    riskWeight: 30,
  },
  {
    name: "Structured Cash Activity",
    description:
      "Detects multiple cash transactions that may indicate an attempt to avoid a cash transaction reporting threshold.",
    code: "STRUCTURED_CASH_ACTIVITY",
    riskWeight: 40,
  },
  {
    name: "Unusual Transaction",
    description:
      "Detects transaction activity that significantly deviates from the customer's usual transaction pattern.",
    code: "UNUSUAL_TRANSACTION",
    riskWeight: 35,
  },
  {
    name: "Rapid Fund Movement",
    description:
      "Detects significant incoming funds followed by rapid outgoing movement that may indicate potential layering activity.",
    code: "RAPID_FUND_MOVEMENT",
    riskWeight: 30,
  },
  {
    name: "High-Risk Jurisdiction",
    description:
      "Detects international transactions involving jurisdictions identified as high-risk or subject to increased monitoring under applicable AML guidance.",
    code: "HIGH_RISK_JURISDICTION",
    riskWeight: 40,
  },
];

async function main() {
  for (const rule of amlRules) {
    await prisma.aMLRule.upsert({
      where: {
        code: rule.code,
      },
      update: {
        name: rule.name,
        description: rule.description,
        riskWeight: rule.riskWeight,
        isActive: true,
      },
      create: {
        name: rule.name,
        description: rule.description,
        code: rule.code,
        riskWeight: rule.riskWeight,
        isActive: true,
      },
    });
  }

  console.log("AML rules seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
