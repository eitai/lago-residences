import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project site → served from /lago-residences/.
// Every runtime asset path must go through the asset() helper so it stays
// base-aware. og:image + canonical are absolute in index.html.
// https://vite.dev/config/
export default defineConfig({
  base: '/lago-residences/',
  plugins: [react(), tailwindcss()],
})
