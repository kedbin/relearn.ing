import roles from './src/styles/colors.json' with { type: 'json' };

const c = (v) => `rgb(var(--${v}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    colors: {
      inherit: 'inherit', current: 'currentColor', transparent: 'transparent',
      ...Object.fromEntries(Object.keys(roles).map(name => [name, c(name)])),
      surface2: c('surface-2'), border: c('line'),
      // Preflight reads colors.gray.400 for placeholders; point it at a role so no default gray ships.
      gray: { 400: c('faint') },
    },
    // Tailwind's built-in shadow, ring and ring-offset defaults are palette roles too (docs/COLOR.md).
    boxShadow: {
      sm: '0 1px 2px 0 rgb(var(--scrim) / 0.05)',
      DEFAULT: '0 1px 3px 0 rgb(var(--scrim) / 0.1), 0 1px 2px -1px rgb(var(--scrim) / 0.1)',
      md: '0 4px 6px -1px rgb(var(--scrim) / 0.1), 0 2px 4px -2px rgb(var(--scrim) / 0.1)',
      lg: '0 10px 15px -3px rgb(var(--scrim) / 0.1), 0 4px 6px -4px rgb(var(--scrim) / 0.1)',
      xl: '0 20px 25px -5px rgb(var(--scrim) / 0.1), 0 8px 10px -6px rgb(var(--scrim) / 0.1)',
      none: 'none',
    },
    ringColor: { DEFAULT: 'rgb(var(--accent) / 0.5)' },
    ringOffsetColor: { DEFAULT: 'rgb(var(--bg))' },
    extend: {
      fontFamily: {
        display: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
        serif: ['"Newsreader Variable"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Geist Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        wrap: '1200px',
        read: '700px',
      },
      transitionTimingFunction: {
        'out-quint': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        reveal: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        reveal: 'reveal 600ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};
