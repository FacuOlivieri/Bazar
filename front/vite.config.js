import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development every /api and /auth call is forwarded to the Spring Boot backend (BazarV1),
// so the browser never makes a cross-origin request and no CORS setup is needed.
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': BACKEND_URL,
      '/auth': BACKEND_URL
    }
  }
});
