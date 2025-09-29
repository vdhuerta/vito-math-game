// Fix: Import `process` directly to make Node.js types available.
import process from 'node:process';
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno del archivo .env
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Expone la API key al código del cliente.
      // Da prioridad a API_KEY (usado en Google AI Studio) y luego a VITE_API_KEY (para desarrollo local).
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY)
    }
  }
})