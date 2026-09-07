import { serverSupabaseServiceRole } from '#supabase/server'

/* Newsletter del footer: reemplaza POST /newsletter del backend Go.
   Guarda el email en public.subscribers y avisa a la bandeja de WeraWoof. */
export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event)
  const email = String(body?.email ?? '')
    .trim()
    .toLowerCase()

  if (!EMAIL_RE.test(email)) {
    throw createError({ statusCode: 400, message: 'Correo inválido' })
  }

  const admin = serverSupabaseServiceRole(event)
  const { error } = await admin.from('subscribers').insert({ email })

  /* 23505 = unique_violation: ya estaba suscrito, lo tratamos como éxito */
  if (error && error.code !== '23505') {
    console.error('[newsletter]', error)
    throw createError({ statusCode: 500, message: 'No se pudo guardar' })
  }

  /* Los correos solo van cuando la suscripción es nueva (no en duplicados) y
     nunca bloquean la respuesta: si el SMTP falla, solo se loguea. */
  if (!error) {
    /* Bienvenida al que se suscribió */
    await sendMail({
      to: email,
      subject: WELCOME_SUBJECT,
      html: WELCOME_HTML,
    }).catch((err) => console.warn('[newsletter] bienvenida no enviada:', err))

    /* Aviso interno a la bandeja de WeraWoof */
    const aviso = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#382615">📧 Nuevo suscriptor al newsletter</h2>
        <div style="background:#DBD8D0;border-radius:12px;padding:20px;margin:16px 0">
          <p><strong>Correo:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          <p><strong>Fuente:</strong> Footer de WeraWoof</p>
        </div>
        <p style="color:#7d571e;font-size:12px">Enviado desde el formulario de newsletter de WeraWoof</p>
      </div>
    `
    await sendMail({
      to: CONTACT_INBOX,
      replyTo: email,
      subject: `Nuevo suscriptor: ${email} — WeraWoof`,
      html: aviso,
    }).catch((err) => console.warn('[newsletter] aviso no enviado:', err))
  }

  return { ok: true }
})
