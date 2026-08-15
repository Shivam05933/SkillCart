import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api-proxy/railway': {
        target: 'https://skillcartcampany-production.up.railway.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-proxy\/railway/, ''),
      },
      '/api-proxy/resume-server': {
        target: 'http://10.111.57.115:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-proxy\/resume-server/, ''),
      },
    },
  },
})
