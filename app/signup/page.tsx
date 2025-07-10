"use client";

import { Button } from "@/components/ui/button";
import { Loader, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignUpFormDataType, SignUpFormDataValidator } from "@/types";
import { ZodIssue } from "zod";

// Todo: Replace all console logs with toast message

export default function Page() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignUpFormDataType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  async function signUp() {
    try {
      SignUpFormDataValidator.parse(formData);
      setLoading(true);

      try {
        let res = await fetch("/api/signup", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        let { message, success }: { message: string; success: boolean } =
          await res.json();

        if (success) {
          console.log(message);
        } else {
          console.log(message);
        }
      } catch (e) {
        console.log(e);
      }
    } catch (e: any) {
      // Validation Error
      let issues = e.issues;
      issues.forEach((issue: ZodIssue) => {
        console.log(issue.path + ": " + issue.message);
      });
    }

    setLoading(false);
  }

  function onFormChange(e: ChangeEvent<HTMLInputElement>) {
    let id = e.target.id;
    let value = e.target.value;

    setFormData((prev) => {
      return { ...prev, [id]: value };
    });
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => onFormChange(e)}
                id="name"
                type="text"
                placeholder="Your Name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                value={formData.email}
                onChange={(e) => onFormChange(e)}
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                value={formData.password}
                onChange={(e) => onFormChange(e)}
                id="password"
                type="password"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
              </div>
              <Input
                value={formData.confirmPassword}
                onChange={(e) => onFormChange(e)}
                id="confirmPassword"
                type="password"
                required
              />
            </div>

            {loading ? (
              <Button disabled className="gap-4 ">
                <Loader className="animate-spin" />
                Signing Up
              </Button>
            ) : (
              <Button onClick={signUp} type="submit" className="w-full">
                Sign Up
              </Button>
            )}
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
