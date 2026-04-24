<template>
  <div class="min-h-full bg-[#DBD8D0]">

    <!-- Header -->
    <div class="max-w-5xl mx-auto px-6 pt-10 pb-6">
      <h1 class="text-[32px] md:text-[40px] font-extrabold text-[#382615] font-jakarta leading-tight">
        Tus Matches
      </h1>
      <p class="text-[#4f4539] mt-1">Los perritos que conectaron con el tuyo 🐾</p>
    </div>

    <!-- Dog selector (si tiene más de 1 perro) -->
    <div v-if="dogsStore.dogs.length > 1" class="max-w-5xl mx-auto px-6 mb-6">
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="dog in dogsStore.dogs"
          :key="dog.id"
          class="flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-bold font-jakarta transition-all"
          :class="String(selectedDogId) === String(dog.id)
            ? 'bg-[#382615] border-[#382615] text-[#F4C07D]'
            : 'bg-white border-[#DBD8D0] text-[#4f4539] hover:border-[#382615]'"
          @click="selectDog(String(dog.id))"
        >
          <img
            v-if="dog.photos?.[0]"
            :src="dog.photos[0]"
            class="w-6 h-6 rounded-full object-cover"
          />
          <span class="material-symbols-outlined text-base" v-else>pets</span>
          {{ dog.name }}
        </button>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-6 pb-24 md:pb-10">

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-24">
        <div class="w-10 h-10 border-4 border-[#F4C07D] border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Sin perros -->
      <div v-else-if="dogsStore.dogs.length === 0" class="text-center py-24">
        <span class="material-symbols-outlined text-6xl text-[#d3c4b4] mb-4 block">pets</span>
        <p class="text-[#4f4539] font-medium">Primero creá el perfil de tu perro para ver matches.</p>
        <NuxtLink
          to="/app/profile"
          class="inline-block mt-4 bg-[#F4C07D] text-[#382615] font-bold px-6 py-3 rounded-xl font-jakarta"
        >
          Crear perfil
        </NuxtLink>
      </div>

      <!-- Sin matches -->
      <div v-else-if="!loading && matches.length === 0" class="text-center py-24">
        <span class="material-symbols-outlined text-6xl text-[#d3c4b4] mb-4 block"
          style="font-variation-settings: 'FILL' 1">favorite</span>
        <p class="text-[#4f4539] font-semibold text-lg">Todavía no hay matches.</p>
        <p class="text-[#4f4539]/60 text-sm mt-1">Explorá y dale like a otros perritos.</p>
        <NuxtLink
          to="/app/dogs"
          class="inline-block mt-4 bg-[#F4C07D] text-[#382615] font-bold px-6 py-3 rounded-xl font-jakarta"
        >
          Explorar
        </NuxtLink>
      </div>

      <!-- Grid de matches -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="match in matches"
          :key="match.id"
          class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.08)] overflow-hidden group hover:-translate-y-1 transition-all duration-300"
        >
          <!-- Foto -->
          <div class="relative aspect-square overflow-hidden bg-[#fff1e8]">
            <img
              v-if="otherDog(match)?.photos?.[0]"
              :src="otherDog(match)!.photos[0]"
              :alt="otherDog(match)!.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="material-symbols-outlined text-7xl text-[#d3c4b4]">pets</span>
            </div>
            <!-- Badge match -->
            <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-sm">
              <span class="material-symbols-outlined text-red-400 text-sm"
                style="font-variation-settings: 'FILL' 1">favorite</span>
              <span class="text-xs font-bold text-[#382615] font-jakarta">Match</span>
            </div>
          </div>

          <!-- Info -->
          <div class="p-5">
            <div class="flex items-start justify-between mb-1">
              <h3 class="text-xl font-extrabold text-[#281808] font-jakarta">
                {{ otherDog(match)?.name }}
              </h3>
              <span class="text-xs text-[#4f4539]/50 mt-1">{{ formatDate(match.created_at) }}</span>
            </div>
            <p class="text-sm text-[#4f4539] mb-1">
              {{ otherDog(match)?.breed }}
              <span v-if="otherDog(match)?.age"> · {{ otherDog(match)!.age }} {{ otherDog(match)!.age === 1 ? 'año' : 'años' }}</span>
            </p>
            <p v-if="otherDog(match)?.bio" class="text-xs text-[#4f4539]/70 line-clamp-2 mb-4">
              {{ otherDog(match)!.bio }}
            </p>

            <!-- Tags de personalidad -->
            <div v-if="otherDog(match)?.personality_tags?.length" class="flex flex-wrap gap-1 mb-4">
              <span
                v-for="tag in otherDog(match)!.personality_tags!.slice(0, 3)"
                :key="tag"
                class="px-2 py-0.5 bg-[#fff1e8] text-[#7d571e] text-xs rounded-full font-medium"
              >{{ tag }}</span>
            </div>

            <NuxtLink
              :to="`/app/chat/${match.id}`"
              class="flex items-center justify-center gap-2 w-full py-3 bg-[#382615] text-[#F4C07D] font-bold rounded-xl font-jakarta hover:bg-[#4a3420] transition-colors"
            >
              <span class="material-symbols-outlined text-lg">chat</span>
              Chatear
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Match } from '~/types/match'
import type { Dog } from '~/types/dog'

definePageMeta({ layout: 'app', middleware: 'auth' })

const dogsStore = useDogsStore()
const matches = ref<Match[]>([])
const loading = ref(true)
const selectedDogId = ref<string>('')

const otherDog = (match: Match): Dog | null => {
  if (!selectedDogId.value) return null
  return String(match.dog1_id) === selectedDogId.value ? match.dog2 : match.dog1
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

const loadMatches = async (dogId: string) => {
  loading.value = true
  try {
    matches.value = await dogsStore.fetchMatches(dogId)
  } catch {
    matches.value = []
  } finally {
    loading.value = false
  }
}

const selectDog = async (dogId: string) => {
  selectedDogId.value = dogId
  await loadMatches(dogId)
}

onMounted(async () => {
  if (dogsStore.dogs.length === 0) await dogsStore.fetchDogs().catch(() => {})
  if (dogsStore.dogs.length > 0) {
    const firstDogId = String(dogsStore.dogs[0].id)
    selectedDogId.value = firstDogId
    await loadMatches(firstDogId)
  } else {
    loading.value = false
  }
})
</script>
