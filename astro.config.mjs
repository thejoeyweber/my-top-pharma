// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    css: {
      // This ensures Tailwind CSS processing
      postcss: {}
    },
    // Provide more detailed logs for debugging
    logLevel: 'info'
  }
});