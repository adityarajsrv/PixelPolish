import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'cropperjs/dist/cropper.css': 'cropperjs/dist/cropper.css',
    },
  },
  optimizeDeps: {
    include: ['cropperjs'],
  },
})
