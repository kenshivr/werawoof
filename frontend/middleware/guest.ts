export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  authStore.restoreSession()

  if (authStore.isAuthenticated) {
    return navigateTo('/app')
  }
})
