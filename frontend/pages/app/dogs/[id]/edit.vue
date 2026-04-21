<template>
  <div class="max-w-lg mx-auto py-8">
    <h1 class="text-xl font-bold text-gray-800 mb-6">Editar perro</h1>

    <div v-if="loading && !form.name" class="text-center text-gray-400 text-sm">Cargando...</div>

    <form
      v-else
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
          {{ loading ? 'Guardando...' : 'Guardar cambios' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const route = useRoute()
const dogsStore = useDogsStore()
const id = route.params.id as string

const form = reactive({ name: '', breed: '', age: 0, bio: '' })
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  await dogsStore.fetchDogs()
  const dog = dogsStore.dogs.find((d) => d.id === id)
  if (dog) {
    form.name = dog.name
    form.breed = dog.breed
    form.age = dog.age
    form.bio = dog.bio ?? ''
  }
})

const handleSubmit = async () => {
  error.value = ''
  loading.value = true
  try {
    await dogsStore.updateDog(id, form)
    await navigateTo('/app/dogs')
  } catch (e: unknown) {
    error.value = (e as Error).message ?? 'Error al actualizar el perro'
  } finally {
    loading.value = false
  }
}
</script>
