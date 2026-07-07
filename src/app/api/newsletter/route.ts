import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validations";
import { created, handleError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const { email } = newsletterSchema.parse(await req.json());

    await prisma.newsletter.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    return created({ email });
  } catch (error) {
    return handleError(error);
  }
}
