import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/agent': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/record': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
