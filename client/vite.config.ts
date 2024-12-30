import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
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

