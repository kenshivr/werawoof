<script setup lang="ts">
definePageMeta({ layout: 'public', middleware: 'guest' })
useCanonical()
useSeoMeta({
  title: 'Crear cuenta gratis · WeraWoof',
  description:
    'Regístrate gratis con tu correo o con Google y crea el perfil de tu perro en dos minutos.',
  ogTitle: 'Crear cuenta gratis · WeraWoof',
  ogDescription:
    'Regístrate gratis con tu correo o con Google y crea el perfil de tu perro en dos minutos.',
  twitterTitle: 'Crear cuenta gratis · WeraWoof',
  twitterDescription:
    'Regístrate gratis con tu correo o con Google y crea el perfil de tu perro en dos minutos.',
})
</script>

<template>
  <AuthCard mode="register" />
</template>
