"use client";

import { motion } from "motion/react";
import {
  Sprout,
  Flame,
  ChefHat,
  Leaf,
  Award,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { whyChooseUs } from "@/data/products";

const iconMap: Record<string, LucideIcon> = {
  Sprout,
  Flame,
  ChefHat,
  Leaf,
  Award,
  Truck,
};

export function WhyChooseUs() {
  return (
    <section id="why" className="relative py-24 sm:py-32">
      <div className="container-px">
        <SectionHeading
          eyebrow="Why Kulas"
          title={
            <>
              Crafted differently.
              <br />
              <span className="text-gradient">Tasted immediately.</span>
            </>
          }
          description="We obsess over every jar so you can taste the difference in every spoonful."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {whyChooseUs.map((item) => {
            const Icon = iconMap[item.icon] ?? Flame;
            return (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-4xl border border-white/10 bg-surface/50 p-7 backdrop-blur-xl"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-radial opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/5 text-brand-secondary transition-all duration-300 group-hover:bg-brand-gradient group-hover:text-white group-hover:shadow-glow">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-bold">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
