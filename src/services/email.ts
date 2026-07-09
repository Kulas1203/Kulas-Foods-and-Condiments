import { Resend } from "resend";
import type { ContactInput } from "@/lib/validations";
import { siteConfig, paymentMethods, type PaymentMethodKey } from "@/data/site";

/**
 * Thin email service around Resend. Every function is a safe no-op when
 * RESEND_API_KEY is not configured, so local dev never crashes on email.
 */

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
// Default to Resend's shared onboarding sender, which works on the free tier
// with no domain verification. Set EMAIL_FROM once you've verified your own
// domain (e.g. "Kulas Foods <hello@yourdomain.com>").
const from = process.env.EMAIL_FROM ?? "Kulas Foods <onboarding@resend.dev>";

export async function sendContactNotification(data: ContactInput) {
  if (!resend) return;
  await resend.emails
    .send({
      from,
      to: siteConfig.email,
      replyTo: data.email,
      subject: `New message from ${data.name}: ${data.subject ?? "Contact form"}`,
      text: `From: ${data.name} <${data.email}>\n\n${data.body}`,
    })
    .catch((e) => console.error("[EMAIL]", e));
}

export async function sendOrderConfirmation(
  to: string,
  orderNumber: string,
  total: string,
  paymentMethod?: PaymentMethodKey,
) {
  if (!resend) return;

  const method = paymentMethod ? paymentMethods[paymentMethod] : null;
  const paymentBlock = method
    ? `
        <div style="margin:16px 0;padding:16px;border:1px solid #eee;border-radius:12px;background:#fafafa">
          <h2 style="margin:0 0 8px;font-size:16px">How to pay — ${method.label}</h2>
          <p style="margin:4px 0">Account name: <strong>${method.accountName}</strong></p>
          ${
            method.accountNumber
              ? `<p style="margin:4px 0">Account number: <strong>${method.accountNumber}</strong></p>`
              : `<p style="margin:4px 0">We'll reply to this email with our ${method.label} account details.</p>`
          }
          <p style="margin:4px 0">Amount: <strong>${total}</strong></p>
          <p style="margin:4px 0">Reference: <strong>${orderNumber}</strong></p>
          <p style="margin:8px 0 0;color:#555;font-size:13px">${method.note} Please include your order number as the payment reference, then reply to this email (or message our Facebook page) with a screenshot of your payment so we can ship your order right away.</p>
        </div>`
    : "";

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
          ${paymentBlock}
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
