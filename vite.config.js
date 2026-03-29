import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png', 'icons/*.svg'],
      manifest: {
        name: 'Flourish & Faith',
        short_name: 'Flourish',
        description: 'Faith-integrated wellness for Christian women. Flourishing body, faithful heart.',
        theme_color: '#5A7B4F',
        background_color: '#FEFDFB',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-180.png',
            sizes: '180x180',
            type: 'image/png'
          }
        ],
        screenshots: [
          {
            src: '/screenshots/home.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Home screen'
          }
        ],
        categories: ['health', 'lifestyle', 'fitness']
      },
      workbox: {
        // Cache pages and assets for offline use
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            // Cache Google Fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            // Cache font files
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            // Cache randomuser.me photos (testimonials)
            urlPattern: /^https:\/\/randomuser\.me\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'avatar-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
        ]
      },
      devOptions: {
        // Enable PWA in dev mode so you can test locally
        enabled: true,
        type: 'module'
      }
    })
  ]
})
