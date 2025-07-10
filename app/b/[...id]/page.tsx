import { Separator } from "@/components/ui/separator";
import prisma from "@/prisma/db";
import { Database, File, FileBarChart, Gauge } from "lucide-react";
import TimeCard from "./components/TimeCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { bytesToMB } from "@/lib/utils";
import SizeCard from "./components/SizeCard";
import FilesTable from "./components/Filestable";
import { getCachedPublicBucket } from "@/server/data";

export default async function page({ params }: { params: { id: string } }) {
  const bucketID = params.id[0];

  const bucket = await getCachedPublicBucket(bucketID);
  // const bucket = await prisma.bucket.findFirst({
  //   where: { id: bucketID, isLocked: false },
  //   include: { user: true, files: true },
  // });

  if (!bucket) {
    return <div>Bucket Not Found</div>;
  }

  return (
    <main className="bg-slate-100 min-h-screen">
      <header className="md:px-12 py-4 flex items-center justify-center gap-2">
        <Database className="h-[25px]" />
        <h1 className="text-3xl font-semibold capitalize">{bucket.name}</h1>
        <Separator
          orientation="horizontal"
          className=" w-[15px] h-[4px] bg-black/40 mx-4"
        />
        <h2 className="text-2xl">{bucket.user.name}</h2>
      </header>

      {/* <Separator className="my-4" /> */}

      <section className="analytics px-12 py-8">
        <div className="info-cards flex gap-8 justify-center  flex-wrap ">
          <SizeCard size={bucket.size} />

          <TimeCard expiryDate={bucket.expiresIn} />

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
                  .toFixed(2)}{" "}
                MB
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Used Storage
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="files px-12 md:px-28">
        <FilesTable bucketName={bucket.name} files={bucket.files} />
      </section>
    </main>
  );
}
