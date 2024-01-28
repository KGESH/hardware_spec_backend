-- CreateEnum
CREATE TYPE "EstimateStatus" AS ENUM ('PENDING', 'SUCCESS', 'ERROR');

-- DropForeignKey
ALTER TABLE "cpu_estimate" DROP CONSTRAINT "cpu_estimate_estimate_id_fkey";

-- DropForeignKey
ALTER TABLE "disk_estimate" DROP CONSTRAINT "disk_estimate_estimate_id_fkey";

-- DropForeignKey
ALTER TABLE "gpu_estimate" DROP CONSTRAINT "gpu_estimate_estimate_id_fkey";

-- DropForeignKey
ALTER TABLE "ram_estimate" DROP CONSTRAINT "ram_estimate_estimate_id_fkey";

-- AddForeignKey
ALTER TABLE "cpu_estimate" ADD CONSTRAINT "cpu_estimate_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "estimate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gpu_estimate" ADD CONSTRAINT "gpu_estimate_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "estimate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ram_estimate" ADD CONSTRAINT "ram_estimate_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "estimate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disk_estimate" ADD CONSTRAINT "disk_estimate_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "estimate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
