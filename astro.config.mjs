import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://kedbin.github.io',
  base: '/relearn.ing', // GitHub Pages repo name
  integrations: [react(), tailwind()],
});