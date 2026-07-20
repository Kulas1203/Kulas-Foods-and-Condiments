"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Flame } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { getFeaturedProduct } from "@/data/products";

/** The making of Kulas — assembly-ledger strips. */
const steps = [
  {
    label: "01 · Fresh Harvest",
    title: "Labuyo picked at peak heat.",
    text: "We start with fresh Filipino labuyo chili — small, fierce, and full of flavor, chosen at its brightest red.",
    metric: "01",
    note: "Heat 4/5",
    indent: "",
  },
  {
    label: "02 · Toasted Garlic",
    title: "Golden, fragrant, never burnt.",
    text: "Garlic is toasted low and slow until it turns deep gold — the smoky backbone of every jar.",
    metric: "02",
    note: "Low & slow",
    indent: "lg:ml-[6%] lg:w-[88%]",
  },
  {
    label: "03 · Slow-Cook",
    title: "Small batches, stirred by hand.",
    text: "Chili, garlic, and premium oil simmer together in small batches so the heat builds deep and finishes clean.",
    metric: "03",
    note: "Small batch",
    indent: "lg:ml-[11%] lg:w-[82%]",
  },
  {
    label: "04 · Jar & Seal",
    title: "Sealed hot, delivered fresh.",
    text: "Every jar is filled and sealed the same day it's cooked — no preservatives, nothing artificial.",
    metric: "04",
    note: "220g net",
    indent: "lg:ml-[4%] lg:w-[92%]",
  },
];

/** What's inside — flavor-stack layers. */
const layers = [
  { tag: "Heat", name: "Fresh labuyo chili", right: "Fire", width: "86%", indent: "" },
  { tag: "Aroma", name: "Toasted garlic", right: "Golden", width: "74%", indent: "lg:ml-[6%]" },
  { tag: "Body", name: "Premium oil & sea salt", right: "Silk", width: "66%", indent: "lg:ml-[12%]" },
  { tag: "Finish", name: "Cane vinegar", right: "Bright", width: "58%", indent: "lg:ml-[4%]" },
];

const chips = ["Labuyo", "Toasted garlic", "Slow-cooked", "Zero preservatives"];

export function Craft() {
  const product = getFeaturedProduct();

  return (
    <section id="craft" className="relative overflow-hidden py-24 sm:py-32">
      {/* Ambient ember glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-[8%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,90,54,0.14),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 right-[4%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(244,180,0,0.09),transparent_70%)] blur-3xl" />
      </div>

      <div className="container-px relative">
        {/* ── Assembly ledger ── */}
        <div className="relative border-t border-white/10 pt-10">
          <Reveal>
            <div className="mb-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/50">
                  The Making of Kulas
                </p>
                <h2 className="mt-5 max-w-3xl font-heading text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl">
                  Cooked like a ritual,{" "}
                  <span className="text-gradient">jarred like a promise.</span>
                </h2>
              </div>
              <p className="max-w-md leading-8 text-muted">
                Every batch follows the heat, not the clock. Four stages, one
                small kitchen in Butuan City — assembled on scroll.
              </p>
            </div>
          </Reveal>

          <div className="space-y-5">
            {steps.map((step, i) => (
              <Reveal key={step.metric} delay={i * 0.05}>
                <article
                  className={`relative overflow-hidden border-b border-t border-white/10 py-6 ${step.indent}`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,90,54,0.08),transparent_35%,rgba(244,180,0,0.06)_75%,transparent_100%)] opacity-60" />
                  <div className="relative grid items-end gap-4 lg:grid-cols-[0.9fr_0.4fr_0.3fr]">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/55">
                        {step.label}
                      </p>
                      <h3 className="mt-3 font-heading text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
                        {step.title}
                      </h3>
                      <p className="mt-3 max-w-[48ch] leading-7 text-muted">
                        {step.text}
                      </p>
                    </div>
                    <div className="font-heading text-6xl font-extrabold leading-none tracking-tighter text-white/10 sm:text-8xl lg:justify-self-end">
                      {step.metric}
                    </div>
                    <div className="self-end text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50 lg:text-right">
                      {step.note}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── Flavor stack ── */}
        <div className="mt-24 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <Reveal>
            <div className="liquid-panel rounded-4xl p-7 sm:p-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/50">
                Flavor Stack
              </p>
              <h2 className="mt-5 font-heading text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-5xl">
                Four layers of fire in{" "}
                <span className="text-gradient">every spoonful.</span>
              </h2>
              <p className="mt-5 max-w-xl leading-8 text-muted">
                Labuyo heat up front, toasted-garlic smoke underneath, a silky
                body of premium oil, and a bright cane-vinegar finish that keeps
                you coming back.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              {/* The jar itself */}
              <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/10">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={product.heroImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 90vw, 45vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3.5 py-1.5 backdrop-blur-md">
                  <Flame className="h-3.5 w-3.5 text-brand-secondary" />
                  <span className="text-xs font-semibold text-white/90">
                    {product.name}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-4 pt-2">
            {layers.map((layer, i) => (
              <Reveal key={layer.tag} delay={i * 0.08}>
                <div className={`liquid-panel rounded-3xl p-5 sm:p-6 ${layer.indent}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
                        {layer.tag}
                      </p>
                      <p className="mt-2 font-heading text-xl font-bold leading-tight sm:text-2xl">
                        {layer.name}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50">
                      {layer.right}
                    </span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.span
                      initial={{ width: 0 }}
                      whileInView={{ width: layer.width }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      className="block h-full rounded-full bg-brand-gradient"
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
