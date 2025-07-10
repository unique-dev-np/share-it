"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { bytesToMB } from "@/lib/utils";
import { Database } from "lucide-react";

export default function SizeCard({ size }: { size: number }) {
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
      </CardContent>
    </Card>
  );
}
