import { motion } from 'framer-motion';
import { fadeUp, scaleIn, staggerContainer, viewportOnce } from '../lib/motion.js';

export default function About() {
  return (
    <section
      id="about"
      className="relative bg-gradient-to-b from-transparent via-coal/95 to-coal px-5 pb-28 pt-44 md:px-8"
    >
      <motion.div
        variants={staggerContainer(0.15)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto max-w-6xl"
      >
        <motion.span variants={fadeUp} className="section-eyebrow">
          Our Story
        </motion.span>
        <motion.h2
          variants={fadeUp}
          className="max-w-2xl text-3xl font-extrabold text-cream md:text-5xl"
        >
          Born over a family stove,{' '}
          <span className="font-script font-normal text-amber-glow">
            bottled with soul
          </span>
        </motion.h2>

        <motion.div
          variants={scaleIn}
          className="glass mt-12 grid gap-10 rounded-3xl p-8 md:grid-cols-[1.2fr_1fr] md:p-12"
        >
          <div className="space-y-5 text-cream/75">
            <p>
              Kulas Foods and Condiments began in a small Filipino kitchen,
              where one family recipe — sun-ripened red chilies slow-cooked
              with hand-peeled garlic in golden oil — was passed from hand to
              hand until the neighbors started bringing their own empty jars.
            </p>
            <p>
              Nothing about the process has changed. Every batch is still
              stirred slowly in small kettles, seasoned by taste rather than
              by timer, and sealed the same day it's cooked. No shortcuts,
              no extenders, no artificial anything — just fire, garlic, and
              patience.
            </p>
            <p className="font-semibold text-cream">
              Crafted with fire. Made with flavor.
            </p>
            <div className="flex flex-wrap gap-6 pt-2">
              <Stat value="100%" label="Natural ingredients" />
              <Stat value="48h" label="From kettle to jar" />
              <Stat value="1" label="Family recipe" />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ChiliGarlicIllustration />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="text-2xl font-extrabold text-amber-glow">{value}</div>
      <div className="text-xs uppercase tracking-widest text-cream/50">
        {label}
      </div>
    </div>
  );
}

/** 2D illustration of the two heroes: a garlic bulb and a curved chili. */
function ChiliGarlicIllustration() {
  return (
    <motion.svg
      viewBox="0 0 300 260"
      className="w-full max-w-xs drop-shadow-[0_10px_40px_rgba(226,58,34,0.25)]"
      initial={{ rotate: -4 }}
      whileInView={{ rotate: 2 }}
      viewport={viewportOnce}
      transition={{ duration: 2.4, ease: 'easeInOut' }}
      aria-label="Garlic and chili illustration"
      role="img"
    >
      <defs>
        <linearGradient id="chiliGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e23a22" />
          <stop offset="1" stopColor="#8e1004" />
        </linearGradient>
        <radialGradient id="garlicGrad" cx="0.4" cy="0.35" r="0.9">
          <stop offset="0" stopColor="#faf3e3" />
          <stop offset="1" stopColor="#d9c9a8" />
        </radialGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e8a33d" stopOpacity="0.35" />
          <stop offset="1" stopColor="#e8a33d" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="150" cy="135" r="120" fill="url(#glow)" />

      {/* garlic bulb */}
      <g transform="translate(78 128)">
        <path
          d="M42 -38C48 -18 76 -6 76 26c0 30 -22 46 -44 46S-12 56 -12 26c0 -32 28 -44 34 -64 2 -8 18 -8 20 0z"
          fill="url(#garlicGrad)"
        />
        <path d="M32 -30C30 0 28 30 30 70" stroke="#bfae8c" strokeWidth="2.5" fill="none" />
        <path d="M14 -18C6 8 4 36 10 68" stroke="#bfae8c" strokeWidth="2" fill="none" />
        <path d="M52 -18C58 8 60 36 54 68" stroke="#bfae8c" strokeWidth="2" fill="none" />
        <path d="M30 -44c2 -8 8 -12 14 -10 -4 4 -4 8 -6 12z" fill="#a4926d" />
      </g>

      {/* chili */}
      <g transform="translate(150 96) rotate(24)">
        <path
          d="M6 6C40 2 96 12 118 54c14 28 -2 56 -18 44C82 84 60 88 40 66 22 47 2 26 6 6z"
          fill="url(#chiliGrad)"
        />
        <path
          d="M14 14C40 12 82 22 104 54"
          stroke="#ffffff"
          strokeOpacity="0.25"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M8 8C0 -4 -12 -8 -24 -4c6 2 8 8 10 14 2 5 10 8 16 4z"
          fill="#3e7c2f"
        />
      </g>

      {/* sparks */}
      <g fill="#e8a33d">
        <circle cx="236" cy="70" r="4" opacity="0.9" />
        <circle cx="252" cy="102" r="2.5" opacity="0.6" />
        <circle cx="58" cy="52" r="3" opacity="0.7" />
        <circle cx="44" cy="216" r="2.5" opacity="0.5" />
      </g>
    </motion.svg>
  );
}
