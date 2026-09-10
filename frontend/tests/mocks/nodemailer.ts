import { vi } from 'vitest'

/* Reemplaza nodemailer en TODOS los tests (vi.mock en tests/setup.ts): un
   test jamás debe abrir una conexión SMTP real. */
export const transportSendMail = vi.fn()
export const createTransport = vi.fn(() => ({ sendMail: transportSendMail }))
export default { createTransport }
