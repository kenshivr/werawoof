<script setup lang="ts">
const route = useRoute()

const isActive = (path: string) =>
  path === '/app/dogs'
    ? route.path.startsWith('/app/dogs') || route.path.startsWith('/app/swipe')
    : route.path.startsWith(path)
</script>

<template>
  <div class="min-h-screen bg-[#DBD8D0] flex flex-col">
    <LayoutPublicHeader />

    <!-- Paw decorations -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <span
        class="material-symbols-outlined absolute text-[#382615] opacity-[0.05] text-8xl top-40 left-[10%]"
        style="transform: rotate(-25deg)"
        >pets</span
      >
      <span
        class="material-symbols-outlined absolute text-[#382615] opacity-[0.05] text-5xl top-64 right-[15%]"
        style="transform: rotate(15deg)"
        >pets</span
      >
      <span
        class="material-symbols-outlined absolute text-[#382615] opacity-[0.05] text-9xl bottom-48 left-[20%]"
        style="transform: rotate(45deg)"
        >pets</span
      >
      <span
        class="material-symbols-outlined absolute text-[#382615] opacity-[0.05] text-6xl bottom-28 right-[5%]"
        style="transform: rotate(-10deg)"
        >pets</span
      >
      <span
        class="material-symbols-outlined absolute text-[#382615] opacity-[0.05] text-7xl top-1/2 left-[5%]"
        style="transform: rotate(180deg)"
        >pets</span
      >
    </div>

    <!-- Page content -->
    <main class="flex-1 pt-20 pb-20 md:pb-0 relative z-10">
      <slot />
    </main>

    <!-- Bottom nav (mobile only) -->
    <nav
      class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-white shadow-[0_-4px_20px_rgba(113,62,24,0.08)] rounded-t-3xl border-t border-[#DBD8D0]"
    >
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
    </nav>
  </div>
</template>
