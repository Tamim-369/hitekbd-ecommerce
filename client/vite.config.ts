import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// https://vitejs.dev/config/
dotenv.config();
export default defineConfig({
  plugins: [react()],
  build: {
    modulePreload: true,
    target: 'esnext',
    minify: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
