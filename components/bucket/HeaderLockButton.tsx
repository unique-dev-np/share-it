"use client";

import GlobalAlertDialog from "@/components/common/GlobalAlertDialog";
import { Button } from "@/components/ui/button";
import { Loader, Lock, LockOpen, Trash } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function HeaderLockButton({
  isLocked,
  bucketId,
  revalidate,
}: {
  isLocked: boolean;
  bucketId: string;
  revalidate: (id: string) => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLockedClient, setIsLockedClient] = useState(isLocked);

  async function changeLocked() {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/bucket/lock", {
        method: "POST",
        body: JSON.stringify({ isLocked: isLockedClient, bucketId }),
      });

      const { success, message, isLocked: updatedIsLocked } = await res.json();

      if (success) {
        setIsLockedClient(updatedIsLocked);
        revalidate(bucketId);

        if (updatedIsLocked) {
          toast.success("Your files are now private.");
        }
        else {
          toast.success("Your files are public.");
        }
      } else {

        toast.error(message);
      }

    } catch (e) {
      toast.error("Failed to change bucket lock status.");
    }
    setIsLoading(false);
  }

  if (isLoading)
    return (
      <Button disabled>
        <Loader className="h-[20px] mr-2 animate-spin" /> Loading
      </Button>
    );

  if (isLockedClient)
    return (
      <GlobalAlertDialog
        action={changeLocked}
        title="Are you sure you want to unlock this bucket?"
        description="This action will make your files accessible to anyone with the link."
      >
        <Button>
          <LockOpen className="h-[20px] mr-2" /> Unlock
        </Button>
      </GlobalAlertDialog>
    );

  return (
    <GlobalAlertDialog
      action={changeLocked}
      title="Are you sure you want to lock this bucket?"
      description="This action will make your files inaccessible to everyone."
    >
      <Button variant="destructive">
        <Lock className="h-[20px] mr-2" /> Lock
      </Button>
    </GlobalAlertDialog>
  );
}
