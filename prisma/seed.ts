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

const jurisdictions = [
  // FATF Call for Action
  {
    country: "Democratic People's Republic of Korea",
    code: "KP",
    riskLevel: "CALL_FOR_ACTION" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Iran",
    code: "IR",
    riskLevel: "CALL_FOR_ACTION" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Myanmar",
    code: "MM",
    riskLevel: "CALL_FOR_ACTION" as const,
    source: "FATF - June 2026",
  },

  // FATF Increased Monitoring
  {
    country: "Angola",
    code: "AO",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Bolivia",
    code: "BO",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Bosnia and Herzegovina",
    code: "BA",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Bulgaria",
    code: "BG",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Cameroon",
    code: "CM",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Côte d'Ivoire",
    code: "CI",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Democratic Republic of the Congo",
    code: "CD",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Haiti",
    code: "HT",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Iraq",
    code: "IQ",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Kenya",
    code: "KE",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Kuwait",
    code: "KW",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Lao People's Democratic Republic",
    code: "LA",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Lebanon",
    code: "LB",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Monaco",
    code: "MC",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Nepal",
    code: "NP",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Papua New Guinea",
    code: "PG",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "South Sudan",
    code: "SS",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Syria",
    code: "SY",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Venezuela",
    code: "VE",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Vietnam",
    code: "VN",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Virgin Islands (British)",
    code: "VG",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
  },
  {
    country: "Yemen",
    code: "YE",
    riskLevel: "INCREASED_MONITORING" as const,
    source: "FATF - June 2026",
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

  for (const jurisdiction of jurisdictions) {
    await prisma.jurisdiction.upsert({
      where: {
        code: jurisdiction.code,
      },
      update: {
        country: jurisdiction.country,
        riskLevel: jurisdiction.riskLevel,
        source: jurisdiction.source,
        isActive: true,
      },
      create: {
        country: jurisdiction.country,
        code: jurisdiction.code,
        riskLevel: jurisdiction.riskLevel,
        source: jurisdiction.source,
        isActive: true,
      },
    });
  }

  console.log("AML rules and jurisdictions seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
