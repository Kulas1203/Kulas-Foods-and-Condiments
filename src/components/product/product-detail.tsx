"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  Star,
  Truck,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeatMeter } from "@/components/sections/heat-meter";
import { useCart } from "@/features/cart/cart-store";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const addItem = useCart((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [fav, setFav] = useState(false);
  const [added, setAdded] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [tab, setTab] = useState<"description" | "ingredients" | "nutrition">(
    "description",
  );

  const gallery =
    product.gallery.length > 0 ? product.gallery : [product.heroImage];

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="container-px pb-24 pt-32">
      <Link
        href="/#featured"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            className="relative aspect-square overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-br from-surface to-background p-10"
          >
            <div className="absolute inset-0 bg-brand-radial opacity-50" />
            <motion.div
              animate={{ y: zoom ? 0 : [0, -14, 0], scale: zoom ? 1.15 : 1 }}
              transition={
                zoom
                  ? { duration: 0.4 }
                  : { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }
              className="relative h-full w-full"
            >
              <Image
                src={gallery[active]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain drop-shadow-[0_30px_60px_rgba(193,18,31,0.45)]"
              />
            </motion.div>
          </div>
          <div className="mt-4 flex gap-3">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  "relative h-20 w-20 overflow-hidden rounded-2xl border-2 bg-surface p-2 transition-colors",
                  active === i ? "border-brand-secondary" : "border-white/10",
                )}
              >
                <Image
                  src={img}
                  alt={`${product.name} view ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
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

          <h1 className="mt-3 font-heading text-4xl font-extrabold">
            {product.name}
          </h1>
          {product.tagline && (
            <p className="mt-2 text-lg text-muted">{product.tagline}</p>
          )}

          <div className="mt-5 flex items-end gap-3">
            <span className="font-heading text-4xl font-extrabold text-gradient">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="mb-1 text-lg text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            {product.netWeight && (
              <Badge variant="glass" className="mb-1.5">
                {product.netWeight}
              </Badge>
            )}
          </div>

          <div className="mt-6">
            <HeatMeter level={product.heatLevel} />
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
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
                  : "border-white/10 bg-white/5 hover:bg-white/10",
              )}
            >
              <Heart className={cn("h-5 w-5", fav && "fill-current")} />
            </button>
            <button
              aria-label="Share"
              className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          {/* Trust row */}
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted">
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-brand-secondary" /> Free shipping over ₱1,000
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-secondary" /> No preservatives
            </span>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="flex gap-2">
              {(["description", "ingredients", "nutrition"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors",
                    tab === t
                      ? "bg-brand-gradient text-white"
                      : "text-muted hover:text-white",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="mt-4 text-muted">
              {tab === "description" && <p>{product.description}</p>}
              {tab === "ingredients" && (
                <ul className="grid grid-cols-2 gap-2">
                  {product.ingredients.map((ing) => (
                    <li key={ing} className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary" />
                      {ing}
                    </li>
                  ))}
                </ul>
              )}
              {tab === "nutrition" &&
                (product.nutrition ? (
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries({
                      Serving: product.nutrition.servingSize,
                      Calories: product.nutrition.calories,
                      Sodium: `${product.nutrition.sodiumMg}mg`,
                      Carbs: `${product.nutrition.carbsG}g`,
                      Sugars: `${product.nutrition.sugarsG}g`,
                      Protein: `${product.nutrition.proteinG}g`,
                    }).map(([k, v]) => (
                      <div
                        key={k}
                        className="rounded-xl bg-white/[0.03] p-3 text-center"
                      >
                        <p className="text-[10px] uppercase tracking-wider text-muted">
                          {k}
                        </p>
                        <p className="text-sm font-semibold text-white">{v}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm">Nutrition details coming soon.</p>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-24">
          <h2 className="mb-8 font-heading text-2xl font-bold">
            You might also <span className="text-gradient">love</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group overflow-hidden rounded-4xl border border-white/10 bg-surface/50 p-6 transition-transform hover:-translate-y-2"
              >
                <div className="relative h-40">
                  <Image
                    src={p.heroImage}
                    alt={p.name}
                    fill
                    sizes="33vw"
                    className="object-contain transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 font-heading font-bold">{p.name}</h3>
                <p className="mt-1 text-sm text-brand-accent">
                  {formatPrice(p.price)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
