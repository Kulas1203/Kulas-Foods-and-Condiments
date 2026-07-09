import type { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ok, unauthorized, handleError } from "@/lib/api";
import { requireRole } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  firstName: z.string().max(60).optional(),
  lastName: z.string().max(60).optional(),
  notes: z.string().max(1000).optional(),
});

// PATCH /api/customers/[id] — admin only
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    if (!(await requireRole(["ADMIN", "SUPER_ADMIN"]))) return unauthorized();
    const { id } = await params;
    const data = patchSchema.parse(await req.json());
    const customer = await prisma.customer.update({ where: { id }, data });
    return ok({ id: customer.id });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/customers/[id] — admin only (removes the customer profile)
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    if (!(await requireRole(["ADMIN", "SUPER_ADMIN"]))) return unauthorized();
    const { id } = await params;
    await prisma.customer.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
