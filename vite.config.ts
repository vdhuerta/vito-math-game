import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno del archivo .env
  
  // Fix: Replaced `process.cwd()` with `'.'` to resolve a TypeScript type error where `process.cwd` is not defined.
  // For a root `vite.config.ts`, `'.'` correctly resolves to the project root to load .env files.
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    define: {
      // Expone la API key al código del cliente.
      // Da prioridad a API_KEY (usado en Google AI Studio) y luego a VITE_API_KEY (para desarrollo local).
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY)
    }
  }
})
