import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { created, handleError } from "@/lib/api";
import { sendContactNotification } from "@/services/email";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = contactSchema.parse(json);

    const message = await prisma.message.create({ data });

    // Fire-and-forget notification email (no-op if RESEND_API_KEY unset).
    void sendContactNotification(data);

    return created({ id: message.id });
  } catch (error) {
    return handleError(error);
  }
}
