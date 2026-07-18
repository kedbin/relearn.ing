import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest config for the React (.tsx) components used across the Astro site.
// Astro page (.astro) compilation is covered by `astro build` in CI; these
// unit/component tests cover the interactive island components and shared
// utilities.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: false,
  },
});
