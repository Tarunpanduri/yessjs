import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  build: {
    outDir: path.resolve(__dirname, 'frontend/dist'), // Correct build output path
    emptyOutDir: true,
  },
  root: 'frontend', 
});
