export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const authStore = useAuthStore()

  if (!authStore.user) {
    try {
      await authStore.fetchProfile()
    } catch {
      return navigateTo('/auth/login')
    }
  }

  if (authStore.user?.role !== 'admin') {
    return navigateTo('/')
  }
})
