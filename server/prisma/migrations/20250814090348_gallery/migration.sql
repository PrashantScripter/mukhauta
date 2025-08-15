-- CreateTable
CREATE TABLE "public"."Gallery" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "ImageUrl" TEXT NOT NULL,
    "imagePublicId" TEXT,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);
