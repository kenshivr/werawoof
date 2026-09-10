import { vi } from 'vitest'
import { createError, defineEventHandler, getRequestHeader, getRequestIP, readBody } from 'h3'
import {
  CONTACT_INBOX,
  EMAIL_RE,
  WELCOME_HTML,
  WELCOME_SUBJECT,
  escapeHtml,
} from '~/server/utils/mail'

/* nodemailer falso para toda la suite: ningún test abre una conexión SMTP.
   Va acá y no en un spec porque este archivo ya importa mail.ts. */
vi.mock('nodemailer', () => import('./mocks/nodemailer'))

/* Nitro auto-importa estas funciones en los server routes. En Vitest no hay
   Nitro, así que se exponen como globales antes de cargar cada route. */
vi.stubGlobal('defineEventHandler', defineEventHandler)
vi.stubGlobal('readBody', readBody)
vi.stubGlobal('createError', createError)
vi.stubGlobal('getRequestIP', getRequestIP)
vi.stubGlobal('getRequestHeader', getRequestHeader)

/* runtimeConfig del server: solo lo que lee server/utils/mail.ts */
vi.stubGlobal('useRuntimeConfig', () => ({
  smtpUser: 'test@werawoof.test',
  smtpPass: 'app-password',
}))

/* Utils propios de server/utils/mail.ts. Todos reales salvo sendMail: cada
   spec decide qué hace el mock. */
vi.stubGlobal('EMAIL_RE', EMAIL_RE)
vi.stubGlobal('escapeHtml', escapeHtml)
vi.stubGlobal('CONTACT_INBOX', CONTACT_INBOX)
vi.stubGlobal('WELCOME_SUBJECT', WELCOME_SUBJECT)
vi.stubGlobal('WELCOME_HTML', WELCOME_HTML)
vi.stubGlobal(
  'sendMail',
  vi.fn(async () => undefined)
)
