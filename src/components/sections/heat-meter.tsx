"use client";

import { motion } from "motion/react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeatMeterProps {
  level: number; // 1-5
  max?: number;
}

const labels = ["Mild", "Warm", "Medium", "Hot", "Fire"];

export function HeatMeter({ level, max = 5 }: HeatMeterProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted">
          Heat Level
        </span>
        <span className="font-heading text-sm font-bold text-brand-secondary">
          {labels[Math.min(level, max) - 1]}
        </span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: max }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={cn(
              "flex h-9 flex-1 items-center justify-center rounded-lg border transition-colors",
              i < level
                ? "border-brand-secondary/40 bg-brand-gradient"
                : "border-white/10 bg-white/5",
            )}
          >
            <Flame
              className={cn(
                "h-4 w-4",
                i < level ? "text-white" : "text-white/20",
              )}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
