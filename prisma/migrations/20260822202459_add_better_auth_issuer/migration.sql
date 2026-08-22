/*
  Warnings:

  - A unique constraint covering the columns `[issuer,accountId]` on the table `accounts_auth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `issuer` to the `accounts_auth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts_auth" ADD COLUMN     "issuer" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_auth_issuer_accountId_key" ON "accounts_auth"("issuer", "accountId");
