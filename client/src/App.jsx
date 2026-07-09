import { Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Features from './components/Features.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

// The 3D scene pulls in three.js — lazy-load it so the 2D shell paints fast.
const Scene = lazy(() => import('./three/Scene.jsx'));

export default function App() {
  // dissolve the 3D backdrop as the story sections take over
  const { scrollY } = useScroll();
  const sceneOpacity = useTransform(scrollY, [0, 500, 900], [1, 0.55, 0]);

  return (
    <div className="grain relative min-h-screen font-sans text-cream">
      {/* fixed 3D backdrop — the hero overlays it, later sections cover it */}
      <motion.div
        style={{ opacity: sceneOpacity }}
        className="fixed inset-0 z-0 bg-hero-radial"
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </motion.div>

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <About />
        <Features />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
