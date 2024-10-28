import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },
  server: {
    proxy: {
      '/proxy': {
        target: 'https://ankrypt.readyplayer.me',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/proxy/, ''),
      },
      '/api': {
        target: 'http://192.168.152.238:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    // headers: {
    //   "Cross-Origin-Opener-Policy": "same-origin",
    //   "Cross-Origin-Embedder-Policy": "require-corp",
    // },
  },
})
