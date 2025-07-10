"use client";

import { Button } from "@/components/ui/button";
import { Loader, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

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
import { SignInFormDataValidator } from "@/types";
import { ZodIssue } from "zod";
import { signIn } from "next-auth/react";

export default function Page() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  async function signInFun() {
    try {
      SignInFormDataValidator.parse(formData);
      setLoading(true);

      try {
        let res = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        console.log(res);

        if (res?.error) {
          console.log("Could not authenticate user.");
          setLoading(false);
          return;
        }

        router.push("/dashboard");
      } catch (e) {
        console.log(e);
      }

      // try {
      //   let res = await fetch("/api/signin", {
      //     method: "POST",
      //     body: JSON.stringify(formData),
      //   });
      //   let { message, success }: { message: string; success: boolean } =
      //     await res.json();
      //   if (success) {
      //     console.log(message);
      //     router.push("/dashboard");
      //   } else {
      //     console.log(message);
      //   }
      // } catch (e) {
      //   console.log(e);
      // }
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
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
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

            {loading ? (
              <Button disabled className="gap-4 ">
                <Loader className="animate-spin" />
                Signing In
              </Button>
            ) : (
              <Button onClick={signInFun} type="submit" className="w-full">
                Sign In
              </Button>
            )}
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
