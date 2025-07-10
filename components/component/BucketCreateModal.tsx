"use client";

import { Database, Loader, PackagePlus, PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ChangeEvent, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { BucketAges, BucketSizes } from "@/globalvariables";
import { CreateBucketFormValidator } from "@/types";
import { ZodError } from "zod";
import { Session } from "next-auth";
import { bytesToMB, CreationCostCalculation } from "@/lib/utils";

export default function BucketCreateModal({
  revalidate,
  session,
}: {
  revalidate: () => Promise<void>;
  session: Session | null;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    life: "",
    size: "",
  });

  const [cost, setCost] = useState(0);

  async function createBucket() {
    try {
      CreateBucketFormValidator.parse(formData);
    } catch (e) {
      if (e instanceof ZodError) {
        console.log(e.issues);
      }
    }

    setLoading(true);

    try {
      let res = await fetch("/api/bucket", {
        method: "POST",
        body: JSON.stringify({ ...formData, userEmail: session?.user?.email }),
      });

      let { message, success, bucket } = await res.json();

      if (success) {
        revalidate();
        setOpen(false);
        setFormData({
          name: "",
          life: "",
          size: "",
        });
        setLoading(false);
      } else {
        console.log(message);
        setLoading(false);
      }
    } catch (e) {
      console.log("Couldn't reach server.", e);
    }
  }

  function onFormChange(e: ChangeEvent<HTMLInputElement>) {
    let id = e.target.id;
    let value = e.target.value;

    setFormData((prev) => {
      return { ...prev, [id]: value };
    });
  }

  useEffect(() => {
    let life = Number(formData.life);
    let size = Number(formData.size);

    setCost(CreationCostCalculation(size, life));
  }, [formData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button asChild size="icon">
        <DialogTrigger>
          <PlusIcon />
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogTitle className="flex items-center gap-4">
          <Database />
          <h1 className="font-bold text-xl font-font1">Create Bucket</h1>
        </DialogTitle>

        <div className="flex flex-col gap-8 mt-6 px-6">
          <div className="flex gap-4 items-center">
            <Label htmlFor="name">Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => onFormChange(e)}
              id="name"
              type="text"
              placeholder="Today's Photos"
              required
            />
          </div>
          <div className="flex gap-4 items-center ">
            <Label htmlFor="name">Size</Label>
            <Select
              onValueChange={(e) =>
                setFormData((prev) => {
                  return { ...prev, size: e };
                })
              }
              value={formData.size}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Select a Bucket Size" />
              </SelectTrigger>
              <SelectContent id="size">
                <SelectGroup>
                  <SelectLabel>Sizes in Mgea Bytes (MB)</SelectLabel>
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
          </div>
          <div className="flex gap-4 items-center ">
            <Label htmlFor="name">Age</Label>
            <Select
              onValueChange={(e) =>
                setFormData((prev) => {
                  return { ...prev, life: e };
                })
              }
              value={formData.life}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Bucket's Age" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Ages in minutes</SelectLabel>
                  {BucketAges.map((age, index) => (
                    <SelectItem
                      key={index}
                      defaultChecked={age.default}
                      value={String(age.age)}
                    >
                      {age.age}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="items-center gap-6">
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
              <Loader className="animate-spin" /> Creating Bucket
            </Button>
          ) : (
            <Button onClick={() => createBucket()} className="ml-4 gap-2">
              <PackagePlus /> Create Bucket
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
