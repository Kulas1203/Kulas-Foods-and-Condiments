"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChefHat, Clock, Loader2, Flame, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Recommendation {
  title: string;
  description: string;
  usesKulas: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeMinutes: number;
  ingredients: string[];
}
interface Result {
  intro: string;
  recommendations: Recommendation[];
  source: "ai" | "local";
}

const MEAL_TYPES = ["Any", "Breakfast", "Lunch", "Dinner", "Snack", "Grill"];

export function RecipeAssistant() {
  const [ingredients, setIngredients] = useState("");
  const [spiceLevel, setSpiceLevel] = useState(3);
  const [mealType, setMealType] = useState("Any");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/recipes/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, spiceLevel, mealType }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not generate ideas");
      setResult(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-br from-surface/80 to-background p-6 backdrop-blur-xl sm:p-8">
      <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-brand-radial opacity-60 blur-3xl" />

      <div className="relative">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient shadow-glow">
            <Wand2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="flex items-center gap-2 font-heading text-xl font-bold">
              Kulas AI Chef
              <Badge variant="gold">
                <Sparkles className="h-3 w-3" /> AI
              </Badge>
            </h3>
            <p className="text-sm text-muted">
              Tell us what&apos;s in your kitchen — get instant Kulas recipe ideas.
            </p>
          </div>
        </div>

        <form onSubmit={generate} className="grid gap-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
              What ingredients do you have?
            </label>
            <input
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g. chicken, rice, eggs, noodles…"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-muted focus:border-brand-secondary/50 focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                Meal type
              </label>
              <div className="flex flex-wrap gap-2">
                {MEAL_TYPES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMealType(m)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                      mealType === m
                        ? "bg-brand-gradient text-white"
                        : "border border-white/10 bg-white/5 text-muted hover:text-white",
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                Spice level: {spiceLevel}/5
              </label>
              <input
                type="range"
                min={1}
                max={5}
                value={spiceLevel}
                onChange={(e) => setSpiceLevel(Number(e.target.value))}
                className="w-full accent-brand-secondary"
                aria-label="Spice level"
              />
              <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-muted">
                <span>Mild</span>
                <span>Fire</span>
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-fit">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Cooking up ideas…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Get recipe ideas
              </>
            )}
          </Button>
        </form>

        {error && <p className="mt-4 text-sm text-brand-secondary">{error}</p>}

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <p className="mb-4 text-sm text-white/90">{result.intro}</p>
              <div className="grid gap-4">
                {result.recommendations.map((rec, i) => (
                  <motion.div
                    key={rec.title + i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-heading text-lg font-bold">{rec.title}</h4>
                      <Badge variant="glass" className="shrink-0">
                        <ChefHat className="h-3 w-3" /> {rec.difficulty}
                      </Badge>
                    </div>
                    <p className="mt-1.5 text-sm text-muted">{rec.description}</p>
                    <div className="mt-3 flex items-start gap-2 rounded-2xl bg-brand-primary/10 p-3 text-sm text-white/90">
                      <Flame className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" />
                      <span>{rec.usesKulas}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {rec.timeMinutes} min
                      </span>
                      <span className="flex flex-wrap gap-1.5">
                        {rec.ingredients.slice(0, 5).map((ing) => (
                          <span
                            key={ing}
                            className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5"
                          >
                            {ing}
                          </span>
                        ))}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                {result.source === "ai"
                  ? "Generated by Claude AI"
                  : "Matched from the Kulas recipe collection — add an ANTHROPIC_API_KEY for AI-generated ideas"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
