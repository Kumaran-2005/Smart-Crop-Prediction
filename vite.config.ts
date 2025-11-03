import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Allow dynamic base so the same repo can deploy to Netlify ("/") and GitHub Pages ("/<repo>/")
// Set env VITE_BASE in CI to override the default.
const base = process.env.VITE_BASE || '/';

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    chunkSizeWarningLimit: 1600, // increase limit to 1.6MB
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
