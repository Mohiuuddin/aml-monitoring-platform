import prisma from "@/lib/prisma";

export async function getAmlRules() {
  const rules = await prisma.aMLRule.findMany({
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      name: true,
      description: true,
      code: true,
      riskWeight: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return rules.map((rule) => ({
    ...rule,
    createdAt: rule.createdAt.toISOString(),
    updatedAt: rule.updatedAt.toISOString(),
  }));
}
