import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validations";
import { ok, created, handleError } from "@/lib/api";

// GET /api/reviews?productId=...
export async function GET(req: NextRequest) {
  try {
    const productId = new URL(req.url).searchParams.get("productId") ?? undefined;
    const reviews = await prisma.review.findMany({
      where: { approved: true, ...(productId ? { productId } : {}) },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return ok(reviews);
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/reviews — pending approval by default
export async function POST(req: NextRequest) {
  try {
    const data = reviewSchema.parse(await req.json());
    const review = await prisma.review.create({
      data: { ...data, approved: false },
    });
    return created({ id: review.id, approved: review.approved });
  } catch (error) {
    return handleError(error);
  }
}
