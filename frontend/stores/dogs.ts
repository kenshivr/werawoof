import { defineStore } from 'pinia'
import type { Dog, CreateDogPayload, UpdateDogPayload } from '~/types/dog'
import type { Match } from '~/types/match'

const fail = (message: string): never => {
  throw new Error(message)
}

export const useDogsStore = defineStore('dogs', () => {
  const supabase = useSupabaseClient()
  const auth = useAuthStore()

  const dogs = ref<Dog[]>([])
  const loading = ref(false)

  /* El id sale del store de auth: es el único que sabe leer los claims */
  const uid = () => auth.uid ?? fail('No hay sesión activa.')

  const fetchDogs = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('user_id', uid())
        .order('created_at', { ascending: true })
      if (error) fail('No pudimos cargar tus perros. Intentá de nuevo.')
      dogs.value = (data ?? []) as Dog[]
    } finally {
      loading.value = false
    }
  }

  const fetchDog = async (id: number | string) => {
    const { data, error } = await supabase.from('dogs').select('*').eq('id', Number(id)).single()
    if (error) fail('No encontramos ese perro.')
    return data as Dog
  }

  const createDog = async (payload: CreateDogPayload) => {
    const { data, error } = await supabase
      .from('dogs')
      .insert({ ...payload, user_id: uid() })
      .select()
      .single()
    if (error) fail('No pudimos guardar el perro. Intentá de nuevo.')
    const dog = data as Dog
    dogs.value.push(dog)
    return dog
  }

  const updateDog = async (id: number | string, payload: UpdateDogPayload) => {
    const { data, error } = await supabase
      .from('dogs')
      .update(payload)
      .eq('id', Number(id))
      .select()
      .single()
    if (error) fail('No pudimos actualizar el perro. Intentá de nuevo.')
    const dog = data as Dog
    const idx = dogs.value.findIndex((d) => String(d.id) === String(id))
    if (idx !== -1) dogs.value[idx] = dog
    return dog
  }

  const deleteDog = async (id: number | string) => {
    const { error } = await supabase.from('dogs').delete().eq('id', Number(id))
    if (error) fail('No pudimos borrar el perro. Intentá de nuevo.')
    dogs.value = dogs.value.filter((d) => String(d.id) !== String(id))
  }

  /* Sube la foto al bucket photos ({user_id}/dogs/{dogId}/...) y la agrega
     al final del array photos del perro. Devuelve el perro actualizado. */
  const uploadPhoto = async (dogId: number | string, file: File) => {
    const dog = dogs.value.find((d) => String(d.id) === String(dogId)) ?? (await fetchDog(dogId))
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${uid()}/dogs/${dogId}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('photos').upload(path, file)
    if (error) fail('No pudimos subir la foto. Intentá de nuevo.')
    const url = supabase.storage.from('photos').getPublicUrl(path).data.publicUrl
    return updateDog(dogId, { photos: [...dog.photos, url] })
  }

  const fetchMatches = async (dogId: number | string): Promise<Match[]> => {
    const id = Number(dogId)
    const { data, error } = await supabase
      .from('matches')
      .select('*, dog1:dogs!dog1_id(*), dog2:dogs!dog2_id(*)')
      .or(`dog1_id.eq.${id},dog2_id.eq.${id}`)
      .order('created_at', { ascending: false })
    if (error) fail('No pudimos cargar los matches. Intentá de nuevo.')
    return (data ?? []) as Match[]
  }

  return {
    dogs,
    loading,
    fetchDogs,
    fetchDog,
    createDog,
    updateDog,
    deleteDog,
    uploadPhoto,
    fetchMatches,
  }
})
