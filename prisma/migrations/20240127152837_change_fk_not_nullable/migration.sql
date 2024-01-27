/*
  Warnings:

  - Made the column `cpu_id` on table `cpu_estimate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `estimate_id` on table `cpu_estimate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shop_id` on table `cpu_estimate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shop_id` on table `cpu_pricing_table` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gpu_id` on table `gpu_estimate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `estimate_id` on table `gpu_estimate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shop_id` on table `gpu_estimate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shop_id` on table `gpu_pricing_table` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "cpu_estimate" DROP CONSTRAINT "cpu_estimate_cpu_id_fkey";

-- DropForeignKey
ALTER TABLE "cpu_estimate" DROP CONSTRAINT "cpu_estimate_estimate_id_fkey";

-- DropForeignKey
ALTER TABLE "cpu_estimate" DROP CONSTRAINT "cpu_estimate_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "cpu_pricing_table" DROP CONSTRAINT "cpu_pricing_table_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "gpu_estimate" DROP CONSTRAINT "gpu_estimate_estimate_id_fkey";

-- DropForeignKey
ALTER TABLE "gpu_estimate" DROP CONSTRAINT "gpu_estimate_gpu_id_fkey";

-- DropForeignKey
ALTER TABLE "gpu_estimate" DROP CONSTRAINT "gpu_estimate_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "gpu_pricing_table" DROP CONSTRAINT "gpu_pricing_table_shop_id_fkey";

-- AlterTable
ALTER TABLE "cpu_estimate" ALTER COLUMN "cpu_id" SET NOT NULL,
ALTER COLUMN "estimate_id" SET NOT NULL,
ALTER COLUMN "shop_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "cpu_pricing_table" ALTER COLUMN "shop_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "gpu_estimate" ALTER COLUMN "gpu_id" SET NOT NULL,
ALTER COLUMN "estimate_id" SET NOT NULL,
ALTER COLUMN "shop_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "gpu_pricing_table" ALTER COLUMN "shop_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "cpu_estimate" ADD CONSTRAINT "cpu_estimate_cpu_id_fkey" FOREIGN KEY ("cpu_id") REFERENCES "cpu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cpu_estimate" ADD CONSTRAINT "cpu_estimate_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "estimate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cpu_estimate" ADD CONSTRAINT "cpu_estimate_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gpu_estimate" ADD CONSTRAINT "gpu_estimate_gpu_id_fkey" FOREIGN KEY ("gpu_id") REFERENCES "gpu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gpu_estimate" ADD CONSTRAINT "gpu_estimate_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "estimate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gpu_estimate" ADD CONSTRAINT "gpu_estimate_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cpu_pricing_table" ADD CONSTRAINT "cpu_pricing_table_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gpu_pricing_table" ADD CONSTRAINT "gpu_pricing_table_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
