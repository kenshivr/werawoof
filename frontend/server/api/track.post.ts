import { serverSupabaseServiceRole } from '#supabase/server'

/* Tracking de visitas para el dashboard admin: reemplaza POST /track de Go.
   IP y user-agent solo se pueden leer acá, por eso no se inserta desde el
   cliente. Siempre responde ok: una visita perdida no debe romper nada. */
export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event)
  const path = String(body?.path ?? '').trim()

  if (!path.startsWith('/') || path.length > 500) {
    throw createError({ statusCode: 400, message: 'path required' })
  }

  const admin = serverSupabaseServiceRole(event)
  const { error } = await admin.from('page_visits').insert({
    path,
    ip: getRequestIP(event, { xForwardedFor: true }) ?? '',
    user_agent: getRequestHeader(event, 'user-agent') ?? '',
  })
  if (error) console.error('[track]', error)

  return { ok: true }
})
