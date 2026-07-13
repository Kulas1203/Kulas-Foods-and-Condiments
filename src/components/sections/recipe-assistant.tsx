"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ChefHat,
  Clock,
  Loader2,
  Flame,
  Wand2,
  X,
  ArrowRight,
  Users,
} from "lucide-react";
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
  steps: string[];
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
  const [selected, setSelected] = useState<Recommendation | null>(null);

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
                    onClick={() => setSelected(rec)}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") && setSelected(rec)
                    }
                    role="button"
                    tabIndex={0}
                    aria-label={`View full recipe: ${rec.title}`}
                    className="group cursor-pointer rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-brand-secondary/40 hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
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
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="flex items-center gap-3 text-xs text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {rec.timeMinutes} min
                        </span>
                        <span>{rec.ingredients.length} ingredients</span>
                        <span>{rec.steps.length} steps</span>
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-brand-secondary transition-transform group-hover:translate-x-0.5">
                        Full recipe <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                {result.source === "ai"
                  ? "Generated by AI"
                  : "Matched from the Kulas recipe collection — add a free GEMINI_API_KEY for AI-generated ideas"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AIRecipeModal recipe={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function AIRecipeModal({
  recipe,
  onClose,
}: {
  recipe: Recommendation | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {recipe && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label={recipe.title}
            className="fixed inset-0 z-[81] m-auto h-fit max-h-[88vh] w-[92%] max-w-2xl overflow-y-auto rounded-4xl border border-white/10 bg-surface/95 p-6 backdrop-blur-2xl sm:p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close recipe"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white transition-colors hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            <Badge variant="gold" className="mb-3">
              <Sparkles className="h-3 w-3" /> AI recipe
            </Badge>
            <h3 className="font-heading text-2xl font-extrabold sm:text-3xl">
              {recipe.title}
            </h3>
            <p className="mt-2 text-muted">{recipe.description}</p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Meta icon={ChefHat} label="Level" value={recipe.difficulty} />
              <Meta icon={Clock} label="Time" value={`${recipe.timeMinutes} min`} />
              <Meta
                icon={Users}
                label="Steps"
                value={`${recipe.steps.length}`}
              />
            </div>

            <div className="mt-6 flex items-start gap-2 rounded-2xl border border-brand-primary/30 bg-brand-primary/10 p-4 text-sm text-white/90">
              <Flame className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" />
              <span>{recipe.usesKulas}</span>
            </div>

            <div className="mt-8 grid gap-8 sm:grid-cols-[0.9fr_1.4fr]">
              <div>
                <h4 className="mb-3 font-heading text-sm font-bold uppercase tracking-widest text-brand-secondary">
                  Ingredients
                </h4>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ing) => (
                    <li
                      key={ing}
                      className="flex items-start gap-2 text-sm text-white/90"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-secondary" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-3 font-heading text-sm font-bold uppercase tracking-widest text-brand-accent">
                  Steps
                </h4>
                <ol className="space-y-4">
                  {recipe.steps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-gradient font-heading text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      <p className="pt-0.5 text-sm leading-relaxed text-white/90">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
      <Icon className="h-4 w-4 text-brand-secondary" />
      <span className="text-xs text-muted">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}
