import { createApp, toWebHandler } from 'h3'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import handler from '~/server/api/contact.post'

const app = createApp()
app.use('/api/contact', handler)
const fetchApp = toWebHandler(app)

const post = (body: unknown) =>
  fetchApp(
    new Request('http://werawoof.test/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
  )

const valid = {
  name: 'Ana Pérez',
  email: ' Ana@Example.com ',
  phone: '55 1234 5678',
  message: 'Hola, ¿cómo sumo a mi perro?',
}

/* sendMail es el mock global de tests/setup.ts */
const mail = vi.mocked(sendMail)
const sentHtml = () => mail.mock.calls[0]?.[0]?.html ?? ''

beforeEach(() => {
  mail.mockReset()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('POST /api/contact', () => {
  it('manda el mensaje a la bandeja de WeraWoof con reply-to al remitente', async () => {
    const res = await post(valid)

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(mail).toHaveBeenCalledTimes(1)
    expect(mail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: CONTACT_INBOX,
        replyTo: 'ana@example.com',
        subject: 'Nuevo mensaje de Ana Pérez — WeraWoof',
      })
    )
    expect(sentHtml()).toContain('Ana Pérez')
    expect(sentHtml()).toContain('mailto:ana@example.com')
    expect(sentHtml()).toContain('55 1234 5678')
  })

  it('escapa el HTML que escribe el usuario', async () => {
    await post({ ...valid, name: 'Ana <script>alert(1)</script>', message: 'a & b' })

    expect(sentHtml()).toContain('Ana &lt;script&gt;alert(1)&lt;/script&gt;')
    expect(sentHtml()).toContain('a &amp; b')
    expect(sentHtml()).not.toContain('<script>')
  })

  it('omite la línea de teléfono cuando no viene', async () => {
    await post({ ...valid, phone: undefined })

    expect(sentHtml()).not.toContain('Teléfono')
  })

  it.each([
    ['body vacío', {}],
    ['nombre en blanco', { ...valid, name: '   ' }],
    ['correo sin dominio', { ...valid, email: 'ana@example' }],
    ['mensaje vacío', { ...valid, message: '' }],
    ['nombre de más de 120 caracteres', { ...valid, name: 'a'.repeat(121) }],
    ['teléfono de más de 40 caracteres', { ...valid, phone: '5'.repeat(41) }],
    ['mensaje de más de 5000 caracteres', { ...valid, message: 'a'.repeat(5001) }],
  ])('responde 400 y no manda nada con %s', async (_case, body) => {
    const res = await post(body)

    expect(res.status).toBe(400)
    expect(mail).not.toHaveBeenCalled()
  })

  it('responde 500 si el SMTP falla', async () => {
    mail.mockRejectedValueOnce(new Error('smtp caído'))

    const res = await post(valid)

    expect(res.status).toBe(500)
  })
})
