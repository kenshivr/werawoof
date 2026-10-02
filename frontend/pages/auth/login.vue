<script setup lang="ts">
definePageMeta({ layout: 'public', middleware: 'guest' })
useCanonical()
</script>

<template>
  <AuthCard mode="login" />
</template>
