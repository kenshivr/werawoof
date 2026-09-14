/* A dónde va alguien que acaba de iniciar sesión (correo, Google o el link
   de confirmación): sin canes todavía → el perfil, que es el onboarding
   (paso 1 tus datos, paso 2 tu can); con canes → Mis Canes. */
export const usePostLoginPath = () => {
  const supabase = useSupabaseClient()

  return async (): Promise<string> => {
    const { data } = await supabase.auth.getClaims()
    const uid = data?.claims.sub
    if (!uid) return '/app'

    const { count, error } = await supabase
      .from('dogs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', uid)
    if (error) return '/app/dogs'
    return count ? '/app/dogs' : '/app/profile'
  }
}
