"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Quote,
  PenLine,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Button } from "@/components/ui/button";
import { reviews as seedReviews } from "@/data/products";
import { cn } from "@/lib/utils";

type DisplayReview = {
  id: string;
  authorName: string;
  rating: number;
  title?: string;
  body: string;
  verified: boolean;
  location?: string;
};

export function Reviews() {
  const [reviews, setReviews] = useState<DisplayReview[]>(seedReviews);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(0);
  const [formOpen, setFormOpen] = useState(false);

  // Load approved reviews from the database; fall back to the seed testimonials.
  useEffect(() => {
    let active = true;
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((json) => {
        if (!active) return;
        const data = json?.data;
        if (Array.isArray(data) && data.length > 0) {
          setReviews(
            data.map(
              (r: {
                id: string;
                authorName: string;
                rating: number;
                title?: string;
                body: string;
                verified: boolean;
              }) => ({
                id: r.id,
                authorName: r.authorName,
                rating: r.rating,
                title: r.title ?? undefined,
                body: r.body,
                verified: r.verified,
              }),
            ),
          );
          setIndex(0);
        }
      })
      .catch(() => {
        /* keep seed reviews */
      });
    return () => {
      active = false;
    };
  }, []);

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

        {review && (
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
                  {review.title && (
                    <p className="mt-5 font-heading text-xl font-semibold leading-relaxed sm:text-2xl">
                      &ldquo;{review.title}&rdquo;
                    </p>
                  )}
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
                      {review.location && (
                        <p className="text-xs text-muted">{review.location}</p>
                      )}
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
              <div className="flex flex-wrap justify-center gap-2">
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
        )}

        {/* Write a review */}
        <div className="mt-12 text-center">
          <Button variant="secondary" onClick={() => setFormOpen(true)}>
            <PenLine className="h-4 w-4" /> Write a review
          </Button>
        </div>
      </div>

      <ReviewFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </section>
  );
}

function ReviewFormModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Attach the review to the flagship product.
      const prodRes = await fetch("/api/products?featured=true");
      const prodJson = await prodRes.json();
      const productId = prodJson?.data?.[0]?.id;
      if (!productId)
        throw new Error("Reviews aren't available right now. Please try later.");

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          authorName,
          rating,
          title: title || undefined,
          body,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not submit review");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setAuthorName("");
    setRating(5);
    setTitle("");
    setBody("");
    setError("");
    setDone(false);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={reset}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Write a review"
            className="fixed inset-0 z-[81] m-auto h-fit max-h-[90vh] w-[92%] max-w-lg overflow-y-auto rounded-4xl border border-white/10 bg-surface/95 p-6 backdrop-blur-2xl sm:p-8"
          >
            <button
              onClick={reset}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white transition-colors hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            {done ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-brand-secondary" />
                <h3 className="mt-4 font-heading text-2xl font-bold">
                  Salamat!
                </h3>
                <p className="mt-2 text-muted">
                  Your review has been submitted and is awaiting approval. It
                  will appear here once the Kulas team verifies it.
                </p>
                <Button className="mt-6" onClick={reset}>
                  Done
                </Button>
              </div>
            ) : (
              <>
                <h3 className="font-heading text-2xl font-extrabold">
                  Share your Kulas experience
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Reviews are checked by our team before going live.
                </p>

                <form onSubmit={submit} className="mt-6 grid gap-4">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                      Your name
                    </label>
                    <input
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. Maria Santos"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-muted focus:border-brand-secondary/50 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                      Rating
                    </label>
                    <div className="flex gap-1.5">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const value = i + 1;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setRating(value)}
                            onMouseEnter={() => setHover(value)}
                            onMouseLeave={() => setHover(0)}
                            aria-label={`${value} star${value > 1 ? "s" : ""}`}
                          >
                            <Star
                              className={cn(
                                "h-8 w-8 transition-colors",
                                value <= (hover || rating)
                                  ? "fill-brand-accent text-brand-accent"
                                  : "text-white/20",
                              )}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                      Title (optional)
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Sum it up in a few words"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-muted focus:border-brand-secondary/50 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                      Your review
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Tell us what you loved about Kulas…"
                      className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-muted focus:border-brand-secondary/50 focus:outline-none"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-brand-secondary">{error}</p>
                  )}

                  <Button type="submit" size="lg" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                      </>
                    ) : (
                      "Submit review"
                    )}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
