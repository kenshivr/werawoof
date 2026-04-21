<template>
  <div class="min-h-screen bg-white flex flex-col">
    <nav class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <span class="text-xl font-bold text-orange-500">WeraWoof 🐾</span>
      <div class="flex items-center gap-4">
        <NuxtLink to="/app" class="text-gray-600 hover:text-orange-500 text-sm font-medium"
          >Swipe</NuxtLink
        >
        <NuxtLink to="/app/matches" class="text-gray-600 hover:text-orange-500 text-sm font-medium"
          >Matches</NuxtLink
        >
        <NuxtLink to="/app/dogs" class="text-gray-600 hover:text-orange-500 text-sm font-medium"
          >Mis perros</NuxtLink
        >
        <NuxtLink to="/app/profile" class="text-gray-600 hover:text-orange-500 text-sm font-medium"
          >Perfil</NuxtLink
        >
        <button class="text-sm text-red-500 hover:text-red-700 font-medium" @click="handleLogout">
          Salir
        </button>
      </div>
    </nav>
    <main class="flex-1 p-4">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const handleLogout = async () => {
  authStore.logout()
  await navigateTo('/auth/login')
}
</script>
