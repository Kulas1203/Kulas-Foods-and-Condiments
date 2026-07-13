"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Search, Clock, Users, ChefHat, X, Flame } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { RecipeAssistant } from "./recipe-assistant";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { recipes } from "@/data/products";
import type { Recipe } from "@/types";

export function Recipes() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Recipe | null>(null);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(recipes.map((r) => r.category)))],
    [],
  );

  const filtered = useMemo(
    () =>
      recipes.filter((r) => {
        const matchesQuery = r.title
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesCat = category === "All" || r.category === category;
        return matchesQuery && matchesCat;
      }),
    [query, category],
  );

  return (
    <section id="recipes" className="relative py-24 sm:py-32">
      <div className="container-px">
        <SectionHeading
          eyebrow="Cook with Kulas"
          title={
            <>
              Recipes made <span className="text-gradient">unforgettable</span>
            </>
          }
          description="A spoonful of Kulas is all it takes. Explore dishes the whole family will love."
        />

        {/* AI Chef assistant */}
        <Reveal className="mx-auto mt-12 max-w-3xl">
          <RecipeAssistant />
        </Reveal>

        {/* Search + categories */}
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search recipes..."
              className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-muted focus:border-brand-secondary/50 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-brand-gradient text-white shadow-glow"
                    : "border border-white/10 bg-white/5 text-muted hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Recipe grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {filtered.map((recipe) => (
            <motion.article
              key={recipe.id}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              onClick={() => setSelected(recipe)}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && setSelected(recipe)
              }
              role="button"
              tabIndex={0}
              aria-label={`View recipe: ${recipe.title}`}
              className="group cursor-pointer overflow-hidden rounded-4xl border border-white/10 bg-surface/50 backdrop-blur-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
            >
              <div className="relative h-44 overflow-hidden bg-gradient-to-br from-brand-primary/30 to-background">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  {recipe.category}
                </span>
                <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex items-center gap-2 rounded-full bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-glow">
                    <ChefHat className="h-4 w-4" /> View recipe
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-heading text-base font-bold leading-snug">
                  {recipe.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted">
                  {recipe.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {recipe.prepTime + recipe.cookTime}m
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {recipe.servings}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-muted">
            No recipes found. Try another search.
          </p>
        )}
      </div>

      <RecipeModal recipe={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

function RecipeModal({
  recipe,
  onClose,
}: {
  recipe: Recipe | null;
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
            className="fixed inset-0 z-[81] m-auto h-fit max-h-[88vh] w-[92%] max-w-2xl overflow-y-auto rounded-4xl border border-white/10 bg-surface/95 backdrop-blur-2xl"
          >
            {/* Header image */}
            <div className="relative h-48 overflow-hidden rounded-t-4xl bg-gradient-to-br from-brand-primary/40 to-background sm:h-56">
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                sizes="640px"
                className="object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
              <button
                onClick={onClose}
                aria-label="Close recipe"
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white">
                  {recipe.category}
                </span>
                <h3 className="mt-2 font-heading text-2xl font-extrabold text-white sm:text-3xl">
                  {recipe.title}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-muted">{recipe.excerpt}</p>

              {/* Meta */}
              <div className="mt-5 flex flex-wrap gap-3">
                <Meta icon={Clock} label="Prep" value={`${recipe.prepTime} min`} />
                <Meta icon={Flame} label="Cook" value={`${recipe.cookTime} min`} />
                <Meta icon={Users} label="Serves" value={`${recipe.servings}`} />
              </div>

              <div className="mt-8 grid gap-8 sm:grid-cols-[0.9fr_1.4fr]">
                {/* Ingredients */}
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

                {/* Steps */}
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

              <div className="mt-8 flex items-start gap-2 rounded-2xl border border-brand-primary/30 bg-brand-primary/10 p-4 text-sm text-white/90">
                <Flame className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" />
                <span>
                  Made with <strong>Kulas Chili Garlic Sauce</strong> — adjust the
                  amount to your preferred heat, and add an extra spoon at the
                  table for more fire.
                </span>
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
