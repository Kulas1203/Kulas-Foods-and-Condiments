"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

type SortKey = "featured" | "price-asc" | "price-desc";

export function ProductGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortKey>("featured");

  const sorted = useMemo(() => {
    const copy = [...products];
    if (sort === "price-asc") copy.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") copy.sort((a, b) => b.price - a.price);
    else copy.sort((a, b) => Number(b.featured) - Number(a.featured));
    return copy;
  }, [products, sort]);

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <p className="text-sm text-muted">{products.length} products</p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-full border border-white/10 bg-surface px-4 py-2 text-sm text-white focus:outline-none"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((product) => (
          <motion.article
            key={product.id}
            whileHover={{ y: -8 }}
            className="group overflow-hidden rounded-4xl border border-white/10 bg-surface/50 backdrop-blur-xl"
          >
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-surface to-background">
              <div className="absolute inset-0 bg-brand-radial opacity-50" />
              <Image
                src={product.heroImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
              />
              {product.status === "COMING_SOON" && (
                <Badge variant="soon" className="absolute right-4 top-4">
                  <Lock className="h-3 w-3" /> Coming Soon
                </Badge>
              )}
            </div>
            <div className="p-6">
              <h3 className="font-heading text-lg font-bold">{product.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted">
                {product.tagline}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-heading text-lg font-bold text-brand-accent">
                  {formatPrice(product.price)}
                </span>
                {product.status === "ACTIVE" && (
                  <Link
                    href={`/products/${product.slug}`}
                    className="flex items-center gap-1 text-sm font-semibold text-brand-secondary transition-transform group-hover:translate-x-1"
                  >
                    View <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </>
  );
}
