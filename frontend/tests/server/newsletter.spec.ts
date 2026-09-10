import { createApp, toWebHandler } from 'h3'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { serverSupabaseServiceRole } from '#supabase/server'
import handler from '~/server/api/newsletter.post'

const app = createApp()
app.use('/api/newsletter', handler)
const fetchApp = toWebHandler(app)

const post = (body: unknown) =>
  fetchApp(
    new Request('http://werawoof.test/api/newsletter', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
  )

/* Cliente admin falso: solo la cadena from('subscribers').insert(...) */
const insert = vi.fn()
const admin = { from: vi.fn(() => ({ insert })) }
vi.mocked(serverSupabaseServiceRole).mockReturnValue(admin as never)

/* sendMail es el mock global de tests/setup.ts */
const mail = vi.mocked(sendMail)

beforeEach(() => {
  vi.clearAllMocks()
  mail.mockResolvedValue(undefined)
  insert.mockResolvedValue({ error: null })
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

describe('POST /api/newsletter', () => {
  it('guarda el correo normalizado y manda bienvenida más aviso interno', async () => {
    const res = await post({ email: ' Ana@Example.com ' })

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(admin.from).toHaveBeenCalledWith('subscribers')
    expect(insert).toHaveBeenCalledWith({ email: 'ana@example.com' })
    expect(mail).toHaveBeenCalledTimes(2)
    expect(mail).toHaveBeenNthCalledWith(1, {
      to: 'ana@example.com',
      subject: WELCOME_SUBJECT,
      html: WELCOME_HTML,
    })
    expect(mail).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        to: CONTACT_INBOX,
        replyTo: 'ana@example.com',
        subject: 'Nuevo suscriptor: ana@example.com — WeraWoof',
      })
    )
  })

  it('trata al suscriptor repetido como éxito sin volver a escribirle', async () => {
    insert.mockResolvedValue({ error: { code: '23505', message: 'duplicate key' } })

    const res = await post({ email: 'ana@example.com' })

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(mail).not.toHaveBeenCalled()
  })

  it.each(['', 'ana', 'ana@example', 'ana perez@mail.com'])(
    'rechaza "%s" con 400 antes de tocar la base',
    async (email) => {
      const res = await post({ email })

      expect(res.status).toBe(400)
      expect(insert).not.toHaveBeenCalled()
      expect(mail).not.toHaveBeenCalled()
    }
  )

  it('responde 500 si la base falla por otra cosa', async () => {
    insert.mockResolvedValue({ error: { code: '42P01', message: 'relation missing' } })

    const res = await post({ email: 'ana@example.com' })

    expect(res.status).toBe(500)
    expect(mail).not.toHaveBeenCalled()
  })

  it('sigue respondiendo ok aunque el SMTP falle', async () => {
    mail.mockRejectedValue(new Error('smtp caído'))

    const res = await post({ email: 'ana@example.com' })

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })
})
