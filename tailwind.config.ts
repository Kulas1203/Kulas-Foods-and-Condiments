import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1440px" },
    },
    extend: {
      colors: {
        // Kulas brand palette
        brand: {
          primary: "#C1121F", // deep red
          secondary: "#FF5A36", // orange / crimson
          accent: "#F4B400", // gold
          ember: "#E63114",
        },
        background: "#0F0F0F",
        surface: "#1B1B1B",
        muted: "#A0A0A0",
        // shadcn tokens (HSL via CSS vars)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        button: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #C1121F 0%, #FF5A36 55%, #F4B400 100%)",
        "brand-radial":
          "radial-gradient(circle at 50% 0%, rgba(255,90,54,0.28), transparent 55%)",
        "ember-glow":
          "radial-gradient(circle at 50% 50%, rgba(193,18,31,0.35), transparent 70%)",
      },
      boxShadow: {
        glow: "0 0 60px -10px rgba(255,90,54,0.45)",
        "glow-gold": "0 0 50px -12px rgba(244,180,0,0.5)",
        soft: "0 20px 60px -20px rgba(0,0,0,0.7)",
        glass: "inset 0 1px 0 0 rgba(255,255,255,0.08), 0 20px 50px -20px rgba(0,0,0,0.8)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        "4xl": "2rem",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-26px) rotate(6deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
