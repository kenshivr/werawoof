export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const router = useRouter()

  const track = (path: string) => {
    $fetch('/track', {
      method: 'POST',
      baseURL: config.public.apiBase as string,
      body: { path },
    }).catch(() => {})
  }

  track(router.currentRoute.value.path)

  router.afterEach((to) => {
    track(to.path)
  })
})
