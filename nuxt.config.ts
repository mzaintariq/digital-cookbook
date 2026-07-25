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
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      ],
      script: [
        {
          id: 'cookbook-theme-init',
          innerHTML: `(function(){var t;try{var s=localStorage.getItem('cookbook-theme');if(s==='light'||s==='dark')t=s}catch(e){}if(!t)t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var r=document.documentElement;r.classList.toggle('dark',t==='dark');r.style.colorScheme=t;var m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement('meta');m.name='theme-color';document.head.appendChild(m)}m.content=t==='dark'?'#111312':'#FAFAF7'})()`,
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg', sizes: 'any' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '32x32' }
      ]
    }
  },
  css: ['~/assets/css/main.css']
})
