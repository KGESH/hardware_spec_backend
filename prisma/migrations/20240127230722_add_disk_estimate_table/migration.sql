-- CreateTable
CREATE TABLE "disk_estimate" (
    "id" UUID NOT NULL,
    "disk_id" UUID NOT NULL,
    "estimate_id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "ai_answer_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "disk_estimate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "disk_estimate" ADD CONSTRAINT "disk_estimate_disk_id_fkey" FOREIGN KEY ("disk_id") REFERENCES "disk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disk_estimate" ADD CONSTRAINT "disk_estimate_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "estimate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disk_estimate" ADD CONSTRAINT "disk_estimate_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disk_estimate" ADD CONSTRAINT "disk_estimate_ai_answer_id_fkey" FOREIGN KEY ("ai_answer_id") REFERENCES "ai_answer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
