"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, Sparkles, ChevronDown, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFeaturedProduct } from "@/data/products";
import { formatPrice } from "@/lib/utils";

const SPECS = [
  "Fresh Labuyo",
  "Toasted Garlic",
  "Slow-Cooked",
  "Zero Preservatives",
];

/** Chili flakes & sauce drips that fly across the video like embers. */
const FLIGHTS: { kind: "flake" | "drip"; vars: Record<string, string> }[] = [
  { kind: "flake", vars: { "--x0": "60vw", "--y0": "14vh", "--x1": "8vw", "--y1": "32vh", "--r0": "-12deg", "--r1": "16deg", left: "58%", top: "12%" } },
  { kind: "flake", vars: { "--x0": "62vw", "--y0": "22vh", "--x1": "12vw", "--y1": "44vh", "--r0": "14deg", "--r1": "-12deg", left: "64%", top: "18%" } },
  { kind: "flake", vars: { "--x0": "66vw", "--y0": "36vh", "--x1": "18vw", "--y1": "48vh", "--r0": "-8deg", "--r1": "8deg", left: "70%", top: "28%" } },
  { kind: "flake", vars: { "--x0": "58vw", "--y0": "48vh", "--x1": "14vw", "--y1": "58vh", "--r0": "10deg", "--r1": "-10deg", left: "54%", top: "38%" } },
  { kind: "flake", vars: { "--x0": "72vw", "--y0": "24vh", "--x1": "24vw", "--y1": "38vh", "--r0": "-14deg", "--r1": "14deg", left: "76%", top: "20%" } },
  { kind: "drip", vars: { "--x0": "68vw", "--y0": "18vh", "--x1": "18vw", "--y1": "26vh", "--r0": "-24deg", "--r1": "20deg", left: "67%", top: "14%" } },
  { kind: "drip", vars: { "--x0": "74vw", "--y0": "30vh", "--x1": "22vw", "--y1": "46vh", "--r0": "18deg", "--r1": "-22deg", left: "74%", top: "24%" } },
  { kind: "drip", vars: { "--x0": "70vw", "--y0": "50vh", "--x1": "16vw", "--y1": "56vh", "--r0": "-18deg", "--r1": "10deg", left: "72%", top: "42%" } },
  { kind: "flake", vars: { "--x0": "76vw", "--y0": "18vh", "--x1": "28vw", "--y1": "20vh", "--r0": "7deg", "--r1": "-7deg", left: "81%", top: "14%" } },
  { kind: "flake", vars: { "--x0": "78vw", "--y0": "44vh", "--x1": "30vw", "--y1": "52vh", "--r0": "-10deg", "--r1": "12deg", left: "84%", top: "36%" } },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const product = getFeaturedProduct();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.24]);
  const videoY = useTransform(scrollYProgress, [0, 1], [0, 18]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen overflow-hidden pt-24"
    >
      {/* Ambient brand glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-24 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(255,90,54,0.16),transparent_72%)] blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(244,180,0,0.1),transparent_72%)] blur-3xl" />
      </div>

      <div className="container-px grid min-h-[calc(100vh-6rem)] w-full items-stretch gap-6 lg:grid-cols-[0.44fr_0.56fr]">
        {/* Copy card */}
        <motion.div
          style={{ y: textY, opacity }}
          className="relative z-30 flex items-center py-10 lg:py-14"
        >
          <div className="glass w-full max-w-xl rounded-4xl p-7 sm:p-9">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="glass" className="mb-6">
                <span className="pulse-ember mr-1 inline-block h-2 w-2 rounded-full bg-brand-secondary shadow-[0_0_12px_rgba(255,90,54,0.9)]" />
                <Sparkles className="h-3.5 w-3.5 text-brand-accent" />
                Small-batch · Handcrafted in Butuan City
              </Badge>
            </motion.div>

            <h1 className="heading-hero text-balance">
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="heat-wave block"
              >
                Kulas
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="heat-wave block text-gradient"
              >
                Chili Garlic
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-6 max-w-md text-lg leading-8 text-muted"
            >
              Premium handcrafted chili garlic sauce — fresh labuyo and toasted
              garlic, slow-cooked for every Filipino kitchen.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-6 flex flex-wrap gap-2"
            >
              {SPECS.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70"
                >
                  {s}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Button asChild size="lg">
                <Link href="/products/kulas-chili-garlic-sauce">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/#recipes">View Recipes</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-9 flex items-center gap-6 text-sm text-muted"
            >
              <Stat value="4.9★" label="128 reviews" />
              <div className="h-8 w-px bg-white/10" />
              <Stat value="100%" label="Fresh ingredients" />
              <div className="h-8 w-px bg-white/10" />
              <Stat value="Zero" label="Preservatives" />
            </motion.div>
          </div>
        </motion.div>

        {/* Cinematic sauce video */}
        <div className="relative order-first min-h-[46vh] overflow-hidden lg:order-none lg:min-h-0">
          <motion.div
            style={{ scale: videoScale, y: videoY }}
            className="absolute inset-0"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover object-center [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_16%,black_72%,transparent_96%)] [mask-image:linear-gradient(to_right,transparent_0%,black_16%,black_72%,transparent_96%)]"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* Warm sauce glow + legibility scrim */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_24%,rgba(255,228,195,0.1),transparent_16%),radial-gradient(circle_at_70%_62%,rgba(244,180,0,0.12),transparent_16%),linear-gradient(180deg,rgba(15,15,15,0.05),rgba(15,15,15,0.45))]" />
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[42%] bg-gradient-to-r from-background/70 via-background/30 to-transparent lg:block" />

          {/* Flying chili flakes & sauce drips */}
          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
            {FLIGHTS.map(({ kind, vars }, i) => (
              <span
                key={i}
                className={
                  kind === "flake"
                    ? "chili-flight absolute h-[4px] w-[10px] rounded-sm bg-[rgba(255,242,216,0.9)]"
                    : "chili-flight absolute h-[6px] w-[18px] rounded-sm bg-[rgba(255,90,54,0.9)]"
                }
                style={vars as React.CSSProperties}
              />
            ))}
          </div>

          {/* Floating product card (the real jar photo) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="absolute bottom-6 left-4 z-30 sm:left-8 lg:bottom-14"
          >
            <Link
              href="/products/kulas-chili-garlic-sauce"
              className="glass-strong flex items-center gap-4 rounded-3xl p-4 pr-6 transition-transform hover:-translate-y-1"
            >
              <span className="relative block h-16 w-16 overflow-hidden rounded-2xl bg-black/40">
                <Image
                  src={product.heroImage}
                  alt={product.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                  priority
                />
              </span>
              <span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                  <Flame className="h-3.5 w-3.5 text-brand-secondary" />
                  {product.name}
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  {formatPrice(product.price)} · {product.netWeight} ·{" "}
                  <span className="text-brand-accent">Order now →</span>
                </span>
              </span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-heading text-lg font-bold text-white">{value}</p>
      <p className="text-xs">{label}</p>
    </div>
  );
}
