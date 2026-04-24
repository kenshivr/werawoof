import { defineStore } from 'pinia'
import type { User, LoginPayload, RegisterPayload, AuthResponse, UpdateProfilePayload } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const setAuth = (data: AuthResponse) => {
    token.value = data.token
    user.value = data.user
    if (import.meta.client) {
      localStorage.setItem('token', data.token)
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    if (import.meta.client) {
      localStorage.removeItem('token')
    }
  }

  const restoreSession = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('token')
      if (saved) token.value = saved
    }
  }

  const login = async (payload: LoginPayload) => {
    const api = useApi()
    const data = await api.post<AuthResponse>('/auth/login', payload)
    setAuth(data)
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

  return { user, token, isAuthenticated, login, register, logout, restoreSession, fetchProfile, updateProfile }
})
