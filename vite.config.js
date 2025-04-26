import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss()
  ],
  server: {
    host: 'localhost',
    port: 50427,
    strictPort: true
  }
})