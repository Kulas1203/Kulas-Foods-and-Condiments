import type { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ok, unauthorized, handleError } from "@/lib/api";
import { requireRole } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  code: z.string().min(3).toUpperCase().optional(),
  type: z.enum(["PERCENT", "FIXED"]).optional(),
  value: z.number().positive().optional(),
  minSpend: z.number().nullable().optional(),
  maxUses: z.number().int().nullable().optional(),
  active: z.boolean().optional(),
});

// PATCH /api/coupons/[id] — admin only
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    if (!(await requireRole(["ADMIN", "SUPER_ADMIN"]))) return unauthorized();
    const { id } = await params;
    const data = patchSchema.parse(await req.json());
    const coupon = await prisma.coupon.update({ where: { id }, data });
    return ok({ id: coupon.id });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/coupons/[id] — admin only
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    if (!(await requireRole(["ADMIN", "SUPER_ADMIN"]))) return unauthorized();
    const { id } = await params;
    await prisma.coupon.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
