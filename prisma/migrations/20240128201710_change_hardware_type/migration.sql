/*
  Warnings:

  - The values [M/B] on the enum `HardwareType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "HardwareType_new" AS ENUM ('CPU', 'GPU', 'RAM', 'MB', 'DISK', 'OTHER');
ALTER TYPE "HardwareType" RENAME TO "HardwareType_old";
ALTER TYPE "HardwareType_new" RENAME TO "HardwareType";
DROP TYPE "HardwareType_old";
COMMIT;
