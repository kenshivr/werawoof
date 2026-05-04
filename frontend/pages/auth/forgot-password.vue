<script setup lang="ts">
definePageMeta({ layout: 'public', middleware: 'guest', ssr: false })

const api = useApi()
const email = ref('')
const loading = ref(false)
const error = ref('')
const sent = ref(false)

const handleSubmit = async () => {
  error.value = ''
  loading.value = true
  try {
    await api.post('/auth/forgot-password', { email: email.value })
    sent.value = true
  } catch (e: unknown) {
    error.value = (e as Error).message ?? 'Error al enviar el email'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-[60vh]">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.10)] p-8">
      <!-- Icon -->
      <div class="flex justify-center mb-6">
        <div class="w-14 h-14 rounded-2xl bg-[#fff1e8] flex items-center justify-center">
          <span class="material-symbols-outlined text-[#F4C07D] text-3xl">lock_reset</span>
        </div>
      </div>

      <h1 class="text-2xl font-extrabold text-center text-[#281808] font-jakarta mb-2">
        Recuperar contraseña
      </h1>
      <p class="text-sm text-center text-[#4f4539] mb-8">
        Ingresá tu email y te enviamos un link para restablecerla
      </p>

      <!-- Form -->
      <form v-if="!sent" class="flex flex-col gap-5" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-[#382615]">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="tu@email.com"
            class="w-full border border-[#DBD8D0] rounded-xl px-4 py-3 text-sm text-[#281808] placeholder:text-[#4f4539]/40 focus:outline-none focus:ring-2 focus:ring-[#F4C07D] focus:border-transparent transition"
          />
        </div>

        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-[#F4C07D] hover:bg-[#e8b06a] text-[#382615] font-bold rounded-xl py-3 font-jakarta transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {{ loading ? 'Enviando...' : 'Enviar link de recuperación' }}
        </button>
      </form>

      <!-- Success -->
      <div v-else class="text-center py-4">
        <span
          class="material-symbols-outlined text-[#F4C07D] text-5xl block mb-4"
          style="font-variation-settings: 'FILL' 1"
          >mark_email_read</span
        >
        <p class="font-bold text-[#281808] font-jakarta text-lg mb-2">¡Email enviado!</p>
        <p class="text-sm text-[#4f4539]">
          Revisá tu bandeja — te mandamos el link para resetear tu contraseña.
        </p>
      </div>

      <div class="mt-6 text-center text-sm text-[#4f4539]">
        <NuxtLink
          to="/auth/login"
          class="inline-flex items-center gap-1 text-[#7d571e] hover:text-[#382615] font-medium transition-colors"
        >
          <span class="material-symbols-outlined text-base leading-none">arrow_back</span>
          Volver al login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
