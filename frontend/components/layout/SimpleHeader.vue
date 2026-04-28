<template>
  <header class="fixed top-0 z-50 w-full bg-[#382615] shadow-xl">
    <div class="flex items-center justify-between w-full max-w-7xl mx-auto px-8 py-4">
      <NuxtLink to="/">
        <img
          :src="'/images/logo-horizontal.png'"
          alt="WeraWoof"
          class="hidden md:block h-12 w-auto"
        />
        <img :src="'/images/logo-icon.png'" alt="WeraWoof" class="md:hidden h-10 w-auto" />
      </NuxtLink>
      <NuxtLink
        to="/"
        class="text-sm font-medium text-white/80 hover:text-white transition-colors font-jakarta flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-base">arrow_back</span>
        Volver al inicio
      </NuxtLink>
    </div>
  </header>
</template>
