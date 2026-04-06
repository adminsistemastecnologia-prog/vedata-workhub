import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // CORREÇÃO: Removido o rewrite que eliminava o prefixo /api.
        // O AuthRestController está mapeado em /api/auth, portanto /api deve ser preservado.
        // Sem rewrite: /api/auth/login → http://localhost:8080/api/auth/login ✓
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
