import { AddedSizeCost, bytesToMB, checkDifference } from "@/lib/utils";
import prisma from "@/prisma/db";
import { IsUerEligibleToPay } from "@/server/payment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let { id, userEmail, addedSize, expiryTime } = await request.json();

  const remainingSeconds = checkDifference(expiryTime);
  const remainingMinutes = remainingSeconds / 60;

  const addedMB = bytesToMB(Number(addedSize));

  console.log(addedMB);

  const cost = AddedSizeCost(addedMB, remainingMinutes);

  try {
    await prisma.$transaction(async (prisma) => {
      const eligible = await IsUerEligibleToPay(userEmail, cost);
      if (!eligible) throw Error("User doesn't have enough balance.");

      await prisma.user.update({
        where: { email: userEmail },
        data: { balance: { decrement: cost } },
      });

      const bucket = await prisma.bucket.update({
        where: {
          id,
          AND: { id, user: { email: userEmail } },
        },
        data: {
          size: { increment: Number(addedSize) },
        },
      });

      return bucket;
    });

    return NextResponse.json({
      success: true,
      message: `${addedMB} MB added successfully.`,
    });
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: `Failed to add ${addedMB} MB.`,
    });
  }
}
