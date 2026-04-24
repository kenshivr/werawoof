export interface Dog {
  id: string
  name: string
  breed: string
  age: number
  sex?: string
  size?: string
  bio?: string
  personality_tags?: string[]
  photos: string[]
  ownerId: string
  createdAt: string
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

export type UpdateDogPayload = Partial<CreateDogPayload>
