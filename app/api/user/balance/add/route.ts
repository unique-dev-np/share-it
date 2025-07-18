import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/prisma/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const balanceAddSchema = z.object({
  email: z.string().email(),
  balance: z.number().optional(),
});

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const body = await req.json();
    const { email, balance } = balanceAddSchema.parse(body);

    const user = session.user as {
      id: number;
      email: string;
      name?: string | null;
      image?: string | null;
    };

    // Check if the new email already exists for another user
    if (email !== user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== user.id) {
        return new NextResponse(
          JSON.stringify({ message: "Email already in use" }),
          { status: 409 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { email: user.email! },
      data: {
        balance: { increment: balance },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ message: error.message }), {
        status: 400,
      });
    }
    console.error("[USER_PUT_ERROR]", error);
    return new NextResponse(JSON.stringify({ message: "Internal Error" }), {
      status: 500,
    });
  }
}
