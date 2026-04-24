<script setup lang="ts">
import type { Match } from '~/types/match'
import type { Dog } from '~/types/dog'
import type { Message } from '~/types/message'

definePageMeta({ layout: 'app', middleware: 'auth' })

const route = useRoute()
const matchId = computed(() => Number(route.params.id))

const authStore = useAuthStore()
const dogsStore = useDogsStore()
const config = useRuntimeConfig()
const api = useApi()

const allMatches = ref<Match[]>([])
const messages = ref<Message[]>([])
const activeMatch = ref<Match | null>(null)
const inputText = ref('')
const loading = ref(true)
const messagesContainer = ref<HTMLElement | null>(null)
const searchQuery = ref('')
const showEmojiPicker = ref(false)
const emojiPickerRef = ref<HTMLElement | null>(null)

let ws: WebSocket | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null

const myDogIds = computed(() => new Set(dogsStore.dogs.map((d) => String(d.id))))

const otherDog = (match: Match): Dog | null => {
  if (myDogIds.value.has(String(match.dog1_id))) return match.dog2
  return match.dog1
}

const filteredMatches = computed(() => {
  if (!searchQuery.value.trim()) return allMatches.value
  const q = searchQuery.value.toLowerCase()
  return allMatches.value.filter((m) => otherDog(m)?.name?.toLowerCase().includes(q))
})

const isMyMessage = (msg: Message) => String(msg.sender_id) === String(authStore.user?.id)

const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })

const formatSidebarTime = (dateStr: string) => {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 86400000) return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  if (diff < 172800000) return 'Ayer'
  const day = d.toLocaleDateString('es-MX', { weekday: 'long' })
  return day.charAt(0).toUpperCase() + day.slice(1)
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const loadMessages = async (mId: number) => {
  try {
    const res = await api.get<{ messages: Message[] }>(`/api/matches/${mId}/messages`)
    messages.value = res.messages ?? []
    scrollToBottom()
  } catch {
    messages.value = []
  }
}

const loadAllMatches = async () => {
  if (dogsStore.dogs.length === 0) await dogsStore.fetchDogs().catch(() => {})
  const matchMap = new Map<number, Match>()
  for (const dog of dogsStore.dogs) {
    try {
      const dogMatches = await dogsStore.fetchMatches(String(dog.id))
      for (const m of dogMatches) matchMap.set(m.id, m)
    } catch (_) {
      // dog has no matches yet
    }
  }
  allMatches.value = [...matchMap.values()].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

const connectWS = () => {
  if (!import.meta.client || !authStore.token) return
  const wsBase = (config.public.apiBase as string).replace(/^http/, 'ws')
  ws = new WebSocket(`${wsBase}/api/ws?token=${authStore.token}`)

  ws.onmessage = (event) => {
    try {
      const msg: Message = JSON.parse(event.data)
      if (msg.match_id === matchId.value) {
        messages.value.push(msg)
        scrollToBottom()
      }
    } catch (_) {
      // ignore malformed WS messages
    }
  }

  ws.onclose = () => {
    reconnectTimer = setTimeout(connectWS, 2500)
  }
}

const sendMessage = () => {
  const text = inputText.value.trim()
  if (!text || !ws || ws.readyState !== WebSocket.OPEN) return

  ws.send(JSON.stringify({ match_id: matchId.value, content: text }))

  messages.value.push({
    id: Date.now(),
    match_id: matchId.value,
    sender_id: Number(authStore.user?.id),
    content: text,
    created_at: new Date().toISOString(),
  })
  inputText.value = ''
  scrollToBottom()
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const addEmoji = (native: string) => {
  inputText.value += native
  showEmojiPicker.value = false
}

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
}

const onClickOutsidePicker = (e: MouseEvent) => {
  if (emojiPickerRef.value && !emojiPickerRef.value.contains(e.target as Node)) {
    showEmojiPicker.value = false
  }
}

watch(showEmojiPicker, (val) => {
  if (val) {
    setTimeout(() => document.addEventListener('click', onClickOutsidePicker), 0)
  } else {
    document.removeEventListener('click', onClickOutsidePicker)
  }
})

const selectMatch = async (match: Match) => {
  activeMatch.value = match
  await navigateTo(`/app/chat/${match.id}`)
  await loadMessages(match.id)
}

onMounted(async () => {
  loading.value = true
  await loadAllMatches()
  activeMatch.value = allMatches.value.find((m) => m.id === matchId.value) ?? null
  await loadMessages(matchId.value)
  connectWS()
  loading.value = false
})

onBeforeUnmount(() => {
  if (reconnectTimer) clearTimeout(reconnectTimer)
  if (ws) ws.close()
  document.removeEventListener('click', onClickOutsidePicker)
})

watch(matchId, async (id) => {
  activeMatch.value = allMatches.value.find((m) => m.id === id) ?? null
  await loadMessages(id)
})
</script>

<template>
  <div class="flex overflow-hidden" style="height: calc(100vh - 80px)">

    <!-- SIDEBAR — oculto en mobile, visible en md+ -->
    <aside class="hidden md:flex w-[300px] lg:w-[340px] flex-col border-r border-[#d3c4b4] bg-white shrink-0">

      <!-- Header -->
      <div class="p-5 border-b border-[#d3c4b4]">
        <h2 class="text-2xl font-extrabold text-[#281808] font-jakarta mb-4">Mensajes</h2>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#817568] text-lg select-none">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar matches..."
            class="w-full pl-10 pr-4 py-2.5 bg-[#fff1e8] border border-[#d3c4b4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4C07D] text-sm text-[#281808] transition-all"
          />
        </div>
      </div>

      <!-- Match list -->
      <div class="flex-1 overflow-y-auto">
        <div
          v-for="match in filteredMatches"
          :key="match.id"
          class="flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all border-l-4"
          :class="match.id === matchId
            ? 'bg-[#ffe3cd] border-[#7d571e]'
            : 'hover:bg-[#fff1e8] border-transparent'"
          @click="selectMatch(match)"
        >
          <div class="relative shrink-0">
            <div class="w-12 h-12 rounded-full overflow-hidden bg-[#fdddc3]">
              <img
                v-if="otherDog(match)?.photos?.[0]"
                :src="otherDog(match)!.photos[0]"
                :alt="otherDog(match)!.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <span class="material-symbols-outlined text-[#B78F64] text-2xl">pets</span>
              </div>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline mb-0.5">
              <span class="font-bold text-[#281808] text-sm font-jakarta truncate">{{ otherDog(match)?.name }}</span>
              <span class="text-[10px] text-[#817568] font-bold uppercase tracking-tighter shrink-0 ml-2">
                {{ formatSidebarTime(match.created_at) }}
              </span>
            </div>
            <p class="text-xs text-[#4f4539] truncate">{{ otherDog(match)?.breed }}</p>
          </div>
        </div>

        <div v-if="filteredMatches.length === 0 && !loading" class="px-6 py-10 text-center">
          <span class="material-symbols-outlined text-4xl text-[#d3c4b4] block mb-2">chat_bubble</span>
          <p class="text-sm text-[#4f4539]/60">No hay matches aún</p>
        </div>
      </div>
    </aside>

    <!-- CHAT PANEL -->
    <section class="flex-1 flex flex-col overflow-hidden relative">

      <!-- Loading -->
      <div v-if="loading" class="flex-1 flex items-center justify-center">
        <div class="w-10 h-10 border-4 border-[#F4C07D] border-t-transparent rounded-full animate-spin" />
      </div>

      <!-- No match -->
      <div v-else-if="!activeMatch" class="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
        <span class="material-symbols-outlined text-6xl text-[#d3c4b4]" style="font-variation-settings: 'FILL' 1">favorite</span>
        <p class="text-[#4f4539] font-semibold">Seleccioná un chat para comenzar</p>
        <NuxtLink to="/app/matches" class="text-sm text-[#7d571e] hover:text-[#382615] transition-colors flex items-center gap-1">
          <span class="material-symbols-outlined text-base">arrow_back</span>
          Ver matches
        </NuxtLink>
      </div>

      <template v-else>

        <!-- Chat header -->
        <div class="flex items-center justify-between px-4 md:px-6 py-3.5 bg-white border-b border-[#d3c4b4] shadow-sm shrink-0">
          <div class="flex items-center gap-3">
            <!-- Back (mobile) -->
            <NuxtLink to="/app/matches" class="md:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#fff1e8] transition-colors">
              <span class="material-symbols-outlined text-[#382615]">arrow_back</span>
            </NuxtLink>

            <div class="w-11 h-11 rounded-full overflow-hidden bg-[#fdddc3] shrink-0">
              <img
                v-if="otherDog(activeMatch)?.photos?.[0]"
                :src="otherDog(activeMatch)!.photos[0]"
                :alt="otherDog(activeMatch)!.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <span class="material-symbols-outlined text-[#B78F64]">pets</span>
              </div>
            </div>

            <div>
              <h3 class="font-bold text-[#281808] font-jakarta leading-tight">{{ otherDog(activeMatch)?.name }}</h3>
              <span class="text-xs text-[#4f4539]/70">{{ otherDog(activeMatch)?.breed }}</span>
            </div>
          </div>

        </div>

        <!-- Messages -->
        <div
          ref="messagesContainer"
          class="flex-1 overflow-y-auto px-4 md:px-8 py-6 bg-[#fff8f5]/50"
        >
          <!-- Empty -->
          <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full gap-3 opacity-60">
            <span class="material-symbols-outlined text-5xl text-[#d3c4b4]">chat_bubble_outline</span>
            <p class="text-sm text-[#4f4539]">¡Saludá a {{ otherDog(activeMatch)?.name }}! 🐾</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="flex gap-3 max-w-[80%]"
              :class="isMyMessage(msg) ? 'flex-row-reverse ml-auto' : ''"
            >
              <!-- Avatar -->
              <div class="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1 bg-[#fdddc3] flex items-center justify-center">
                <template v-if="isMyMessage(msg)">
                  <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" class="w-full h-full object-cover" />
                  <span v-else class="material-symbols-outlined text-[#B78F64] text-sm">person</span>
                </template>
                <template v-else>
                  <img v-if="otherDog(activeMatch)?.photos?.[0]" :src="otherDog(activeMatch)!.photos[0]" class="w-full h-full object-cover" />
                  <span v-else class="material-symbols-outlined text-[#B78F64] text-sm">pets</span>
                </template>
              </div>

              <!-- Bubble -->
              <div
                class="px-4 py-3 rounded-2xl shadow-sm"
                :class="isMyMessage(msg)
                  ? 'bg-[#F4C07D] text-[#382615] rounded-tr-none'
                  : 'bg-[#DBD8D0] text-[#713E18] rounded-tl-none'"
              >
                <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
                <span class="text-[10px] opacity-60 mt-1 block font-bold tracking-tight">{{ formatTime(msg.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="shrink-0 px-4 md:px-6 py-4 bg-white border-t border-[#d3c4b4]">
          <!-- Emoji picker -->
          <div v-if="showEmojiPicker" ref="emojiPickerRef" class="absolute bottom-[76px] right-4 md:right-8 z-50 shadow-xl rounded-2xl overflow-hidden">
            <EmojiPicker @select="addEmoji" />
          </div>

          <form class="flex items-center gap-3" @submit.prevent="sendMessage">
            <div class="flex-1 relative">
              <input
                v-model="inputText"
                type="text"
                placeholder="Escribe un mensaje..."
                class="w-full bg-[#fff1e8] border border-[#d3c4b4] rounded-2xl px-5 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#F4C07D] text-sm text-[#281808] transition-all"
                @keydown="onKeydown"
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                :class="showEmojiPicker ? 'text-[#7d571e]' : 'text-[#4f4539] hover:text-[#7d571e]'"
                @click.stop="toggleEmojiPicker"
              >
                <span class="material-symbols-outlined text-lg">mood</span>
              </button>
            </div>
            <button
              type="submit"
              class="w-12 h-12 bg-[#F4C07D] text-[#382615] rounded-2xl flex items-center justify-center shadow-sm hover:brightness-95 active:scale-95 transition-all shrink-0"
            >
              <span class="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>

      </template>
    </section>

  </div>
</template>
