/*
  Warnings:

  - A unique constraint covering the columns `[customerNumber]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerNumber` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "customerNumber" TEXT NOT NULL,
ADD COLUMN     "riskLevel" "RiskLevel" NOT NULL DEFAULT 'LOW',
ADD COLUMN     "status" "CustomerStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE UNIQUE INDEX "customers_customerNumber_key" ON "customers"("customerNumber");

-- CreateIndex
CREATE INDEX "customers_name_idx" ON "customers"("name");

-- CreateIndex
CREATE INDEX "customers_riskLevel_idx" ON "customers"("riskLevel");

-- CreateIndex
CREATE INDEX "customers_status_idx" ON "customers"("status");
