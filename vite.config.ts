import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Use root-relative base so built asset paths are correct in dev, preview, and Netlify
  base: '/', 
 build: {
    chunkSizeWarningLimit: 1600, // increase limit to 1.6MB
  },
});
