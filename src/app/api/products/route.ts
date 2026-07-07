import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { ok, created, handleError, unauthorized } from "@/lib/api";
import { requireRole } from "@/lib/auth";
import { slugify } from "@/lib/utils";

// GET /api/products — public list with optional filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") ?? undefined;
    const featured = searchParams.get("featured");
    const status = searchParams.get("status") ?? "ACTIVE";

    const products = await prisma.product.findMany({
      where: {
        status: status as never,
        ...(featured ? { featured: featured === "true" } : {}),
        ...(category ? { category: { slug: category } } : {}),
      },
      include: { category: true, inventory: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    return ok(products);
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/products — admin only
export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(["ADMIN", "SUPER_ADMIN"]);
    if (!session) return unauthorized();

    const body = productSchema.parse(await req.json());
    const product = await prisma.product.create({
      data: { ...body, slug: body.slug || slugify(body.name) },
    });

    return created(product);
  } catch (error) {
    return handleError(error);
  }
}
