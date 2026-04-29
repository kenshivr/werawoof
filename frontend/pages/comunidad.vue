<script setup lang="ts">
definePageMeta({ layout: false })

const reviewsStore = useReviewsStore()
const authStore = useAuthStore()

const form = reactive({ rating: 0, comment: '' })
const hoveredStar = ref(0)
const saving = ref(false)
const error = ref('')
const success = ref(false)

onMounted(async () => {
  authStore.restoreSession()
  await reviewsStore.fetchReviews()
})

const myExistingReview = computed(() =>
  reviewsStore.reviews.find((r) => r.user_id === Number(authStore.user?.id))
)

watch(
  myExistingReview,
  (r) => {
    if (r) {
      form.rating = r.rating
      form.comment = r.comment
    }
  },
  { immediate: true }
)

async function submitReview() {
  if (!form.rating) {
    error.value = 'Elige una calificación.'
    return
  }
  if (!form.comment.trim()) {
    error.value = 'Escribe tu reseña.'
    return
  }
  error.value = ''
  saving.value = true
  try {
    await reviewsStore.upsertReview({ rating: form.rating, comment: form.comment.trim() })
    success.value = true
    setTimeout(() => (success.value = false), 3000)
  } catch {
    error.value = 'No se pudo guardar. Inténtalo de nuevo.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="bg-[#DBD8D0] min-h-screen flex flex-col font-vietnam">
    <LayoutPublicHeader />

    <!-- Hero -->
    <section class="bg-[#382615] pt-28 pb-16 px-6 text-center">
      <span
        class="inline-block px-4 py-1 bg-white/10 text-[#F4C07D] text-sm font-medium rounded-full mb-5 border border-white/10 font-jakarta"
      >
        Comunidad WeraWoof
      </span>
      <h1 class="text-4xl md:text-5xl font-extrabold text-white font-jakarta leading-tight mb-4">
        Lo que dice nuestra comunidad
      </h1>
      <p class="text-white/70 text-lg max-w-xl mx-auto">
        Historias reales de dueños y sus perritos conectando en WeraWoof.
      </p>
    </section>

    <div class="max-w-5xl mx-auto w-full px-6 py-14 flex flex-col gap-14">
      <!-- Reviews grid -->
      <section>
        <!-- Loading -->
        <div v-if="reviewsStore.loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="i in 4" :key="i" class="bg-white rounded-2xl h-44 animate-pulse shadow-sm" />
        </div>

        <!-- Empty -->
        <div
          v-else-if="reviewsStore.reviews.length === 0"
          class="text-center py-20 text-[#4f4539]/60"
        >
          <span class="material-symbols-outlined text-5xl block mb-3 text-[#F4C07D]"
            >rate_review</span
          >
          <p class="font-semibold text-lg">Todavía no hay reseñas.</p>
          <p class="text-sm mt-1">¡Sé el primero en compartir tu experiencia!</p>
        </div>

        <!-- Cards -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="review in reviewsStore.reviews"
            :key="review.id"
            class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.07)] p-6 flex flex-col gap-4"
          >
            <!-- User info -->
            <div class="flex items-center gap-3">
              <div
                class="w-11 h-11 rounded-full overflow-hidden bg-[#fff1e8] shrink-0 border-2 border-[#F4C07D]/30 flex items-center justify-center"
              >
                <img
                  v-if="review.user?.avatar"
                  :src="review.user.avatar"
                  :alt="review.user.name"
                  class="w-full h-full object-cover"
                />
                <span v-else class="material-symbols-outlined text-[#F4C07D]">person</span>
              </div>
              <div>
                <p class="font-bold text-[#281808] font-jakarta leading-tight">
                  {{ review.user?.name }}
                </p>
                <p class="text-xs text-[#4f4539]/50 mt-0.5">
                  {{
                    new Date(review.created_at).toLocaleDateString('es-AR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  }}
                </p>
              </div>
              <!-- Stars right -->
              <div class="ml-auto flex items-center gap-0.5">
                <span
                  v-for="s in 5"
                  :key="s"
                  class="material-symbols-outlined text-lg leading-none"
                  :style="s <= review.rating ? 'font-variation-settings: \'FILL\' 1' : ''"
                  :class="s <= review.rating ? 'text-[#F4C07D]' : 'text-[#DBD8D0]'"
                  >star</span
                >
              </div>
            </div>

            <!-- Comment -->
            <p class="text-[#4f4539] text-sm leading-relaxed flex-1">"{{ review.comment }}"</p>
          </div>
        </div>
      </section>

      <!-- Form section -->
      <section class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.08)] p-8">
        <h2 class="text-2xl font-bold text-[#7d571e] font-jakarta mb-1">
          {{ myExistingReview ? 'Edita tu reseña' : 'Deja tu reseña' }}
        </h2>
        <p class="text-[#4f4539]/70 text-sm mb-7">
          Cuéntanos cómo fue tu experiencia con WeraWoof.
        </p>

        <!-- Not logged in -->
        <template v-if="!authStore.isAuthenticated">
          <div class="flex flex-col items-center gap-4 py-8 text-center">
            <span class="material-symbols-outlined text-5xl text-[#F4C07D]">lock</span>
            <p class="text-[#4f4539] font-medium">Inicia sesión para dejar tu reseña</p>
            <NuxtLink
              to="/auth/login"
              class="px-8 py-3 bg-[#F4C07D] text-[#382615] rounded-xl font-bold font-jakarta shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              Iniciar sesión
            </NuxtLink>
          </div>
        </template>

        <!-- Logged in form -->
        <template v-else>
          <!-- Star picker -->
          <div class="flex flex-col gap-2 mb-6">
            <label class="text-xs font-bold uppercase tracking-widest text-[#4f4539] font-jakarta"
              >Calificación</label
            >

            <div class="flex items-center gap-1">
              <button
                v-for="s in 5"
                :key="s"
                type="button"
                class="transition-transform hover:scale-110 active:scale-95"
                @mouseenter="hoveredStar = s"
                @mouseleave="hoveredStar = 0"
                @click="form.rating = s"
              >
                <span
                  class="material-symbols-outlined text-3xl leading-none"
                  :style="
                    s <= (hoveredStar || form.rating) ? 'font-variation-settings: \'FILL\' 1' : ''
                  "
                  :class="s <= (hoveredStar || form.rating) ? 'text-[#F4C07D]' : 'text-[#DBD8D0]'"
                  >star</span
                >
              </button>
              <span v-if="form.rating" class="ml-3 text-sm font-medium text-[#7d571e] font-jakarta">
                {{ ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][form.rating] }}
              </span>
            </div>
          </div>

          <!-- Comment -->
          <div class="flex flex-col gap-2 mb-6">
            <div class="flex justify-between items-center">
              <label class="text-xs font-bold uppercase tracking-widest text-[#4f4539] font-jakarta"
                >Tu reseña</label
              >
              <span class="text-xs text-[#4f4539]/50">{{ form.comment.length }} / 300</span>
            </div>
            <textarea
              v-model="form.comment"
              maxlength="300"
              rows="4"
              placeholder="Cuéntanos tu experiencia con WeraWoof..."
              class="w-full bg-white border border-[#DBD8D0] rounded-xl px-4 py-3 focus:border-[#B78F64] focus:ring-0 outline-none transition-all resize-none text-sm"
            />
          </div>

          <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>
          <p v-if="success" class="text-green-600 text-sm mb-4 font-medium">¡Reseña guardada!</p>

          <button
            type="button"
            :disabled="saving"
            class="w-full md:w-auto px-10 py-3.5 bg-[#F4C07D] text-[#382615] rounded-xl font-bold font-jakarta shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all disabled:opacity-60"
            @click="submitReview"
          >
            {{
              saving ? 'Guardando...' : myExistingReview ? 'Actualizar reseña' : 'Publicar reseña'
            }}
          </button>
        </template>
      </section>
    </div>

    <LayoutPublicFooter />
  </div>
</template>
