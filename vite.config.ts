import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/jupiter-api': {
        target: 'https://quote-api.jup.ag',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jupiter-api/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('Origin', 'https://quote-api.jup.ag');
          });
        }
      },
    },
  },
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
