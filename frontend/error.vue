<template>
  <div class="bg-[#DBD8D0] text-on-background font-vietnam overflow-x-hidden min-h-screen flex flex-col">

    <!-- Header -->
    <header class="fixed top-0 z-50 w-full bg-[#382615] shadow-xl">
      <div class="flex items-center justify-between w-full max-w-7xl mx-auto px-8 py-4">
        <NuxtLink to="/">
          <img :src="'/images/logo-horizontal.png'" alt="WeraWoof" class="hidden md:block h-12 w-auto" />
          <img :src="'/images/logo-icon.png'" alt="WeraWoof" class="md:hidden h-10 w-auto" />
        </NuxtLink>
        <nav class="hidden md:flex items-center gap-8">
          <NuxtLink to="/app" class="text-sm font-medium tracking-wide text-white/80 hover:text-white transition-all duration-200 font-jakarta">Explorar</NuxtLink>
          <NuxtLink to="/app/matches" class="text-sm font-medium tracking-wide text-white/80 hover:text-white transition-all duration-200 font-jakarta">Matches</NuxtLink>
          <NuxtLink to="/app/dogs" class="text-sm font-medium tracking-wide text-white/80 hover:text-white transition-all duration-200 font-jakarta">Mis Perros</NuxtLink>
        </nav>
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/auth/register"
            class="bg-primary-container text-on-primary-container font-medium text-sm tracking-wide px-6 py-2.5 rounded-2xl hover:opacity-90 transition-all duration-200 active:scale-95"
          >
            Comenzar
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Paw decorations -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <span class="material-symbols-outlined absolute text-[#382615] opacity-[0.05] text-8xl top-40 left-[10%]" style="transform: rotate(-25deg)">pets</span>
      <span class="material-symbols-outlined absolute text-[#382615] opacity-[0.05] text-5xl top-64 right-[15%]" style="transform: rotate(15deg)">pets</span>
      <span class="material-symbols-outlined absolute text-[#382615] opacity-[0.05] text-9xl bottom-48 left-[20%]" style="transform: rotate(45deg)">pets</span>
      <span class="material-symbols-outlined absolute text-[#382615] opacity-[0.05] text-6xl bottom-28 right-[5%]" style="transform: rotate(-10deg)">pets</span>
      <span class="material-symbols-outlined absolute text-[#382615] opacity-[0.05] text-7xl top-1/2 left-[5%]" style="transform: rotate(180deg)">pets</span>
    </div>

    <!-- Main content -->
    <main class="flex-1 flex items-center justify-center pt-28 pb-12 px-6 relative z-10">
      <div class="max-w-2xl w-full text-center flex flex-col items-center gap-6">

        <h1 class="text-[32px] md:text-[48px] font-extrabold text-[#382615] font-jakarta leading-tight tracking-tight">
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
            <span class="material-symbols-outlined">home</span>
            Volver al inicio
          </button>
          <button
            class="w-full sm:w-auto border-2 border-[#7d571e] text-[#7d571e] px-10 py-4 rounded-2xl font-bold font-jakarta flex items-center justify-center gap-2 hover:bg-[#7d571e]/5 hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
            @click="clearError({ redirect: '/app/dogs' })"
          >
            <span class="material-symbols-outlined">pets</span>
            Ver mis perros
          </button>
        </div>

      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-[#382615] text-white pt-xl pb-24 md:pb-12 relative z-10">
      <div class="max-w-7xl mx-auto px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div class="col-span-1">
            <div class="text-3xl font-black text-[#F4C07D] italic mb-6 font-jakarta">WeraWoof</div>
            <p class="text-white/60 text-body-md mb-6 leading-relaxed">
              Cultivando una comunidad de amantes de los perros enfocada en la socialización segura y alegre.
            </p>
            <div class="flex gap-4">
              <a href="#" class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                <span class="material-symbols-outlined text-sm">public</span>
              </a>
              <a href="#" class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                <span class="material-symbols-outlined text-sm">share</span>
              </a>
            </div>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-6 font-jakarta">Plataforma</h4>
            <ul class="space-y-4 text-white/60 text-body-md">
              <li><NuxtLink to="/app" class="hover:text-[#F4C07D] transition-colors">Explorar</NuxtLink></li>
              <li><NuxtLink to="/app/matches" class="hover:text-[#F4C07D] transition-colors">Matches</NuxtLink></li>
              <li><NuxtLink to="/app/dogs" class="hover:text-[#F4C07D] transition-colors">Mis Perros</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-6 font-jakarta">Empresa</h4>
            <ul class="space-y-4 text-white/60 text-body-md">
              <li><a href="#" class="hover:text-[#F4C07D] transition-colors">Sobre nosotros</a></li>
              <li><a href="#" class="hover:text-[#F4C07D] transition-colors">Contacto</a></li>
              <li><a href="#" class="hover:text-[#F4C07D] transition-colors">Press Kit</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-6 font-jakarta">Newsletter</h4>
            <p class="text-white/60 text-body-md mb-4">Novedades y eventos para vos y tu perro.</p>
            <div class="flex">
              <input
                type="email"
                placeholder="Tu email"
                class="bg-white/10 border border-white/20 rounded-l-xl px-4 py-3 w-full outline-none text-sm focus:ring-1 focus:ring-[#F4C07D]"
              />
              <button class="bg-[#F4C07D] text-[#382615] px-4 rounded-r-xl font-bold hover:opacity-90 transition-opacity">
                <span class="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
        <div class="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm">
          <div class="flex gap-8">
            <a href="#" class="hover:text-white transition-colors">Privacidad</a>
            <a href="#" class="hover:text-white transition-colors">Términos</a>
            <a href="#" class="hover:text-white transition-colors">Contacto</a>
          </div>
          <p>© 2026 WeraWoof — Conectá patitas, creá recuerdos.</p>
        </div>
      </div>
    </footer>

    <!-- Bottom nav mobile -->
    <nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-white shadow-[0_-4px_20px_rgba(113,62,24,0.08)] rounded-t-3xl border-t border-[#DBD8D0]">
      <button class="flex flex-col items-center justify-center px-4 py-2 text-[#713E18]/50" @click="clearError({ redirect: '/' })">
        <span class="material-symbols-outlined">home</span>
        <span class="text-[10px] font-bold uppercase tracking-tighter mt-0.5 font-jakarta">Inicio</span>
      </button>
      <button class="flex flex-col items-center justify-center px-4 py-2 text-[#713E18]/50" @click="clearError({ redirect: '/app' })">
        <span class="material-symbols-outlined">pets</span>
        <span class="text-[10px] font-bold uppercase tracking-tighter mt-0.5 font-jakarta">Explorar</span>
      </button>
      <button class="flex flex-col items-center justify-center px-4 py-2 text-[#713E18]/50" @click="clearError({ redirect: '/app/dogs' })">
        <span class="material-symbols-outlined">house</span>
        <span class="text-[10px] font-bold uppercase tracking-tighter mt-0.5 font-jakarta">Mis Perros</span>
      </button>
    </nav>

  </div>
</template>

<script setup lang="ts">
defineProps<{ error: { statusCode: number; message: string } }>()
</script>
