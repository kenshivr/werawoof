export default defineNuxtRouteMiddleware(() => {
  // TODO: re-enable auth guard before production
  // const authStore = useAuthStore()
  // authStore.restoreSession()
  // if (!authStore.isAuthenticated) {
  //   return navigateTo('/auth/login')
  // }
})
