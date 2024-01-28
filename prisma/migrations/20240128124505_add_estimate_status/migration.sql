/*
  Warnings:

  - Added the required column `status` to the `estimate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "estimate" ADD COLUMN     "status" "EstimateStatus" NOT NULL;
