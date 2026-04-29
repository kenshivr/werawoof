<script setup lang="ts">
const authStore = useAuthStore()

onMounted(() => {
  authStore.restoreSession()
})

const handleLogout = async () => {
  authStore.logout()
  await navigateTo('/auth/login')
}
</script>

<template>
  <header class="fixed top-0 z-50 w-full bg-[#382615] shadow-xl">
    <div class="flex items-center justify-between w-full px-8 py-4">
      <NuxtLink to="/">
        <img
          :src="'/images/logo-horizontal.webp'"
          alt="WeraWoof"
          class="hidden md:block h-12 w-auto"
        />
        <img :src="'/images/logo-icon.webp'" alt="WeraWoof" class="md:hidden h-10 w-auto" />
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-8">
        <NuxtLink
          to="/app"
          class="text-sm font-medium tracking-wide text-white/80 hover:text-white transition-all duration-200 font-jakarta"
          >Swipe</NuxtLink
        >
        <NuxtLink
          to="/app/matches"
          class="text-sm font-medium tracking-wide text-white/80 hover:text-white transition-all duration-200 font-jakarta"
          >Matches</NuxtLink
        >
        <NuxtLink
          to="/app/dogs"
          class="text-sm font-medium tracking-wide text-white/80 hover:text-white transition-all duration-200 font-jakarta"
          >Mis Canes</NuxtLink
        >
        <NuxtLink
          to="/comunidad"
          class="text-sm font-medium tracking-wide text-white/80 hover:text-white transition-all duration-200 font-jakarta"
          >Comunidad</NuxtLink
        >
      </nav>

      <!-- Logueado -->
      <div v-if="authStore.isAuthenticated" class="flex items-center gap-3">
        <NuxtLink to="/app/profile" class="flex items-center gap-2.5 group">
          <span
            class="hidden md:block text-sm font-medium text-white/90 group-hover:text-white transition-colors font-jakarta truncate max-w-[120px]"
          >
            {{ authStore.user?.name }}
          </span>
          <div
            class="w-9 h-9 rounded-full overflow-hidden border-2 border-[#F4C07D]/60 bg-white/10 flex items-center justify-center shrink-0"
          >
            <img
              v-if="authStore.user?.avatar"
              :src="authStore.user.avatar"
              :alt="authStore.user.name"
              class="w-full h-full object-cover"
            />
            <span v-else class="material-symbols-outlined text-[#F4C07D] text-lg">person</span>
          </div>
        </NuxtLink>
        <button
          class="flex items-center justify-center text-white/50 hover:text-white/90 transition-colors"
          title="Cerrar sesión"
          @click="handleLogout"
        >
          <span class="material-symbols-outlined text-xl">logout</span>
        </button>
      </div>

      <!-- No logueado -->
      <NuxtLink
        v-else
        to="/auth/login"
        class="bg-primary-container text-on-primary-container font-medium text-sm tracking-wide px-6 py-2.5 rounded-2xl hover:opacity-90 transition-all duration-200 active:scale-95"
      >
        Comenzar
      </NuxtLink>
    </div>
  </header>
</template>
