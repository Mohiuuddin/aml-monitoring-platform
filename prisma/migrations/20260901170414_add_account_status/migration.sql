/*
  Warnings:

  - You are about to drop the column `isActive` on the `accounts` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED', 'CLOSED');

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "isActive",
ADD COLUMN     "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE';
