import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  build: {
    outDir: path.resolve(__dirname, 'dist'), // Ensure correct output path
    emptyOutDir: true,
    rollupOptions: {
      input: 'frontend/index.html', // Ensures Vite includes assets properly
    },
  },
  root: 'frontend',
});
