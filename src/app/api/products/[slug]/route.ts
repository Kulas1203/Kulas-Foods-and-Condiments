import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { ok, notFound, unauthorized, handleError } from "@/lib/api";
import { requireRole } from "@/lib/auth";

type Params = { params: Promise<{ slug: string }> };

// GET /api/products/[slug]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true, inventory: true, reviews: true },
    });
    if (!product) return notFound("Product not found");
    return ok(product);
  } catch (error) {
    return handleError(error);
  }
}

// PATCH /api/products/[slug] — admin only
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    if (!(await requireRole(["ADMIN", "SUPER_ADMIN"]))) return unauthorized();
    const { slug } = await params;
    const body = productSchema.partial().parse(await req.json());
    const product = await prisma.product.update({ where: { slug }, data: body });
    return ok(product);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/products/[slug] — admin only
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    if (!(await requireRole(["ADMIN", "SUPER_ADMIN"]))) return unauthorized();
    const { slug } = await params;
    await prisma.product.delete({ where: { slug } });
    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
