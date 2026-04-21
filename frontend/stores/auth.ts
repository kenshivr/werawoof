import { defineStore } from 'pinia'
import type { User, LoginPayload, RegisterPayload, AuthResponse } from '~/types/auth'

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

  return { user, token, isAuthenticated, login, register, logout, restoreSession }
})
