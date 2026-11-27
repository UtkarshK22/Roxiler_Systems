import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // Frontend calls /api/auth/login -> backend receives /api/v1/auth/login
        rewrite: (p) => p.replace(/^\/api/, '/api/v1'),
      },
    },
  },
});