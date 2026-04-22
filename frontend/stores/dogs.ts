import { defineStore } from 'pinia'
import type { Dog, CreateDogPayload, UpdateDogPayload } from '~/types/dog'

export const useDogsStore = defineStore('dogs', () => {
  const dogs = ref<Dog[]>([])
  const loading = ref(false)

  const fetchDogs = async () => {
    const api = useApi()
    loading.value = true
    try {
      const res = await api.get<{ dogs: Dog[] }>('/api/dogs')
      dogs.value = res.dogs ?? []
    } finally {
      loading.value = false
    }
  }

  const createDog = async (payload: CreateDogPayload) => {
    const api = useApi()
    const dog = await api.post<Dog>('/api/dogs', payload)
    dogs.value.push(dog)
    return dog
  }

  const updateDog = async (id: string, payload: UpdateDogPayload) => {
    const api = useApi()
    const updated = await api.put<Dog>(`/api/dogs/${id}`, payload)
    const idx = dogs.value.findIndex((d) => d.id === id)
    if (idx !== -1) dogs.value[idx] = updated
    return updated
  }

  const deleteDog = async (id: string) => {
    const api = useApi()
    await api.del(`/api/dogs/${id}`)
    dogs.value = dogs.value.filter((d) => d.id !== id)
  }

  return { dogs, loading, fetchDogs, createDog, updateDog, deleteDog }
})
