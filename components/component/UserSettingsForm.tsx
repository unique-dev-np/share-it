"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { toast } from "react-toastify";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  image: z.string().optional(),
  balance: z.string().optional(),
});

type UserSettingsFormValues = z.infer<typeof formSchema>;

interface UserSettingsFormProps {
  initialData: UserSettingsFormValues;
  onSuccess?: () => void;
}

export default function UserSettingsForm({
  initialData,
  onSuccess,
}: UserSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState, watch } = useForm<UserSettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { errors } = formState;
  const watchedImage = watch("image");

  const onSubmit = async (data: UserSettingsFormValues) => {
    setLoading(true);
    try {
      const parsedBalance = data.balance === "" || data.balance === undefined ? undefined : Number(data.balance);

      if (parsedBalance !== undefined && isNaN(parsedBalance)) {
        toast.error("Invalid balance value.");
        setLoading(false);
        return;
      }

      if (parsedBalance !== undefined && parsedBalance < 0) {
        toast.error("Balance cannot be negative.");
        setLoading(false);
        return;
      }

      const dataToSend = {
        ...data,
        balance: parsedBalance,
      };

      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      toast.success("Profile updated successfully!");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={watchedImage || "/placeholder-user.jpg"} alt="User Avatar" />
          <AvatarFallback>{initialData.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <Label htmlFor="image">Avatar URL</Label>
          <Input
            id="image"
            type="text"
            {...register("image")}
            placeholder="Enter avatar URL"
          />
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} disabled />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="balance">Balance</Label>
        <Input id="balance" type="number" step="0.01" {...register("balance")} />
        {errors.balance && (
          <p className="text-red-500 text-sm mt-1">{errors.balance.message}</p>
        )}
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
