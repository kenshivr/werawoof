<script setup lang="ts">
useHead({
  /* Pages that set a full title (public ones, already carrying the brand) are
     left untouched; short titles from app/auth pages get the suffix. Lives
     here because app.head in nuxt.config is serialized and drops functions. */
  titleTemplate: (title?: string) =>
    title
      ? title.includes('WeraWoof')
        ? title
        : `${title} · WeraWoof`
      : 'WeraWoof — Matches, playdates y chat para dueños de perros',
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
      href: '/fonts/vietnam-500.woff2',
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
      href: '/fonts/jakarta-700.woff2',
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
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
