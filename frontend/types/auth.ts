/* Fila de public.profiles en Supabase */
export interface Profile {
  id: string
  name: string
  location: string
  bio: string
  avatar_url: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

/* Vista unificada auth.users + profiles, con la misma forma que
   devolvía el backend Go — así las páginas no cambian. */
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  location?: string
  bio?: string
  emailVerified: boolean
  createdAt: string
  role?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  name: string
}

export interface UpdateProfilePayload {
  name: string
  location?: string
  bio?: string
}
