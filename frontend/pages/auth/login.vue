<script setup lang="ts">
definePageMeta({ layout: 'public', middleware: 'guest', ssr: false })
</script>

<template>
  <AuthCard mode="login" />
</template>
