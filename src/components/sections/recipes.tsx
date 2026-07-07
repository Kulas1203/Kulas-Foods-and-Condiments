"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Clock, Users, Play } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { recipes } from "@/data/products";

export function Recipes() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

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
              className="group overflow-hidden rounded-4xl border border-white/10 bg-surface/50 backdrop-blur-xl"
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
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-gradient shadow-glow">
                    <Play className="h-6 w-6 fill-white text-white" />
                  </div>
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
    </section>
  );
}
