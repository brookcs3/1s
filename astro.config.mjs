import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: 'https://brookcs3.github.io',
  base: '/1s',
  outDir: './dist',
});
