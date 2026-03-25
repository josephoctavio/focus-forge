import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // includeAssets ensures these are cached for offline use
      includeAssets: ['pwa-192x192.png', 'pwa-512x512.png', 'favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'StudyFlow Academic',
        short_name: 'StudyFlow',
        description: 'Your Academic Command Center',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable' // Fixed: Added maskable support for 192px
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Supported for 512px
          }
        ]
      }
    })
  ]
})