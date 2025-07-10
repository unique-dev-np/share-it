import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { isLocked, bucketId } = await req.json();

  try {
    const bucket = await prisma.bucket.update({
      where: {
        id: bucketId,
      },
      data: {
        isLocked: !isLocked,
      },
    });

    return NextResponse.json({
      success: true,
      isLocked: bucket.isLocked,
      message: "Lock state updated successfuly.",
    });
  } catch (e) {
    console.log(e);

    return NextResponse.json({
      success: false,
      message: "Lock state can't be updated successfuly.",
    });
  }
}
