-- CreateTable
CREATE TABLE "estimate" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "cpu_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "estimate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cpu" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "cpu_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "estimate" ADD CONSTRAINT "estimate_cpu_id_fkey" FOREIGN KEY ("cpu_id") REFERENCES "cpu"("id") ON DELETE SET NULL ON UPDATE CASCADE;
