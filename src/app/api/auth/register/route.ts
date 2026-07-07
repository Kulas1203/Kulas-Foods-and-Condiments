import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { created, badRequest, handleError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = registerSchema.parse(await req.json());

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return badRequest("An account with this email already exists");

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "CUSTOMER",
        customer: { create: {} },
      },
    });

    return created({ id: user.id, email: user.email });
  } catch (error) {
    return handleError(error);
  }
}
