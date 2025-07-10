-- AlterTable
ALTER TABLE "Bucket" ADD CONSTRAINT "Bucket_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "File" ADD CONSTRAINT "File_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
