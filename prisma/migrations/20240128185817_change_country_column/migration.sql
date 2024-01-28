/*
  Warnings:

  - You are about to drop the column `country` on the `pickup_address` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `user_info` table. All the data in the column will be lost.
  - Added the required column `country` to the `user_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pickup_address" DROP COLUMN "country";

-- AlterTable
ALTER TABLE "user_info" DROP COLUMN "address",
ADD COLUMN     "country" "Country" NOT NULL;
