import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    // Proxy para evitar problemas de CORS en desarrollo.
    // El front llama a /auth, /equipos, /api/predicciones, etc.
    // y Vite los redirige al backend real definido en VITE_API_URL.
    proxy: {
      '/auth': 'http://localhost:8080',
      '/equipos': 'http://localhost:8080',
      '/fechas': 'http://localhost:8080',
      '/partidos': 'http://localhost:8080',
      '/ranking': 'http://localhost:8080',
      '/grupos': 'http://localhost:8080',
      '/api': 'http://localhost:8080',
    },
  },
});