"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FloatingParticles } from "@/components/effects/floating-particles";
import { ThreeErrorBoundary } from "@/components/three/three-error-boundary";
import { getFeaturedProduct } from "@/data/products";

const ProductJarScene = dynamic(
  () => import("@/components/three/product-jar").then((m) => m.ProductJarScene),
  {
    ssr: false,
    loading: () => <JarFallback />,
  },
);

function JarFallback() {
  const product = getFeaturedProduct();
  return (
    <div className="relative grid h-full w-full place-items-center">
      <div className="absolute h-72 w-72 rounded-full bg-brand-radial blur-2xl" />
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-[420px] w-[320px]"
      >
        <Image
          src={product.heroImage}
          alt={product.name}
          fill
          priority
          sizes="320px"
          className="object-contain drop-shadow-[0_30px_60px_rgba(193,18,31,0.4)]"
        />
      </motion.div>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const jarScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-radial blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-ember-glow blur-3xl" />
        <FloatingParticles count={30} />
        <FloatingChilis />
      </div>

      <div className="container-px grid w-full items-center gap-8 lg:grid-cols-2">
        {/* Copy */}
        <motion.div style={{ y: textY, opacity }} className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="glass" className="mb-6">
              <Sparkles className="h-3.5 w-3.5 text-brand-accent" />
              Small-batch · Handcrafted in the Philippines
            </Badge>
          </motion.div>

          <h1 className="heading-hero text-balance">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="block"
            >
              Crafted with <span className="text-gradient">Fire.</span>
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="block"
            >
              Made with <span className="text-gradient">Flavor.</span>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 max-w-md text-lg text-muted"
          >
            Premium handcrafted chili garlic sauce made from fresh ingredients
            for every Filipino kitchen.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button asChild size="lg">
              <Link href="/products/kulas-chili-garlic-sauce">
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/#about">Learn More</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-10 flex items-center gap-6 text-sm text-muted"
          >
            <Stat value="4.9★" label="128 reviews" />
            <div className="h-8 w-px bg-white/10" />
            <Stat value="100%" label="Fresh ingredients" />
            <div className="h-8 w-px bg-white/10" />
            <Stat value="Zero" label="Preservatives" />
          </motion.div>
        </motion.div>

        {/* 3D Jar */}
        <motion.div
          style={{ scale: jarScale }}
          className="relative h-[420px] w-full sm:h-[560px] lg:h-[640px]"
        >
          <ThreeErrorBoundary fallback={<JarFallback />}>
            <ProductJarScene />
          </ThreeErrorBoundary>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
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

/** Decorative floating chilis & garlic behind the hero. */
function FloatingChilis() {
  const items = [
    { emoji: "🌶️", top: "18%", left: "8%", size: 44, dur: 9 },
    { emoji: "🧄", top: "62%", left: "14%", size: 38, dur: 11 },
    { emoji: "🌶️", top: "30%", left: "88%", size: 40, dur: 10 },
    { emoji: "🧄", top: "72%", left: "82%", size: 34, dur: 12 },
    { emoji: "🌶️", top: "82%", left: "48%", size: 30, dur: 8 },
  ];
  return (
    <>
      {items.map((it, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute select-none opacity-40 blur-[0.5px]"
          style={{ top: it.top, left: it.left, fontSize: it.size }}
          animate={{ y: [0, -24, 0], rotate: [0, 12, -6, 0] }}
          transition={{ duration: it.dur, repeat: Infinity, ease: "easeInOut" }}
        >
          {it.emoji}
        </motion.span>
      ))}
    </>
  );
}
