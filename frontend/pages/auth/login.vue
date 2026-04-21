<template>
  <div class="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
    <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Bienvenido a WeraWoof 🐾</h1>

    <form class="flex flex-col gap-4" @submit.prevent="handleLogin">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          v-model="form.email"
          type="email"
          required
          placeholder="tu@email.com"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
        <input
          v-model="form.password"
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
        {{ loading ? 'Ingresando...' : 'Ingresar' }}
      </button>
    </form>

    <div class="mt-4 text-center text-sm text-gray-500">
      <NuxtLink to="/auth/forgot-password" class="hover:text-orange-500"
        >¿Olvidaste tu contraseña?</NuxtLink
      >
    </div>

    <div class="mt-2 text-center text-sm text-gray-500">
      ¿No tenés cuenta?
      <NuxtLink to="/auth/register" class="text-orange-500 font-medium hover:underline"
        >Registrate</NuxtLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'guest' })

const authStore = useAuthStore()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(form)
    await navigateTo('/app')
  } catch (e: unknown) {
    error.value = (e as Error).message ?? 'Error al ingresar'
  } finally {
    loading.value = false
  }
}
</script>
