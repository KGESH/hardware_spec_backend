/*
  Warnings:

  - You are about to drop the column `name` on the `cpu` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `cpu` table. All the data in the column will be lost.
  - You are about to drop the column `cpu_id` on the `estimate` table. All the data in the column will be lost.
  - You are about to drop the `sample_estimate` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `coreCount` to the `cpu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelName` to the `cpu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendor` to the `cpu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `estimate` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Country" AS ENUM ('KR', 'US', 'JP', 'CN', 'VN');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('KRW', 'USD', 'JPY', 'CNY', 'VND');

-- CreateEnum
CREATE TYPE "HardwareType" AS ENUM ('CPU', 'GPU', 'RAM', 'M/B', 'DISK', 'OTHER');

-- DropForeignKey
ALTER TABLE "estimate" DROP CONSTRAINT "estimate_cpu_id_fkey";

-- AlterTable
ALTER TABLE "cpu" DROP COLUMN "name",
DROP COLUMN "price",
ADD COLUMN     "baseClock" DOUBLE PRECISION,
ADD COLUMN     "boostClock" DOUBLE PRECISION,
ADD COLUMN     "coreCount" INTEGER NOT NULL,
ADD COLUMN     "metadata" TEXT,
ADD COLUMN     "modelName" TEXT NOT NULL,
ADD COLUMN     "threadCount" INTEGER,
ADD COLUMN     "vendor" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "estimate" DROP COLUMN "cpu_id",
ADD COLUMN     "country" "Country" NOT NULL;

-- DropTable
DROP TABLE "sample_estimate";

-- CreateTable
CREATE TABLE "shop" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "country" "Country" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cpu_estimate" (
    "id" UUID NOT NULL,
    "cpu_id" UUID,
    "estimate_id" UUID,
    "shop_id" UUID,
    "ai_answer_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "cpu_estimate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_answer" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "table_price" DOUBLE PRECISION NOT NULL,
    "buying_price" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL,
    "metadata" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "ai_answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gpu" (
    "id" UUID NOT NULL,
    "modelName" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "chipset" TEXT NOT NULL,
    "metadata" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "gpu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gpu_estimate" (
    "id" UUID NOT NULL,
    "gpu_id" UUID,
    "estimate_id" UUID,
    "shop_id" UUID,
    "ai_answer_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "gpu_estimate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cpu_pricing_table" (
    "id" UUID NOT NULL,
    "shop_id" UUID,
    "sheets" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "cpu_pricing_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gpu_pricing_table" (
    "id" UUID NOT NULL,
    "shop_id" UUID,
    "sheets" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "gpu_pricing_table_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cpu_estimate" ADD CONSTRAINT "cpu_estimate_cpu_id_fkey" FOREIGN KEY ("cpu_id") REFERENCES "cpu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cpu_estimate" ADD CONSTRAINT "cpu_estimate_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "estimate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cpu_estimate" ADD CONSTRAINT "cpu_estimate_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cpu_estimate" ADD CONSTRAINT "cpu_estimate_ai_answer_id_fkey" FOREIGN KEY ("ai_answer_id") REFERENCES "ai_answer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gpu_estimate" ADD CONSTRAINT "gpu_estimate_gpu_id_fkey" FOREIGN KEY ("gpu_id") REFERENCES "gpu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gpu_estimate" ADD CONSTRAINT "gpu_estimate_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "estimate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gpu_estimate" ADD CONSTRAINT "gpu_estimate_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gpu_estimate" ADD CONSTRAINT "gpu_estimate_ai_answer_id_fkey" FOREIGN KEY ("ai_answer_id") REFERENCES "ai_answer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cpu_pricing_table" ADD CONSTRAINT "cpu_pricing_table_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gpu_pricing_table" ADD CONSTRAINT "gpu_pricing_table_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
