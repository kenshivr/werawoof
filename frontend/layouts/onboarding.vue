<template>
  <div class="min-h-screen bg-[#DBD8D0] flex flex-col">
    <header class="bg-[#382615] shadow-xl sticky top-0 z-50">
      <div class="flex justify-between items-center px-8 py-4 w-full max-w-7xl mx-auto">
        <span class="text-2xl font-black text-[#F4C07D] italic font-jakarta">WeraWoof</span>
        <NuxtLink
          to="/app/profile"
          class="w-10 h-10 rounded-full border-2 border-[#F4C07D]/40 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
        >
          <span class="material-symbols-outlined text-[#F4C07D]">person</span>
        </NuxtLink>
      </div>
    </header>
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
