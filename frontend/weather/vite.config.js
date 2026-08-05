import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss({
    optimize: false
  })],
  build: {
    // Tells Vite 8 to bypass lightningcss and use esbuild instead
    cssMinify: 'esbuild'
  },
  server: {
    allowedHosts: ["tubular-playpen-unknown.ngrok-free.dev"]
  }
})
