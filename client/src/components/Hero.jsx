import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '../lib/motion.js';

/**
 * Hero copy overlaid on the fixed 3D scene. The container ignores pointer
 * events so drag-to-spin reaches the jar; buttons opt back in.
 */
export default function Hero() {
  return (
    <section
      id="home"
      className="pointer-events-none relative flex h-screen flex-col items-center justify-between overflow-hidden px-5 pb-10 pt-28 text-center md:pt-32"
    >
      <motion.div
        variants={staggerContainer(0.14, 0.35)}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center"
      >
        <motion.p
          variants={fadeUp}
          className="mb-4 text-[11px] font-bold uppercase tracking-[0.4em] text-amber-glow md:text-xs"
        >
          Small-Batch · Handcrafted · Fiery
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="max-w-4xl text-4xl font-extrabold leading-tight text-cream drop-shadow-[0_2px_20px_rgba(0,0,0,0.7)] sm:text-5xl md:text-7xl"
        >
          <span className="font-script font-normal text-amber-glow">
            Kulas
          </span>{' '}
          Chili Garlic Sauce
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-5 max-w-xl text-base text-cream/70 md:text-lg"
        >
          Ignite your taste buds with pure heat and flavor.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.a
            href="#products"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="btn-primary"
          >
            <FlameIcon />
            Shop the Heat
          </motion.a>
          <motion.a
            href="#about"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="btn-ghost"
          >
            Our Story
          </motion.a>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="flex flex-col items-center gap-2 text-cream/40"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">
          Scroll to explore
        </span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="block h-8 w-px bg-gradient-to-b from-amber-glow to-transparent"
        />
      </motion.div>
    </section>
  );
}

function FlameIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2c.6 3-0.5 4.6-2 6-1.9 1.9-3.5 4-3.5 7A7.5 7.5 0 0 0 14 22.4c3.9-.8 6.5-4.2 6-8.4-.6-5.5-4.6-9-8-12zm1.5 17.9a3.5 3.5 0 0 1-5-3.2c0-1.5.7-2.7 1.8-3.7.3 1.4 1.2 2.3 2.5 2.8 1.5.6 2.3 1.6 2.1 3a2.9 2.9 0 0 1-1.4 1.1z" />
    </svg>
  );
}
