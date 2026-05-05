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

export interface AuthResponse {
  token: string
  user: User
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
}

export interface UpdateProfilePayload {
  name: string
  location?: string
  bio?: string
}
