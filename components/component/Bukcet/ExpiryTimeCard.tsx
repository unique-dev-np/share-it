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
import { BucketAges, BucketSizes } from "@/globalvariables";
import {
  bytesToMB,
  checkDifference,
  getPreetyTime,
  TimeCost,
} from "@/lib/utils";
import { AlarmClock, AlarmClockPlus, Loader, PackagePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ExpiryTimeCard({
  expiryDate,
  id,
  revalidate,
  size,
  userEmail,
}: {
  expiryDate: Date;
  id: string;
  revalidate: (id: string) => Promise<void>;
  size: number;
  userEmail: string;
}) {
  let [expiryDateClient, setExpiryDate] = useState(expiryDate);
  let [expiresIn, setExpiresIn] = useState<number>(0);

  let [open, setOpen] = useState(false);

  let [addedTime, setAddedTime] = useState("");
  let [cost, setCost] = useState(0);

  let [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval = setInterval(() => {
      setExpiresIn(checkDifference(expiryDateClient));
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryDateClient]);

  useEffect(() => {
    let lifeCost = TimeCost(Number(addedTime), bytesToMB(size)).toFixed(2);

    setCost(Number(lifeCost));
  }, [addedTime, size]);

  async function addTime() {
    setLoading(true);
    let res = await fetch("/api/bucket/time", {
      method: "POST",
      body: JSON.stringify({ id, addedTime, userEmail, size }),
    });

    let { success, message, newExpiry } = await res.json();

    if (success) {
      revalidate(id);
      setOpen(false);
      setExpiryDate(newExpiry);
      toast.success(message);
    } else {
      toast.error(message);
    }
    setLoading(false);
  }

  return (
    <Card className="max-w-sm w-fit min-w-52">
      <CardHeader className="flex flex-row items-center justify-center  gap-4 ">
        <AlarmClock />
        <p>Expiry Time</p>
      </CardHeader>
      <CardContent>
        <h1 className="font-bold text-2xl">{getPreetyTime(expiresIn)}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
        <Separator className="my-2" />
        <div className="actions flex items-center gap-4 ">
          <Dialog open={open} onOpenChange={setOpen}>
            <Button asChild className="px-2  text-sm" variant={"default"}>
              <DialogTrigger>
                <AlarmClockPlus className="w-[20px] mr-2" /> Add
              </DialogTrigger>
            </Button>
            <DialogContent>
              <DialogDescription />
              <DialogTitle className="flex gap-2 items-center">
                <AlarmClockPlus />
                Add Time
              </DialogTitle>

              {/* <p className="text-sm px-4 mt-4">
                Select the amount of time you want to add from the packages
                below
              </p> */}

              <Select value={addedTime} onValueChange={(e) => setAddedTime(e)}>
                <SelectTrigger className="mt-5">
                  <SelectValue placeholder="Select a Package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Time in Minutes</SelectLabel>
                    {BucketAges.map((age, index) => (
                      <SelectItem
                        key={index}
                        defaultChecked={age.default}
                        value={age.age + ""}
                      >
                        {age.age}
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
                    <Loader className="animate-spin" /> Adding Time
                  </Button>
                ) : (
                  <Button onClick={() => addTime()} className="ml-4 gap-2">
                    <PackagePlus /> Add Time
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
