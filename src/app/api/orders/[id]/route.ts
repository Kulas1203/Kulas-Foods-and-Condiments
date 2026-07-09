import type { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ok, unauthorized, handleError } from "@/lib/api";
import { requireRole } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  status: z.enum([
    "PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
});

// PATCH /api/orders/[id] — admin only (update status; stamps paidAt on PAID)
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    if (!(await requireRole(["STAFF", "ADMIN", "SUPER_ADMIN"])))
      return unauthorized();
    const { id } = await params;
    const { status } = patchSchema.parse(await req.json());

    const existing = await prisma.order.findUnique({ where: { id } });
    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        paidAt:
          status === "PAID" && !existing?.paidAt
            ? new Date()
            : existing?.paidAt,
      },
    });
    return ok({ id: order.id, status: order.status });
  } catch (error) {
    return handleError(error);
  }
}
