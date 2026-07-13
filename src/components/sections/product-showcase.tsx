"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "./section-heading";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";

/** Horizontal-scrolling product cards driven by vertical scroll. */
export function ProductShowcase() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-45%"]);

  return (
    <section id="showcase" ref={targetRef} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-16">
        <div className="container-px">
          <SectionHeading
            align="left"
            eyebrow="The Collection"
            title={
              <>
                The Kulas family is <span className="text-gradient">growing</span>
              </>
            }
            description="More handcrafted condiments are simmering. Here's what's coming to your table."
          />
        </div>

        <motion.div style={{ x }} className="mt-12 flex gap-6 pl-6 md:pl-10">
          {products.map((product) => (
            <motion.article
              key={product.id}
              whileHover={{ y: -10 }}
              className="group relative flex h-[420px] w-[320px] shrink-0 flex-col overflow-hidden rounded-4xl border border-white/10 bg-surface/60 backdrop-blur-xl sm:w-[380px]"
            >
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-surface to-background">
                <div className="absolute inset-0 bg-brand-radial opacity-50" />
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative h-full w-full p-6"
                >
                  <Image
                    src={product.heroImage}
                    alt={product.name}
                    fill
                    sizes="380px"
                    className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                </motion.div>
                {product.status === "COMING_SOON" && (
                  <Badge variant="soon" className="absolute right-4 top-4">
                    <Lock className="h-3 w-3" /> Coming Soon
                  </Badge>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-heading text-xl font-bold">{product.name}</h3>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">
                  {product.tagline}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-heading text-lg font-bold text-brand-accent">
                    {formatPrice(product.price)}
                  </span>
                  {product.status === "ACTIVE" ? (
                    <Link
                      href={`/products/${product.slug}`}
                      className="flex items-center gap-1 text-sm font-semibold text-brand-secondary transition-transform group-hover:translate-x-1"
                    >
                      View <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="text-sm text-muted">Notify me</span>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
