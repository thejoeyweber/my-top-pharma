// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer'; // Import

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Enable SSR for Supabase integration
  output: 'server',

  vite: {
    plugins: [tailwindcss(), visualizer({ // Add visualizer plugin
      filename: './dist/stats.html', // Output file path
      open: true, // Automatically open report in browser after build
      gzipSize: true,
      brotliSize: true,
    })],
  },

  adapter: vercel({})
});