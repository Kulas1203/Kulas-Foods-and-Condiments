"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Heart, Share2, Minus, Plus, ShoppingBag, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section-heading";
import { HeatMeter } from "./heat-meter";
import { useCart } from "@/features/cart/cart-store";
import { getFeaturedProduct } from "@/data/products";
import { formatPrice, cn } from "@/lib/utils";

export function FeaturedProduct() {
  const product = getFeaturedProduct();
  const addItem = useCart((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [fav, setFav] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  async function handleShare() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/products/${product.slug}`
        : "";
    if (navigator.share) {
      await navigator.share({ title: product.name, url }).catch(() => {});
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url).catch(() => {});
    }
  }

  return (
    <section id="featured" className="relative py-24 sm:py-32">
      <div className="container-px">
        <SectionHeading
          eyebrow="The Flagship"
          title={
            <>
              Meet <span className="text-gradient">Kulas Chili Garlic</span>
            </>
          }
          description="One jar. Endless dishes. This is the sauce that started it all."
        />

        <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
          {/* Product visual */}
          <Reveal className="perspective">
            <motion.div
              whileHover={{ rotateY: 8, rotateX: -6 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="group relative aspect-square overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-br from-surface to-background p-8 shadow-soft"
            >
              <div className="absolute inset-0 bg-brand-radial opacity-60" />
              <motion.div
                animate={{ y: [0, -16, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative h-full w-full"
              >
                <Image
                  src={product.heroImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain drop-shadow-[0_30px_60px_rgba(193,18,31,0.45)]"
                />
              </motion.div>
              <Badge variant="gold" className="absolute left-6 top-6">
                <Star className="h-3.5 w-3.5 fill-current" />
                Best Seller
              </Badge>
            </motion.div>
          </Reveal>

          {/* Details */}
          <div>
            <Reveal>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-brand-accent text-brand-accent"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted">
                  {product.rating} · {product.reviewCount} reviews
                </span>
              </div>
              <h3 className="mt-3 font-heading text-3xl font-extrabold sm:text-4xl">
                {product.name}
              </h3>
              <p className="mt-3 text-muted">{product.description}</p>
            </Reveal>

            <Reveal delay={0.05} className="mt-6">
              <HeatMeter level={product.heatLevel} />
            </Reveal>

            {/* Ingredients */}
            <Reveal delay={0.1} className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
                Ingredients
              </p>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </Reveal>

            {/* Pairings */}
            <Reveal delay={0.12} className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
                Best Pairings
              </p>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-white/80">
                {product.pairings.map((pair) => (
                  <li key={pair} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary" />
                    {pair}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Nutrition */}
            {product.nutrition && (
              <Reveal delay={0.14} className="mt-5">
                <details className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-white/90">
                    Nutrition Facts
                    <span className="float-right text-muted group-open:rotate-180 transition-transform">
                      ⌄
                    </span>
                  </summary>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted sm:grid-cols-3">
                    <NutriCell k="Serving" v={product.nutrition.servingSize} />
                    <NutriCell k="Calories" v={`${product.nutrition.calories}`} />
                    <NutriCell k="Sodium" v={`${product.nutrition.sodiumMg}mg`} />
                    <NutriCell k="Carbs" v={`${product.nutrition.carbsG}g`} />
                    <NutriCell k="Sugars" v={`${product.nutrition.sugarsG}g`} />
                    <NutriCell k="Protein" v={`${product.nutrition.proteinG}g`} />
                  </div>
                </details>
              </Reveal>
            )}

            {/* Price + actions */}
            <Reveal delay={0.16} className="mt-8">
              <div className="flex items-end gap-3">
                <span className="font-heading text-4xl font-extrabold text-gradient">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="mb-1 text-lg text-muted line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1.5">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10"
                    aria-label="Decrease"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10"
                    aria-label="Increase"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <Button onClick={handleAdd} size="lg" className="flex-1 sm:flex-none">
                  {added ? (
                    <>
                      <Check className="h-4 w-4" /> Added
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" /> Add to Cart
                    </>
                  )}
                </Button>

                <button
                  onClick={() => setFav((v) => !v)}
                  aria-label="Favorite"
                  className={cn(
                    "grid h-12 w-12 place-items-center rounded-full border transition-colors",
                    fav
                      ? "border-brand-primary bg-brand-primary/20 text-brand-secondary"
                      : "border-white/10 bg-white/5 text-white hover:bg-white/10",
                  )}
                >
                  <Heart className={cn("h-5 w-5", fav && "fill-current")} />
                </button>

                <button
                  onClick={handleShare}
                  aria-label="Share"
                  className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function NutriCell({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg bg-white/[0.03] p-2">
      <p className="text-[10px] uppercase tracking-wider text-muted">{k}</p>
      <p className="text-sm font-semibold text-white">{v}</p>
    </div>
  );
}
