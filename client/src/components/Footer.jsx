export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-coal-soft px-5 py-12 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <div className="flex items-baseline justify-center gap-2 md:justify-start">
            <span className="font-script text-3xl text-cream">Kulas</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-glow">
              Foods &amp; Condiments
            </span>
          </div>
          <p className="mt-2 text-xs text-cream/40">
            Crafted with fire. Made with flavor.
          </p>
        </div>

        <nav className="flex gap-6 text-sm text-cream/60">
          <a href="#home" className="transition-colors hover:text-amber-glow">
            Home
          </a>
          <a href="#about" className="transition-colors hover:text-amber-glow">
            About
          </a>
          <a
            href="#products"
            className="transition-colors hover:text-amber-glow"
          >
            Our Products
          </a>
          <a
            href="#contact"
            className="transition-colors hover:text-amber-glow"
          >
            Contact
          </a>
        </nav>

        <p className="text-xs text-cream/35">
          © {new Date().getFullYear()} Kulas Foods and Condiments.
          <br className="md:hidden" /> All rights reserved.
        </p>
      </div>
    </footer>
  );
}
