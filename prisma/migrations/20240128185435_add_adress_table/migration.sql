-- CreateTable
CREATE TABLE "pickup_address" (
    "id" UUID NOT NULL,
    "user_info_id" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "adress_detail" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "pickup_address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pickup_address_user_info_id_key" ON "pickup_address"("user_info_id");

-- AddForeignKey
ALTER TABLE "pickup_address" ADD CONSTRAINT "pickup_address_user_info_id_fkey" FOREIGN KEY ("user_info_id") REFERENCES "user_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;
