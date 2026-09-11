import nodemailer, { type Transporter } from 'nodemailer'

/* Correos transaccionales por SMTP de Gmail con App Password, desde la
   cuenta dedicada de WeraWoof (la misma que usa Supabase Auth como
   custom SMTP). Solo corre en el server: usuario y clave viven en
   runtimeConfig (env NUXT_SMTP_USER y NUXT_SMTP_PASS). */

/* Bandeja que recibe contacto y avisos de newsletter: la misma cuenta
   dedicada que envía. La persona que llena el formulario NO recibe copia;
   solo va como reply-to para poder contestarle desde la bandeja. */
export const CONTACT_INBOX = 'werawoofapp@gmail.com'

export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

interface Mail {
  to: string
  subject: string
  html: string
  replyTo?: string
}

let transport: Transporter | null = null

const getTransport = () => {
  const { smtpUser, smtpPass } = useRuntimeConfig()
  if (!smtpUser || !smtpPass) {
    throw new Error('SMTP sin configurar: faltan NUXT_SMTP_USER o NUXT_SMTP_PASS')
  }
  /* Vercel deja salir por 465 (TLS implícito) y 587; bloquea solo el 25 */
  transport ??= nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: smtpUser, pass: smtpPass },
  })
  return transport
}

export const sendMail = async ({ to, subject, html, replyTo }: Mail) => {
  const { smtpUser } = useRuntimeConfig()
  /* Gmail reescribe el From si no coincide con la cuenta autenticada */
  await getTransport().sendMail({
    from: `"WeraWoof" <${smtpUser}>`,
    to,
    replyTo,
    subject,
    html,
  })
}

/* Lo que escribe el usuario va dentro del HTML del mail: se escapa siempre */
export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string
  )

/* Correo de bienvenida al que se suscribe al newsletter. Sin datos del
   usuario (solo tenemos su email), así que es estático. Diseño aprobado por
   Brayan; el fuente editable vive en preview-newsletter/bienvenida.html. */
export const WELCOME_SUBJECT = '¡Bienvenido a la manada de WeraWoof! 🐾'

export const WELCOME_HTML = `
  <div style="max-width:560px;margin:0 auto;padding:0 16px 28px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
    <div style="background:#382615;border-radius:16px 16px 0 0;padding:22px 32px;text-align:center">
      <span style="font-size:26px">🐾</span>
      <span style="color:#F4C07D;font-size:20px;font-weight:800;letter-spacing:-0.3px;margin-left:8px;vertical-align:middle">WeraWoof</span>
    </div>
    <div style="background:#ffffff;padding:36px 32px;border-left:1px solid #e5ddd4;border-right:1px solid #e5ddd4">
      <p style="margin:0 0 4px;color:#B78F64;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px">Ya sos de la manada</p>
      <h1 style="margin:0 0 14px;color:#382615;font-size:26px;font-weight:800;line-height:1.2">¡Gracias por sumarte! 🎉</h1>
      <p style="margin:0 0 20px;color:#5a4030;font-size:15px;line-height:1.65">Te sumaste a la manada de <strong>WeraWoof</strong>. De vez en cuando te vamos a escribir con <strong>eventos</strong>, <strong>tips para tu can</strong> y las novedades de la comunidad. Nada de spam, prometido. 🐾</p>
      <div style="background:#fdf8f2;border:1px solid #e8d8c0;border-radius:14px;padding:20px 24px;margin:0 0 28px">
        <p style="margin:0;color:#5a4030;font-size:14px;line-height:1.6">Mientras tanto, armá el perfil de tu perro y encontrá con quién menear la cola.</p>
      </div>
      <div style="text-align:center;margin:8px 0 4px">
        <a href="https://werawoof.com" style="display:inline-block;background:#F4C07D;color:#382615;text-decoration:none;font-weight:700;font-size:15px;padding:14px 40px;border-radius:12px;letter-spacing:0.2px;box-shadow:0 4px 12px rgba(244,192,125,0.4)">Entrar a WeraWoof →</a>
      </div>
    </div>
    <div style="background:#382615;border-radius:0 0 16px 16px;padding:18px 32px;text-align:center">
      <p style="margin:0;color:#B78F64;font-size:12px;font-style:italic">Conectá patitas, creá recuerdos. 🐾</p>
      <p style="margin:6px 0 0;color:#6b4a2a;font-size:11px">WeraWoof · te llegó este correo porque te suscribiste al newsletter</p>
    </div>
  </div>
`
