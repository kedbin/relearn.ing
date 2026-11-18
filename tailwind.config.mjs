import typography from '@tailwindcss/typography';

const c = (v) => `rgb(var(--${v}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: c('bg'),
        surface: c('surface'),
        surface2: c('surface-2'),
        line: c('line'),
        text: c('text'),
        muted: c('muted'),
        faint: c('faint'),
        accent: c('accent'),
        eng: c('eng'),
        life: c('life'),
        work: c('work'),
        // legacy aliases so untouched components keep compiling during migration
        border: c('line'),
        green: c('accent'),
        note: c('accent'),
        amber: c('work'),
        redsoft: c('accent'),
      },
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
  plugins: [typography],
};
