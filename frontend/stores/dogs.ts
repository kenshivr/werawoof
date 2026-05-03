import { defineStore } from 'pinia'
import type { Dog, CreateDogPayload, UpdateDogPayload } from '~/types/dog'
import type { Match } from '~/types/match'

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
    const res = await api.post<{ dog: Dog }>('/api/dogs', payload)
    dogs.value.push(res.dog)
    return res.dog
  }

  const updateDog = async (id: string, payload: UpdateDogPayload) => {
    const api = useApi()
    const res = await api.put<{ dog: Dog }>(`/api/dogs/${id}`, payload)
    const idx = dogs.value.findIndex((d) => String(d.id) === id)
    if (idx !== -1) dogs.value[idx] = res.dog
    return res.dog
  }

  const deleteDog = async (id: string) => {
    const api = useApi()
    await api.del(`/api/dogs/${id}`)
    dogs.value = dogs.value.filter((d) => String(d.id) !== String(id))
  }

  const uploadPhoto = async (dogId: string, file: File) => {
    const authStore = useAuthStore()
    const config = useRuntimeConfig()
    const formData = new FormData()
    formData.append('photo', file)

    const res = await $fetch<{ dog: Dog }>(`/api/dogs/${dogId}/photos`, {
      method: 'POST',
      baseURL: config.public.apiBase as string,
      body: formData,
      headers: { Authorization: `Bearer ${authStore.token}` },
    })

    const idx = dogs.value.findIndex((d) => String(d.id) === dogId)
    if (idx !== -1) dogs.value[idx] = res.dog
    return res.dog
  }

  const fetchMatches = async (dogId: string): Promise<Match[]> => {
    const api = useApi()
    const res = await api.get<{ matches: Match[] }>(`/api/dogs/${dogId}/matches`)
    return res.matches ?? []
  }

  return { dogs, loading, fetchDogs, createDog, updateDog, deleteDog, uploadPhoto, fetchMatches }
})
