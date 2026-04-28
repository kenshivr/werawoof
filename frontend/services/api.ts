type FetchError = {
  response?: { status?: number; _data?: { message?: string } }
}

const normalizeError = (e: unknown): never => {
  const err = e as FetchError
  if (!err.response) {
    throw new Error('No pudimos conectarnos al servidor. Verificá tu conexión a internet.')
  }
  const status = err.response.status
  const serverMessage = err.response._data?.message
  if (status === 401) throw new Error(serverMessage ?? 'Correo o contraseña incorrectos.')
  if (status === 400 || status === 422)
    throw new Error(serverMessage ?? 'Los datos ingresados no son válidos.')
  if (status && status >= 500)
    throw new Error('Ocurrió un error en el servidor. Intentá de nuevo en unos minutos.')
  throw new Error(serverMessage ?? 'Algo salió mal. Intentá de nuevo.')
}

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

  const get = <T>(path: string) =>
    $fetch<T>(path, { baseURL, headers: getHeaders() }).catch(normalizeError)

  const post = <T>(path: string, body: object) =>
    $fetch<T>(path, {
      method: 'POST',
      baseURL,
      body: body as Record<string, unknown>,
      headers: getHeaders(),
    }).catch(normalizeError)

  const put = <T>(path: string, body: object) =>
    $fetch<T>(path, {
      method: 'PUT',
      baseURL,
      body: body as Record<string, unknown>,
      headers: getHeaders(),
    }).catch(normalizeError)

  const del = <T>(path: string) =>
    $fetch<T>(path, { method: 'DELETE', baseURL, headers: getHeaders() }).catch(normalizeError)

  return { get, post, put, del }
}
