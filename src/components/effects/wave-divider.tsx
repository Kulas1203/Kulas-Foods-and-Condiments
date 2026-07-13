"use client";

import { motion } from "motion/react";

interface WaveDividerProps {
  flip?: boolean;
  className?: string;
}

/** Animated sauce-wave divider between sections. */
export function WaveDivider({ flip = false, className }: WaveDividerProps) {
  return (
    <div
      className={className}
      style={{ transform: flip ? "rotate(180deg)" : undefined }}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="h-16 w-full md:h-24"
      >
        <defs>
          <linearGradient id="sauce" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C1121F" />
            <stop offset="55%" stopColor="#FF5A36" />
            <stop offset="100%" stopColor="#F4B400" />
          </linearGradient>
        </defs>
        <motion.path
          fill="url(#sauce)"
          fillOpacity="0.85"
          initial={{ d: "M0,64 C240,110 480,20 720,54 C960,88 1200,30 1440,64 L1440,120 L0,120 Z" }}
          animate={{
            d: [
              "M0,64 C240,110 480,20 720,54 C960,88 1200,30 1440,64 L1440,120 L0,120 Z",
              "M0,54 C240,20 480,100 720,64 C960,28 1200,96 1440,54 L1440,120 L0,120 Z",
              "M0,64 C240,110 480,20 720,54 C960,88 1200,30 1440,64 L1440,120 L0,120 Z",
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
