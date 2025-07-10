import { addMinutes, bytesToMB, TimeCost } from "@/lib/utils";
import { IsUerEligibleToPay } from "@/server/payment";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  let { id, addedTime, userEmail, size } = await req.json();
  let prisma = new PrismaClient();

  try {
    let bucket = await prisma.bucket.findFirst({
      where: { id },
      select: { expiresIn: true },
    });
    if (!bucket)
      return NextResponse.json({
        success: false,
        message: "Can not find bucket!",
      });

    let expiryDate = bucket.expiresIn;

    //    Manage Payment

    const cost = TimeCost(Number(addedTime), bytesToMB(Number(size)));

    const eligible = await IsUerEligibleToPay(userEmail, cost);
    if (!eligible) throw Error("User doesn't have enough balance.");

    //

    let newExpiry = addMinutes(new Date(expiryDate), Number(addedTime));

    let prismaRes = await prisma.bucket.update({
      where: { id, user: { email: userEmail } },
      data: { expiresIn: newExpiry },
    });

    await prisma.user.update({
      where: { email: userEmail },
      data: {
        balance: {
          decrement: cost,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Time added successfully",
      newExpiry: prismaRes.expiresIn,
    });
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Time Cannot be added!",
    });
  }
}
