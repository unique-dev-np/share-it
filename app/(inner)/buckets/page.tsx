import { authOptions } from "@/lib/auth";
import BucketCard from "@/components/component/BucketCard";
import BucketCreateModal from "@/components/component/BucketCreateModal";
import { Separator } from "@/components/ui/separator";
import prisma from "@/prisma/db";
import { getServerSession, Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function getBuckets(session: Session | null) {
  if (!session) return [];

  if (session.user) {
    let buckets = await prisma.bucket.findMany({
      where: { user: { email: session.user.email as string } },
      select: {
        size: true,
        usedSize: true,
        name: true,
        expiresIn: true,
        id: true,
      },
    });

    return buckets;
  }

  return [];
}

async function revalidateBuckets() {
  "use server";
  // revalidatePath("/buckets");
  redirect("/buckets");
}

export default async function page() {
  const session = await getServerSession(authOptions);

  const buckets = await getBuckets(session);

  return (
    <>
      <header className="flex justify-between md:px-12 mt-4">
        <h1 className=" font-bold text-2xl">Your Buckets</h1>
        <BucketCreateModal revalidate={revalidateBuckets} session={session} />
      </header>

      <Separator className="w-full my-4" />

      {buckets.length < 1 && <div>No Buckets Found</div>}

      <div className="buckets-container flex justify-center flex-wrap gap-4  ">
        {buckets.map((bucket) => (
          <BucketCard
            revalidate={revalidateBuckets}
            key={bucket.id}
            bucket={bucket}
          />
        ))}
      </div>
    </>
  );
}
