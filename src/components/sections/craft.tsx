"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Flame } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { getFeaturedProduct } from "@/data/products";

const metrics = [
  { label: "Heat Level", value: "4/5" },
  { label: "Small Batches", value: "100%" },
];

const bars = [
  { label: "Fresh Labuyo Chili", value: "96%", width: "w-[96%]" },
  { label: "Toasted Garlic", value: "91%", width: "w-[91%]" },
  { label: "Handcrafted Quality", value: "100%", width: "w-full" },
];

export function Craft() {
  const product = getFeaturedProduct();

  return (
    <section id="craft" className="relative overflow-hidden py-24 sm:py-32">
      {/* Ambient ember glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-[8%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,90,54,0.16),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 right-[4%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(244,180,0,0.1),transparent_70%)] blur-3xl" />
      </div>

      <div className="container-px relative">
        <section className="grid items-center gap-16 lg:grid-cols-[0.52fr_0.48fr]">
          {/* Copy + panels */}
          <div className="relative z-10 max-w-2xl">
            <Reveal>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 font-heading text-[11px] uppercase tracking-[0.3em] text-white/60">
                <span className="pulse-ember h-2 w-2 rounded-full bg-brand-secondary shadow-[0_0_15px_rgba(255,90,54,0.9)]" />
                Small-Batch Craft
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="mt-8 font-heading text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl xl:text-7xl">
                Crafted like a<br />
                <span className="text-gradient">living fire.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-8 max-w-xl text-lg leading-8 text-white/55">
                Every jar of Kulas is slow-cooked in small batches — fresh
                labuyo chili and toasted garlic coaxed into a deep, smoky heat
                that finishes clean. No shortcuts, no fillers. Just fire, made
                with flavor.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-12 flex flex-wrap gap-5">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="liquid-panel rounded-[2rem] px-6 py-5"
                  >
                    <div className="font-heading text-[10px] uppercase tracking-[0.28em] text-white/45">
                      {metric.label}
                    </div>
                    <div className="mt-3 font-heading text-3xl font-bold">
                      {metric.value}
                    </div>
                  </div>
                ))}

                <div className="liquid-panel flex-1 rounded-[2rem] px-6 py-5">
                  <div className="font-heading text-[10px] uppercase tracking-[0.28em] text-white/45">
                    In Every Spoonful
                  </div>
                  <div className="mt-4 space-y-3">
                    {bars.map((bar) => (
                      <div key={bar.label}>
                        <div className="mb-1.5 flex items-center justify-between text-xs text-white/55">
                          <span>{bar.label}</span>
                          <span>{bar.value}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: bar.value }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1.1,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className={`h-full rounded-full bg-brand-gradient ${bar.width}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Organic product shell */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="float-core scroll-grow relative aspect-square w-full max-w-[520px]"
            >
              {/* Ember glow behind the shape */}
              <div className="absolute inset-4 rounded-full bg-brand-radial opacity-70 blur-3xl" />

              {/* Organic blob mask holding the product photo */}
              <div
                className="relative h-full w-full overflow-hidden border border-white/10 shadow-glow"
                style={{
                  borderRadius: "46% 54% 56% 44% / 44% 42% 58% 56%",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/25 via-surface to-background" />
                <Image
                  src={product.heroImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover"
                  priority={false}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(15,15,15,0.55)_100%)]" />
              </div>

              {/* Product label pill — sibling so it's never clipped by the blob */}
              <div className="pulse-ember absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/70 px-4 py-2 backdrop-blur-md">
                <span className="flex items-center gap-2 text-xs font-semibold text-white/90">
                  <Flame className="h-3.5 w-3.5 text-brand-secondary" />
                  {product.name}
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </section>
  );
}
