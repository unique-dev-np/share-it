"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, Share2 } from "lucide-react";

export default function Home() {
  const session = useSession();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center space-x-2">
          <Share2 className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">ShareIt</h1>
        </div>
        <nav className="flex items-center space-x-4">
          {session.status !== "authenticated" ? (
            <Link href="/signin">
              <Button variant="outline">Login</Button>
            </Link>
          ) : (
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          )}
        </nav>
      </header>

      <main className="flex-grow">
        <section className="flex flex-col items-center justify-center h-screen text-center bg-cover bg-center" style={{ backgroundImage: "url('/placeholder.svg')" }}>
          <div className="bg-black bg-opacity-50 p-10 rounded-lg">
            <h2 className="text-5xl font-bold text-white">
              Share Files, Instantly.
            </h2>
            <p className="mt-4 text-lg text-gray-200">
              The simplest way to share files with anyone, anywhere.
            </p>
            <Link href={session.status !== "authenticated" ? "/signup" : "/dashboard"}>
              <Button className="mt-8 px-8 py-4 text-lg">
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-800">
              Why Choose ShareIt?
            </h3>
            <div className="flex justify-center mt-10 space-x-8">
              <div className="max-w-xs p-6 bg-gray-100 rounded-lg">
                <h4 className="text-xl font-bold">Easy to Use</h4>
                <p className="mt-2 text-gray-600">
                  Drag and drop your files and get a shareable link instantly.
                </p>
              </div>
              <div className="max-w-xs p-6 bg-gray-100 rounded-lg">
                <h4 className="text-xl font-bold">Secure</h4>
                <p className="mt-2 text-gray-600">
                  Your files are encrypted and safe with us.
                </p>
              </div>
              <div className="max-w-xs p-6 bg-gray-100 rounded-lg">
                <h4 className="text-xl font-bold">Fast</h4>
                <p className="mt-2 text-gray-600">
                  Upload and download files at lightning speed.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="p-4 text-center bg-gray-800 text-white">
        <p>&copy; 2025 ShareIt. All rights reserved.</p>
      </footer>
    </div>
  );
}