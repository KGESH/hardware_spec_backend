/*
  Warnings:

  - The values [PENDING,SUCCESS] on the enum `EstimateStatus` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `kind` on the `disk` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DiskKind" AS ENUM ('SSD', 'HDD');

-- AlterEnum
BEGIN;
CREATE TYPE "EstimateStatus_new" AS ENUM ('DRAFT', 'CREATED', 'ERROR', 'DONE');
ALTER TABLE "estimate" ALTER COLUMN "status" TYPE "EstimateStatus_new" USING ("status"::text::"EstimateStatus_new");
ALTER TYPE "EstimateStatus" RENAME TO "EstimateStatus_old";
ALTER TYPE "EstimateStatus_new" RENAME TO "EstimateStatus";
DROP TYPE "EstimateStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "disk" DROP COLUMN "kind",
ADD COLUMN     "kind" "DiskKind" NOT NULL;

-- CreateTable
CREATE TABLE "user_info" (
    "id" UUID NOT NULL,
    "estimate_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "user_info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_info_estimate_id_key" ON "user_info"("estimate_id");

-- CreateIndex
CREATE INDEX "user_info_phone_number_idx" ON "user_info"("phone_number");

-- CreateIndex
CREATE INDEX "user_info_created_at_idx" ON "user_info"("created_at");

-- CreateIndex
CREATE INDEX "cpu_vendor_idx" ON "cpu"("vendor");

-- CreateIndex
CREATE INDEX "cpu_model_name_idx" ON "cpu"("model_name");

-- CreateIndex
CREATE INDEX "cpu_estimate_created_at_idx" ON "cpu_estimate"("created_at");

-- CreateIndex
CREATE INDEX "disk_vendor_idx" ON "disk"("vendor");

-- CreateIndex
CREATE INDEX "disk_model_name_idx" ON "disk"("model_name");

-- CreateIndex
CREATE INDEX "disk_kind_idx" ON "disk"("kind");

-- CreateIndex
CREATE INDEX "disk_estimate_created_at_idx" ON "disk_estimate"("created_at");

-- CreateIndex
CREATE INDEX "estimate_status_idx" ON "estimate"("status");

-- CreateIndex
CREATE INDEX "estimate_created_at_idx" ON "estimate"("created_at");

-- CreateIndex
CREATE INDEX "gpu_vendor_idx" ON "gpu"("vendor");

-- CreateIndex
CREATE INDEX "gpu_model_name_idx" ON "gpu"("model_name");

-- CreateIndex
CREATE INDEX "gpu_estimate_created_at_idx" ON "gpu_estimate"("created_at");

-- CreateIndex
CREATE INDEX "motherboard_vendor_idx" ON "motherboard"("vendor");

-- CreateIndex
CREATE INDEX "motherboard_model_name_idx" ON "motherboard"("model_name");

-- CreateIndex
CREATE INDEX "motherboard_estimate_created_at_idx" ON "motherboard_estimate"("created_at");

-- CreateIndex
CREATE INDEX "ram_vendor_idx" ON "ram"("vendor");

-- CreateIndex
CREATE INDEX "ram_model_name_idx" ON "ram"("model_name");

-- CreateIndex
CREATE INDEX "ram_estimate_created_at_idx" ON "ram_estimate"("created_at");

-- AddForeignKey
ALTER TABLE "user_info" ADD CONSTRAINT "user_info_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "estimate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
