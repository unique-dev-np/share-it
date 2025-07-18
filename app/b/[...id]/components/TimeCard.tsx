"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { checkDifference, getPreetyTime, isBucketExpired } from "@/lib/utils";
import { AlarmClock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TimeCard({ expiryDate }: { expiryDate: Date }) {
  let [expiryDateClient] = useState(expiryDate);
  let [expiresIn, setExpiresIn] = useState<number>(0);


  const router = useRouter()

  useEffect(() => {
    let interval = setInterval(() => {

      if (isBucketExpired(expiryDateClient)) {
        router.refresh()
      }

      setExpiresIn(checkDifference(expiryDateClient));
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryDateClient, router]);

  return (
    <Card className="max-w-sm w-fit min-w-52">
      <CardHeader className="flex flex-row items-center justify-center  gap-4 ">
        <AlarmClock />
        <p>Expiry Time</p>
      </CardHeader>
      <CardContent>
        <h1 className="font-bold text-2xl">{getPreetyTime(expiresIn)}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
      </CardContent>
    </Card>
  );
}
