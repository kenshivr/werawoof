export default defineNuxtPlugin(() => {
  const router = useRouter()

  const track = (path: string) => {
    $fetch('/api/track', { method: 'POST', body: { path } }).catch(() => {})
  }

  track(router.currentRoute.value.path)

  router.afterEach((to) => {
    track(to.path)
  })
})
