/* Fila de public.messages en Supabase */
export interface Message {
  id: number
  match_id: number
  sender_id: string
  content: string
  created_at: string
}
