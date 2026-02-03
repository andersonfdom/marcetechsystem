import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // quando rodar junto do backend, dá pra usar proxy:
    // proxy: { '/': 'https://localhost:5001' }
  }
})