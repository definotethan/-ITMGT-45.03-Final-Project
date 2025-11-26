import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// No extra plugins needed for routing!
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
