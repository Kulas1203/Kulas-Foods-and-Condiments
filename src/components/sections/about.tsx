"use client";

import { motion } from "framer-motion";
import { Target, Eye, Heart } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section-heading";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { timeline } from "@/data/products";

const pillars = [
  {
    icon: Target,
    title: "Our Mission",
    body: "To bring bold, authentic Filipino flavor to every table — handcrafted, honest, and made to be shared.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    body: "To become the Philippines' most-loved artisan condiment brand, one small batch at a time.",
  },
  {
    icon: Heart,
    title: "Our Story",
    body: "A family recipe from Iloilo that grew from Sunday lunches into a brand — without ever losing its soul.",
  },
];

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="container-px">
        <SectionHeading
          eyebrow="Our Story"
          title={
            <>
              Rooted in family.
              <br />
              <span className="text-gradient">Perfected by fire.</span>
            </>
          }
          description="Every jar of Kulas carries a story — of fresh markets, slow cooking, and a family that believes flavor should never be rushed."
        />

        {/* Pillars */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid gap-6 md:grid-cols-3"
        >
          {pillars.map((p) => (
            <motion.div
              key={p.title}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="group rounded-4xl border border-white/10 bg-surface/50 p-8 backdrop-blur-xl transition-shadow hover:shadow-glow"
            >
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient shadow-glow transition-transform group-hover:scale-110">
                <p.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 font-heading text-xl font-bold">{p.title}</h3>
              <p className="text-muted">{p.body}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline — "Made with Love" */}
        <div className="mt-24">
          <Reveal>
            <h3 className="mb-12 text-center font-heading text-2xl font-bold sm:text-3xl">
              Made with Love — <span className="text-gradient">Our Journey</span>
            </h3>
          </Reveal>

          <div className="relative">
            {/* line */}
            <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-brand-primary via-brand-secondary to-brand-accent md:left-1/2 md:-translate-x-1/2" />

            <div className="space-y-12">
              {timeline.map((item, i) => (
                <Reveal
                  key={item.year}
                  variants={fadeInUp}
                  delay={i * 0.05}
                  className={`relative flex flex-col gap-4 pl-12 md:w-1/2 md:pl-0 ${
                    i % 2 === 0
                      ? "md:pr-12 md:text-right"
                      : "md:ml-auto md:pl-12 md:text-left"
                  }`}
                >
                  <span
                    className={`absolute left-4 top-1 h-4 w-4 -translate-x-1/2 rounded-full bg-brand-gradient shadow-glow ring-4 ring-background md:left-auto ${
                      i % 2 === 0 ? "md:-right-2 md:left-auto" : "md:-left-2"
                    }`}
                  />
                  <div className="rounded-3xl border border-white/10 bg-surface/50 p-6 backdrop-blur-xl">
                    <span className="font-heading text-3xl font-extrabold text-gradient">
                      {item.year}
                    </span>
                    <h4 className="mt-2 font-heading text-lg font-bold">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm text-muted">{item.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
