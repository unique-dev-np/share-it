"use server";

import prisma from "@/prisma/db";
import { unstable_cache } from "next/cache";

export async function BucketWithId(bucketId: string, userEmail: string | null) {
  if (userEmail) {
    return await prisma.bucket.findUnique({
      where: { id: bucketId, user: { email: userEmail } },
      include: { files: { select: { bucketId: true, size: true } } },
    });
  }

  return await prisma.bucket.findUnique({
    where: { id: bucketId },
    include: { files: { select: { bucketId: true, size: true } } },
  });
}

export async function BucketFilesWithId(
  bucketId: string,
  userEmail: string | null
) {
  if (userEmail) {
    return await prisma.file.findMany({
      where: { bucket: { id: bucketId, user: { email: userEmail } } },
    });
  }

  return await prisma.file.findMany({
    where: { bucketId },
  });
}

export async function PublicBucketWithId(bucketId: string) {
  return await prisma.bucket.findFirst({
    where: { id: bucketId, isLocked: false },
    include: { user: true, files: true },
  });
}

export const getCachedBucket = unstable_cache(
  async (id: string, userEmail: string | null) => BucketWithId(id, userEmail),
  ["bucket"],
  {
    revalidate: 60 * 5,
  }
);

export const getCachedFiles = unstable_cache(
  async (id: string, userEmail: string | null) =>
    BucketFilesWithId(id, userEmail),
  ["bucket-files"],
  {
    revalidate: 60 * 5,
  }
);

export const getCachedPublicBucket = unstable_cache(
  async (id: string) => PublicBucketWithId(id),
  ["public-bucket-files"],
  {
    revalidate: 60 * 5,
  }
);
