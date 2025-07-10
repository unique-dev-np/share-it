"use client";

import GlobalAlertDialog from "@/components/component/GlobalAlertDialog";

import { Button } from "@/components/ui/button";
import { Loader, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function HeaderDeleteButton({
  bucketId,
  revalidate,
}: {
  bucketId: string;
  revalidate: (id: string) => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function deleteBucket() {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/bucket", {
        method: "DELETE",
        body: JSON.stringify({ id: bucketId }),
      });

      const { success, message } = await res.json();

      setIsLoading(false);
      if (success) {
        revalidate(bucketId);
        router.push("/buckets");
      }
      console.log(message);
    } catch (e) {
      console.log(e);
    }
  }

  if (isLoading)
    return (
      <Button disabled>
        <Loader className="h-[20px] mr-2 animate-spin" /> Loading
      </Button>
    );

  return (
    <GlobalAlertDialog
      title="  Are you sure you want to delete this bucket?"
      description="This action cannot be undone. This will permanently delete your
            bucket and remove your files from our servers."
      action={deleteBucket}
    >
      <Button variant="destructive">
        <Trash className="h-[20px] mr-2" /> Delete
      </Button>
    </GlobalAlertDialog>
  );
}
