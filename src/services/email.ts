import { Resend } from "resend";
import type { ContactInput } from "@/lib/validations";
import { siteConfig } from "@/data/site";

/**
 * Thin email service around Resend. Every function is a safe no-op when
 * RESEND_API_KEY is not configured, so local dev never crashes on email.
 */

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
const from = process.env.EMAIL_FROM ?? "Kulas Foods <hello@kulasfoods.com>";

export async function sendContactNotification(data: ContactInput) {
  if (!resend) return;
  await resend.emails
    .send({
      from,
      to: siteConfig.email,
      subject: `New message: ${data.subject ?? "Contact form"}`,
      text: `From: ${data.name} <${data.email}>\n\n${data.body}`,
    })
    .catch((e) => console.error("[EMAIL]", e));
}

export async function sendOrderConfirmation(
  to: string,
  orderNumber: string,
  total: string,
) {
  if (!resend) return;
  await resend.emails
    .send({
      from,
      to,
      subject: `Your Kulas order ${orderNumber} is confirmed 🌶️`,
      html: `
        <div style="font-family:sans-serif;color:#111">
          <h1 style="color:#C1121F">Salamat for your order!</h1>
          <p>Order <strong>${orderNumber}</strong> is confirmed.</p>
          <p>Total: <strong>${total}</strong></p>
          <p>We'll email you again when it ships. Crafted with fire, made with flavor.</p>
        </div>`,
    })
    .catch((e) => console.error("[EMAIL]", e));
}

export async function sendWelcomeEmail(to: string) {
  if (!resend) return;
  await resend.emails
    .send({
      from,
      to,
      subject: "Welcome to the Kulas kitchen 🔥",
      text: "Thanks for subscribing! Spicy recipes and offers are on the way.",
    })
    .catch((e) => console.error("[EMAIL]", e));
}
