<script setup lang="ts">
definePageMeta({ layout: false })

/* Aterrizan acá el OAuth de Google y el link de confirmación de email.
   El módulo de Supabase intercambia el code (PKCE) solo al cargar la página;
   nosotros únicamente esperamos a que aparezca la sesión. */
const user = useSupabaseUser()

onMounted(() => {
  if (user.value) {
    navigateTo('/app')
    return
  }

  const stop = watch(user, async (u) => {
    if (u) {
      stop()
      await navigateTo('/app')
    }
  })

  setTimeout(async () => {
    if (!user.value) {
      await navigateTo('/auth/login?error=oauth_failed')
    }
  }, 8000)
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
