import NextAuthProvider from "@/providers/NextAuthProvider";
import { getServerSession, Session } from "next-auth";

import type { Metadata } from "next";
import { Inter, Merriweather, Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { NextRequest } from "next/server";

const font1 = Poppins({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-1",
});

const font2 = Merriweather({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-2",
});

export const metadata: Metadata = {
  title: "Share IT",
  description: "File Sahring Web App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <NextAuthProvider>
        <body className={cn(font1.variable, font2.variable)}>{children}</body>
      </NextAuthProvider>
    </html>
  );
}
