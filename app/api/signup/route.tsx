import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function POST(req: NextRequest, res: NextResponse) {
  let { name, email, password } = await req.json();

  let hashesPassword = password;

  const prisma = new PrismaClient();

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        hashesPassword,
      },
    });

    prisma.$disconnect();

    // TODO: Send confirmation email

    return NextResponse.json({
      message:
        "Client Created. Check your inbox or spam folder to verify your email.",
      success: true,
    });
  } catch (e) {
    return NextResponse.json({
      message: "Failed to create client",
      success: false,
    });
  }
}
