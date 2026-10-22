import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build`         → multi-file site for hosting (cacheable chunks, lazy-loaded 3D/charts)
// `npm run build:offline` → one self-contained index.html for USB sticks / no-server use
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), tailwindcss(), ...(mode === 'offline' ? [viteSingleFile()] : [])],
  build: { chunkSizeWarningLimit: 1200 },
}))
