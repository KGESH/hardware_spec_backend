/*
  Warnings:

  - You are about to drop the column `baseClock` on the `cpu` table. All the data in the column will be lost.
  - You are about to drop the column `boostClock` on the `cpu` table. All the data in the column will be lost.
  - You are about to drop the column `coreCount` on the `cpu` table. All the data in the column will be lost.
  - You are about to drop the column `modelName` on the `cpu` table. All the data in the column will be lost.
  - You are about to drop the column `threadCount` on the `cpu` table. All the data in the column will be lost.
  - You are about to drop the column `modelName` on the `gpu` table. All the data in the column will be lost.
  - Added the required column `core_count` to the `cpu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model_name` to the `cpu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model_name` to the `gpu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cpu" DROP COLUMN "baseClock",
DROP COLUMN "boostClock",
DROP COLUMN "coreCount",
DROP COLUMN "modelName",
DROP COLUMN "threadCount",
ADD COLUMN     "base_clock" DOUBLE PRECISION,
ADD COLUMN     "boost_clock" DOUBLE PRECISION,
ADD COLUMN     "core_count" INTEGER NOT NULL,
ADD COLUMN     "model_name" TEXT NOT NULL,
ADD COLUMN     "thread_count" INTEGER;

-- AlterTable
ALTER TABLE "gpu" DROP COLUMN "modelName",
ADD COLUMN     "model_name" TEXT NOT NULL,
ADD COLUMN     "sub_vendor" TEXT;
