import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Librerías en archivos propios: cambian poco, así el navegador las reutiliza entre versiones de la web
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('/firebase/') || id.includes('/@firebase/')) return 'firebase'
          if (id.includes('/react') || id.includes('/scheduler/')) return 'react'
        },
      },
    },
  },
})
