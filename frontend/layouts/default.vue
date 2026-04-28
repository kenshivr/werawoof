<template>
  <div class="min-h-screen bg-[#DBD8D0] flex flex-col items-center justify-center p-6 md:p-xl">
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
    <div class="relative z-10 w-full flex flex-col items-center justify-center">
      <slot />
    </div>
  </div>
</template>
