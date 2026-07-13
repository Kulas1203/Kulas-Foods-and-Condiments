"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Mail, MapPin, Phone, Send, Check, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section-heading";
import { siteConfig } from "@/data/site";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", body: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", body: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="container-px">
        <SectionHeading
          eyebrow="Say Hello"
          title={
            <>
              Let&apos;s <span className="text-gradient">talk flavor</span>
            </>
          }
          description="Questions, wholesale, or just love for Kulas — we'd love to hear from you."
        />

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-2">
          {/* Info + map */}
          <Reveal className="space-y-4">
            {[
              { icon: Mail, label: "Email", value: siteConfig.email },
              { icon: Phone, label: "Phone", value: siteConfig.phone },
              { icon: MapPin, label: "Location", value: siteConfig.address },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-3xl border border-white/10 bg-surface/50 p-5 backdrop-blur-xl"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient shadow-glow">
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted">
                    {item.label}
                  </p>
                  <p className="font-semibold">{item.value}</p>
                </div>
              </div>
            ))}

            {/* Google Map — Sherwood, Butuan City (keyless embed) */}
            <div className="relative h-56 overflow-hidden rounded-3xl border border-white/10 bg-surface/50">
              <iframe
                title="Kulas Foods location — Sherwood, Butuan City"
                src="https://www.google.com/maps?q=Sherwood%2C%20Butuan%20City%2C%20Agusan%20del%20Norte%2C%20Philippines&z=15&output=embed"
                className="h-full w-full border-0 grayscale-[0.2] contrast-[1.05]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                <MapPin className="h-3.5 w-3.5 text-brand-secondary" />
                Sherwood, Butuan City
              </div>
            </div>

            <div className="flex gap-3">
              {[
                { icon: Facebook, href: siteConfig.socials.facebook },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-brand-primary/20 hover:text-brand-secondary"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-4xl border border-white/10 bg-surface/50 p-8 backdrop-blur-xl"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Name"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  required
                />
                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  required
                />
              </div>
              <Field
                label="Subject"
                value={form.subject}
                onChange={(v) => setForm({ ...form, subject: v })}
              />
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder:text-muted focus:border-brand-secondary/50 focus:outline-none"
                  placeholder="Tell us what's on your mind..."
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={status === "loading"}
              >
                {status === "sent" ? (
                  <>
                    <Check className="h-4 w-4" /> Message sent
                  </>
                ) : status === "loading" ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Send Message
                  </>
                )}
              </Button>
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm text-brand-secondary"
                >
                  Something went wrong. Please try again.
                </motion.p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-muted focus:border-brand-secondary/50 focus:outline-none"
      />
    </div>
  );
}
