import { defineStore } from 'pinia'

export interface Coords {
  lat: number
  lng: number
  /** "Roma Norte, Cuauhtémoc, Ciudad de México" (reverse geocoding); vacío si no se pudo */
  label?: string
}

/* Lo que devuelve el navegador: el punto más el margen de error en metros */
export interface LocatedPosition extends Coords {
  accuracy: number
}

/* Respuesta de GET /api/geocode */
export interface GeocodeResult {
  label: string
  city: string
}

/* Mensajes en español para los códigos de error de la Geolocation API */
const geoErrorMessage = (err: GeolocationPositionError): string => {
  if (err.code === err.PERMISSION_DENIED) {
    return 'No nos diste permiso de ubicación. Activalo en tu navegador y probá de nuevo.'
  }
  if (err.code === err.TIMEOUT) {
    return 'Tu dispositivo tardó demasiado en responder. Probá de nuevo.'
  }
  return 'No pudimos obtener tu ubicación. Probá de nuevo.'
}

/* Ubicación del dueño (public.profile_locations): un punto por cuenta que
   solo su dueño puede leer. get_candidates la usa del lado de Postgres para
   filtrar por radio y calcular la distancia; nadie más ve el punto. */
export const useLocationStore = defineStore('location', () => {
  const supabase = useSupabaseClient()
  const authStore = useAuthStore()

  const coords = ref<Coords | null>(null)

  const fetchLocation = async () => {
    const id = authStore.uid
    if (!id) return
    const { data, error } = await supabase
      .from('profile_locations')
      .select('lat, lng, label')
      .eq('user_id', id)
      .maybeSingle()
    if (error) {
      console.error('[location] fetch', error)
      throw new Error('No pudimos leer tu ubicación.')
    }
    coords.value = data ? { lat: data.lat, lng: data.lng, label: data.label } : null
  }

  const saveLocation = async (next: Coords) => {
    const id = authStore.uid
    if (!id) throw new Error('No hay sesión activa.')
    const { error } = await supabase
      .from('profile_locations')
      .upsert({ user_id: id, lat: next.lat, lng: next.lng, label: next.label ?? '' })
    if (error) {
      console.error('[location] save', error)
      throw new Error('No pudimos guardar tu ubicación.')
    }
    coords.value = next
  }

  /* Dirección legible del punto, vía server route (Nominatim exige un
     User-Agent propio que el navegador no deja mandar). */
  const describe = (point: Coords) =>
    $fetch<GeocodeResult>('/api/geocode', {
      query: { lat: point.lat, lng: point.lng },
      /* La ruta responde 429 cuando Nominatim está saturado; ofetch reintenta
         solo ante 429, 5xx o corte de red: tres veces, 1.5 s entre cada una. */
      retry: 3,
      retryDelay: 1500,
    })

  const clearLocation = async () => {
    const id = authStore.uid
    if (!id) throw new Error('No hay sesión activa.')
    const { error } = await supabase.from('profile_locations').delete().eq('user_id', id)
    if (error) {
      console.error('[location] clear', error)
      throw new Error('No pudimos quitar tu ubicación.')
    }
    coords.value = null
  }

  /* Pide la posición al navegador. Requiere https (o localhost) y el
     permiso del usuario; la primera vez el navegador muestra el diálogo. */
  const locate = () =>
    new Promise<LocatedPosition>((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Tu navegador no soporta geolocalización.'))
        return
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          }),
        (err) => reject(new Error(geoErrorMessage(err))),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      )
    })

  return { coords, fetchLocation, saveLocation, clearLocation, locate, describe }
})
