import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Omni-Lingua',
        short_name: 'Omni-Lingua',
        description:
          'Personal English learning exocortex: pronunciation, vocab, listening, AI coach, generative comprehensible input, language twin.',
        theme_color: '#F0EEE6',
        background_color: '#F0EEE6',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // Google Fonts
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            // Imágenes Unsplash y similares
            urlPattern: /^https:\/\/(?:images\.unsplash\.com|.+\.amazonaws\.com)\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            // MediaPipe models y wasm
            urlPattern: /^https:\/\/(?:cdn\.jsdelivr\.net|storage\.googleapis\.com)\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'ml-models',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 90 },
            },
          },
          {
            // API calls — NetworkFirst con fallback offline
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api',
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
    }),
  ],
})
