<script setup lang="ts">
const authStore = useAuthStore()
const route = useRoute()

const isActive = (path: string) =>
  path === '/app/dogs'
    ? route.path.startsWith('/app/dogs') || route.path.startsWith('/app/swipe')
    : route.path.startsWith(path)
</script>

<template>
  <nav
    class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-white shadow-[0_-4px_20px_rgba(113,62,24,0.08)] rounded-t-3xl border-t border-[#DBD8D0]"
  >
    <!-- Logged in: app nav -->
    <template v-if="authStore.isAuthenticated">
      <NuxtLink
        to="/app/dogs"
        class="flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-200"
        :class="
          isActive('/app/dogs') ? 'bg-[#F4C07D] text-[#382615] shadow-sm' : 'text-[#713E18]/50'
        "
      >
        <span
          class="material-symbols-outlined"
          :style="isActive('/app/dogs') ? 'font-variation-settings: \'FILL\' 1' : ''"
          >pets</span
        >
        <span class="text-[10px] font-bold uppercase tracking-tighter mt-0.5 font-jakarta"
          >Explorar</span
        >
      </NuxtLink>

      <NuxtLink
        to="/app/matches"
        class="flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-200"
        :class="
          isActive('/app/matches') ? 'bg-[#F4C07D] text-[#382615] shadow-sm' : 'text-[#713E18]/50'
        "
      >
        <span
          class="material-symbols-outlined"
          :style="isActive('/app/matches') ? 'font-variation-settings: \'FILL\' 1' : ''"
          >favorite</span
        >
        <span class="text-[10px] font-bold uppercase tracking-tighter mt-0.5 font-jakarta"
          >Matches</span
        >
      </NuxtLink>

      <NuxtLink
        to="/app/dogs"
        class="flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-200"
        :class="
          isActive('/app/dogs') ? 'bg-[#F4C07D] text-[#382615] shadow-sm' : 'text-[#713E18]/50'
        "
      >
        <span class="material-symbols-outlined">house</span>
        <span class="text-[10px] font-bold uppercase tracking-tighter mt-0.5 font-jakarta"
          >Mis Canes</span
        >
      </NuxtLink>

      <NuxtLink
        to="/app/profile"
        class="flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-200"
        :class="
          isActive('/app/profile') ? 'bg-[#F4C07D] text-[#382615] shadow-sm' : 'text-[#713E18]/50'
        "
      >
        <span class="material-symbols-outlined">person</span>
        <span class="text-[10px] font-bold uppercase tracking-tighter mt-0.5 font-jakarta"
          >Perfil</span
        >
      </NuxtLink>
    </template>

    <!-- Not logged in: public nav -->
    <template v-else>
      <NuxtLink
        to="/"
        class="flex flex-col items-center justify-center text-[#713E18]/50 hover:text-[#713E18] transition-colors"
        active-class="!text-[#713E18]"
      >
        <span class="material-symbols-outlined text-2xl">home</span>
        <span class="text-[10px] font-bold uppercase tracking-tighter mt-1 font-jakarta"
          >Inicio</span
        >
      </NuxtLink>

      <NuxtLink
        to="/quienes-somos"
        class="flex flex-col items-center justify-center text-[#713E18]/50 hover:text-[#713E18] transition-colors"
        active-class="!text-[#713E18]"
      >
        <span class="material-symbols-outlined text-2xl">info</span>
        <span class="text-[10px] font-bold uppercase tracking-tighter mt-1 font-jakarta"
          >Nosotros</span
        >
      </NuxtLink>

      <NuxtLink
        to="/contacto"
        class="flex flex-col items-center justify-center text-[#713E18]/50 hover:text-[#713E18] transition-colors"
        active-class="!text-[#713E18]"
      >
        <span class="material-symbols-outlined text-2xl">mail</span>
        <span class="text-[10px] font-bold uppercase tracking-tighter mt-1 font-jakarta"
          >Contacto</span
        >
      </NuxtLink>

      <NuxtLink
        to="/auth/login"
        class="flex flex-col items-center justify-center text-[#713E18]/50 hover:text-[#713E18] transition-colors"
        active-class="!text-[#713E18]"
      >
        <span class="material-symbols-outlined text-2xl">login</span>
        <span class="text-[10px] font-bold uppercase tracking-tighter mt-1 font-jakarta"
          >Entrar</span
        >
      </NuxtLink>
    </template>
  </nav>
</template>
