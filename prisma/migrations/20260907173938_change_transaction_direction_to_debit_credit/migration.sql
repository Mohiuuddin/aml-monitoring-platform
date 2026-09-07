/*
  Warnings:

  - The values [INCOMING,OUTGOING] on the enum `TransactionDirection` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransactionDirection_new" AS ENUM ('CREDIT', 'DEBIT');
ALTER TABLE "transactions" ALTER COLUMN "direction" TYPE "TransactionDirection_new" USING ("direction"::text::"TransactionDirection_new");
ALTER TYPE "TransactionDirection" RENAME TO "TransactionDirection_old";
ALTER TYPE "TransactionDirection_new" RENAME TO "TransactionDirection";
DROP TYPE "public"."TransactionDirection_old";
COMMIT;
