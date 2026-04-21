<template>
  <div class="max-w-lg mx-auto py-8">
    <h1 class="text-xl font-bold text-gray-800 mb-6">Agregar perro</h1>

    <form
      class="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4"
      @submit.prevent="handleSubmit"
    >
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Raza</label>
        <input
          v-model="form.breed"
          type="text"
          required
          class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Edad (años)</label>
        <input
          v-model.number="form.age"
          type="number"
          min="0"
          required
          class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Bio (opcional)</label>
        <textarea
          v-model="form.bio"
          rows="3"
          placeholder="Contanos algo de tu perro..."
          class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

      <div class="flex gap-3">
        <NuxtLink
          to="/app/dogs"
          class="flex-1 text-center border border-gray-300 text-gray-600 font-semibold rounded-lg py-2 text-sm hover:bg-gray-50 transition"
        >
          Cancelar
        </NuxtLink>
        <button
          type="submit"
          :disabled="loading"
          class="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg py-2 text-sm transition disabled:opacity-50"
        >
          {{ loading ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const dogsStore = useDogsStore()
const form = reactive({ name: '', breed: '', age: 0, bio: '' })
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  error.value = ''
  loading.value = true
  try {
    await dogsStore.createDog(form)
    await navigateTo('/app/dogs')
  } catch (e: unknown) {
    error.value = (e as Error).message ?? 'Error al guardar el perro'
  } finally {
    loading.value = false
  }
}
</script>
