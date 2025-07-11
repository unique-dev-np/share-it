/*
  Warnings:

  - Added the required column `key` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bucket" DROP CONSTRAINT "Bucket_userId_fkey";

-- AlterTable
ALTER TABLE "Bucket" ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT,
ALTER COLUMN "balance" SET DEFAULT 0,
ALTER COLUMN "balance" SET DATA TYPE DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Bucket" ADD CONSTRAINT "Bucket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
