import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  let prisma = new PrismaClient();
  let { email, password } = await req.json();

  try {
    let user = await prisma.user.findUnique({ where: { email } });
    prisma.$disconnect();

    if (!user)
      return NextResponse.json({ success: false, message: "Email Not Found." });

    if (user.hashesPassword == password) {
      return NextResponse.json({
        success: true,
        message: "User Authorized Successfully.",
      });
    }

    return NextResponse.json({
      success: false,
      message: "Either email or password is incorrect.",
    });
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Some error happened in server. Please try again later.",
    });
  }
}
