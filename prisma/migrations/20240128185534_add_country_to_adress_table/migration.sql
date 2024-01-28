/*
  Warnings:

  - Added the required column `country` to the `pickup_address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pickup_address" ADD COLUMN     "country" "Country" NOT NULL;
