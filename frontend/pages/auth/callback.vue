<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const authStore = useAuthStore()

onMounted(async () => {
  const token = route.query.token as string | undefined

  if (!token) {
    await navigateTo('/auth/login?error=oauth_failed')
    return
  }

  try {
    await authStore.loginWithToken(token)
    await navigateTo('/app')
  } catch {
    await navigateTo('/auth/login?error=oauth_failed')
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#DBD8D0] flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <div
        class="w-12 h-12 border-4 border-[#F4C07D] border-t-transparent rounded-full animate-spin"
      />
      <p class="text-[#382615] font-jakarta font-medium">Iniciando sesión...</p>
    </div>
  </div>
</template>
