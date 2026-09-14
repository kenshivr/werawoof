/* Fila de public.dogs en Supabase */
export interface Dog {
  id: number
  user_id: string
  name: string
  breed: string
  age: number
  sex: string
  size: string
  bio: string
  personality_tags: string[]
  photos: string[]
  created_at: string
  updated_at: string
}

export interface CreateDogPayload {
  name: string
  breed?: string
  age?: number
  sex?: string
  size?: string
  bio?: string
  personality_tags?: string[]
}

export type UpdateDogPayload = Partial<CreateDogPayload> & {
  photos?: string[]
}
