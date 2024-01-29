-- DropForeignKey
ALTER TABLE "cpu_pricing_table" DROP CONSTRAINT "cpu_pricing_table_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "disk_pricing_table" DROP CONSTRAINT "disk_pricing_table_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "gpu_pricing_table" DROP CONSTRAINT "gpu_pricing_table_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "motherboard_pricing_table" DROP CONSTRAINT "motherboard_pricing_table_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "ram_pricing_table" DROP CONSTRAINT "ram_pricing_table_shop_id_fkey";

-- AddForeignKey
ALTER TABLE "cpu_pricing_table" ADD CONSTRAINT "cpu_pricing_table_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gpu_pricing_table" ADD CONSTRAINT "gpu_pricing_table_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motherboard_pricing_table" ADD CONSTRAINT "motherboard_pricing_table_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ram_pricing_table" ADD CONSTRAINT "ram_pricing_table_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disk_pricing_table" ADD CONSTRAINT "disk_pricing_table_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
