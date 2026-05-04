<script setup lang="ts">
import type { Dog } from '~/types/dog'

definePageMeta({ layout: 'app', middleware: 'auth' })

interface Candidate extends Dog {
  distance?: number
}

const route = useRoute()
const dogId = computed(() => route.params.dogId as string)

const api = useApi()
const dogsStore = useDogsStore()

const activeDog = ref<Dog | null>(null)
const candidates = ref<Candidate[]>([])
const loadingDog = ref(true)
const loadingCandidates = ref(false)
const noMoreCandidates = ref(false)

interface MatchCelebrationData {
  myDog: Dog
  otherDog: Dog
  matchId: string
}
const matchCelebration = ref<MatchCelebrationData | null>(null)

// Profile detail sheet
const showProfile = ref(false)
const profilePhotoIdx = ref(0)

// Drag state
const isDragging = ref(false)
const isAnimating = ref(false)
const swipeDirection = ref<'like' | 'dislike' | null>(null)
const startX = ref(0)
const startY = ref(0)
const currentX = ref(0)
const currentY = ref(0)

const deltaX = computed(() => currentX.value - startX.value)
const deltaY = computed(() => currentY.value - startY.value)

const cardTransform = computed(() => {
  if (swipeDirection.value === 'like') return 'translate(160%, -8%) rotate(22deg)'
  if (swipeDirection.value === 'dislike') return 'translate(-160%, -8%) rotate(-22deg)'
  if (!isDragging.value) return ''
  const rotate = deltaX.value * 0.08
  return `translate(${deltaX.value}px, ${deltaY.value}px) rotate(${rotate}deg)`
})

const likeOpacity = computed(() => {
  if (swipeDirection.value === 'like') return 1
  return Math.max(0, Math.min(1, deltaX.value / 80))
})
const nopeOpacity = computed(() => {
  if (swipeDirection.value === 'dislike') return 1
  return Math.max(0, Math.min(1, -deltaX.value / 80))
})

const topCandidate = computed(() => candidates.value[0] ?? null)

const dogPhoto = (dog: Candidate) =>
  dog.photos?.[0] ??
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBSRJrDXTAUPRdQb_rcU2rznew6qav938_yk_RwRmV_VkZZYuZCfGLbji43Qo08LLoWzz6XwVU9Q3RaXVL_Hj63tHG1ijzV9djC8_S7mOYH_2U3vuEY-pXy_y9MNdFifZMeshO2SgtUmiZ9PkacisaAG9_rN2Kz7mYGysg-DDkXdQLNHB6-7sMa_rU3ct5Yr7XgHAm-wH4-BYN9G4UxEJQhZrr0MDnObHJRJKtFM2uB6HvoQSpTmuTJLqXxKN42TYgSUEvonUr7Kg'

async function loadCandidates() {
  if (!activeDog.value) return
  loadingCandidates.value = true
  try {
    const res = await api.get<{ candidates: Candidate[] }>(
      `/api/dogs/${activeDog.value.id}/candidates`
    )
    candidates.value = res.candidates ?? []
    if (candidates.value.length === 0) noMoreCandidates.value = true
  } catch {
    noMoreCandidates.value = true
  } finally {
    loadingCandidates.value = false
  }
}

async function performSwipe(direction: 'like' | 'dislike') {
  if (!activeDog.value || !topCandidate.value || isAnimating.value) return
  isAnimating.value = true
  swipeDirection.value = direction

  const [result] = await Promise.allSettled([
    api.post<{ swiped: boolean; match?: { id: string } }>('/api/swipe', {
      swiper_dog_id: Number(activeDog.value.id),
      swiped_dog_id: Number(topCandidate.value.id),
      direction,
    }),
    new Promise<void>((r) => setTimeout(r, 380)),
  ])

  const matchedCandidate = topCandidate.value

  swipeDirection.value = null
  isAnimating.value = false
  candidates.value.shift()

  if (result.status === 'fulfilled' && result.value?.match && activeDog.value && matchedCandidate) {
    matchCelebration.value = {
      myDog: activeDog.value,
      otherDog: matchedCandidate,
      matchId: result.value.match.id,
    }
  }
  if (candidates.value.length < 2) loadCandidates()
}

function onPointerDown(e: PointerEvent) {
  if (isAnimating.value) return
  isDragging.value = true
  startX.value = e.clientX
  startY.value = e.clientY
  currentX.value = e.clientX
  currentY.value = e.clientY
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value) return
  currentX.value = e.clientX
  currentY.value = e.clientY
}

async function onPointerUp() {
  if (!isDragging.value) return
  isDragging.value = false
  const dx = deltaX.value
  startX.value = 0
  startY.value = 0
  currentX.value = 0
  currentY.value = 0
  if (Math.abs(dx) >= 80) {
    await performSwipe(dx > 0 ? 'like' : 'dislike')
  }
}

function openProfile() {
  profilePhotoIdx.value = 0
  showProfile.value = true
}

function closeProfile() {
  showProfile.value = false
}

function prevPhoto() {
  const len = topCandidate.value?.photos?.length ?? 0
  if (len > 1) profilePhotoIdx.value = (profilePhotoIdx.value - 1 + len) % len
}

function nextPhoto() {
  const len = topCandidate.value?.photos?.length ?? 0
  if (len > 1) profilePhotoIdx.value = (profilePhotoIdx.value + 1) % len
}

const profileTouchStartX = ref(0)

function onProfileTouchStart(e: TouchEvent) {
  profileTouchStartX.value = e.touches[0].clientX
}

function onProfileTouchEnd(e: TouchEvent) {
  const delta = e.changedTouches[0].clientX - profileTouchStartX.value
  if (Math.abs(delta) < 40) return
  if (delta < 0) nextPhoto()
  else prevPhoto()
}

onMounted(async () => {
  loadingDog.value = true
  try {
    // Try store first to avoid extra request
    if (dogsStore.dogs.length === 0) await dogsStore.fetchDogs()
    const found = dogsStore.dogs.find((d) => String(d.id) === dogId.value)
    if (found) {
      activeDog.value = found
    } else {
      const res = await api.get<{ dog: Dog }>(`/api/dogs/${dogId.value}`)
      activeDog.value = res.dog
    }
    await loadCandidates()
  } catch {
    navigateTo('/app/dogs')
  } finally {
    loadingDog.value = false
  }
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-start md:justify-center min-h-[calc(100vh-80px)] px-4 pt-16 pb-8 md:py-8 overflow-y-auto"
  >
    <!-- Active dog banner -->
    <div
      v-if="activeDog && !loadingDog"
      class="fixed top-[83px] left-0 right-0 z-40 flex justify-center pointer-events-none"
    >
      <div
        class="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-[#fdddc3] px-4 py-2 rounded-full shadow-sm text-sm font-medium text-[#382615] font-jakarta pointer-events-auto"
      >
        <div class="w-6 h-6 rounded-full overflow-hidden bg-[#fff1e8] shrink-0">
          <img
            v-if="activeDog.photos?.length"
            :src="activeDog.photos[0]"
            :alt="activeDog.name"
            class="w-full h-full object-cover"
          />
          <span
            v-else
            class="material-symbols-outlined text-sm text-[#F4C07D] flex items-center justify-center w-full h-full"
            >pets</span
          >
        </div>
        <span
          >Explorando como <strong>{{ activeDog.name }}</strong></span
        >
        <NuxtLink to="/app/dogs" class="ml-1 text-[#795832] hover:text-[#382615] transition-colors">
          <span class="material-symbols-outlined text-base leading-none">swap_horiz</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Loading dog -->
    <div v-if="loadingDog" class="text-center space-y-3">
      <span class="material-symbols-outlined text-5xl text-[#382615]/30 animate-pulse">pets</span>
      <p class="text-body-md text-on-surface-variant">Cargando…</p>
    </div>

    <template v-else>
      <!-- Match celebration overlay -->
      <MatchCelebration
        v-if="matchCelebration"
        :my-dog="matchCelebration.myDog"
        :other-dog="matchCelebration.otherDog"
        :match-id="matchCelebration.matchId"
        @message="navigateTo(`/app/chat/${matchCelebration!.matchId}`)"
        @continue="matchCelebration = null"
        @home="navigateTo('/app')"
      />

      <!-- Loading candidates -->
      <div v-if="loadingCandidates && candidates.length === 0" class="text-center space-y-3">
        <span class="material-symbols-outlined text-5xl text-[#382615]/30 animate-pulse">pets</span>
        <p class="text-body-md text-on-surface-variant">Buscando peludos cerca…</p>
      </div>

      <!-- No more candidates -->
      <div v-else-if="noMoreCandidates && candidates.length === 0" class="text-center space-y-4">
        <span class="material-symbols-outlined text-6xl text-[#382615]/30"
          >sentiment_satisfied</span
        >
        <h2 class="text-h3 font-h3 text-on-surface font-jakarta">
          ¡Ya viste a todos los de tu zona!
        </h2>
        <p class="text-body-md text-on-surface-variant">
          Volvé más tarde para ver nuevos peludos cerca.
        </p>
        <NuxtLink
          to="/app/dogs"
          class="inline-flex items-center gap-2 text-[#795832] font-medium hover:text-[#382615] transition-colors"
        >
          <span class="material-symbols-outlined text-base">arrow_back</span>
          Explorar con otro can
        </NuxtLink>
      </div>

      <!-- Swipe deck -->
      <template v-else-if="candidates.length > 0 || !noMoreCandidates">
        <!-- Card stack -->
        <div class="relative w-full max-w-[380px]" style="height: 460px">
          <div
            v-if="candidates.length >= 3"
            class="absolute inset-0 bg-white rounded-[16px] shadow-[0_4px_20px_rgba(113,62,24,0.08)] opacity-60"
            style="transform: scale(0.92) translateY(-48px); z-index: 5"
          />
          <div
            v-if="candidates.length >= 2"
            class="absolute inset-0 bg-white rounded-[16px] shadow-[0_4px_20px_rgba(113,62,24,0.08)] opacity-80"
            style="transform: scale(0.96) translateY(-24px); z-index: 10"
          />
          <div
            v-if="topCandidate"
            class="absolute inset-0 bg-white rounded-[16px] shadow-[0_4px_20px_rgba(113,62,24,0.08)] overflow-hidden select-none"
            :class="isAnimating ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'"
            :style="{
              transform: cardTransform || undefined,
              transition: isDragging
                ? 'none'
                : 'transform 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              zIndex: 20,
              touchAction: 'none',
            }"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
          >
            <img
              :src="dogPhoto(topCandidate)"
              :alt="topCandidate.name"
              class="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"
            />
            <div
              class="absolute top-10 left-8 border-4 border-primary text-primary font-h2 px-4 py-1 rounded-lg -rotate-12 pointer-events-none transition-opacity duration-100 font-jakarta uppercase tracking-wider text-2xl font-black"
              :style="{ opacity: likeOpacity }"
            >
              LIKE
            </div>
            <div
              class="absolute top-10 right-8 border-4 border-error text-error font-h2 px-4 py-1 rounded-lg rotate-12 pointer-events-none transition-opacity duration-100 font-jakarta uppercase tracking-wider text-2xl font-black"
              :style="{ opacity: nopeOpacity }"
            >
              NOPE
            </div>
            <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div class="flex items-end justify-between gap-4">
                <div class="flex-1 min-w-0 pointer-events-none">
                  <div class="flex items-center gap-2 mb-2">
                    <h2 class="text-3xl font-extrabold font-jakarta">
                      {{ topCandidate.name }}, {{ topCandidate.age }}
                    </h2>
                    <span
                      class="material-symbols-outlined text-[#F4C07D]"
                      style="font-variation-settings: 'FILL' 1"
                      >verified</span
                    >
                  </div>

                  <div class="flex flex-wrap gap-2 mb-3">
                    <span
                      class="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-white/20"
                      >{{ topCandidate.breed }}</span
                    >
                    <span
                      v-if="topCandidate.distance"
                      class="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                    >
                      <span class="material-symbols-outlined text-sm">location_on</span>
                      {{ topCandidate.distance.toFixed(1) }} km
                    </span>
                  </div>

                  <p v-if="topCandidate.bio" class="text-white/90 text-sm line-clamp-2">
                    {{ topCandidate.bio }}
                  </p>
                </div>
                <button
                  class="shrink-0 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-1 hover:bg-white/30 transition-colors"
                  @click.stop="openProfile"
                >
                  <span class="material-symbols-outlined text-white text-xl">info</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="mt-8 flex items-center gap-8">
          <button
            class="w-16 h-16 rounded-full bg-white flex items-center justify-center text-stone-400 shadow-[0_4px_20px_rgba(113,62,24,0.08)] hover:bg-stone-100 active:scale-90 transition-all duration-200 disabled:opacity-40"
            :disabled="isAnimating"
            @click="performSwipe('dislike')"
          >
            <span class="material-symbols-outlined text-3xl">close</span>
          </button>
          <button
            class="w-20 h-20 rounded-full bg-[#F4C07D] flex items-center justify-center text-[#382615] shadow-[0_4px_20px_rgba(113,62,24,0.12)] hover:opacity-90 active:scale-90 transition-all duration-200 disabled:opacity-40"
            :disabled="isAnimating"
            @click="performSwipe('like')"
          >
            <span
              class="material-symbols-outlined text-4xl"
              style="font-variation-settings: 'FILL' 1"
              >favorite</span
            >
          </button>
        </div>
      </template>
    </template>

    <!-- Profile detail -->
    <Transition name="profile-fade">
      <div v-if="showProfile && topCandidate" class="fixed inset-0 z-[100]">
        <!-- MOBILE -->
        <div class="md:hidden absolute inset-0 bg-white overflow-y-auto no-scrollbar">
          <nav
            class="fixed top-0 left-0 right-0 z-10 flex justify-between items-center px-6 py-6 pointer-events-none"
          >
            <button
              class="pointer-events-auto bg-white/20 backdrop-blur-md text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/30 transition-all shadow-sm"
              @click="closeProfile"
            >
              <span class="material-symbols-outlined">arrow_back</span>
            </button>
          </nav>
          <section
            class="relative h-[530px] w-full bg-stone-200"
            @touchstart.passive="onProfileTouchStart"
            @touchend.passive="onProfileTouchEnd"
          >
            <img
              :src="topCandidate.photos?.[profilePhotoIdx] ?? dogPhoto(topCandidate)"
              :alt="topCandidate.name"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"
            />
            <button
              v-if="(topCandidate.photos?.length ?? 0) > 1"
              class="absolute inset-y-0 left-0 w-1/2"
              @click="prevPhoto"
            />
            <button
              v-if="(topCandidate.photos?.length ?? 0) > 1"
              class="absolute inset-y-0 right-0 w-1/2"
              @click="nextPhoto"
            />
            <div
              v-if="(topCandidate.photos?.length ?? 0) > 1"
              class="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-full"
            >
              <div
                v-for="(_, i) in topCandidate.photos"
                :key="i"
                class="w-2 h-2 rounded-full transition-all duration-200"
                :class="i === profilePhotoIdx ? 'bg-white' : 'bg-white/40'"
              />
            </div>
          </section>
          <section class="relative -mt-8 bg-white rounded-t-[32px] px-6 pt-8 pb-36">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h1
                  class="font-jakarta font-extrabold text-[32px] text-[#281808] leading-tight flex items-center gap-2"
                >
                  {{ topCandidate.name }}
                  <span
                    class="material-symbols-outlined text-[#F4C07D] text-2xl"
                    style="font-variation-settings: 'FILL' 1"
                    >verified</span
                  >
                </h1>
                <p
                  v-if="topCandidate.distance"
                  class="text-[#4f4539] flex items-center gap-1 mt-1 text-sm"
                >
                  <span class="material-symbols-outlined text-[18px]">location_on</span>
                  {{ topCandidate.distance.toFixed(1) }} km de distancia
                </p>
              </div>
              <div
                class="bg-[#fff1e8] px-4 py-2 rounded-2xl flex flex-col items-center shrink-0 ml-4"
              >
                <span class="font-jakarta font-bold text-[#7d571e] text-xl leading-tight">{{
                  topCandidate.age
                }}</span>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#4f4539]"
                  >Años</span
                >
              </div>
            </div>
            <div class="flex flex-wrap gap-2 mb-7">
              <span
                class="bg-[#B78F64]/10 text-[#B78F64] px-4 py-2 rounded-full text-sm font-semibold"
                >{{ topCandidate.breed }}</span
              >
            </div>
            <div v-if="topCandidate.bio" class="mb-8">
              <h3 class="font-jakarta font-bold text-xl text-[#281808] mb-3">
                Sobre {{ topCandidate.name }}
              </h3>
              <p class="text-[#4f4539] leading-relaxed">{{ topCandidate.bio }}</p>
            </div>
            <div v-if="(topCandidate.photos?.length ?? 0) > 1" class="mb-4">
              <p class="text-xs font-bold uppercase tracking-widest text-[#4f4539]/60 mb-3">
                Fotos
              </p>
              <div class="grid grid-cols-3 gap-2">
                <div
                  v-for="(photo, i) in topCandidate.photos"
                  :key="i"
                  class="aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-150"
                  :class="
                    i === profilePhotoIdx
                      ? 'ring-2 ring-[#F4C07D] ring-offset-2'
                      : 'opacity-75 hover:opacity-100'
                  "
                  @click="profilePhotoIdx = i"
                >
                  <img
                    :src="photo"
                    :alt="`${topCandidate.name} ${i + 1}`"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div
          class="md:hidden absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent"
        >
          <div class="max-w-md mx-auto flex gap-4">
            <button
              class="flex-1 h-16 bg-white border-2 border-stone-200 rounded-[20px] flex items-center justify-center text-stone-400 hover:border-red-400 hover:text-red-400 transition-all duration-200 shadow-lg active:scale-95"
              @click="
                () => {
                  closeProfile()
                  performSwipe('dislike')
                }
              "
            >
              <span class="material-symbols-outlined text-[32px]">close</span>
            </button>
            <button
              class="flex-[2] h-16 bg-[#F4C07D] text-[#382615] rounded-[20px] flex items-center justify-center gap-2 font-jakarta font-bold text-lg shadow-xl active:scale-95 transition-all duration-200"
              @click="
                () => {
                  closeProfile()
                  performSwipe('like')
                }
              "
            >
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1"
                >favorite</span
              >
              ¡Vamos!
            </button>
          </div>
        </div>

        <!-- DESKTOP -->
        <div class="hidden md:flex absolute inset-0 items-center justify-center px-6">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeProfile" />
          <div
            class="relative w-full max-w-4xl bg-white rounded-[16px] shadow-[0_12px_40px_rgba(113,62,24,0.12)] overflow-hidden flex"
            style="max-height: 88vh"
          >
            <button
              class="absolute top-6 left-6 z-30 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#382615] shadow-md hover:bg-white transition-all"
              @click="closeProfile"
            >
              <span class="material-symbols-outlined">arrow_back</span>
            </button>
            <div class="w-1/2 relative bg-stone-100 min-h-[500px]">
              <img
                :src="topCandidate.photos?.[profilePhotoIdx] ?? dogPhoto(topCandidate)"
                :alt="topCandidate.name"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <button
                v-if="(topCandidate.photos?.length ?? 0) > 1"
                class="absolute inset-y-0 left-0 w-1/2 z-10"
                @click="prevPhoto"
              />
              <button
                v-if="(topCandidate.photos?.length ?? 0) > 1"
                class="absolute inset-y-0 right-0 w-1/2 z-10"
                @click="nextPhoto"
              />
              <div
                v-if="(topCandidate.photos?.length ?? 0) > 1"
                class="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2"
              >
                <div
                  v-for="(_, i) in topCandidate.photos"
                  :key="i"
                  class="w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-200"
                  :class="i === profilePhotoIdx ? 'bg-[#F4C07D]' : 'bg-white/50'"
                  @click.stop="profilePhotoIdx = i"
                />
              </div>
            </div>
            <div class="w-1/2 flex flex-col overflow-y-auto custom-scrollbar">
              <div class="flex-1 p-8 pb-4 space-y-6">
                <div>
                  <h1
                    class="font-jakarta font-extrabold text-[32px] text-[#281808] leading-tight mb-1"
                  >
                    {{ topCandidate.name }}, {{ topCandidate.age }}
                  </h1>
                  <p class="text-[#7d571e] font-semibold text-lg">{{ topCandidate.breed }}</p>
                </div>
                <div v-if="topCandidate.distance" class="grid grid-cols-2 gap-4">
                  <div
                    class="bg-[#fff1e8] p-4 rounded-[16px] flex flex-col items-center col-span-2"
                  >
                    <span class="material-symbols-outlined text-[#795832] mb-1">location_on</span>
                    <span class="text-xs font-bold uppercase tracking-wide text-[#4f4539]"
                      >Distancia</span
                    >
                    <span class="font-bold text-[#281808] mt-1"
                      >{{ topCandidate.distance.toFixed(1) }} km</span
                    >
                  </div>
                </div>
                <div v-if="topCandidate.bio">
                  <h3 class="font-jakarta font-bold text-xl text-[#281808] mb-3">
                    Sobre {{ topCandidate.name }}
                  </h3>
                  <p class="text-[#4f4539] leading-relaxed">{{ topCandidate.bio }}</p>
                </div>
              </div>
              <div
                class="flex-shrink-0 flex gap-4 px-8 py-5 bg-white/90 backdrop-blur-md border-t border-[#fdddc3] sticky bottom-0"
              >
                <button
                  class="flex-1 flex items-center justify-center gap-2 border-2 border-[#ba1a1a] text-[#ba1a1a] py-4 px-6 rounded-[16px] font-bold hover:bg-red-50 transition-all duration-200 active:scale-95"
                  @click="
                    () => {
                      closeProfile()
                      performSwipe('dislike')
                    }
                  "
                >
                  <span class="material-symbols-outlined">close</span>
                  Pasar
                </button>
                <button
                  class="flex-1 flex items-center justify-center gap-2 bg-[#F4C07D] text-[#382615] py-4 px-6 rounded-[16px] font-bold shadow-md hover:opacity-90 active:scale-95 transition-all duration-200"
                  @click="
                    () => {
                      closeProfile()
                      performSwipe('like')
                    }
                  "
                >
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1"
                    >favorite</span
                  >
                  Me gusta {{ topCandidate.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}
.profile-fade-enter-active,
.profile-fade-leave-active {
  transition: opacity 0.25s ease;
}
.profile-fade-enter-from,
.profile-fade-leave-to {
  opacity: 0;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
