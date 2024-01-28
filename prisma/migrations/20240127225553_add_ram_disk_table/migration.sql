-- CreateTable
CREATE TABLE "ram" (
    "id" UUID NOT NULL,
    "hw_key" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "metadata" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "ram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disk" (
    "id" UUID NOT NULL,
    "hw_key" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "totalSpace" TEXT NOT NULL,
    "metadata" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "disk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ram_estimate" (
    "id" UUID NOT NULL,
    "ram_id" UUID NOT NULL,
    "estimate_id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "ai_answer_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "ram_estimate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ram_hw_key_key" ON "ram"("hw_key");

-- CreateIndex
CREATE UNIQUE INDEX "disk_hw_key_key" ON "disk"("hw_key");

-- AddForeignKey
ALTER TABLE "ram_estimate" ADD CONSTRAINT "ram_estimate_ram_id_fkey" FOREIGN KEY ("ram_id") REFERENCES "ram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ram_estimate" ADD CONSTRAINT "ram_estimate_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "estimate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ram_estimate" ADD CONSTRAINT "ram_estimate_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ram_estimate" ADD CONSTRAINT "ram_estimate_ai_answer_id_fkey" FOREIGN KEY ("ai_answer_id") REFERENCES "ai_answer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
