import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,  // Specify the desired port number
    strictPort: true,  // Ensure the server fails if the port is already in use
  },
})
