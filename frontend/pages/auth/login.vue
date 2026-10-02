<script setup lang="ts">
definePageMeta({ layout: 'public', middleware: 'guest' })
useCanonical()
useSeoMeta({
  title: 'Iniciar sesión · WeraWoof',
  ogTitle: 'Iniciar sesión · WeraWoof',
  twitterTitle: 'Iniciar sesión · WeraWoof',
})
</script>

<template>
  <AuthCard mode="login" />
</template>
