"use client";

import { useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { Menu, X, ShoppingBag, Flame } from "lucide-react";
import { navLinks, siteConfig } from "@/data/site";
import { useCart } from "@/features/cart/cart-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const totalItems = useCart((s) => s.totalItems());
  const setCartOpen = useCart((s) => s.setOpen);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "transition-all duration-500",
            scrolled
              ? "border-b border-white/10 bg-background/70 backdrop-blur-xl"
              : "bg-transparent",
          )}
        >
          <nav className="container-px flex h-20 items-center justify-between py-3">
            <Link href="/#home" className="group flex items-center gap-2.5">
              <motion.span
                whileHover={{ rotate: 20, scale: 1.1 }}
                className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-gradient shadow-glow"
              >
                <Flame className="h-5 w-5 text-white" />
              </motion.span>
              <span className="font-heading text-lg font-extrabold tracking-tight text-white">
                Kulas
                <span className="ml-1 hidden text-xs font-medium tracking-widest text-muted sm:inline">
                  FOODS
                </span>
              </span>
            </Link>

            <div className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                  {link.label}
                  <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-brand-gradient transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCartOpen(true)}
                aria-label="Open cart"
                className="relative grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-brand-secondary text-[11px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </button>
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href="/products/kulas-chili-garlic-sauce">Shop Now</Link>
              </Button>
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle menu"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>
        </div>

        <motion.div
          style={{ scaleX: progress }}
          className="h-0.5 origin-left bg-brand-gradient"
        />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="container-px flex h-full flex-col justify-center gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-heading text-3xl font-bold text-white/90 hover:text-brand-secondary"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Button asChild size="lg" className="mt-6 w-fit">
                <Link
                  href="/products/kulas-chili-garlic-sauce"
                  onClick={() => setOpen(false)}
                >
                  Shop Now
                </Link>
              </Button>
              <p className="mt-8 text-sm text-muted">{siteConfig.email}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
