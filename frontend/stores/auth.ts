import { defineStore } from 'pinia'
import type {
  User,
  Profile,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
} from '~/types/auth'

/* Supabase Auth responde en inglés; mapeamos a los mismos mensajes
   en español que usaba el normalizeError del backend viejo. */
const translateAuthError = (message: string): string => {
  const map: [RegExp, string][] = [
    [/invalid login credentials/i, 'Correo o contraseña incorrectos.'],
    [/email not confirmed/i, 'Tu correo todavía no está verificado. Revisá tu bandeja.'],
    [/already registered/i, 'Este email ya tiene una cuenta. Iniciá sesión.'],
    [/password should be at least/i, 'La contraseña debe tener al menos 6 caracteres.'],
    [
      /same as the old password|different from the old/i,
      'La nueva contraseña tiene que ser distinta a la anterior.',
    ],
    [
      /rate limit|too many requests|security purposes/i,
      'Demasiados intentos. Esperá unos minutos y probá de nuevo.',
    ],
    [
      /failed to fetch|network/i,
      'No pudimos conectarnos al servidor. Verificá tu conexión a internet.',
    ],
  ]
  for (const [pattern, translation] of map) {
    if (pattern.test(message)) return translation
  }
  return 'Algo salió mal. Intentá de nuevo.'
}

export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabaseClient()
  /* OJO: en @nuxtjs/supabase 2.x useSupabaseUser() NO devuelve el User de
     auth sino los CLAIMS del JWT (auth.getClaims). El id vive en `sub`; no
     existen `id`, `created_at` ni `email_confirmed_at`, y el tipo JwtPayload
     tiene `[key: string]: any`, así que TypeScript no avisa. Tampoco sirve
     session.user: el módulo lo borra a propósito. Este store es el ÚNICO
     lugar que sabe esto: el resto de la app usa `uid` y `user` de acá. */
  const claims = useSupabaseUser()

  const profile = ref<Profile | null>(null)

  const isAuthenticated = computed(() => !!claims.value)

  /* Solo UX (mostrar/ocultar accesos). La autorización real vive en
     Postgres: is_admin() dentro de get_admin_dashboard() y el UPDATE de
     profiles.role revocado, así que esto no protege nada por sí solo. */
  const isAdmin = computed(() => profile.value?.role === 'admin')

  /* id del usuario logueado (claims.sub === profiles.id) */
  const uid = computed(() => claims.value?.sub ?? null)

  /* Vista con la forma del viejo User del backend Go */
  const user = computed<User | null>(() => {
    const c = claims.value
    if (!c?.sub) return null
    return {
      id: c.sub,
      email: c.email ?? '',
      name: profile.value?.name || ((c.user_metadata?.name as string) ?? ''),
      avatar: profile.value?.avatar_url || undefined,
      location: profile.value?.location || undefined,
      bio: profile.value?.bio || undefined,
      role: profile.value?.role,
    }
  })

  const fetchProfile = async () => {
    const id = uid.value
    if (!id) return
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
    if (error) throw new Error(translateAuthError(error.message))
    profile.value = data as Profile
  }

  const login = async (payload: LoginPayload) => {
    const { error } = await supabase.auth.signInWithPassword(payload)
    if (error) throw new Error(translateAuthError(error.message))
    await fetchProfile().catch(() => {})
  }

  const register = async (payload: RegisterPayload) => {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: { name: payload.name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw new Error(translateAuthError(error.message))
    /* signUp con un email ya registrado no falla: devuelve un user sin identities */
    if (data.user && data.user.identities?.length === 0) {
      throw new Error('Este email ya tiene una cuenta. Iniciá sesión.')
    }
  }

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) throw new Error(translateAuthError(error.message))
  }

  const logout = async () => {
    await supabase.auth.signOut()
    profile.value = null
  }

  const forgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) throw new Error(translateAuthError(error.message))
  }

  const resetPassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw new Error(translateAuthError(error.message))
  }

  const updateProfile = async (payload: UpdateProfilePayload, avatarFile?: File) => {
    const id = uid.value
    if (!id) throw new Error('No hay sesión activa.')

    let avatarUrl: string | undefined
    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop() || 'jpg'
      const path = `${id}/avatar-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('photos').upload(path, avatarFile)
      if (uploadError) throw new Error('No pudimos subir tu avatar. Intentá de nuevo.')
      avatarUrl = supabase.storage.from('photos').getPublicUrl(path).data.publicUrl
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        name: payload.name,
        location: payload.location ?? '',
        bio: payload.bio ?? '',
        ...(payload.search_radius_km !== undefined
          ? { search_radius_km: payload.search_radius_km }
          : {}),
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      })
      .eq('id', id)
      .select()
      .single()
    if (error) {
      /* El mensaje traducido es genérico: la causa real (columna que falta,
         policy, etc.) queda en la consola para poder diagnosticar. */
      console.error('[auth] updateProfile', error)
      throw new Error(translateAuthError(error.message))
    }
    profile.value = data as Profile
  }

  const deleteAccount = async () => {
    /* El borrado necesita service role: lo hace el server route,
       autenticado por las cookies de la sesión. */
    await $fetch('/api/account', { method: 'DELETE' })
    await supabase.auth.signOut()
    profile.value = null
  }

  return {
    user,
    uid,
    profile,
    isAuthenticated,
    isAdmin,
    login,
    register,
    loginWithGoogle,
    logout,
    fetchProfile,
    updateProfile,
    forgotPassword,
    resetPassword,
    deleteAccount,
  }
})
