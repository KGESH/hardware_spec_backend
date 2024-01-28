/*
  Warnings:

  - Changed the type of `totalSpace` on the `disk` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "disk" DROP COLUMN "totalSpace",
ADD COLUMN     "totalSpace" INTEGER NOT NULL;
