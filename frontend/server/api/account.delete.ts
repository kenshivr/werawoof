import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'

/* Borrar la cuenta requiere la secret key (server-only, env
   NUXT_SUPABASE_SECRET_KEY). El cascade de la base limpia profile, perros,
   swipes, matches y mensajes. */
export default defineEventHandler(async (event) => {
  /* serverSupabaseUser devuelve los CLAIMS del JWT, no el User: el id es `sub` */
  const claims = await serverSupabaseUser(event)
  if (!claims?.sub) {
    throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  }

  const admin = serverSupabaseServiceRole(event)
  const { error } = await admin.auth.admin.deleteUser(claims.sub)
  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'No pudimos borrar la cuenta' })
  }

  return { ok: true }
})
