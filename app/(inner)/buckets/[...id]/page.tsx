import ExpiryTimeCard from "@/components/bucket/BucketExpiryCard";
import SizeCard from "@/components/bucket/BucketSizeCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getCachedBucket, getCachedFiles } from "@/server/data";
import { File, FileBarChart, Gauge } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import FilesTable from "@/components/bucket/BucketFilesTable";
import FileUploadDropzone from "@/components/bucket/BucketFileUploadDropzone";
import { bytesToMB, isBucketExpired } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import HeaderLockButton from "@/components/bucket/HeaderLockButton";
import HeaderDeleteButton from "@/components/bucket/HeaderDeleteButton";
import HeaderShareButton from "@/components/bucket/HeaderShareButton";

async function revalidateBucket(id: string) {
  "use server";
  revalidatePath(`/buckets/${id}`);
  revalidatePath(`/b/${id}`);
  redirect(`/buckets/${id}`);
}

export default async function page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) return <div>Loading...</div>;

  const bucketID = params.id[0];
  const bucket = await getCachedBucket(bucketID, session.user.email);
  const files = await getCachedFiles(bucketID, session.user.email);

  if (!bucket || isBucketExpired(bucket.expiresIn)) {
    return <div>Bucket Not Found</div>;
  }

  console.log(bucket.files);

  return (
    <>
      <header className="md:px-12 mt-4 flex justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={"/buckets"}>Buckets</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-2xl">
              <BreadcrumbPage>{bucket.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="actions flex gap-4 items-center">

          {!bucket.isLocked &&
            <HeaderShareButton bucketId={bucket.id} />
          }

          <HeaderLockButton
            revalidate={revalidateBucket}
            bucketId={bucket.id}
            isLocked={bucket.isLocked}
          />

          <HeaderDeleteButton
            bucketId={bucket.id}
            revalidate={revalidateBucket}
          />

        </div>
      </header>

      <Separator className="my-4" />

      <section className="analytics px-12">
        <h1 className="font-bold text-2xl my-8 flex  items-center">
          <FileBarChart className="mr-2" /> Analytics
        </h1>

        <div className="info-cards flex gap-8 justify-center  flex-wrap ">
          <SizeCard
            id={bucket.id}
            userEmail={session.user.email}
            size={bucket.size}
            expiryTime={bucket.expiresIn}
            revalidate={revalidateBucket}
          />

          <ExpiryTimeCard
            userEmail={session.user.email}
            size={bucket.size}
            revalidate={revalidateBucket}
            id={bucket.id}
            expiryDate={bucket.expiresIn}
          />

          <Card className="max-w-sm w-fit min-w-52">
            <CardHeader className="flex flex-row items-center justify-center  gap-4 ">
              <File />
              <p>File Count</p>
            </CardHeader>
            <CardContent>
              <h1 className="font-bold text-2xl">{bucket.files.length}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Files Stored
              </p>
            </CardContent>
          </Card>
          <Card className="max-w-sm w-fit min-w-52">
            <CardHeader className="flex flex-row items-center justify-center  gap-4 ">
              <Gauge />
              <p>File Size</p>
            </CardHeader>
            <CardContent>
              <h1 className="font-bold text-2xl">
                {bucket.files
                  .reduce((a, b) => {
                    return a + bytesToMB(b.size);
                  }, 0)
                  .toFixed(2)}
                MB
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Used Storage
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="files px-12">
        <FileUploadDropzone revalidate={revalidateBucket} bucketID={bucketID} />
        <FilesTable
          bucketName={bucket.name}
          files={files}
          revalidate={revalidateBucket}
        />
      </section>
    </>
  );
}
