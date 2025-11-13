import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // Use relative paths so GitHub Pages (served from a repo subpath) can load assets correctly
      base: './',
      server: {
        port: 3000,
        host: '0.0.0.0',
        // Proxy API calls in dev to the local GenAI proxy (default port 3001 or override with PROXY_PORT)
        proxy: {
          '/api': {
            target: `http://localhost:${process.env.PROXY_PORT || 3001}`,
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(/^\/api/, '/api')
          }
        }
      },
      // Proxy API calls to the local GenAI proxy during development to avoid CORS and
      // to keep API keys server-side. This only applies to `npm run dev`.
      proxy: {
        '/api/genai': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        // Split vendor and large libraries into separate chunks to reduce initial bundle size
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (!id) return null;
              if (id.includes('node_modules')) {
                // group React and React DOM together
                if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
                // recharts is heavy (d3-based) - put it in its own chunk
                if (id.includes('recharts')) return 'vendor-recharts';
                // google genai client in its own chunk
                if (id.includes('@google/genai')) return 'vendor-genai';
                // all other node_modules into vendor
                return 'vendor';
              }
            }
          }
        },
        // Lower warning threshold so we get actionable warnings earlier (in KB)
        chunkSizeWarningLimit: 600
      }
    };
});
