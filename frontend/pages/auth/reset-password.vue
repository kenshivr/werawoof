<template>
  <div class="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
    <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Nueva contraseña</h1>

    <form v-if="!done" class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
        <input
          v-model="password"
          type="password"
          required
          placeholder="••••••••"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading"
        class="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg py-2 transition disabled:opacity-50"
      >
        {{ loading ? 'Guardando...' : 'Guardar contraseña' }}
      </button>
    </form>

    <div v-else class="text-center text-green-600 font-medium">
      ✅ Contraseña actualizada.
      <NuxtLink to="/auth/login" class="block mt-2 text-orange-500 hover:underline"
        >Ir al login</NuxtLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const api = useApi()

const password = ref('')
const loading = ref(false)
const error = ref('')
const done = ref(false)

const handleSubmit = async () => {
  error.value = ''
  loading.value = true
  try {
    await api.post('/auth/reset-password', {
      token: route.query.token,
      password: password.value,
    })
    done.value = true
  } catch (e: unknown) {
    error.value = (e as Error).message ?? 'Error al resetear la contraseña'
  } finally {
    loading.value = false
  }
}
</script>
