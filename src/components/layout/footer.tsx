"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Facebook, Instagram, Send, Check } from "lucide-react";
import { siteConfig, footerLinks } from "@/data/site";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      /* optimistic UI regardless */
    }
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 3500);
  }

  return (
    <footer className="relative mt-24 border-t border-white/10 bg-surface/40">
      <div className="container-px py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand + newsletter */}
          <div>
            <Link href="/#home" className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-gradient shadow-glow">
                <Flame className="h-5 w-5 text-white" />
              </span>
              <span className="font-heading text-lg font-extrabold">Kulas</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted">
              Premium handcrafted chili garlic sauce for every Filipino kitchen.
              Crafted with fire, made with flavor.
            </p>

            <form onSubmit={subscribe} className="mt-6 max-w-sm">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                Join the Kulas kitchen
              </label>
              <div className="flex gap-2 rounded-full border border-white/10 bg-white/5 p-1.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="flex-1 bg-transparent px-4 text-sm text-white placeholder:text-muted focus:outline-none"
                />
                <Button type="submit" size="sm" aria-label="Subscribe">
                  {done ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {done && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-xs text-brand-accent"
                >
                  You&apos;re in! Watch your inbox for spicy recipes.
                </motion.p>
              )}
            </form>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="mb-4 font-heading text-sm font-bold uppercase tracking-widest text-white">
                {heading}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-brand-secondary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[
              { icon: Facebook, href: siteConfig.socials.facebook },
              { icon: Instagram, href: siteConfig.socials.instagram },
            ].map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-brand-primary/20 hover:text-brand-secondary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
