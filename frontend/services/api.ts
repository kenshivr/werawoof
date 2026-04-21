export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  const getHeaders = (): Record<string, string> => {
    const authStore = useAuthStore()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }
    return headers
  }

  const get = <T>(path: string) => $fetch<T>(path, { baseURL, headers: getHeaders() })

  const post = <T>(path: string, body: object) =>
    $fetch<T>(path, {
      method: 'POST',
      baseURL,
      body: body as Record<string, unknown>,
      headers: getHeaders(),
    })

  const put = <T>(path: string, body: object) =>
    $fetch<T>(path, {
      method: 'PUT',
      baseURL,
      body: body as Record<string, unknown>,
      headers: getHeaders(),
    })

  const del = <T>(path: string) =>
    $fetch<T>(path, { method: 'DELETE', baseURL, headers: getHeaders() })

  return { get, post, put, del }
}
