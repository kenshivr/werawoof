<script setup lang="ts">
const authStore = useAuthStore()
</script>

<template>
  <nav
    class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 py-3 bg-white shadow-[0_-4px_20px_rgba(113,62,24,0.08)] rounded-t-3xl border-t border-[#DBD8D0]"
  >
    <NuxtLink
      to="/"
      class="flex flex-col items-center justify-center text-[#713E18]/50 hover:text-[#713E18] transition-colors"
      active-class="!text-[#713E18]"
    >
      <span class="material-symbols-outlined text-2xl">home</span>
      <span class="text-[10px] font-bold uppercase tracking-tighter mt-1 font-jakarta">Inicio</span>
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
      v-if="authStore.isAuthenticated"
      to="/app/profile"
      class="flex flex-col items-center justify-center text-[#713E18]/50 hover:text-[#713E18] transition-colors"
      active-class="!text-[#713E18]"
    >
      <span class="material-symbols-outlined text-2xl">person</span>
      <span class="text-[10px] font-bold uppercase tracking-tighter mt-1 font-jakarta">Perfil</span>
    </NuxtLink>
    <NuxtLink
      v-else
      to="/auth/login"
      class="flex flex-col items-center justify-center text-[#713E18]/50 hover:text-[#713E18] transition-colors"
      active-class="!text-[#713E18]"
    >
      <span class="material-symbols-outlined text-2xl">login</span>
      <span class="text-[10px] font-bold uppercase tracking-tighter mt-1 font-jakarta">Entrar</span>
    </NuxtLink>
  </nav>
</template>
