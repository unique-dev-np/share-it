"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import BucketCardDropdownMenu from "./BucketCardMenu";
import { Button } from "@/components/ui/button";
import { ExternalLink, Share2, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { bytesToMB, checkDifference, cn, getPreetyTime } from "@/lib/utils";
import GlobalAlertDialog from "@/components/common/GlobalAlertDialog";

export default function BucketCard({
  bucket,
  revalidate,
}: {
  bucket: {
    id: string;
    name: string;
    size: number;
    usedSize: number;
    expiresIn: Date;
    isLocked: boolean;
  };
  revalidate: () => Promise<void>;
}) {
  let [loading, setLoading] = useState(false);
  let [expiresIn, setExpiresIn] = useState<number>(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setExpiresIn(checkDifference(bucket.expiresIn));
    }, 100);

    return () => clearInterval(interval);
  }, [bucket.expiresIn]);

  async function deleteBucket(id: string) {
    if (loading) return;
    setLoading(true);
    try {
      let res = await fetch("/api/bucket", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });

      let { success, message } = await res.json();

      if (success) {
        toast.success(message);
        revalidate();
      } else {
        toast.error(message);
      }
    } catch (e: any) {
      console.log(e);
      toast.error("Failed to delete bucket.");
    } finally {
      setLoading(false);
    }
  }

  const handleShare = (id: string) => {
    const shareableLink = `${window.location.origin}/b/${id}`;
    navigator.clipboard.writeText(shareableLink);
    toast.success("Shareable link copied to clipboard!");
  };

  return (
    <Card
      key={bucket.id}
      className={cn(
        "bg-white dark:bg-gray-950 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300  max-w-xs",
        (expiresIn < 0 || loading) && "opacity-80 cursor-not-allowed"
      )}
    >
      <CardContent className="p-6 space-y-4">
        <div className="flex gap-8 items-center justify-between bg-primary-foreground px-4 py-2 rounded-md">
          <h3 className="text-lg font-semibold">{bucket.name}</h3>
          <div className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-sm font-medium">
            {bucket.size / (1000 * 1000)} MB
          </div>
        </div>
        <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
          <div>Used Space</div>
          <div>{bytesToMB(bucket.usedSize).toFixed(2)} MB</div>
        </div>
        {expiresIn >= 0 ? (
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <div>Expries In:</div>
            <div className="bg-destructive text-primary-foreground p-1 rounded-lg ml-2 text-sm ">
              {getPreetyTime(expiresIn)}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <div>Expries In:</div>
            <div className="bg-destructive text-primary-foreground p-1 rounded-lg ml-2 text-sm ">
              Expired
            </div>
          </div>
        )}
      </CardContent>
      <Separator className="mb-2" />
      <CardFooter className=" gap-4 justify-center">
        {expiresIn >= 0 && (
          <Button asChild className="w-fit" variant="outline">
            <Link href={`/buckets/${bucket.id}`}>
              <ExternalLink className="w-[20px] mr-2" />
              Open
            </Link>
          </Button>
        )}
        <Button
          disabled={expiresIn < 0 || bucket.isLocked}
          className="w-fit"
          variant="outline"
          onClick={() => handleShare(bucket.id)}
        >
          <Share2 className="w-[20px] mr-2" /> Share
        </Button>

        <GlobalAlertDialog
          title="  Are you sure you want to delete this bucket?"
          description="This action cannot be undone. This will permanently delete your
            bucket and remove your files from our servers."
          action={() => deleteBucket(bucket.id)}
          innerButtonElement={
            <Button>
              <Trash className="w-[20px] mr-2" /> Delete
            </Button>
          }
        >
          <Button
            disabled={loading}
            className="w-fit md:block "
            variant="outline"
          >
            <Trash className="w-[20px] mr" />
          </Button>
        </GlobalAlertDialog>

        <BucketCardDropdownMenu />
      </CardFooter>
    </Card>
  );
}
