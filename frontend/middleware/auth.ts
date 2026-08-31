export default defineNuxtRouteMiddleware(async () => {
  /* En SSR el server no ve localStorage, pero sí la cookie espejo del token.
     Sin cookie => redirect 302 real, sin renderizar la página protegida. */
  if (import.meta.server) {
    const token = useCookie<string | null>('auth_token')
    if (!token.value) {
      return navigateTo('/auth/login')
    }
    return
  }

  const authStore = useAuthStore()
  await authStore.restoreSession()
  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }
})
