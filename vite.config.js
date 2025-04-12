import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api':'https://chatappbackend-xdb9.onrender.com'
    }
  },
  define: {
    'import.meta.env.VITE_API_URL ': JSON.stringify('https://chatappbackend-xdb9.onrender.com')
  },
  plugins: [react(),tailwindcss(),],
})
