import { createApp, toWebHandler } from 'h3'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { serverSupabaseServiceRole } from '#supabase/server'
import handler from '~/server/api/track.post'

const app = createApp()
app.use('/api/track', handler)
const fetchApp = toWebHandler(app)

const post = (body: unknown, headers: Record<string, string> = {}) =>
  fetchApp(
    new Request('http://werawoof.test/api/track', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify(body),
    })
  )

/* Cliente admin falso: solo la cadena from('page_visits').insert(...) */
const insert = vi.fn()
const admin = { from: vi.fn(() => ({ insert })) }
vi.mocked(serverSupabaseServiceRole).mockReturnValue(admin as never)

beforeEach(() => {
  vi.clearAllMocks()
  insert.mockResolvedValue({ error: null })
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('POST /api/track', () => {
  it('guarda la visita con la IP del proxy y el user agent', async () => {
    const res = await post(
      { path: '/app/swipe/5' },
      { 'x-forwarded-for': '203.0.113.7', 'user-agent': 'Mozilla/5.0 (test)' }
    )

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(admin.from).toHaveBeenCalledWith('page_visits')
    expect(insert).toHaveBeenCalledWith({
      path: '/app/swipe/5',
      ip: '203.0.113.7',
      user_agent: 'Mozilla/5.0 (test)',
    })
  })

  it('guarda cadena vacía cuando no hay IP', async () => {
    await post({ path: '/comunidad' })

    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ path: '/comunidad', ip: '' }))
  })

  it('acepta un path de exactamente 500 caracteres', async () => {
    const res = await post({ path: '/'.padEnd(500, 'a') })

    expect(res.status).toBe(200)
    expect(insert).toHaveBeenCalledTimes(1)
  })

  it.each([
    ['body vacío', {}],
    ['path sin barra inicial', { path: 'app/swipe' }],
    ['URL absoluta', { path: 'https://evil.example/x' }],
    ['path de 501 caracteres', { path: '/'.padEnd(501, 'a') }],
  ])('responde 400 y no inserta con %s', async (_case, body) => {
    const res = await post(body)

    expect(res.status).toBe(400)
    expect(insert).not.toHaveBeenCalled()
  })

  it('responde ok aunque la base falle: una visita perdida no rompe nada', async () => {
    insert.mockResolvedValue({ error: { code: '42P01', message: 'relation missing' } })

    const res = await post({ path: '/' })

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })
})
