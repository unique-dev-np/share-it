import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import InfoCards from "@/components/dashboard/InfoCards";
import RecentBucketsTable from "@/components/dashboard/RecentBucketsTable";
import RecentFilesTable from "@/components/dashboard/RecentFilesTable";
import { isBucketExpired } from "@/lib/utils";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return redirect("/signin");
  }

  const buckets = await prisma.bucket.findMany({
    where: { userId: user.id },
    include: { files: true },
    orderBy: { createdAt: "desc" },
  });

  const activeBuckets = buckets.filter(
    (bucket) => !isBucketExpired(bucket.expiresIn)
  );

  const recentFiles = await prisma.file.findMany({
    where: {
      bucket: {
        userId: user.id,
        expiresIn: {
          gt: new Date(),
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const totalFiles = activeBuckets.reduce((acc, bucket) => acc + bucket.files.length, 0);
  const totalSize = activeBuckets.reduce((acc, bucket) => acc + bucket.usedSize, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/buckets">
          <Button>
            <PlusCircle className="mr-2" />
            Create New Bucket
          </Button>
        </Link>
      </div>

      <InfoCards
        totalBuckets={buckets.filter((bucket) => !isBucketExpired(bucket.expiresIn)).length}
        totalFiles={totalFiles}
        totalSize={totalSize}
      />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Buckets</h2>
        <RecentBucketsTable buckets={buckets.slice(0, 5)} />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Files</h2>
        <RecentFilesTable files={recentFiles} />
      </div>
    </div>
  );
}