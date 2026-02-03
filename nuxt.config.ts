import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
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
        { name: 'theme-color', content: '#FAFAF7', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#111312', media: '(prefers-color-scheme: dark)' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg', sizes: 'any' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '32x32' }
      ]
    }
  }
})
