import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Включаем полифиллы для buffer и process
      include: ['buffer', 'process'],
      globals: {
        Buffer: true,
        process: true,
        global: true
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react']
  }
});
