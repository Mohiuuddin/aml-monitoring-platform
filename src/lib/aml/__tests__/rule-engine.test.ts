import { beforeEach, describe, expect, it, vi } from "vitest";
import { evaluateTransaction } from "../rule-engine";

const mocks = vi.hoisted(() => ({
  findRules: vi.fn(),
  findTransactions: vi.fn(),
  findJurisdiction: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    aMLRule: {
      findMany: mocks.findRules,
    },
    transaction: {
      findMany: mocks.findTransactions,
    },
    jurisdiction: {
      findFirst: mocks.findJurisdiction,
    },
  },
}));

const baseTransaction = {
  id: "transaction-1",
  customerId: "customer-1",
  accountId: "account-1",
  amount: "100000",
  currency: "BDT",
  type: "TRANSFER" as const,
  direction: "CREDIT" as const,
  counterparty: null,
  counterpartyCountry: null,
  transactionAt: new Date("2026-09-10T12:00:00"),
};

function activateRule(code: string, riskWeight = 30) {
  mocks.findRules.mockResolvedValue([{ id: "rule-1", code, riskWeight }]);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AML Rule Engine", () => {
  describe("LARGE_CASH_TRANSACTION", () => {
    it("should trigger for a cash transaction of at least 1 million BDT", async () => {
      activateRule("LARGE_CASH_TRANSACTION");

      const result = await evaluateTransaction({
        ...baseTransaction,
        type: "CASH_DEPOSIT",
        amount: "1200000",
      });

      expect(result).toHaveLength(1);
      expect(result[0].code).toBe("LARGE_CASH_TRANSACTION");
    });

    it("should not trigger below 1 million BDT", async () => {
      activateRule("LARGE_CASH_TRANSACTION");

      const result = await evaluateTransaction({
        ...baseTransaction,
        type: "CASH_DEPOSIT",
        amount: "500000",
      });

      expect(result).toHaveLength(0);
    });
  });

  describe("STRUCTURED_CASH_ACTIVITY", () => {
    it("should trigger when multiple cash transactions total at least 1 million BDT", async () => {
      activateRule("STRUCTURED_CASH_ACTIVITY");

      mocks.findTransactions.mockResolvedValue([
        { id: "tx-1", amount: 400000 },
        { id: "tx-2", amount: 350000 },
        { id: "tx-3", amount: 300000 },
      ]);

      const result = await evaluateTransaction({
        ...baseTransaction,
        type: "CASH_DEPOSIT",
      });

      expect(result).toHaveLength(1);
      expect(result[0].code).toBe("STRUCTURED_CASH_ACTIVITY");
    });

    it("should not trigger when the total is below 1 million BDT", async () => {
      activateRule("STRUCTURED_CASH_ACTIVITY");

      mocks.findTransactions.mockResolvedValue([
        { id: "tx-1", amount: 200000 },
        { id: "tx-2", amount: 300000 },
      ]);

      const result = await evaluateTransaction({
        ...baseTransaction,
        type: "CASH_DEPOSIT",
      });

      expect(result).toHaveLength(0);
    });
  });

  describe("UNUSUAL_TRANSACTION", () => {
    it("should trigger when the current transaction is at least 5 times the previous average", async () => {
      activateRule("UNUSUAL_TRANSACTION");

      mocks.findTransactions.mockResolvedValue([
        { amount: 10000 },
        { amount: 10000 },
        { amount: 10000 },
        { amount: 10000 },
        { amount: 10000 },
      ]);

      const result = await evaluateTransaction({
        ...baseTransaction,
        amount: "50000",
      });

      expect(result).toHaveLength(1);
      expect(result[0].code).toBe("UNUSUAL_TRANSACTION");
    });

    it("should not trigger when there are fewer than 5 previous transactions", async () => {
      activateRule("UNUSUAL_TRANSACTION");

      mocks.findTransactions.mockResolvedValue([
        { amount: 10000 },
        { amount: 10000 },
        { amount: 10000 },
        { amount: 10000 },
      ]);

      const result = await evaluateTransaction({
        ...baseTransaction,
        amount: "100000",
      });

      expect(result).toHaveLength(0);
    });
  });

  describe("RAPID_FUND_MOVEMENT", () => {
    it("should trigger when outgoing funds are at least 80% of incoming funds", async () => {
      activateRule("RAPID_FUND_MOVEMENT");

      mocks.findTransactions.mockResolvedValue([{ amount: 100000 }]);

      const result = await evaluateTransaction({
        ...baseTransaction,
        amount: "80000",
        direction: "DEBIT",
      });

      expect(result).toHaveLength(1);
      expect(result[0].code).toBe("RAPID_FUND_MOVEMENT");
    });

    it("should not trigger when outgoing funds are below 80% of incoming funds", async () => {
      activateRule("RAPID_FUND_MOVEMENT");

      mocks.findTransactions.mockResolvedValue([{ amount: 100000 }]);

      const result = await evaluateTransaction({
        ...baseTransaction,
        amount: "50000",
        direction: "DEBIT",
      });

      expect(result).toHaveLength(0);
    });
  });

  describe("HIGH_RISK_JURISDICTION", () => {
    it("should trigger for an international transfer involving a high-risk jurisdiction", async () => {
      activateRule("HIGH_RISK_JURISDICTION");

      mocks.findJurisdiction.mockResolvedValue({
        riskLevel: "CALL_FOR_ACTION",
      });

      const result = await evaluateTransaction({
        ...baseTransaction,
        type: "INTERNATIONAL_TRANSFER",
        counterpartyCountry: "Iran",
      });

      expect(result).toHaveLength(1);
      expect(result[0].code).toBe("HIGH_RISK_JURISDICTION");
    });

    it("should not trigger when the jurisdiction is not found", async () => {
      activateRule("HIGH_RISK_JURISDICTION");

      mocks.findJurisdiction.mockResolvedValue(null);

      const result = await evaluateTransaction({
        ...baseTransaction,
        type: "INTERNATIONAL_TRANSFER",
        counterpartyCountry: "Bangladesh",
      });

      expect(result).toHaveLength(0);
    });
  });
});
