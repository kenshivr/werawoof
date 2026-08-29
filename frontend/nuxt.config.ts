export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'WeraWoof — Matches, playdates y chat para dueños de perros',
      meta: [
        {
          name: 'description',
          content:
            'Conecta a tu perro: perfiles, swipe, matches y chat en tiempo real para organizar playdates o cruzas.',
        },
        { name: 'author', content: 'Brayan Vidal Romero' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'WeraWoof' },
        {
          property: 'og:title',
          content: 'WeraWoof — Matches, playdates y chat para dueños de perros',
        },
        {
          property: 'og:description',
          content:
            'Conecta a tu perro: perfiles, swipe, matches y chat en tiempo real para organizar playdates o cruzas.',
        },
        { property: 'og:url', content: 'https://werawoof.vercel.app' },
        { property: 'og:image', content: 'https://werawoof.vercel.app/og-werawoof.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:title',
          content: 'WeraWoof — Matches, playdates y chat para dueños de perros',
        },
        {
          name: 'twitter:description',
          content:
            'Conecta a tu perro: perfiles, swipe, matches y chat en tiempo real para organizar playdates o cruzas.',
        },
        { name: 'twitter:image', content: 'https://werawoof.vercel.app/og-werawoof.png' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  css: ['~/assets/css/fonts.css'],

  routeRules: {
    '/app': { redirect: '/app/dogs' },
  },

  devServer: {
    port: 3003,
  },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/eslint'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:3004',
    },
  },

  imports: {
    dirs: ['stores', 'services'],
  },

  typescript: {
    strict: true,
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'emoji-picker',
    },
  },
})
