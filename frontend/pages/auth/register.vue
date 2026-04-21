<template>
  <div class="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
    <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Crear cuenta 🐶</h1>

    <form class="flex flex-col gap-4" @submit.prevent="handleRegister">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          v-model="form.name"
          type="text"
          required
          placeholder="Tu nombre"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

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
        {{ loading ? 'Creando cuenta...' : 'Registrarse' }}
      </button>
    </form>

    <div class="mt-4 text-center text-sm text-gray-500">
      ¿Ya tenés cuenta?
      <NuxtLink to="/auth/login" class="text-orange-500 font-medium hover:underline"
        >Ingresá</NuxtLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'guest' })

const authStore = useAuthStore()

const form = reactive({ name: '', email: '', password: '' })
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  error.value = ''
  loading.value = true
  try {
    await authStore.register(form)
    await navigateTo('/app')
  } catch (e: unknown) {
    error.value = (e as Error).message ?? 'Error al registrarse'
  } finally {
    loading.value = false
  }
}
</script>
