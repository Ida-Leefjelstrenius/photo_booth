import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    host: true,
    port: 3010,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certificate/key.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certificate/cert.crt')),
    },
    allowedHosts: [
      'excursion-slum-penpal.ngrok-free.dev',
      '192.168.137.1'
    ],
    proxy: {
      '/ws': {
        target: 'wss://192.168.137.1:3011',
        ws: true,
        secure: false,
      }
    }
  }
})