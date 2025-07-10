/*
  Warnings:

  - The primary key for the `Bucket` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_bucketId_fkey";

-- AlterTable
ALTER TABLE "Bucket" DROP CONSTRAINT "Bucket_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Bucket_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Bucket_id_seq";

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "bucketId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_bucketId_fkey" FOREIGN KEY ("bucketId") REFERENCES "Bucket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
