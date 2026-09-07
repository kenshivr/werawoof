/* Formulario de /contacto: reemplaza POST /contact del backend Go.
   Manda el mensaje a la bandeja de WeraWoof con reply-to al remitente. */
export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event)
  const name = String(body?.name ?? '').trim()
  const phone = String(body?.phone ?? '').trim()
  const email = String(body?.email ?? '')
    .trim()
    .toLowerCase()
  const message = String(body?.message ?? '').trim()

  if (!name || !message || !EMAIL_RE.test(email)) {
    throw createError({
      statusCode: 400,
      message: 'Datos inválidos. Verifica nombre, correo y mensaje.',
    })
  }
  if (name.length > 120 || phone.length > 40 || message.length > 5000) {
    throw createError({ statusCode: 400, message: 'El mensaje es demasiado largo.' })
  }

  const phoneLine = phone ? `<p><strong>Teléfono:</strong> ${escapeHtml(phone)}</p>` : ''
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <h2 style="color:#382615">📬 Nuevo mensaje de contacto</h2>
      <div style="background:#DBD8D0;border-radius:12px;padding:20px;margin:16px 0">
        <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
        ${phoneLine}
        <p><strong>Correo:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        <hr style="border:none;border-top:1px solid #B78F64;margin:16px 0"/>
        <p><strong>Mensaje:</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>
      <p style="color:#7d571e;font-size:12px">Enviado desde el formulario de contacto de WeraWoof</p>
    </div>
  `

  try {
    await sendMail({
      to: CONTACT_INBOX,
      replyTo: email,
      subject: `Nuevo mensaje de ${name} — WeraWoof`,
      html,
    })
  } catch (err) {
    console.error('[contact] SMTP:', err)
    throw createError({
      statusCode: 500,
      message: 'No se pudo enviar el mensaje. Intenta más tarde.',
    })
  }

  return { ok: true }
})
