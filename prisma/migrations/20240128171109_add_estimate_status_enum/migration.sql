/*
  Warnings:

  - The values [CREATED,DONE] on the enum `EstimateStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstimateStatus_new" AS ENUM ('DRAFT', 'ESTIMATED', 'PICKUP', 'CHECKING', 'APPROVED', 'PAID', 'ERROR');
ALTER TABLE "estimate" ALTER COLUMN "status" TYPE "EstimateStatus_new" USING ("status"::text::"EstimateStatus_new");
ALTER TYPE "EstimateStatus" RENAME TO "EstimateStatus_old";
ALTER TYPE "EstimateStatus_new" RENAME TO "EstimateStatus";
DROP TYPE "EstimateStatus_old";
COMMIT;
