export default defineNuxtRouteMiddleware(() => {
  /* La sesión de Supabase viaja en cookies (@nuxtjs/supabase), así que
     en SSR esto redirige con 302 real, sin renderizar la página protegida. */
  const user = useSupabaseUser()
  if (!user.value) {
    return navigateTo('/auth/login')
  }
})
