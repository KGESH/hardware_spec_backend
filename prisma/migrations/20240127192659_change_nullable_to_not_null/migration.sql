/*
  Warnings:

  - Made the column `name` on table `estimate` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "estimate" ALTER COLUMN "name" SET NOT NULL;
