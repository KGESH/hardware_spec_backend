-- CreateTable
CREATE TABLE "sample_estimate" (
    "id" UUID NOT NULL,
    "sheets" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "sample_estimate_pkey" PRIMARY KEY ("id")
);
