/*
  Warnings:

  - A unique constraint covering the columns `[hw_key]` on the table `cpu` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hw_key]` on the table `gpu` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cpu_hw_key_key" ON "cpu"("hw_key");

-- CreateIndex
CREATE UNIQUE INDEX "gpu_hw_key_key" ON "gpu"("hw_key");
