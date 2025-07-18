"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UserSettingsForm from "./UserSettingsForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AddBalanceForm from "./AddBalanceForm";

interface HeaderProps {
  name: string;
  email: string;
  image?: string;
}

export default function Header({ name, email, image }: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setIsModalOpen(false);
    router.refresh(); // Refresh the page to show updated data
  };

  const handleUpdateBalanceSuccess = () => {
    setIsBalanceModalOpen(false);
    router.refresh();
  };



  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={image || "/placeholder-user.jpg"} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-muted-foreground">{email}</p>
        </div>
      </div>
      <div className="flex gap-4" >

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Profile</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <UserSettingsForm
              initialData={{
                name: name || "",
                email: email || "",
                image: image || "",
              }}
              onSuccess={handleSuccess}
            />
          </DialogContent>
        </Dialog>
        <Dialog open={isBalanceModalOpen} onOpenChange={setIsBalanceModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Balance</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Enter how many balance you want to add.
              </DialogDescription>
            </DialogHeader>
            <AddBalanceForm onSuccess={handleUpdateBalanceSuccess} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}