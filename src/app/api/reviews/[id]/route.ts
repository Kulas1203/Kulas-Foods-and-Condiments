import type { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ok, unauthorized, handleError } from "@/lib/api";
import { requireRole } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

const patchSchema = z.object({ approved: z.boolean() });

// PATCH /api/reviews/[id] — admin only (approve / unapprove)
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    if (!(await requireRole(["STAFF", "ADMIN", "SUPER_ADMIN"])))
      return unauthorized();
    const { id } = await params;
    const { approved } = patchSchema.parse(await req.json());
    const review = await prisma.review.update({
      where: { id },
      data: { approved },
    });
    return ok({ id: review.id, approved: review.approved });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/reviews/[id] — admin only (reject / remove)
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    if (!(await requireRole(["STAFF", "ADMIN", "SUPER_ADMIN"])))
      return unauthorized();
    const { id } = await params;
    await prisma.review.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
