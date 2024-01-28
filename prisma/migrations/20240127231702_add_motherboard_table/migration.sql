-- CreateTable
CREATE TABLE "motherboard" (
    "id" UUID NOT NULL,
    "hw_key" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "chipset" TEXT NOT NULL,
    "metadata" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "motherboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motherboard_estimate" (
    "id" UUID NOT NULL,
    "motherboard_id" UUID NOT NULL,
    "estimate_id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "ai_answer_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "motherboard_estimate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "motherboard_hw_key_key" ON "motherboard"("hw_key");

-- AddForeignKey
ALTER TABLE "motherboard_estimate" ADD CONSTRAINT "motherboard_estimate_motherboard_id_fkey" FOREIGN KEY ("motherboard_id") REFERENCES "motherboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motherboard_estimate" ADD CONSTRAINT "motherboard_estimate_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "estimate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motherboard_estimate" ADD CONSTRAINT "motherboard_estimate_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motherboard_estimate" ADD CONSTRAINT "motherboard_estimate_ai_answer_id_fkey" FOREIGN KEY ("ai_answer_id") REFERENCES "ai_answer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
