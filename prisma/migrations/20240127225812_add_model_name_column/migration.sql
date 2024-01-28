/*
  Warnings:

  - Added the required column `model_name` to the `disk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model_name` to the `ram` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "disk" ADD COLUMN     "model_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ram" ADD COLUMN     "model_name" TEXT NOT NULL;
