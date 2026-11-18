import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://relearn.ing',
  trailingSlash: 'ignore',
  integrations: [react(), tailwind({ applyBaseStyles: false }), sitemap()],
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'vitesse-dark' },
      wrap: false,
    },
  },
});
