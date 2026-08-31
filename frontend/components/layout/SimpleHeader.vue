<template>
  <header class="fixed top-0 z-50 w-full bg-[#382615] shadow-xl">
    <div class="flex items-center justify-between w-full max-w-7xl mx-auto px-8 py-4">
      <NuxtLink to="/">
        <picture>
          <source
            media="(min-width: 768px)"
            :srcset="'/images/logo-horizontal.webp'"
            width="490"
            height="140"
          />
          <img
            :src="'/images/logo-icon.webp'"
            alt="WeraWoof"
            class="h-10 md:h-12 w-auto"
            width="112"
            height="80"
          />
        </picture>
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
