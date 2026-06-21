import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Plugins used by Vite. react() compiles React code, tailwindcss() compiles Tailwind v4 CSS on-the-fly
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173, // Frontend dev server runs on port 5173
  }
});
