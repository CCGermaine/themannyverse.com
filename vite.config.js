import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { prerenderPlugin } from './build/prerender-plugin.js'

const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/',
  plugins: [prerenderPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rolldownOptions: {
      input: [
        resolve(root, 'index.html'),
        resolve(root, 'games/index.html'),
        resolve(root, 'art-zines/index.html'),
        resolve(root, '404.html'),
      ],
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
})
