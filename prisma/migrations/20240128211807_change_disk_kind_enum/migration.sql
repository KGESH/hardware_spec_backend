/*
  Warnings:

  - The values [SSD,HDD] on the enum `DiskKind` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DiskKind_new" AS ENUM ('ssd', 'hdd');
ALTER TABLE "disk" ALTER COLUMN "kind" TYPE "DiskKind_new" USING ("kind"::text::"DiskKind_new");
ALTER TYPE "DiskKind" RENAME TO "DiskKind_old";
ALTER TYPE "DiskKind_new" RENAME TO "DiskKind";
DROP TYPE "DiskKind_old";
COMMIT;
