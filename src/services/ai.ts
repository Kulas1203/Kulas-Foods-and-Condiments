import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { recipes } from "@/data/products";

/**
 * AI recipe recommendations for the Kulas Chili Garlic Sauce.
 *
 * Uses Claude (model `claude-opus-4-8`) via a forced tool call for reliable
 * structured JSON output when ANTHROPIC_API_KEY is configured. Falls back to a
 * deterministic local recommender over the existing recipe catalog when no key
 * is present, so the feature works out of the box with zero configuration.
 */

export const recommendInputSchema = z.object({
  ingredients: z.string().max(400).optional(),
  spiceLevel: z.number().int().min(1).max(5).default(3),
  mealType: z
    .enum(["Any", "Breakfast", "Lunch", "Dinner", "Snack", "Grill"])
    .default("Any"),
  notes: z.string().max(300).optional(),
});

export type RecommendInput = z.infer<typeof recommendInputSchema>;

const recommendationSchema = z.object({
  intro: z.string(),
  recommendations: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        usesKulas: z.string(),
        difficulty: z.enum(["Easy", "Medium", "Hard"]),
        timeMinutes: z.number().int(),
        ingredients: z.array(z.string()),
      }),
    )
    .min(1)
    .max(3),
});

export type RecipeRecommendation = z.infer<typeof recommendationSchema>;

// JSON Schema for the forced tool call (mirrors recommendationSchema).
const RECIPE_TOOL = {
  name: "suggest_recipes",
  description: "Return 2-3 dishes that feature Kulas Chili Garlic Sauce.",
  input_schema: {
    type: "object" as const,
    properties: {
      intro: { type: "string", description: "One warm sentence introducing the picks." },
      recommendations: {
        type: "array",
        minItems: 2,
        maxItems: 3,
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            usesKulas: {
              type: "string",
              description: "Specifically how Kulas Chili Garlic Sauce is used.",
            },
            difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
            timeMinutes: { type: "integer" },
            ingredients: { type: "array", items: { type: "string" } },
          },
          required: [
            "title",
            "description",
            "usesKulas",
            "difficulty",
            "timeMinutes",
            "ingredients",
          ],
        },
      },
    },
    required: ["intro", "recommendations"],
  },
};

const apiKey = process.env.ANTHROPIC_API_KEY;
const anthropic = apiKey ? new Anthropic({ apiKey }) : null;

export const isAiEnabled = Boolean(apiKey);

const SYSTEM_PROMPT = `You are the head chef for Kulas Foods and Condiments, a premium Filipino artisan brand. Your flagship product is Kulas Chili Garlic Sauce — a small-batch, smoky, garlicky chili sauce (heat level 4/5) made from fresh labuyo chili, toasted garlic, oil, sea salt, and cane vinegar.

Given a home cook's available ingredients, preferred spice level, and meal type, recommend 2-3 delicious dishes that feature Kulas Chili Garlic Sauce. Keep dishes achievable in a home kitchen, warm and Filipino in spirit, and always describe specifically how the Kulas sauce is used. Scale spice suggestions to the requested level. Be concise and appetizing. Return your answer only through the suggest_recipes tool.`;

export async function recommendRecipes(
  input: RecommendInput,
): Promise<RecipeRecommendation & { source: "ai" | "local" }> {
  if (anthropic) {
    try {
      const userPrompt = [
        `Ingredients on hand: ${input.ingredients?.trim() || "anything common in a Filipino pantry"}`,
        `Preferred spice level: ${input.spiceLevel}/5`,
        `Meal type: ${input.mealType}`,
        input.notes ? `Extra notes: ${input.notes}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const message = await anthropic.messages.create({
        model: "claude-opus-4-8",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
        tools: [RECIPE_TOOL],
        tool_choice: { type: "tool", name: RECIPE_TOOL.name },
      });

      const toolUse = message.content.find((b) => b.type === "tool_use");
      if (toolUse && toolUse.type === "tool_use") {
        const parsed = recommendationSchema.parse(toolUse.input);
        return { ...parsed, source: "ai" };
      }
    } catch (err) {
      console.error("[AI_RECOMMEND]", err);
      // fall through to local recommender
    }
  }

  return { ...localRecommend(input), source: "local" };
}

/** Deterministic recommender used when the Claude API is not configured. */
function localRecommend(input: RecommendInput): RecipeRecommendation {
  const wanted = new Set(
    (input.ingredients ?? "")
      .toLowerCase()
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean),
  );

  const scored = recipes
    .map((r) => {
      let score = 0;
      if (input.mealType !== "Any" && r.category === input.mealType) score += 3;
      for (const ing of wanted) {
        if (r.title.toLowerCase().includes(ing)) score += 2;
        if (r.excerpt.toLowerCase().includes(ing)) score += 1;
      }
      return { r, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ r }) => r);

  const chosen = scored.length ? scored : recipes.slice(0, 3);

  const heatWord =
    input.spiceLevel >= 4 ? "generous" : input.spiceLevel <= 2 ? "light" : "balanced";

  return {
    intro: `Based on your ${input.mealType.toLowerCase() === "any" ? "kitchen" : input.mealType.toLowerCase()} and a ${heatWord} spice preference, here are Kulas-forward dishes you can make tonight.`,
    recommendations: chosen.map((r) => ({
      title: r.title,
      description: r.excerpt,
      usesKulas: `Finish with a ${heatWord} spoonful of Kulas Chili Garlic Sauce, stirred in off the heat so the garlic stays fragrant.`,
      difficulty:
        r.prepTime + r.cookTime <= 12
          ? "Easy"
          : r.prepTime + r.cookTime <= 30
            ? "Medium"
            : "Hard",
      timeMinutes: r.prepTime + r.cookTime,
      ingredients: [
        ...(wanted.size ? Array.from(wanted) : ["your pantry staples"]),
        "Kulas Chili Garlic Sauce",
      ],
    })),
  };
}
