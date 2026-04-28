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
          >Mis Perros</NuxtLink
        >
      </nav>

      <NuxtLink
        to="/auth/login"
        class="bg-primary-container text-on-primary-container font-medium text-sm tracking-wide px-6 py-2.5 rounded-2xl hover:opacity-90 transition-all duration-200 active:scale-95"
      >
        Comenzar
      </NuxtLink>
    </div>
  </header>
</template>
