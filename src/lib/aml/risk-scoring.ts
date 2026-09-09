import type { RiskLevel } from "@/generated/prisma/client";

interface TriggeredRule {
  code: string;
  riskWeight: number;
}

interface RiskResult {
  score: number;
  level: RiskLevel;
}

export function calculateRiskScore(
  triggeredRules: TriggeredRule[],
): RiskResult {
  const totalWeight = triggeredRules.reduce(
    (total, rule) => total + rule.riskWeight,
    0,
  );

  const score = Math.min(totalWeight, 100);

  return {
    score,
    level: getRiskLevel(score),
  };
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) {
    return "CRITICAL";
  }

  if (score >= 60) {
    return "HIGH";
  }

  if (score >= 30) {
    return "MEDIUM";
  }

  return "LOW";
}
