import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), wasm()],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: id => {
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react';
          }

          if (id.includes('lucide')) {
            return 'icons';
          }

          if (id.includes('worker')) {
            return 'worker';
          }

          if (id.includes('@komplett')) {
            return 'komplett';
          }

          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  worker: {
    format: 'es',
    plugins: [wasm()],
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  optimizeDeps: {
    exclude: ['@komplett/transformers'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "/src/styles/globals.scss" as *;',
      },
    },
  },
});
