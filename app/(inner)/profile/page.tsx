import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/prisma/db";
import { redirect } from "next/navigation";
import Header from "./components/Header";
import InfoCards from "./components/InfoCards";
import RecentBucketsTable from "./components/RecentBucketsTable";
import PaymentHistoryTable from "./components/PaymentHistoryTable";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      buckets: {
        orderBy: { createdAt: "desc" },
      },
      Payment: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    return redirect("/signin");
  }

  const totalBuckets = user.buckets.length;
  const now = new Date();
  const nonExpiredBuckets = user.buckets.filter(
    (bucket) => bucket.expiresIn > now
  );
  const totalFiles = await prisma.file.count({
    where: {
      bucketId: {
        in: nonExpiredBuckets.map((bucket) => bucket.id),
      },
    },
  });
  const totalSize = nonExpiredBuckets.reduce(
    (acc, bucket) => acc + bucket.usedSize,
    0
  );

  return (
    <div className="p-8">
      <Header name={user.name} email={user.email} image={user.image || ""} />
      <div className="mt-8">
        <InfoCards 
          balance={user.balance}
          totalBuckets={totalBuckets} 
          totalFiles={totalFiles} 
          totalSize={totalSize} 
        />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Buckets</h2>
        <RecentBucketsTable buckets={user.buckets.slice(0, 5)} />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Payment History</h2>
        <PaymentHistoryTable payments={user.Payment} />
      </div>
    </div>
  );
}
