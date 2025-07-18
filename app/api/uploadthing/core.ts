import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/prisma/db";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: { maxFileCount: 30 },
    video: { maxFileCount: 3, maxFileSize: "1GB" },
    audio: { maxFileCount: 20, maxFileSize: "1GB" },
    text: { maxFileCount: 30 },
    pdf: { maxFileCount: 30 },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, files }) => {
      // This code runs on your server before upload
      const data = await getServerSession(authOptions);

      const user = data?.user;
      const bucketId = req.headers.get("bucket-id");

      if (!user || !bucketId) throw new UploadThingError("Unauthorized");

      let totalSizeBytes = files.reduce((a, file) => {
        return a + file.size;
      }, 0);

      const bucket = await prisma.bucket.findUnique({
        where: { id: bucketId },
      });

      if (!bucket) throw new UploadThingError("Bucket Not Found");

      const availableSize = bucket.size - bucket.usedSize;

      if (totalSizeBytes > availableSize)
        throw new UploadThingError("Not much space left.");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { bucketId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS after upload

      const { bucketId } = metadata;

      try {
        await prisma.file.create({
          data: {
            bucketId,
            name: file.name,
            size: file.size,
            type: file.type,
            url: file.url,
            key: file.key,
          },
        });
      } catch (e) {
        console.log(e);
      }

      try {
        await prisma.bucket.update({
          where: { id: bucketId },
          data: { usedSize: { increment: file.size } },
        });
        revalidatePath(`/buckets/${bucketId}`);
        revalidatePath(`/b/${bucketId}`);
      } catch (e) {
        console.log(e);
      }

      return { uploadedOn: metadata.bucketId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
