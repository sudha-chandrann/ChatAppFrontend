import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api':'http://localhost:4000'
    }
  },
  define: {
    'import.meta.env.VITE_API_URL ': JSON.stringify('http://localhost:4000')
  },
  plugins: [react(),tailwindcss(),],
})
