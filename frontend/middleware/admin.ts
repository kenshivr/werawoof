export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const authStore = useAuthStore()

  if (authStore.isAuthenticated && !authStore.user) {
    await authStore.fetchProfile().catch(() => {})
  }

  if (authStore.user?.role !== 'admin') {
    return navigateTo('/')
  }
})
