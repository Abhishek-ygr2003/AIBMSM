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
          '/api/genai': {
            target: `http://localhost:${process.env.PROXY_PORT || 3001}`,
            changeOrigin: true,
            secure: false,
          }
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
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor-react': ['react', 'react-dom'],
              'vendor-recharts': ['recharts'],
              'vendor-genai': ['@google/genai']
            }
          }
        }
      }
    };
});
