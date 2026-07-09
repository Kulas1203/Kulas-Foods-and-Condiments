import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion.js';

const FEATURES = [
  {
    title: 'Fresh Red Chili',
    body: 'Sun-ripened native chilies picked at peak heat, delivering a clean, building burn that never turns bitter.',
    Icon: ChiliIcon,
    accent: 'from-chili-bright/25',
  },
  {
    title: 'Organic Garlic',
    body: 'Plump, hand-peeled cloves slow-toasted in golden oil until sweet, savory, and impossibly aromatic.',
    Icon: GarlicIcon,
    accent: 'from-amber-glow/25',
  },
  {
    title: 'Premium Spices',
    body: 'A guarded blend of toasted spices rounds out the heat — smoky, deep, and unmistakably Kulas.',
    Icon: SpiceIcon,
    accent: 'from-rust-light/25',
  },
];

export default function Features() {
  return (
    <section id="products" className="relative bg-coal px-5 py-28 md:px-8">
      {/* faint ember divider */}
      <div className="absolute inset-x-0 top-0 mx-auto h-px max-w-4xl bg-ember-line" />

      <motion.div
        variants={staggerContainer(0.15)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto max-w-6xl"
      >
        <motion.span variants={fadeUp} className="section-eyebrow">
          Our Products
        </motion.span>
        <motion.h2
          variants={fadeUp}
          className="max-w-2xl text-3xl font-extrabold text-cream md:text-5xl"
        >
          Three ingredients.{' '}
          <span className="font-script font-normal text-amber-glow">
            Zero compromise.
          </span>
        </motion.h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {FEATURES.map(({ title, body, Icon, accent }) => (
            <motion.article
              key={title}
              variants={fadeUp}
              whileHover={{ scale: 1.04, y: -6 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className={`glass group relative overflow-hidden rounded-3xl bg-gradient-to-b ${accent} to-transparent p-8`}
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-amber-glow transition-colors group-hover:text-chili-bright">
                <Icon />
              </div>
              <h3 className="text-xl font-bold text-cream">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/65">
                {body}
              </p>
              <div className="mt-6 h-px w-12 bg-amber-glow/40 transition-all duration-500 group-hover:w-24 group-hover:bg-chili-bright/70" />
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ChiliIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 4c0-1 .8-2 2-2" />
      <path d="M13 6c0-1.5.9-2 2-2s2 .5 2 2c0 .8-.3 1.4-1 2" />
      <path d="M13 6c.5 5-1.5 10-6 13-2 1.3-4 1.6-5 1 4-1 5.5-3.5 6-6 .7-3.6 2-7 5-8z" />
    </svg>
  );
}

function GarlicIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3c.5 3 4.5 4.5 4.5 9 0 4.5-2.5 7-4.5 7s-4.5-2.5-4.5-7c0-4.5 4-6 4.5-9z" />
      <path d="M10.5 8c-.8 2.5-1 5.5-.4 9" />
      <path d="M13.5 8c.8 2.5 1 5.5.4 9" />
      <path d="M12 3c0-1 .6-1.8 1.6-2" />
    </svg>
  );
}

function SpiceIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12h16" />
      <path d="M5 12a7 7 0 0 0 14 0" />
      <path d="M12 12V7" />
      <path d="M12 7c-2 0-3-1.5-3-3 2 0 3 .5 3 3zm0 0c2 0 3-1.5 3-3-2 0-3 .5-3 3z" />
    </svg>
  );
}
