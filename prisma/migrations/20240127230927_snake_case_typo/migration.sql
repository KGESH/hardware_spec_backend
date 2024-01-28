/*
  Warnings:

  - You are about to drop the column `totalSpace` on the `disk` table. All the data in the column will be lost.
  - Added the required column `total_space` to the `disk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "disk" DROP COLUMN "totalSpace",
ADD COLUMN     "total_space" INTEGER NOT NULL;
