import prisma from "@/lib/prisma";

export async function getRiskDistribution() {
  const distribution = await prisma.alert.groupBy({
    by: ["riskLevel"],
    _count: {
      _all: true,
    },
  });

  const counts = new Map(
    distribution.map((item) => [item.riskLevel, item._count._all]),
  );

  return [
    {
      riskLevel: "LOW",
      count: counts.get("LOW") ?? 0,
    },
    {
      riskLevel: "MEDIUM",
      count: counts.get("MEDIUM") ?? 0,
    },
    {
      riskLevel: "HIGH",
      count: counts.get("HIGH") ?? 0,
    },
    {
      riskLevel: "CRITICAL",
      count: counts.get("CRITICAL") ?? 0,
    },
  ];
}
