import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { created, handleError } from "@/lib/api";
import { sendContactNotification } from "@/services/email";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = contactSchema.parse(json);

    // Best-effort persistence — don't fail the request (or block the email)
    // if the database isn't configured. This lets the contact form work on a
    // storefront-only deploy that has RESEND_API_KEY but no DATABASE_URL.
    let id: string | null = null;
    try {
      const message = await prisma.message.create({ data });
      id = message.id;
    } catch (dbError) {
      console.error("[CONTACT] persist skipped:", dbError);
    }

    // Await so the serverless function doesn't terminate before the email
    // is sent. Internally a no-op when RESEND_API_KEY is unset.
    await sendContactNotification(data);

    return created({ id });
  } catch (error) {
    return handleError(error);
  }
}
