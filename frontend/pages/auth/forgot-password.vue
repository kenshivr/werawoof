<template>
  <div class="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
    <h1 class="text-2xl font-bold text-center text-gray-800 mb-2">Recuperar contraseña</h1>
    <p class="text-sm text-center text-gray-500 mb-6">Te enviamos un email para resetearla</p>

    <form v-if="!sent" class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          required
          placeholder="tu@email.com"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading"
        class="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg py-2 transition disabled:opacity-50"
      >
        {{ loading ? 'Enviando...' : 'Enviar email' }}
      </button>
    </form>

    <div v-else class="text-center text-green-600 font-medium">
      ✅ Revisá tu email — te mandamos el link para resetear tu contraseña.
    </div>

    <div class="mt-4 text-center text-sm text-gray-500">
      <NuxtLink to="/auth/login" class="text-orange-500 hover:underline">Volver al login</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'guest' })

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
