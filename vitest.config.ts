import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

// Vitest config for the site's pure TypeScript helpers (no framework runtime).
// Astro page (.astro) compilation is covered by `astro build` in CI.
export default defineConfig({
  resolve: {
    alias: { 'astro:content': fileURLToPath(new URL('./src/test/astro-content-stub.ts', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: false,
  },
});
