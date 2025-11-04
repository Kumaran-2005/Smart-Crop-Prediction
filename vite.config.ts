import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Keep the base fixed for local development. If you later deploy to GitHub Pages
// and need a subpath, set VITE_BASE in your CI or environment and update this file.
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    chunkSizeWarningLimit: 1600,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
