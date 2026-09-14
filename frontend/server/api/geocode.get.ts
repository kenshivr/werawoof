import { buildLabel, type NominatimReverse, type GeocodeResult } from '../utils/geocode'

/* Reverse geocoding para que el dueño confirme su ubicación: convierte el
   punto en "colonia, municipio, estado". Va por el server y no desde el
   navegador porque Nominatim (OpenStreetMap) exige un User-Agent que
   identifique a la app, cosa que el browser no deja mandar. Su política:
   máximo 1 request por segundo, resultados cacheados y la atribución
   "© OpenStreetMap contributors" visible donde se muestre la dirección. */
const NOMINATIM = 'https://nominatim.openstreetmap.org/reverse'
const USER_AGENT = 'WeraWoof/1.0 (+https://werawoof.com)'

/* 4 decimales ≈ 11 m: de sobra para una colonia y evita repetir consultas
   por el mismo punto mientras la función siga viva. */
const cache = new Map<string, GeocodeResult>()

/* Cola que espacia las consultas a Nominatim: cada pedido espera a que
   termine el anterior y a que haya pasado un segundo desde la última salida,
   así dos clics en el mismo segundo no violan la regla. Vale por instancia
   (en Vercel cada función tiene su memoria): a escala hace falta un limitador
   compartido o cambiar de proveedor. Si se juntan más de MAX_PENDING, la ruta
   responde 429 + Retry-After y el cliente reintenta en vez de apilarse acá. */
const MIN_INTERVAL_MS = 1000
const MAX_PENDING = 5
let lastCallAt = 0
let pending = 0
let queue: Promise<unknown> = Promise.resolve()

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const throttled = <T>(fn: () => Promise<T>): Promise<T> => {
  const run = queue.then(async () => {
    const wait = MIN_INTERVAL_MS - (Date.now() - lastCallAt)
    if (wait > 0) await sleep(wait)
    lastCallAt = Date.now()
    return fn()
  })
  queue = run.catch(() => undefined)
  return run
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const lat = Number(query.lat)
  const lng = Number(query.lng)

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    throw createError({ statusCode: 400, message: 'lat and lng required' })
  }

  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`
  const hit = cache.get(key)
  if (hit) return hit

  if (pending >= MAX_PENDING) {
    setResponseHeader(event, 'Retry-After', 2)
    throw createError({ statusCode: 429, message: 'geocoding busy, retry later' })
  }

  pending++
  const data = await throttled(() =>
    $fetch<NominatimReverse>(NOMINATIM, {
      query: {
        lat: key.split(',')[0],
        lon: key.split(',')[1],
        format: 'jsonv2',
        zoom: 16,
        'accept-language': 'es',
      },
      headers: { 'user-agent': USER_AGENT },
      timeout: 8000,
    })
  )
    .catch((err: unknown) => {
      console.error('[geocode]', err)
      return null
    })
    .finally(() => {
      pending--
    })

  const result = data?.address ? buildLabel(data.address) : null
  if (!result?.label) {
    throw createError({ statusCode: 502, message: 'geocoding unavailable' })
  }

  cache.set(key, result)
  return result
})
