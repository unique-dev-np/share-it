"use client";

import { Database, Home, LogOut, User } from "lucide-react";
import Brand from "@/components/common/Brand";
import { Button } from "@/components//ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import GlobalAlertDialog from "@/components/common/GlobalAlertDialog";

const iconStyle = "w-[20px]";

export default function DashboardSidebar() {

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
      name: "Logout",
      href: "/signout",
      icon: <LogOut className={iconStyle} />,
      isButton: true,
      component: LogoutComponent
    },
  ];

  return (
    <div
      className={
        "w-[18vw] font-font1 h-screen bg-primary-foreground py-8 px-2 md:block hidden"
      }
    >
      <Brand />

      <nav className="flex flex-col gap-4 px-4 py-8">

        <>
          {navLinks.map((link, index) =>
            !link.isButton ? (
              <NavLink
                key={index}
                name={link.name}
                href={link.href}
                icon={link.icon}
              />
            ) : (
              <link.component key={index} />
            )
          )}
        </>

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



function LogoutComponent() {

  return (
    <GlobalAlertDialog
      title="Do you really want to log out?"
      description=""
      action={() => signOut({ redirect: true, callbackUrl: "/" })}
      innerButtonElement={
        <Button
          className={cn("justify-start gap-4 bg-destructive hover:bg-destructive")}
          variant="destructive"

        >
          <LogOut className={iconStyle} /> Log Out
        </Button>}
    >
      <Button
        className={cn("w-full justify-start gap-4 ")}
        variant="ghost"
      >
        <LogOut className={iconStyle} /> Log Out
      </Button>
    </GlobalAlertDialog>
  )
}