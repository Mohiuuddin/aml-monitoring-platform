-- CreateEnum
CREATE TYPE "JurisdictionRisk" AS ENUM ('NORMAL', 'INCREASED_MONITORING', 'CALL_FOR_ACTION');

-- CreateTable
CREATE TABLE "jurisdictions" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "riskLevel" "JurisdictionRisk" NOT NULL,
    "source" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jurisdictions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jurisdictions_country_key" ON "jurisdictions"("country");

-- CreateIndex
CREATE UNIQUE INDEX "jurisdictions_code_key" ON "jurisdictions"("code");

-- CreateIndex
CREATE INDEX "jurisdictions_riskLevel_idx" ON "jurisdictions"("riskLevel");

-- CreateIndex
CREATE INDEX "jurisdictions_isActive_idx" ON "jurisdictions"("isActive");
