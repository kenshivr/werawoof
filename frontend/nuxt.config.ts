export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/eslint'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:8082',
    },
  },

  typescript: {
    strict: true,
  },
})
