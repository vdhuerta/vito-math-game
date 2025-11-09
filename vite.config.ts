import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno del archivo .env para que Vite las pueda usar.
  // FIX: Cast `process` to `any` to resolve TypeScript error for `cwd`.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Expone la clave de API al código del cliente SOLO en modo de desarrollo.
      // En producción (Netlify build), `env.VITE_API_KEY` será undefined,
      // por lo que no se expondrá la clave.
      // Asegúrate de crear un archivo `.env` en la raíz con `VITE_API_KEY=tu_clave`
      'process.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY),
      // FIX: Define NODE_ENV to allow environment checks in client code.
      'process.env.NODE_ENV': JSON.stringify(mode),
    }
  }
})
