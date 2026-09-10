import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Message } from '~/types/message'
import { useMessagesStore } from '~/stores/messages'

type InsertHandler = (payload: { new: Message }) => void

const message = (id: number, sender = 'user-2', content = `mensaje ${id}`): Message => ({
  id,
  match_id: 7,
  sender_id: sender,
  content,
  created_at: `2026-09-10T10:00:0${id}Z`,
})

/* Canal de Realtime falso: guarda la suscripción para disparar INSERTs a mano */
let subscription:
  | { event: string; filter: { filter?: string }; callback: InsertHandler }
  | undefined
const fakeChannel = {
  on(event: string, filter: { filter?: string }, callback: InsertHandler) {
    subscription = { event, filter, callback }
    return this
  },
  subscribe() {
    return this
  },
}

/* Cliente de Supabase falso: solo las cadenas que usa el store */
const single = vi.fn()
const insert = vi.fn(() => ({ select: () => ({ single }) }))
const order = vi.fn()
const eq = vi.fn(() => ({ order }))
const select = vi.fn(() => ({ eq }))
const supabase = {
  from: vi.fn(() => ({ insert, select })),
  channel: vi.fn(() => fakeChannel),
  removeChannel: vi.fn(),
}
const auth = { uid: 'user-1' as string | null }

/* Auto-imports de Nuxt que usa el store */
vi.stubGlobal('ref', ref)
vi.stubGlobal('useSupabaseClient', () => supabase)
vi.stubGlobal('useAuthStore', () => auth)

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  subscription = undefined
  auth.uid = 'user-1'
})

describe('useMessagesStore', () => {
  it('sendMessage agrega el mensaje y el eco de Realtime con el mismo id no lo duplica', async () => {
    const sent = message(1, 'user-1', 'hola')
    single.mockResolvedValue({ data: sent, error: null })
    const store = useMessagesStore()
    store.listen(7)

    const result = await store.sendMessage(7, 'hola')
    subscription?.callback({ new: sent })

    expect(result).toEqual(sent)
    expect(insert).toHaveBeenCalledWith({ match_id: 7, sender_id: 'user-1', content: 'hola' })
    expect(store.messages).toHaveLength(1)
  })

  it('un mensaje ajeno entra una sola vez aunque Realtime repita el evento', () => {
    const onMessage = vi.fn()
    const store = useMessagesStore()
    store.listen(7, onMessage)

    subscription?.callback({ new: message(2) })
    subscription?.callback({ new: message(2) })
    subscription?.callback({ new: message(3) })

    expect(store.messages.map((m) => m.id)).toEqual([2, 3])
    expect(onMessage).toHaveBeenCalledWith(message(2))
  })

  it('listen escucha solo los INSERT del match y cierra el canal anterior', () => {
    const store = useMessagesStore()

    store.listen(7)
    expect(supabase.channel).toHaveBeenCalledWith('chat-7')
    expect(subscription?.event).toBe('postgres_changes')
    expect(subscription?.filter).toEqual(
      expect.objectContaining({ event: 'INSERT', table: 'messages', filter: 'match_id=eq.7' })
    )
    expect(supabase.removeChannel).not.toHaveBeenCalled()

    store.listen(8)
    expect(supabase.removeChannel).toHaveBeenCalledTimes(1)
    expect(supabase.removeChannel).toHaveBeenCalledWith(fakeChannel)
    expect(supabase.channel).toHaveBeenLastCalledWith('chat-8')
  })

  it('clear vacía los mensajes y cierra el canal una sola vez', () => {
    const store = useMessagesStore()
    store.listen(7)
    subscription?.callback({ new: message(4) })

    store.clear()
    store.clear()

    expect(store.messages).toEqual([])
    expect(supabase.removeChannel).toHaveBeenCalledTimes(1)
  })

  it('sendMessage sin sesión falla antes de tocar la base', async () => {
    auth.uid = null
    const store = useMessagesStore()

    await expect(store.sendMessage(7, 'hola')).rejects.toThrow('No hay sesión activa.')
    expect(insert).not.toHaveBeenCalled()
  })

  it('fetchMessages carga el historial del match en orden y apaga loading', async () => {
    order.mockResolvedValue({ data: [message(1), message(2)], error: null })
    const store = useMessagesStore()

    await store.fetchMessages(7)

    expect(select).toHaveBeenCalledWith('*')
    expect(eq).toHaveBeenCalledWith('match_id', 7)
    expect(order).toHaveBeenCalledWith('created_at', { ascending: true })
    expect(store.messages.map((m) => m.id)).toEqual([1, 2])
    expect(store.loading).toBe(false)
  })

  it('fetchMessages avisa si la consulta falla y no deja loading colgado', async () => {
    order.mockResolvedValue({ data: null, error: { message: 'boom' } })
    const store = useMessagesStore()

    await expect(store.fetchMessages(7)).rejects.toThrow('No pudimos cargar los mensajes')
    expect(store.loading).toBe(false)
  })
})
