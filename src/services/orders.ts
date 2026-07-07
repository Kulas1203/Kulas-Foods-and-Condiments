import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { publish } from "@/services/events";
import type { CheckoutInput } from "@/lib/validations";

const SHIPPING_FLAT = 120;
const FREE_SHIPPING_THRESHOLD = 1000;

interface PricedOrder {
  orderNumber: string;
  email: string;
  items: { productId: string; name: string; price: number; quantity: number }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponId?: string;
}

/** Prices a cart server-side from trusted product data + coupon rules. */
export async function priceOrder(input: CheckoutInput): Promise<PricedOrder> {
  const productIds = input.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const items = input.items.map((line) => {
    const product = products.find((p) => p.id === line.productId);
    if (!product) throw new Error(`Product not found: ${line.productId}`);
    return {
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: line.quantity,
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let discount = 0;
  let couponId: string | undefined;

  if (input.couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: input.couponCode.toUpperCase() },
    });
    const now = new Date();
    const valid =
      coupon &&
      coupon.active &&
      (!coupon.expiresAt || coupon.expiresAt > now) &&
      (!coupon.startsAt || coupon.startsAt <= now) &&
      (!coupon.maxUses || coupon.usedCount < coupon.maxUses) &&
      (!coupon.minSpend || subtotal >= Number(coupon.minSpend));

    if (valid && coupon) {
      couponId = coupon.id;
      discount =
        coupon.type === "PERCENT"
          ? (subtotal * Number(coupon.value)) / 100
          : Number(coupon.value);
      discount = Math.min(discount, subtotal);
    }
  }

  const shipping =
    subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal - discount + shipping;

  return {
    orderNumber: generateOrderNumber(),
    email: input.email,
    items,
    subtotal,
    discount,
    shipping,
    total,
    couponId,
  };
}

/** Persists a priced order and decrements inventory, then broadcasts live events. */
export async function createOrder(priced: PricedOrder) {
  const order = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        orderNumber: priced.orderNumber,
        email: priced.email,
        subtotal: priced.subtotal,
        discount: priced.discount,
        shipping: priced.shipping,
        total: priced.total,
        couponId: priced.couponId,
        items: {
          create: priced.items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        },
      },
      include: { items: true },
    });

    for (const item of priced.items) {
      await tx.inventory.updateMany({
        where: { productId: item.productId },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    if (priced.couponId) {
      await tx.coupon.update({
        where: { id: priced.couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    return order;
  });

  // Broadcast to the admin live dashboard (SSE subscribers).
  const itemCount = priced.items.reduce((n, i) => n + i.quantity, 0);
  publish({
    type: "order.created",
    orderNumber: order.orderNumber,
    email: order.email,
    total: Number(order.total),
    itemCount,
    at: new Date().toISOString(),
  });

  // Real-time inventory updates for the affected products.
  const inventories = await prisma.inventory.findMany({
    where: { productId: { in: priced.items.map((i) => i.productId) } },
  });
  for (const inv of inventories) {
    publish({
      type: "inventory.updated",
      productId: inv.productId,
      sku: inv.sku,
      quantity: inv.quantity,
      lowStock: inv.quantity <= inv.lowStockAlert,
      at: new Date().toISOString(),
    });
  }

  return order;
}
