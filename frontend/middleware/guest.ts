export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const authStore = useAuthStore()
  await authStore.restoreSession()

  if (authStore.isAuthenticated) {
    return navigateTo('/app')
  }
})
