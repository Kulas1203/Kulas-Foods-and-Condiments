import type { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, handleError } from "@/lib/api";

const schema = z.object({
  code: z.string().min(1),
  subtotal: z.number().nonnegative(),
});

// POST /api/coupons/validate — checks a coupon and returns the discount.
export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = schema.parse(await req.json());

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });
    const now = new Date();

    const valid =
      coupon &&
      coupon.active &&
      (!coupon.expiresAt || coupon.expiresAt > now) &&
      (!coupon.startsAt || coupon.startsAt <= now) &&
      (!coupon.maxUses || coupon.usedCount < coupon.maxUses) &&
      (!coupon.minSpend || subtotal >= Number(coupon.minSpend));

    if (!valid || !coupon) return badRequest("Invalid or expired coupon");

    const discount =
      coupon.type === "PERCENT"
        ? Math.min((subtotal * Number(coupon.value)) / 100, subtotal)
        : Math.min(Number(coupon.value), subtotal);

    return ok({ code: coupon.code, discount, type: coupon.type });
  } catch (error) {
    return handleError(error);
  }
}
