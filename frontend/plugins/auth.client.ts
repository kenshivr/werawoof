export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  const user = useSupabaseUser()

  /* Sincroniza el profile de la base con la sesión de Supabase:
     al entrar (o restaurar sesión) lo carga, al salir lo limpia. */
  watch(
    user,
    (u) => {
      if (u) {
        authStore.fetchProfile().catch(() => {})
      } else {
        authStore.profile = null
      }
    },
    { immediate: true }
  )
})
