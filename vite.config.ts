import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Esta línea es la clave: Inyecta la variable de entorno de Netlify
    // en el código del navegador, haciendo que process.env.API_KEY esté disponible.
    'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY)
  }
})
