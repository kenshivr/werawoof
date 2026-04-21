<template>
  <div class="max-w-lg mx-auto py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-bold text-gray-800">Mis perros</h1>
      <NuxtLink
        to="/app/dogs/new"
        class="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
      >
        + Agregar
      </NuxtLink>
    </div>

    <div v-if="dogsStore.loading" class="text-center text-gray-400 text-sm">Cargando...</div>

    <div v-else-if="dogsStore.dogs.length === 0" class="text-center text-gray-400 text-sm py-12">
      No tenés perros todavía. ¡Agregá el primero!
    </div>

    <div v-else class="flex flex-col gap-4">
      <div
        v-for="dog in dogsStore.dogs"
        :key="dog.id"
        class="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between"
      >
        <div>
          <p class="font-semibold text-gray-800">{{ dog.name }}</p>
          <p class="text-sm text-gray-500">{{ dog.breed }} · {{ dog.age }} años</p>
        </div>
        <NuxtLink
          :to="`/app/dogs/${dog.id}/edit`"
          class="text-sm text-orange-500 hover:underline font-medium"
        >
          Editar
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const dogsStore = useDogsStore()
onMounted(() => dogsStore.fetchDogs())
</script>
