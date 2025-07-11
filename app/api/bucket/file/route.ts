import { utapi } from "@/server/uploadthing";
import { File, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const { files }: { files: File[] } = await req.json();

  const prisma = new PrismaClient();

  try {
    // await prisma.$transaction(async (tx) => {
    for (const file of files) {
      await prisma.bucket.update({
        where: { id: file.bucketId },
        data: {
          usedSize: { decrement: file.size },
        },
      });

      await utapi.deleteFiles(file.key);

      await prisma.file.delete({
        where: {
          id: file.id,
        },
      });
    }
    // });

    return NextResponse.json({
      success: true,
      message: `File(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting files: ", error);
    return NextResponse.json({
      success: false,
      message: "Failed to delete files.",
    });
  } finally {
    await prisma.$disconnect();
  }
}
