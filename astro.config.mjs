import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://relearn.ing',
  trailingSlash: 'ignore',
  integrations: [tailwind({ applyBaseStyles: false }), sitemap()],
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  // Allow previewing over Tailscale MagicDNS (dev/preview only; no effect on the static build).
  server: { allowedHosts: ['.ts.net'] },
  vite: { preview: { allowedHosts: ['.ts.net'] }, server: { allowedHosts: ['.ts.net'] } },
  markdown: {
    shikiConfig: {
      // Syntax colors come from palette roles (see docs/COLOR.md), so code follows day and night.
      theme: 'css-variables',
      wrap: false,
    },
  },
});
