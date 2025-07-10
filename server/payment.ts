import prisma from "@/prisma/db";

export async function IsUerEligibleToPay(email: string, cost: number) {
  if (!email) return false;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { balance: true },
  });

  if (!user) return false;

  if (user.balance < cost) {
    return false;
  }

  return true;
}
