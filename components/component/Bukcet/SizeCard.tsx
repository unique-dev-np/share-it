"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { BucketSizes } from "@/globalvariables";
import { AddedSizeCost, bytesToMB, checkDifference } from "@/lib/utils";
import { Database, Loader, PackagePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function SizeCard({
  size,
  expiryTime,
  id,
  userEmail,
  revalidate,
}: {
  size: number;
  expiryTime: Date;
  id: string;
  userEmail: string;
  revalidate: (id: string) => Promise<void>;
}) {
  const [newSize, setNewSize] = useState("100");
  const [loading, setLoading] = useState(false);
  const [cost, setCost] = useState(0);
  const [open, setOpen] = useState(false);

  async function addSize() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/bucket/size", {
        method: "POST",
        body: JSON.stringify({
          id,
          userEmail,
          addedSize: newSize,
          expiryTime,
        }),
      });

      const { success, message } = await res.json();

      if (success) {
        await revalidate(id);
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (e) {
      toast.error("Failed to add size.");
    }
    setLoading(false);
    setOpen(false);
  }

  useEffect(() => {
    const remainingSeconds = checkDifference(expiryTime);
    const remainingMinutes = remainingSeconds / 60;

    // console.log(remainingMinutes);

    const newCost = AddedSizeCost(
      bytesToMB(parseInt(newSize)),
      remainingMinutes
    ).toFixed(2);

    setCost(Number(newCost));
  }, [newSize, expiryTime]);

  return (
    <Card className="max-w-sm w-fit min-w-52">
      <CardHeader className="flex flex-row items-center justify-center  gap-4 ">
        <Database />
        <p>Bucket Size</p>
      </CardHeader>
      <CardContent>
        <h1 className="font-bold text-2xl">{bytesToMB(size)} MB</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Total Storage
        </p>
        <Separator className="my-2" />
        <div className="actions flex items-center gap-4 ">
          <Dialog open={open} onOpenChange={setOpen}>
            <Button asChild className="px-2  text-sm" variant={"default"}>
              <DialogTrigger>
                <PackagePlus className="w-[20px] mr-2" /> Upgrade
              </DialogTrigger>
            </Button>
            <DialogContent>
              <DialogDescription />
              <DialogTitle className="flex gap-2 items-center">
                <PackagePlus />
                Add Size
              </DialogTitle>

              {/* <p className="text-sm px-4 mt-4">
                Select the amount of time you want to add from the packages
                below
              </p> */}

              <Select value={newSize} onValueChange={(e) => setNewSize(e)}>
                <SelectTrigger className="mt-5">
                  <SelectValue placeholder="Select a Package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Packages in Mega Bytes (MB)</SelectLabel>
                    {BucketSizes.map((size, index) => (
                      <SelectItem
                        key={index}
                        defaultChecked={size.default}
                        value={String(size.size)}
                      >
                        {bytesToMB(size.size)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <DialogFooter className="items-center gap-6 mt-5">
                <div className="info flex items-center gap-4">
                  <Badge className="flex gap-2 py-2">
                    <p>Total Cost: </p> <p>{cost}</p>
                  </Badge>
                  <Badge className="flex gap-2 py-2" variant="secondary">
                    <p>Your Balance: </p> <p>10</p>
                  </Badge>
                </div>
                {loading ? (
                  <Button disabled className="ml-4 gap-2">
                    <Loader className="animate-spin" /> Adding Size
                  </Button>
                ) : (
                  <Button onClick={() => addSize()} className="ml-4 gap-2">
                    <PackagePlus /> Add Size
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
