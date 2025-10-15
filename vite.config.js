import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  optimizeDeps: {
    exclude: [],
    esbuildOptions: {
      target: 'esnext',
      define: {
        'global': 'globalThis',
        'module': '{}',
        'exports': '{}'
      }
    }
  },
  define: {
    'global': 'globalThis',
    'module': '{}',
    'process.env': {}
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  }
})
