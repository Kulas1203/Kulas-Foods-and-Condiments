export const dynamic = "force-dynamic";

import Image from "next/image";
import { Plus, Clock } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { recipes as demoRecipes } from "@/data/products";

type RecipeRow = {
  id: string;
  title: string;
  image: string;
  category: string;
  time: number;
  published: boolean;
};

async function loadRecipes(): Promise<RecipeRow[]> {
  try {
    const dbRecipes = await prisma.recipe.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (dbRecipes.length > 0) {
      return dbRecipes.map((r) => ({
        id: r.id,
        title: r.title,
        image: r.image,
        category: r.category ?? "—",
        time: (r.prepTime ?? 0) + (r.cookTime ?? 0),
        published: r.published,
      }));
    }
  } catch {
    /* fall back to demo */
  }
  return demoRecipes.map((r) => ({
    id: r.id,
    title: r.title,
    image: r.image,
    category: r.category,
    time: r.prepTime + r.cookTime,
    published: true,
  }));
}

export default async function AdminRecipesPage() {
  const recipes = await loadRecipes();

  return (
    <div>
      <AdminTopbar title="Recipes" />
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">{recipes.length} recipes</p>
          <Button size="sm">
            <Plus className="h-4 w-4" /> New Recipe
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r) => (
            <div
              key={r.id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-surface/50 backdrop-blur-xl"
            >
              <div className="relative h-32 bg-gradient-to-br from-brand-primary/30 to-background">
                <Image
                  src={r.image}
                  alt={r.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover opacity-90"
                />
                <span
                  className={
                    r.published
                      ? "absolute right-3 top-3 rounded-full bg-green-500/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur"
                      : "absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted backdrop-blur"
                  }
                >
                  {r.published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="p-4">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-secondary">
                  {r.category}
                </span>
                <h3 className="mt-1 font-heading text-base font-bold leading-snug">
                  {r.title}
                </h3>
                <p className="mt-2 flex items-center gap-1 text-xs text-muted">
                  <Clock className="h-3.5 w-3.5" /> {r.time} min
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
