import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'

/* Borrar la cuenta requiere la service role key (server-only, env
   SUPABASE_SERVICE_KEY). El cascade de la base limpia profile, perros,
   swipes, matches y mensajes. */
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  }

  const admin = serverSupabaseServiceRole(event)
  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'No pudimos borrar la cuenta' })
  }

  return { ok: true }
})
