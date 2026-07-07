import type { NextRequest } from "next/server";
import { ok, handleError } from "@/lib/api";
import { recommendInputSchema, recommendRecipes } from "@/services/ai";

export const runtime = "nodejs";

// POST /api/recipes/recommend — AI-assisted recipe ideas featuring Kulas sauce.
export async function POST(req: NextRequest) {
  try {
    const input = recommendInputSchema.parse(await req.json());
    const result = await recommendRecipes(input);
    return ok(result);
  } catch (error) {
    return handleError(error);
  }
}
