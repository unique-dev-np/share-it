"use client";

import { Cog, Database, Home, LogOut, User } from "lucide-react";
import { Separator } from "../ui/separator";
import Brand from "./Brand";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

export default function DashboardSidebar() {
  const iconStyle = "w-[20px]";

  const navLinks = [
    {
      name: "Home",
      href: "/dashboard",
      icon: <Home className={iconStyle} />,
    },
    {
      name: "Buckets",
      href: "/buckets",
      icon: <Database className={iconStyle} />,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <User className={iconStyle} />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Cog className={iconStyle} />,
    },
    {
      name: "Logout",
      href: "/signout",
      icon: <LogOut className={iconStyle} />,
      isButton: true,
      onClick: () => {
        signOut({ redirect: true, callbackUrl: "/" });
      },
    },
  ];

  return (
    <div
      className={
        "w-[18vw] font-font1 h-screen bg-primary-foreground py-8 px-2 md:block hidden"
      }
    >
      <Brand />
      {/* <Separator className="mt-3" /> */}

      <nav className="flex flex-col gap-4 px-4 py-8">
        {navLinks.map((link, index) =>
          !link.isButton ? (
            <NavLink
              key={index}
              name={link.name}
              href={link.href}
              icon={link.icon}
            />
          ) : (
            <NavButton
              key={index}
              name={link.name}
              icon={link.icon}
              onClick={link.onClick}
            />
          )
        )}
      </nav>
    </div>
  );
}

function NavLink({
  name,
  href,
  icon,
}: {
  name: string;
  href: string;
  icon: JSX.Element;
}) {
  const path = usePathname();

  let addedStyles = "";
  if (path == href) addedStyles = "bg-accent";

  return (
    <Link href={href} className="w-full">
      <Button
        className={cn("w-full justify-start gap-4 ", addedStyles)}
        variant="ghost"
      >
        {icon} {name}
      </Button>
    </Link>
  );
}

function NavButton({
  name,
  icon,
  onClick,
}: {
  name: string;
  icon: JSX.Element;
  onClick: () => void;
}) {
  const path = usePathname();

  return (
    <Button
      className={cn("w-full justify-start gap-4 ")}
      variant="ghost"
      onClick={() => onClick()}
    >
      {icon} {name}{" "}
    </Button>
  );
}
