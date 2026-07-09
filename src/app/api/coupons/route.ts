import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { couponSchema } from "@/lib/validations";
import { ok, created, unauthorized, handleError } from "@/lib/api";
import { requireRole } from "@/lib/auth";

// GET /api/coupons — admin only (list all)
export async function GET() {
  try {
    if (!(await requireRole(["ADMIN", "SUPER_ADMIN"]))) return unauthorized();
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return ok(coupons);
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/coupons — admin only (create)
export async function POST(req: NextRequest) {
  try {
    if (!(await requireRole(["ADMIN", "SUPER_ADMIN"]))) return unauthorized();
    const body = couponSchema.parse(await req.json());
    const coupon = await prisma.coupon.create({
      data: {
        code: body.code,
        type: body.type,
        value: body.value,
        minSpend: body.minSpend,
        maxUses: body.maxUses,
      },
    });
    return created(coupon);
  } catch (error) {
    return handleError(error);
  }
}
