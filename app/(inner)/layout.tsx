import type { Metadata } from "next";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Share IT",
  description: "File Sahring Web App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <>
      <main className="flex bg-primary-foreground" >
        <DashboardSidebar />
        <div className="p-4 w-full  mx-auto h-screen overflow-y-auto" >
          {children}
        </div>
      </main>
    </>
  );
}
