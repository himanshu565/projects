import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: './src/frontend',
  
  server: {
      proxy: {
          "/auth": {
              target: "http://localhost:3002/",
              changeOrigin: true,
              secure: false,
          }
      }
  }
})
