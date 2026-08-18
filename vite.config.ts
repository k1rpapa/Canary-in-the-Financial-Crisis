import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Canary-in-the-Financial-Crisis/',
  plugins: [react()],
})
