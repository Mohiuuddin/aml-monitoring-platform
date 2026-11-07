import { describe, it, expect } from "vitest";
import { calculateRiskScore } from "../risk-scoring";

describe("calculateRiskScore", () => {
  it("should return LOW for a score below 30", () => {
    const result = calculateRiskScore([]);
    expect(result.score).toBe(0);
    expect(result.level).toBe("LOW");
  });

  it("should return MEDIUM for a score between 30 and 59", () => {
    const result = calculateRiskScore([{ code: "RULE_1", riskWeight: 30 }]);
    expect(result.score).toBe(30);
    expect(result.level).toBe("MEDIUM");
  });

  it("should return HIGH for a score between 60 and 79", () => {
    const result = calculateRiskScore([{ code: "RULE_1", riskWeight: 60 }]);

    expect(result.score).toBe(60);
    expect(result.level).toBe("HIGH");
  });

  it("should return CRITICAL for a score of 80 or above", () => {
    const result = calculateRiskScore([{ code: "RULE_1", riskWeight: 80 }]);

    expect(result.score).toBe(80);
    expect(result.level).toBe("CRITICAL");
  });

  it("should cap the risk score at 100", () => {
    const result = calculateRiskScore([
      { code: "RULE_1", riskWeight: 60 },
      { code: "RULE_2", riskWeight: 50 },
    ]);

    expect(result.score).toBe(100);
    expect(result.level).toBe("CRITICAL");
  });
});
