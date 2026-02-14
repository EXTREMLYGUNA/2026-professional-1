import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    include: "**/*.{js,jsx,ts,tsx}", // This includes .js files
  })],
  cacheDir: '.vite-cache', // Change cache location
  server: {
    watch: {
      usePolling: true, // Helps with file watching on Windows
    },
  },
})
