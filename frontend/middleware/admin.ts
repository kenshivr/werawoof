export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser()
  if (!user.value) {
    return navigateTo('/auth/login')
  }

  const authStore = useAuthStore()
  if (!authStore.profile) {
    try {
      await authStore.fetchProfile()
    } catch {
      return navigateTo('/')
    }
  }

  if (authStore.profile?.role !== 'admin') {
    return navigateTo('/')
  }
})
