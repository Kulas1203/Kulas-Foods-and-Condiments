"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, BadgeCheck, Quote } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { reviews } from "@/data/products";

export function Reviews() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(0);

  function paginate(newDir: number) {
    setDir(newDir);
    setIndex((prev) => (prev + newDir + reviews.length) % reviews.length);
  }

  const review = reviews[index];

  return (
    <section id="reviews" className="relative py-24 sm:py-32">
      <div className="container-px">
        <SectionHeading
          eyebrow="Loved Nationwide"
          title={
            <>
              What the <span className="text-gradient">Kulas family</span> says
            </>
          }
          description="Real reviews from real kitchens across the Philippines."
        />

        <div className="relative mx-auto mt-16 max-w-3xl">
          <div className="relative min-h-[280px] overflow-hidden">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={review.id}
                custom={dir}
                initial={{ opacity: 0, x: dir >= 0 ? 60 : -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir >= 0 ? -60 : 60 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-4xl border border-white/10 bg-surface/50 p-8 backdrop-blur-xl sm:p-12"
              >
                <Quote className="h-10 w-10 text-brand-primary/40" />
                <div className="mt-4 flex gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-brand-accent text-brand-accent"
                    />
                  ))}
                </div>
                <p className="mt-5 font-heading text-xl font-semibold leading-relaxed sm:text-2xl">
                  &ldquo;{review.title}&rdquo;
                </p>
                <p className="mt-3 text-muted">{review.body}</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-brand-gradient font-heading font-bold text-white">
                    {review.authorName.charAt(0)}
                  </div>
                  <div>
                    <p className="flex items-center gap-1.5 font-semibold">
                      {review.authorName}
                      {review.verified && (
                        <BadgeCheck className="h-4 w-4 text-brand-secondary" />
                      )}
                    </p>
                    <p className="text-xs text-muted">{review.location}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => paginate(-1)}
              aria-label="Previous review"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDir(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  aria-label={`Go to review ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index
                      ? "w-8 bg-brand-gradient"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => paginate(1)}
              aria-label="Next review"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
