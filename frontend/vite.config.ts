import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  // server: {
  //   proxy: {
  //     '/': {
  //       target: process.env.VITE_API_URL || 'http://localhost:3000',
  //       changeOrigin: true,
  //     }
  //   }
  // }
})
