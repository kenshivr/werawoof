<template>
  <div
    class="bg-[#DBD8D0] text-on-background font-vietnam overflow-x-hidden min-h-screen flex flex-col"
  >
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

    <!-- Main content -->
    <main class="flex-1 flex items-center justify-center pt-28 pb-12 px-6 relative z-10">
      <div class="max-w-2xl w-full text-center flex flex-col items-center gap-6">
        <h1
          class="text-[32px] md:text-[48px] font-extrabold text-[#382615] font-jakarta leading-tight tracking-tight"
        >
          ¡Ups! Esta huella no lleva a ningún lado.
        </h1>

        <p class="text-lg text-[#7d571e] font-vietnam max-w-md leading-relaxed">
          La página que buscás se perdió en el parque.<br class="hidden sm:block" />
          Pero tu próximo match te está esperando.
        </p>

        <div class="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <button
            class="w-full sm:w-auto bg-[#F4C07D] text-[#382615] px-10 py-4 rounded-2xl font-bold font-jakarta flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 active:scale-95"
            @click="clearError({ redirect: '/' })"
          >
            Volver al inicio
          </button>
          <button
            class="w-full sm:w-auto border-2 border-[#7d571e] text-[#7d571e] px-10 py-4 rounded-2xl font-bold font-jakarta flex items-center justify-center gap-2 hover:bg-[#7d571e]/5 hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
            @click="clearError({ redirect: '/app/dogs' })"
          >
            Ver mis Canes
          </button>
        </div>
      </div>
    </main>

    <LayoutPublicFooter />

    <!-- Bottom nav mobile -->
    <nav
      class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-white shadow-[0_-4px_20px_rgba(113,62,24,0.08)] rounded-t-3xl border-t border-[#DBD8D0]"
    >
      <button
        class="flex flex-col items-center justify-center px-4 py-2 text-[#713E18]/50"
        @click="clearError({ redirect: '/' })"
      >
        <span class="material-symbols-outlined">home</span>
        <span class="text-[10px] font-bold uppercase tracking-tighter mt-0.5 font-jakarta"
          >Inicio</span
        >
      </button>
      <button
        class="flex flex-col items-center justify-center px-4 py-2 text-[#713E18]/50"
        @click="clearError({ redirect: '/app' })"
      >
        <span class="material-symbols-outlined">pets</span>
        <span class="text-[10px] font-bold uppercase tracking-tighter mt-0.5 font-jakarta"
          >Explorar</span
        >
      </button>
      <button
        class="flex flex-col items-center justify-center px-4 py-2 text-[#713E18]/50"
        @click="clearError({ redirect: '/app/dogs' })"
      >
        <span class="material-symbols-outlined">house</span>
        <span class="text-[10px] font-bold uppercase tracking-tighter mt-0.5 font-jakarta"
          >Mis Canes</span
        >
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
defineProps<{ error: { statusCode: number; message: string } }>()
</script>
