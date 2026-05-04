<template>
  <div class="max-w-2xl mx-auto px-4 py-8 pb-28 md:pb-12">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1
          class="text-[clamp(18px,5vw,28px)] font-extrabold text-[#281808] font-jakarta leading-tight"
        >
          Mis Canes
        </h1>
        <p class="text-[clamp(11px,3vw,14px)] text-[#4f4539] mt-0.5">
          Elige con quién quieres explorar hoy
        </p>
      </div>
      <NuxtLink
        to="/app/dogs/new"
        class="flex items-center gap-1.5 bg-[#F4C07D] text-[#382615] px-4 py-2.5 rounded-xl font-bold text-sm font-jakarta shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 active:scale-95"
      >
        <span class="material-symbols-outlined text-lg leading-none">add</span>
        Agregar
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="dogsStore.loading" class="flex flex-col gap-4">
      <div
        v-for="i in 2"
        :key="i"
        class="bg-white rounded-2xl h-16 animate-pulse shadow-[0_4px_20px_rgba(113,62,24,0.06)]"
      />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="dogsStore.dogs.length === 0"
      class="flex flex-col items-center text-center py-20 gap-5"
    >
      <div class="w-24 h-24 rounded-full bg-[#fff1e8] flex items-center justify-center">
        <span class="material-symbols-outlined text-5xl text-[#F4C07D]">pets</span>
      </div>
      <div>
        <h2 class="text-xl font-bold text-[#281808] font-jakarta mb-1">
          Todavía no tienes peludos
        </h2>
        <p class="text-sm text-[#4f4539]">Agregá tu primer can para empezar a explorar.</p>
      </div>
      <NuxtLink
        to="/app/dogs/new"
        class="bg-[#F4C07D] text-[#382615] px-8 py-3.5 rounded-xl font-bold font-jakarta shadow-sm hover:-translate-y-0.5 transition-all duration-200"
      >
        Agregar a mi can
      </NuxtLink>
    </div>

    <!-- Dog cards -->
    <div v-else class="flex flex-col gap-3">
      <div v-for="dog in dogsStore.dogs" :key="dog.id" class="bg-white rounded-2xl flex gap-1 h-28">
        <!-- Photo -->
        <div class="h-[calc(100%-20px)] aspect-square m-[10px] rounded-md overflow-hidden">
          <img
            v-if="dog.photos?.length"
            :src="dog.photos[0]"
            :alt="dog.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <span class="material-symbols-outlined text-3xl text-[#F4C07D]">pets</span>
          </div>
        </div>

        <!-- Info + actions -->
        <div class="flex flex-col justify-between pb-2">
          <div>
            <p class="font-jakarta font-extrabold text-[#281808] text-lg">
              {{ dog.name }}
            </p>
            <p class="text-sm font-semibold text-[#7d571e] mt-0.5">
              {{ dog.age }} {{ dog.age === 1 ? 'año' : 'años' }}
            </p>
          </div>
          <div class="flex gap-3 items-center">
            <NuxtLink
              :to="`/app/swipe/${dog.id}`"
              class="flex items-center justify-center gap-1 bg-[#F4C07D] text-[#382615] px-2 py-1 rounded-lg font-bold text-xs font-jakarta shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 active:scale-95"
            >
              <span class="material-symbols-outlined text-sm leading-none">explore</span>
              Explorar
            </NuxtLink>
            <NuxtLink
              :to="`/app/dogs/${dog.id}/edit`"
              class="flex items-center justify-center gap-1 border border-[#DBD8D0] text-[#4f4539] px-2 py-1 rounded-lg text-xs font-medium hover:border-[#B78F64] hover:text-[#382615] transition-all duration-200"
            >
              <span class="material-symbols-outlined text-sm leading-none">edit</span>
              Editar
            </NuxtLink>
            <button
              type="button"
              class="flex items-center justify-center gap-1 border border-red-200 text-red-500 px-2 py-1 rounded-lg text-xs font-medium hover:bg-red-50 hover:border-red-400 transition-all duration-200 active:scale-95"
              @click="confirmDelete(dog)"
            >
              <span class="material-symbols-outlined text-sm leading-none">delete</span>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="dogToDelete"
          class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
          @click.self="dogToDelete = null"
        >
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="dogToDelete = null" />
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 sm:p-8 z-10">
            <div class="flex flex-col items-center text-center gap-4">
              <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <span class="material-symbols-outlined text-3xl text-red-500">delete</span>
              </div>
              <div>
                <h2 class="text-xl font-extrabold text-[#281808] font-jakarta">
                  ¿Eliminar a {{ dogToDelete.name }}?
                </h2>
                <p class="text-sm text-[#4f4539] mt-1.5">
                  Esta acción no se puede deshacer. Se borrarán todas sus fotos y matches.
                </p>
              </div>
              <div class="flex gap-3 w-full mt-2">
                <button
                  type="button"
                  class="flex-1 h-12 border border-[#DBD8D0] text-[#4f4539] rounded-xl font-bold text-sm font-jakarta hover:bg-[#ffeadb] transition-colors"
                  @click="dogToDelete = null"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  :disabled="deleting"
                  class="flex-1 h-12 bg-red-500 text-white rounded-xl font-bold text-sm font-jakarta hover:bg-red-600 transition-colors disabled:opacity-60 active:scale-95"
                  @click="executeDelete"
                >
                  {{ deleting ? 'Eliminando...' : 'Sí, eliminar' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const dogsStore = useDogsStore()
onMounted(() => dogsStore.fetchDogs())

const dogToDelete = ref<{ id: string; name: string } | null>(null)
const deleting = ref(false)

const confirmDelete = (dog: { id: string; name: string }) => {
  dogToDelete.value = dog
}

const executeDelete = async () => {
  if (!dogToDelete.value) return
  deleting.value = true
  try {
    await dogsStore.deleteDog(dogToDelete.value.id)
    dogToDelete.value = null
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
