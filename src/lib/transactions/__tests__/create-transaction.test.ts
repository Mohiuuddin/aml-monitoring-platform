import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTransaction } from "../create-transaction";

const mocks = vi.hoisted(() => ({
  findAccount: vi.fn(),
  createTransactionRecord: vi.fn(),
  updateBalance: vi.fn(),
  runTransaction: vi.fn(),
  getCurrentUser: vi.fn(),
  createAuditLog: vi.fn(),
  createAlertForTransaction: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    bankAccount: {
      findUnique: mocks.findAccount,
    },
    $transaction: mocks.runTransaction,
  },
}));

vi.mock("@/lib/auth/get-current-user", () => ({
  getCurrentUser: mocks.getCurrentUser,
}));

vi.mock("@/lib/audit/create-audit-log", () => ({
  createAuditLog: mocks.createAuditLog,
}));

vi.mock("@/lib/aml/create-alert", () => ({
  createAlertForTransaction: mocks.createAlertForTransaction,
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

const validInput = {
  accountId: "account-1",
  amount: "500",
  type: "TRANSFER" as const,
  direction: "CREDIT" as const,
  counterparty: "John",
  counterpartyCountry: "Bangladesh",
  description: "Test transfer",
  transactionAt: "2026-09-10T12:00:00",
};

beforeEach(() => {
  vi.clearAllMocks();

  mocks.getCurrentUser.mockResolvedValue({
    id: "user-1",
    role: "ANALYST",
  });

  mocks.findAccount.mockResolvedValue({
    id: "account-1",
    customerId: "customer-1",
    currency: "BDT",
    status: "ACTIVE",
  });

  mocks.createTransactionRecord.mockResolvedValue({
    id: "transaction-1",
  });

  mocks.createAuditLog.mockResolvedValue({});
  mocks.createAlertForTransaction.mockResolvedValue(null);

  mocks.runTransaction.mockImplementation(async (callback) => {
    return callback({
      transaction: {
        create: mocks.createTransactionRecord,
      },
      bankAccount: {
        update: mocks.updateBalance,
      },
    });
  });
});

describe("createTransaction", () => {
  it("should create a transaction and update account balance", async () => {
    const result = await createTransaction(validInput);

    expect(result.success).toBe(true);
    expect(result.transactionId).toBe("transaction-1");

    expect(mocks.createTransactionRecord).toHaveBeenCalled();
    expect(mocks.updateBalance).toHaveBeenCalledWith({
      where: { id: "account-1" },
      data: {
        balance: {
          increment: 500,
        },
      },
    });

    expect(mocks.createAuditLog).toHaveBeenCalled();
    expect(mocks.createAlertForTransaction).toHaveBeenCalledWith({
      transactionId: "transaction-1",
    });
  });

  it("should reject a zero transaction amount", async () => {
    await expect(
      createTransaction({
        ...validInput,
        amount: "0",
      }),
    ).rejects.toThrow("Amount must be greater than zero.");

    expect(mocks.runTransaction).not.toHaveBeenCalled();
  });

  it("should reject a negative transaction amount", async () => {
    await expect(
      createTransaction({
        ...validInput,
        amount: "-500",
      }),
    ).rejects.toThrow("Amount must be greater than zero.");

    expect(mocks.runTransaction).not.toHaveBeenCalled();
  });

  it("should reject transactions for inactive accounts", async () => {
    mocks.findAccount.mockResolvedValue({
      ...{
        id: "account-1",
        customerId: "customer-1",
        currency: "BDT",
      },
      status: "INACTIVE",
    });

    await expect(createTransaction(validInput)).rejects.toThrow(
      "Transactions can only be created for active accounts.",
    );

    expect(mocks.runTransaction).not.toHaveBeenCalled();
  });
});
