import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' makes every asset path relative, so the build works at
// https://USER.github.io/ and also at https://USER.github.io/repo/.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: { output: { manualChunks: { three: ['three', '@react-three/fiber'], gsap: ['gsap'] } } },
  },
})
