import { createApp, toWebHandler } from 'h3'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import handler from '~/server/api/geocode.get'
import { buildLabel } from '~/server/utils/geocode'

const app = createApp()
app.use('/api/geocode', handler)
const fetchApp = toWebHandler(app)

const get = (params: Record<string, string>) =>
  fetchApp(new Request(`http://werawoof.test/api/geocode?${new URLSearchParams(params)}`))

/* Nominatim falso: $fetch es global en Nitro, acá se stubea por test */
const nominatim = vi.fn()
vi.stubGlobal('$fetch', nominatim)

const cdmx = {
  neighbourhood: 'Roma Norte',
  city_district: 'Cuauhtémoc',
  city: 'Ciudad de México',
  state: 'Ciudad de México',
  country: 'México',
}

/* La ruta espacia las consultas a Nominatim 1 s entre sí con setTimeout y
   Date.now(): timers falsos para no esperar de verdad. El reloj avanza 10 min
   en cada test (acumulado, más que cualquier avance dentro de un test) para
   que la primera consulta de cada uno salga sin esperar a la del anterior. */
let clock = Date.now()

beforeEach(() => {
  vi.clearAllMocks()
  vi.useFakeTimers()
  clock += 600_000
  vi.setSystemTime(clock)
  nominatim.mockResolvedValue({ address: cdmx })
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.useRealTimers()
})

describe('buildLabel', () => {
  it('arma colonia, municipio y estado sin repetir CDMX', () => {
    expect(buildLabel(cdmx)).toEqual({
      label: 'Roma Norte, Cuauhtémoc, Ciudad de México',
      city: 'Cuauhtémoc, Ciudad de México',
    })
  })

  it('usa suburb y town cuando no hay neighbourhood ni city_district', () => {
    expect(buildLabel({ suburb: 'Centro', town: 'Tepoztlán', state: 'Morelos' })).toEqual({
      label: 'Centro, Tepoztlán, Morelos',
      city: 'Tepoztlán, Morelos',
    })
  })

  it('devuelve vacío cuando la respuesta no trae nada útil', () => {
    expect(buildLabel({ country: 'México' })).toEqual({ label: '', city: '' })
  })
})

describe('GET /api/geocode', () => {
  it('consulta Nominatim con User-Agent propio y responde la etiqueta', async () => {
    const res = await get({ lat: '19.4194', lng: '-99.1612' })

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      label: 'Roma Norte, Cuauhtémoc, Ciudad de México',
      city: 'Cuauhtémoc, Ciudad de México',
    })
    expect(nominatim).toHaveBeenCalledWith(
      'https://nominatim.openstreetmap.org/reverse',
      expect.objectContaining({
        query: expect.objectContaining({ lat: '19.4194', lon: '-99.1612', format: 'jsonv2' }),
        headers: { 'user-agent': 'WeraWoof/1.0 (+https://werawoof.com)' },
      })
    )
  })

  it('cachea por punto redondeado a 4 decimales: dos pedidos, una consulta', async () => {
    await get({ lat: '19.432608', lng: '-99.133209' })
    await get({ lat: '19.432612', lng: '-99.133201' })

    expect(nominatim).toHaveBeenCalledTimes(1)
  })

  it.each([
    ['sin parámetros', {}],
    ['lat no numérica', { lat: 'abc', lng: '-99.1' }],
    ['lat fuera de rango', { lat: '91', lng: '-99.1' }],
    ['lng fuera de rango', { lat: '19.4', lng: '181' }],
  ])('responde 400 y no consulta con %s', async (_case, params) => {
    const res = await get(params)

    expect(res.status).toBe(400)
    expect(nominatim).not.toHaveBeenCalled()
  })

  it('responde 502 si Nominatim falla', async () => {
    nominatim.mockRejectedValue(new Error('timeout'))

    const res = await get({ lat: '20.6597', lng: '-103.3496' })

    expect(res.status).toBe(502)
  })

  it('responde 502 si la respuesta no trae dirección', async () => {
    nominatim.mockResolvedValue({ error: 'Unable to geocode' })

    const res = await get({ lat: '0', lng: '0' })

    expect(res.status).toBe(502)
  })
})

describe('GET /api/geocode — cola de 1 consulta por segundo', () => {
  it('dos pedidos en el mismo instante salen a Nominatim con un segundo de separación', async () => {
    const first = get({ lat: '25.6866', lng: '-100.3161' })
    const second = get({ lat: '21.1619', lng: '-86.8515' })

    await vi.advanceTimersByTimeAsync(0)
    expect(nominatim).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(999)
    expect(nominatim).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(1)
    expect(nominatim).toHaveBeenCalledTimes(2)

    const [a, b] = await Promise.all([first, second])
    expect(a.status).toBe(200)
    expect(b.status).toBe(200)
  })

  it('responde 429 con Retry-After cuando ya hay cinco pedidos esperando', async () => {
    /* Nominatim lento: cada consulta tarda 10 s (falsos) en responder */
    nominatim.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ address: cdmx }), 10_000))
    )
    const inFlight = [1, 2, 3, 4, 5].map((i) => get({ lat: `10.${i}`, lng: `-70.${i}` }))
    await vi.advanceTimersByTimeAsync(0)

    const res = await get({ lat: '11', lng: '-71' })

    expect(res.status).toBe(429)
    expect(res.headers.get('retry-after')).toBe('2')

    /* Drena la cola para no dejar estado colgado a los demás tests */
    await vi.advanceTimersByTimeAsync(60_000)
    const statuses = (await Promise.all(inFlight)).map((r) => r.status)
    expect(statuses).toEqual([200, 200, 200, 200, 200])
  })
})
