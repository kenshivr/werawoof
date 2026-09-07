import { defineStore } from 'pinia'
import type { Message } from '~/types/message'

const fail = (message: string): never => {
  throw new Error(message)
}

/* Chat de un match: historial por consulta y mensajes nuevos por Realtime
   (postgres_changes sobre messages). La policy de select filtra por
   is_match_member, así que solo llegan los de mis matches. */
export const useMessagesStore = defineStore('messages', () => {
  const supabase = useSupabaseClient()
  const auth = useAuthStore()

  const messages = ref<Message[]>([])
  const loading = ref(false)

  let channel: ReturnType<typeof supabase.channel> | null = null

  const uid = () => auth.uid ?? fail('No hay sesión activa.')

  /* El que envía recibe su propio INSERT por Realtime: dedupe por id */
  const append = (msg: Message) => {
    if (messages.value.some((m) => m.id === msg.id)) return
    messages.value.push(msg)
  }

  const fetchMessages = async (matchId: number) => {
    loading.value = true
    messages.value = []
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true })
      if (error) fail('No pudimos cargar los mensajes. Intentá de nuevo.')
      messages.value = (data ?? []) as Message[]
    } finally {
      loading.value = false
    }
  }

  const sendMessage = async (matchId: number, content: string) => {
    const { data, error } = await supabase
      .from('messages')
      .insert({ match_id: matchId, sender_id: uid(), content })
      .select()
      .single()
    if (error) fail('No pudimos enviar el mensaje. Intentá de nuevo.')
    const msg = data as Message
    append(msg)
    return msg
  }

  const stopListening = () => {
    if (!channel) return
    supabase.removeChannel(channel)
    channel = null
  }

  /* Un canal por match abierto; el anterior se cierra */
  const listen = (matchId: number, onMessage?: (msg: Message) => void) => {
    stopListening()
    channel = supabase
      .channel(`chat-${matchId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` },
        (payload) => {
          const msg = payload.new as Message
          append(msg)
          onMessage?.(msg)
        }
      )
      .subscribe()
  }

  const clear = () => {
    stopListening()
    messages.value = []
  }

  return { messages, loading, fetchMessages, sendMessage, listen, stopListening, clear }
})
