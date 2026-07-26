import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],
  pwa: {
    registerType: 'prompt',
    includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png'],
    manifest: {
      id: '/',
      name: 'Digital Cookbook',
      short_name: 'Cookbook',
      description: 'A private family recipe vault for browsing and managing tried-and-published recipes.',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#FAFAF7',
      theme_color: '#19907F',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      cleanupOutdatedCaches: true,
      // Nuxt renders routes on the server, so do not substitute a cached page
      // for recipe or admin navigations while offline.
      navigateFallback: null,
      runtimeCaching: [],
    },
    client: {
      registerPlugin: true,
      installPrompt: false,
      periodicSyncForUpdates: 0,
    },
  },
  routeRules: {
    '/sw.js': {
      headers: {
        'cache-control': 'no-cache, no-store, must-revalidate',
      },
    },
  },
  vite: {
    plugins: [
      svgLoader({
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
          ],
        },
      })
    ]
  },
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'Cookbook' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
      script: [
        {
          id: 'cookbook-theme-init',
          innerHTML: `(function(){var t;try{var s=localStorage.getItem('cookbook-theme');if(s==='light'||s==='dark')t=s}catch(e){}if(!t)t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var r=document.documentElement;r.classList.toggle('dark',t==='dark');r.style.colorScheme=t;var m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement('meta');m.name='theme-color';document.head.appendChild(m)}m.content=t==='dark'?'#111312':'#FAFAF7'})()`,
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg', sizes: 'any' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }
      ]
    }
  },
  css: ['~/assets/css/main.css']
})
