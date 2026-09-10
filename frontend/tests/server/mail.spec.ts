import { afterEach, describe, expect, it, vi } from 'vitest'
import nodemailer from 'nodemailer'
import { transportSendMail } from '~/tests/mocks/nodemailer'
import { CONTACT_INBOX, EMAIL_RE, escapeHtml, sendMail } from '~/server/utils/mail'

/* nodemailer es el mock de tests/mocks/nodemailer.ts (vi.mock en setup) */
const smtpConfig = { smtpUser: 'test@werawoof.test', smtpPass: 'app-password' }

describe('EMAIL_RE', () => {
  it.each(['ana@example.com', 'ana.perez+wera@mail.co', 'A@B.MX'])('acepta %s', (email) => {
    expect(EMAIL_RE.test(email)).toBe(true)
  })

  it.each([
    '',
    'ana',
    'ana@',
    '@example.com',
    'ana@example',
    'ana perez@mail.com',
    'ana@@mail.com',
  ])('rechaza "%s"', (email) => {
    expect(EMAIL_RE.test(email)).toBe(false)
  })
})

describe('escapeHtml', () => {
  it('escapa los cinco caracteres que rompen el HTML del correo', () => {
    expect(escapeHtml(`<b>"Wera" & 'Woof'</b>`)).toBe(
      '&lt;b&gt;&quot;Wera&quot; &amp; &#39;Woof&#39;&lt;/b&gt;'
    )
  })

  it('deja intacto el texto normal, acentos incluidos', () => {
    expect(escapeHtml('Hola, ¿cómo está tu perro?')).toBe('Hola, ¿cómo está tu perro?')
  })
})

describe('sendMail', () => {
  afterEach(() => {
    vi.stubGlobal('useRuntimeConfig', () => smtpConfig)
  })

  it('manda por Gmail con TLS implícito, remitente WeraWoof y un solo transporte', async () => {
    await sendMail({
      to: CONTACT_INBOX,
      subject: 'Hola',
      html: '<p>Hola</p>',
      replyTo: 'ana@example.com',
    })
    await sendMail({ to: 'ana@example.com', subject: 'Otra vez', html: '<p>Otra</p>' })

    expect(nodemailer.createTransport).toHaveBeenCalledTimes(1)
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: smtpConfig.smtpUser, pass: smtpConfig.smtpPass },
    })
    expect(transportSendMail).toHaveBeenCalledTimes(2)
    expect(transportSendMail).toHaveBeenNthCalledWith(1, {
      from: '"WeraWoof" <test@werawoof.test>',
      to: CONTACT_INBOX,
      replyTo: 'ana@example.com',
      subject: 'Hola',
      html: '<p>Hola</p>',
    })
  })

  it('falla con un mensaje claro si faltan las credenciales SMTP', async () => {
    vi.stubGlobal('useRuntimeConfig', () => ({ smtpUser: '', smtpPass: '' }))
    transportSendMail.mockClear()

    await expect(sendMail({ to: 'ana@example.com', subject: 'x', html: '' })).rejects.toThrow(
      'SMTP sin configurar'
    )
    expect(transportSendMail).not.toHaveBeenCalled()
  })
})
