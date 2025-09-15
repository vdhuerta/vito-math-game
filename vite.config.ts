import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Esta línea inyecta la variable de entorno API_KEY
    // en el código del navegador, haciendo que process.env.API_KEY esté disponible.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})
