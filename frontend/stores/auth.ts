import { defineStore } from 'pinia'
import type {
  User,
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  UpdateProfilePayload,
} from '~/types/auth'

const isTokenExpired = (t: string): boolean => {
  try {
    const payload = JSON.parse(atob(t.split('.')[1]))
    return Date.now() >= payload.exp * 1000
  } catch {
    return true
  }
}

/* Espejo del token en una cookie: localStorage no viaja al server, la cookie sí.
   El middleware de auth la lee en SSR para redirigir sin esperar la hidratación. */
const setAuthCookie = (t: string | null) => {
  if (!import.meta.client) return
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  if (t) {
    let expires = ''
    try {
      const payload = JSON.parse(atob(t.split('.')[1]))
      expires = `; expires=${new Date(payload.exp * 1000).toUTCString()}`
    } catch {
      // sin exp legible: queda como cookie de sesión
    }
    document.cookie = `auth_token=${t}; path=/; SameSite=Lax${secure}${expires}`
  } else {
    document.cookie = `auth_token=; path=/; Max-Age=0; SameSite=Lax${secure}`
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const setAuth = (data: AuthResponse) => {
    token.value = data.token
    user.value = data.user
    if (import.meta.client) {
      localStorage.setItem('token', data.token)
      setAuthCookie(data.token)
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    if (import.meta.client) {
      localStorage.removeItem('token')
      setAuthCookie(null)
    }
  }

  const restoreSession = async () => {
    if (!import.meta.client) return
    const saved = localStorage.getItem('token')
    if (!saved) return
    if (isTokenExpired(saved)) {
      logout()
      return
    }
    token.value = saved
    setAuthCookie(saved)
    try {
      await fetchProfile()
    } catch (e: unknown) {
      const status = (e as { statusCode?: number }).statusCode
      // token rechazado por el server: sesión inválida; error de red: mantenemos la sesión local
      if (status === 401 || status === 403) logout()
    }
  }

  const login = async (payload: LoginPayload) => {
    const api = useApi()
    const data = await api.post<AuthResponse>('/auth/login', payload)
    setAuth(data)
    await fetchProfile()
  }

  const register = async (payload: RegisterPayload) => {
    const api = useApi()
    const data = await api.post<AuthResponse>('/auth/register', payload)
    setAuth(data)
  }

  const fetchProfile = async () => {
    const api = useApi()
    const data = await api.get<{ user: User }>('/api/me')
    user.value = data.user
  }

  const updateProfile = async (payload: UpdateProfilePayload, avatarFile?: File) => {
    const api = useApi()
    const data = await api.put<{ user: User }>('/api/me', payload)
    user.value = data.user

    if (avatarFile) {
      const config = useRuntimeConfig()
      const formData = new FormData()
      formData.append('avatar', avatarFile)
      const res = await $fetch<{ user: User }>('/api/me/avatar', {
        method: 'POST',
        baseURL: config.public.apiBase as string,
        body: formData,
        headers: { Authorization: `Bearer ${token.value}` },
      })
      user.value = res.user
    }
  }

  const deleteAccount = async () => {
    const api = useApi()
    await api.del('/api/me')
    logout()
  }

  const loginWithToken = async (tokenValue: string) => {
    token.value = tokenValue
    if (import.meta.client) {
      localStorage.setItem('token', tokenValue)
      setAuthCookie(tokenValue)
    }
    await fetchProfile()
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    restoreSession,
    fetchProfile,
    updateProfile,
    loginWithToken,
    deleteAccount,
  }
})
