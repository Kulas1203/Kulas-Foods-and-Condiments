"use client";

import { motion, type Variants } from "framer-motion";
import { fadeInUp } from "@/animations/variants";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  once?: boolean;
  as?: "div" | "section" | "li" | "article";
}

/** Fades content in as it scrolls into view. */
export function Reveal({
  children,
  className,
  variants = fadeInUp,
  delay = 0,
  once = true,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
