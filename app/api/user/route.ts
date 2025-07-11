import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/prisma/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const userUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  image: z.string().optional(), // For avatar URL
  balance: z.number().optional(),
});

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const body = await req.json();
    const { name, email, image, balance } = userUpdateSchema.parse(body);

    // Check if the new email already exists for another user
    const user = session.user as { id: number; email: string; name?: string | null; image?: string | null };

    // Check if the new email already exists for another user
    if (email !== user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== user.id) {
        return new NextResponse(JSON.stringify({ message: "Email already in use" }), { status: 409 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { email: user.email! },
      data: {
        name,
        email,
        image, // Update avatar URL
        ...(balance !== undefined && { balance }),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
    console.error("[USER_PUT_ERROR]", error);
    return new NextResponse(JSON.stringify({ message: "Internal Error" }), { status: 500 });
  }
}
