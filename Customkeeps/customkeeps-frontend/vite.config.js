import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// This plugin makes Vite fallback to index.html on unknown routes in dev
import { VitePluginStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    react(),
    // No extra plugins needed for routing in production build
    // Vite handles dev routing out-of-the-box
  ],
  build: {
    outDir: 'dist',         // default, matches your Vercel config
    emptyOutDir: true       // cleans output directory before build
  },
  server: {
    // Enable history fallback so local dev supports direct route entry
    // This is on by default with Vite
    // Left here for clarity; no need to override!
    // historyApiFallback: true
  }
})
