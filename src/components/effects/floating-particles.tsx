"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

/** Ambient floating ember particles rendered behind hero content. */
export function FloatingParticles({
  count = 26,
  className,
}: FloatingParticlesProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 2 + Math.random() * 5,
        delay: Math.random() * 6,
        duration: 8 + Math.random() * 10,
        drift: (Math.random() - 0.5) * 60,
        hue: Math.random() > 0.5 ? "#FF5A36" : "#F4B400",
        opacity: 0.3 + Math.random() * 0.5,
      })),
    [count],
  );

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: "-5%",
            width: p.size,
            height: p.size,
            background: p.hue,
            boxShadow: `0 0 ${p.size * 3}px ${p.hue}`,
            opacity: p.opacity,
          }}
          animate={{
            y: ["0vh", "-108vh"],
            x: [0, p.drift, 0],
            opacity: [0, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
