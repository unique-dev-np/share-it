import { Separator } from "@/components/ui/separator";
import UserSettingsForm from "@/components/component/UserSettingsForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/prisma/db";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return redirect("/signin");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <Separator className="my-4" />
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Profile Settings</h2>
        <p className="text-muted-foreground">
          Update your account&apos;s profile information.
        </p>
        <UserSettingsForm
          initialData={{
            name: user.name || "",
            email: user.email || "",
            image: user.image || "",
          }}
        />
      </div>
    </div>
  );
}
