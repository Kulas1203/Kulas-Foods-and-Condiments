/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        chili: {
          DEFAULT: '#C21807',
          bright: '#E23A22',
          dark: '#8E1004',
          deep: '#5C0B06',
        },
        cream: {
          DEFAULT: '#F5EFE0',
          soft: '#EFE5CE',
        },
        coal: {
          DEFAULT: '#0D0B09',
          soft: '#171310',
          card: '#1E1712',
        },
        amber: {
          glow: '#E8A33D',
          gold: '#D4A24E',
        },
        rust: {
          DEFAULT: '#8B5A2B',
          light: '#B07B44',
        },
      },
      fontFamily: {
        sans: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        script: ['"Kaushan Script"', 'cursive'],
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(232,163,61,0.14), transparent 65%), radial-gradient(ellipse 60% 50% at 70% 80%, rgba(194,24,7,0.12), transparent 60%)',
        'ember-line':
          'linear-gradient(90deg, transparent, rgba(232,163,61,0.6), transparent)',
      },
      boxShadow: {
        ember: '0 0 40px -8px rgba(226,58,34,0.45)',
        'ember-lg': '0 10px 60px -10px rgba(226,58,34,0.55)',
        glass: '0 8px 32px rgba(0,0,0,0.35)',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'pulse-slow': 'pulse-slow 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
