<template>
  <div class="max-w-2xl mx-auto px-4 py-8 pb-28 md:pb-12">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-[28px] font-extrabold text-[#281808] font-jakarta leading-tight">
          Mis Canes
        </h1>
        <p class="text-sm text-[#4f4539] mt-0.5">Elige con quién quieres explorar hoy</p>
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
        class="bg-white rounded-2xl h-32 animate-pulse shadow-[0_4px_20px_rgba(113,62,24,0.06)]"
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
    <div v-else class="flex flex-col gap-4">
      <div
        v-for="dog in dogsStore.dogs"
        :key="dog.id"
        class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.07)] overflow-hidden flex transition-shadow hover:shadow-[0_6px_28px_rgba(113,62,24,0.12)]"
      >
        <!-- Photo -->
        <div class="w-28 h-28 shrink-0 bg-[#fff1e8] relative">
          <img
            v-if="dog.photos?.length"
            :src="dog.photos[0]"
            :alt="dog.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <span class="material-symbols-outlined text-4xl text-[#F4C07D]">pets</span>
          </div>
        </div>

        <!-- Info + actions -->
        <div class="flex-1 px-5 py-4 flex flex-col justify-between min-w-0">
          <div>
            <p class="font-jakarta font-extrabold text-[#281808] text-lg leading-tight truncate">
              {{ dog.name }}
            </p>
            <p class="text-sm text-[#4f4539] mt-0.5">
              {{ dog.breed }} · {{ dog.age }} {{ dog.age === 1 ? 'año' : 'años' }}
            </p>
          </div>
          <div class="flex items-center gap-2 mt-3">
            <NuxtLink
              :to="`/app/swipe/${dog.id}`"
              class="flex items-center gap-1.5 bg-[#F4C07D] text-[#382615] px-4 py-2 rounded-xl font-bold text-sm font-jakarta shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 active:scale-95"
            >
              <span class="material-symbols-outlined text-base leading-none">explore</span>
              Explorar
            </NuxtLink>
            <NuxtLink
              :to="`/app/dogs/${dog.id}/edit`"
              class="flex items-center gap-1.5 border border-[#DBD8D0] text-[#4f4539] px-3 py-2 rounded-xl text-sm font-medium hover:border-[#B78F64] hover:text-[#382615] transition-all duration-200"
            >
              <span class="material-symbols-outlined text-base leading-none">edit</span>
              Editar
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const dogsStore = useDogsStore()
onMounted(() => dogsStore.fetchDogs())
</script>
