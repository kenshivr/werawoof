export interface Dog {
  id: string
  name: string
  breed: string
  age: number
  bio?: string
  photos: string[]
  ownerId: string
  createdAt: string
}

export interface CreateDogPayload {
  name: string
  breed: string
  age: number
  bio?: string
}

export type UpdateDogPayload = Partial<CreateDogPayload>
