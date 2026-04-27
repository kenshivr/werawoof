export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  authStore.restoreSession()
  if (authStore.isAuthenticated) {
    await authStore.fetchProfile().catch(() => {})
  }
})
