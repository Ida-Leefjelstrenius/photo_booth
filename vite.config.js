import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3010,
    allowedHosts: ['excursion-slum-penpal.ngrok-free.dev'],
    proxy: {
      '/ws': {
        target: 'ws://localhost:3011',
        ws: true,
      }
    }
  }
})