import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Logan-stream',
        short_name: 'Logan',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: '/public/icon1.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/public/icon2.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
