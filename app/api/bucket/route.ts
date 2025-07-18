import { addMinutes, CreationCostCalculation } from "@/lib/utils";
import { IsUerEligibleToPay } from "@/server/payment";
import { CreateBucketFormValidator } from "@/types";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest, res: NextResponse) {
  let prisma = new PrismaClient();
  let data: {
    name: string;
    life: string;
    size: string;
    userEmail: string;
  } = await req.json();

  //   Validation
  try {
    CreateBucketFormValidator.parse(data);
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({
        success: false,
        message: e.issues,
        type: "validation_error",
      });
    }
  }

  //

  let now = new Date();
  let expiresIn = addMinutes(now, Number(data.life));

  try {
    let cost = CreationCostCalculation(
      parseInt(data.size),
      parseInt(data.life)
    );

    let bucket = await prisma.$transaction(
      async (prisma) => {
        let bucket = await prisma.bucket.create({
          data: {
            name: data.name,
            size: Number(data.size),
            expiresIn: expiresIn,
            user: { connect: { email: data.userEmail } },
          },
        });

        const eligible = await IsUerEligibleToPay(data.userEmail, cost);
        if (!eligible) throw Error("User doesn't have enough balance.");

        await prisma.user.update({
          where: { email: data.userEmail },
          data: { balance: { decrement: cost } },
        });

        return bucket;
      },
      {
        maxWait: 7000, // 5 seconds max wait to connect to prisma
        timeout: 20000, // 20 seconds
      }
    );

    return NextResponse.json({
      success: true,
      message: "Bucket created successfully.",
      bucket,
    });
  } catch (e: any) {
    console.log(e);
    let message = "Can not create the bucket";
    if (e.message === "User doesn't have enough balance.") {
      message = e.message;
    }
    return NextResponse.json({
      success: false,
      message: message,
      type: "database",
    });
  }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  let { id } = await req.json();
  let prisma = new PrismaClient();

  try {
    // prisma.$transaction(async (prisma)=>{
    const bucket = await prisma.bucket.findFirst({
      where: { id },
      include: { files: true },
    });

    if (!bucket)
      return NextResponse.json({
        success: false,
        message: "Bucket not found",
        type: "database",
      });

    const files = bucket.files;

    const baseUrl = process.env.VERCEL_URL
      ? "https://" + process.env.VERCEL_URL
      : "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/bucket/file`, {
      method: "DELETE",
      body: JSON.stringify({ files }),
    });

    console.log(await res.json());

    const deletdBucket = await prisma.bucket.delete({ where: { id } });
    // })

    return NextResponse.json({
      success: true,
      message: "Bucket Deleted Successfully",
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      success: false,
      message: "Can not delete the bucket",
      type: "database",
    });
  }
}
