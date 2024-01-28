-- CreateTable
CREATE TABLE "motherboard_pricing_table" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "sheets" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "motherboard_pricing_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ram_pricing_table" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "sheets" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "ram_pricing_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disk_pricing_table" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "sheets" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "disk_pricing_table_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "motherboard_pricing_table" ADD CONSTRAINT "motherboard_pricing_table_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ram_pricing_table" ADD CONSTRAINT "ram_pricing_table_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disk_pricing_table" ADD CONSTRAINT "disk_pricing_table_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
