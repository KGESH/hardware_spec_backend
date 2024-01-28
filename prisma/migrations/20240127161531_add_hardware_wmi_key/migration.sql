/*
  Warnings:

  - Added the required column `hw_key` to the `cpu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hw_key` to the `gpu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cpu" ADD COLUMN     "hw_key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "gpu" ADD COLUMN     "hw_key" TEXT NOT NULL;
