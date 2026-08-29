<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'

useHead({
  link: [
    // fuentes self-hosted (assets/css/fonts.css); preload de las críticas del primer render
    {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      href: '/fonts/vietnam-400.woff2',
      crossorigin: '',
    },
    {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      href: '/fonts/jakarta-800.woff2',
      crossorigin: '',
    },
    {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      href: '/fonts/material-symbols.woff2',
      crossorigin: '',
    },
  ],
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <Analytics />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
