import type { NextRequest } from "next/server";
import { checkoutSchema } from "@/lib/validations";
import { ok, handleError } from "@/lib/api";
import { priceOrder, createOrder } from "@/services/orders";
import { stripe, isStripeEnabled } from "@/lib/stripe";
import { sendOrderConfirmation } from "@/services/email";
import { formatPrice } from "@/lib/utils";
import { siteConfig, paymentMethods } from "@/data/site";

export async function POST(req: NextRequest) {
  try {
    const input = checkoutSchema.parse(await req.json());
    const priced = await priceOrder(input);
    const order = await createOrder(priced, input.paymentMethod);

    // Stripe Checkout when configured; otherwise manual PH payment channels.
    if (isStripeEnabled && stripe) {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: input.email,
        line_items: priced.items.map((i) => ({
          quantity: i.quantity,
          price_data: {
            currency: "php",
            unit_amount: Math.round(i.price * 100),
            product_data: { name: i.name },
          },
        })),
        metadata: { orderId: order.id, orderNumber: order.orderNumber },
        success_url: `${siteConfig.url}/checkout/success?order=${order.orderNumber}`,
        cancel_url: `${siteConfig.url}/checkout`,
      });

      return ok({ orderNumber: order.orderNumber, checkoutUrl: session.url });
    }

    const method = paymentMethods[input.paymentMethod];

    void sendOrderConfirmation(
      order.email,
      order.orderNumber,
      formatPrice(Number(order.total)),
      input.paymentMethod,
    );

    return ok({
      orderNumber: order.orderNumber,
      total: Number(order.total),
      paymentMethod: input.paymentMethod,
      payment: {
        label: method.label,
        accountName: method.accountName,
        accountNumber: method.accountNumber,
        note: method.note,
      },
      checkoutUrl: null,
    });
  } catch (error) {
    return handleError(error);
  }
}
