import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /**
         * The artwork's photographed ground, sampled off
         * public/ambalathara-logo.jpg — see the token block in globals.css.
         * 300 is the field, 100 the lit centre, 500 the corner vignette.
         */
        cream: {
          DEFAULT: '#ECD6BF',
          50: '#FAF0E0',
          100: '#F2DFCC',
          200: '#EFDAC4',
          300: '#ECD6BF',
          400: '#E4C7AA',
          500: '#D4B99D',
        },
        // Madder red / temple maroon
        maroon: {
          DEFAULT: '#6B1724',
          light: '#8A2434',
          dark: '#4C0F19',
        },
        /**
         * Kasavu zari gold. `dark` is the text-safe one: the old #9C7B3B
         * managed only 2.8:1 against the blush ground, so the small-caps
         * labels that use it dropped below legible. #6E5220 is the deep
         * antique zari in the artwork's border and clears 5.1:1.
         */
        gold: {
          DEFAULT: '#C5A059',
          light: '#DCC08A',
          pale: '#EFE2C6',
          dark: '#6E5220',
        },
        // Typography earth tones
        charcoal: {
          DEFAULT: '#2E2A26',
          soft: '#4A423A',
        },
        earth: '#5C4A3D',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'Cambria', 'serif'],
        // Pair with the `italic` utility so the true italic face is selected.
        'serif-italic': ['var(--font-playfair-italic)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
        zari: '0.4em',
      },
      boxShadow: {
        loom: '0 18px 40px -24px rgba(107, 23, 36, 0.35)',
        zari: '0 0 0 1px rgba(197, 160, 89, 0.35), 0 12px 30px -18px rgba(107, 23, 36, 0.4)',
      },
      backgroundImage: {
        'zari-sweep':
          'linear-gradient(105deg, transparent 30%, rgba(197,160,89,0.55) 48%, rgba(255,246,224,0.85) 52%, rgba(197,160,89,0.55) 56%, transparent 74%)',
      },
      keyframes: {
        'zari-shimmer': {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' },
        },
        'shuttle-glide': {
          '0%': { transform: 'translateX(-10%) rotate(0deg)' },
          '50%': { transform: 'translateX(110%) rotate(2deg)' },
          '100%': { transform: 'translateX(-10%) rotate(0deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'warp-drift': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 240px' },
        },
        /* The WhatsApp button settling into its corner on first paint. */
        'whatsapp-in': {
          '0%': { opacity: '0', transform: 'scale(0.6) translateY(14px)' },
          '70%': { opacity: '1', transform: 'scale(1.06) translateY(0)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        /* A slow halo expanding out from under it, then fading. */
        'whatsapp-ping': {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '70%': { transform: 'scale(1.9)', opacity: '0' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
      },
      animation: {
        'zari-shimmer': 'zari-shimmer 4.5s ease-in-out infinite',
        'shuttle-glide': 'shuttle-glide 18s ease-in-out infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        'warp-drift': 'warp-drift 40s linear infinite',
        'whatsapp-in': 'whatsapp-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 1.2s both',
        // Long gap between pulses: often enough to catch the eye, rare
        // enough not to nag while someone is reading the countdown.
        'whatsapp-ping': 'whatsapp-ping 2.6s cubic-bezier(0, 0, 0.2, 1) 2s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
