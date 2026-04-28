<script setup lang="ts">
definePageMeta({ layout: false })

const authStore = useAuthStore()
authStore.restoreSession()

if (authStore.isAuthenticated) {
  await navigateTo('/app')
}
</script>

<template>
  <div class="bg-background text-on-background font-vietnam overflow-x-hidden">
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

    <main class="pt-20 pb-20 md:pb-0">
      <!-- Hero -->
      <section class="relative min-h-[870px] flex items-center overflow-hidden">
        <div class="absolute inset-0 z-0">
          <img
            :src="'/images/horizontal.jpeg'"
            alt="Wera, a golden-colored dog, sitting happily in a sunny park."
            class="w-full h-full object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#382615]/90 via-[#382615]/40 to-transparent"
          />
        </div>
        <div class="relative z-10 w-full max-w-7xl mx-auto px-8">
          <div class="max-w-2xl mx-auto md:mx-0 text-center md:text-left">
            <h1 class="text-h1 font-h1 text-white mb-6 font-jakarta">
              Encuentra al match perfecto para tu perro
            </h1>
            <p class="text-body-lg text-white/90 mb-10 leading-relaxed">
              Únete a la comunidad más chida para amantes de los perritos. Ya sea para jugar, salir
              a caminar o vivir nuevas aventuras, el mejor cuate de tu perro está a un swipe de
              distancia.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <NuxtLink
                to="/auth/register"
                class="bg-[#F4C07D] text-[#382615] font-medium text-lg px-10 py-5 rounded-2xl shadow-lg hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span> Comenzar </span>
                <span class="material-symbols-outlined">arrow_forward</span>
              </NuxtLink>
              <button
                class="hidden sm:flex border-2 border-white/30 bg-white/10 backdrop-blur-md text-white font-medium text-lg px-10 py-5 rounded-2xl hover:bg-white/20 transition-all duration-200 items-center justify-center"
              >
                Ver comunidad
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="py-xl bg-[#DBD8D0]">
        <div class="max-w-7xl mx-auto px-8">
          <div class="text-center mb-16">
            <span class="text-primary font-medium uppercase tracking-[0.2em] mb-4 block text-sm"
              >El Proceso</span
            >
            <h2 class="text-h2 font-h2 text-on-surface font-jakarta">
              Así de fácil es la felicidad
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div
              class="bg-white p-10 rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.08)] group hover:-translate-y-2 transition-all duration-300"
            >
              <div
                class="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary-container transition-colors duration-300"
              >
                <span class="material-symbols-outlined text-primary text-3xl">person_add</span>
              </div>
              <h3 class="text-h3 font-h3 text-on-surface mb-4 font-jakarta">1. Crea tu perfil</h3>
              <p class="text-body-md text-on-surface-variant">
                Cuéntanos sobre ti y tu peludo. Comparte su nivel de energía, sus juguetes favoritos
                y todo lo que lo hace único.
              </p>
            </div>
            <div
              class="bg-white p-10 rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.08)] group hover:-translate-y-2 transition-all duration-300"
            >
              <div
                class="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary-container transition-colors duration-300"
              >
                <span class="material-symbols-outlined text-primary text-3xl">swipe</span>
              </div>
              <h3 class="text-h3 font-h3 text-on-surface mb-4 font-jakarta">
                2. Swipe &amp; Conecta
              </h3>
              <p class="text-body-md text-on-surface-variant">
                Explora perritos y dueños de tu zona. Encuentra los que mejor se lleven con el tuyo.
              </p>
            </div>
            <div
              class="bg-white p-10 rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.08)] group hover:-translate-y-2 transition-all duration-300"
            >
              <div
                class="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary-container transition-colors duration-300"
              >
                <span class="material-symbols-outlined text-primary text-3xl">handshake</span>
              </div>
              <h3 class="text-h3 font-h3 text-on-surface mb-4 font-jakarta">3. ¡A juntarse!</h3>
              <p class="text-body-md text-on-surface-variant">
                Cuando hagan match, coordinen un encuentro seguro en un parque cercano. ¡Las colas
                no van a parar de moverse!
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Bento Grid -->
      <section class="py-xl bg-background">
        <div class="max-w-7xl mx-auto px-8">
          <div class="grid grid-cols-12 grid-rows-2 gap-6 h-auto md:h-[600px]">
            <div
              class="col-span-12 md:col-span-7 row-span-2 relative overflow-hidden rounded-2xl shadow-lg"
            >
              <img
                :src="'/images/hand.jpg'"
                alt="Wera playing with a playful expression."
                class="w-full h-full object-cover"
              />
              <div
                class="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-on-surface to-transparent text-white"
              >
                <div
                  class="bg-primary-container/20 backdrop-blur-sm px-4 py-1 rounded-full w-fit mb-4"
                >
                  <span class="text-[#F4C07D] font-medium text-sm">Favoritos de la zona</span>
                </div>
                <h3 class="text-h2 font-h2 mb-2 font-jakarta">Lugares Pet-Friendly</h3>
                <p class="text-body-md opacity-90 max-w-lg">
                  Descubre los mejores parques, cafés y senderos recomendados por la comunidad
                  WeraWoof.
                </p>
              </div>
            </div>
            <div
              class="col-span-12 md:col-span-5 row-span-1 bg-surface-container rounded-2xl p-8 flex flex-col justify-center"
            >
              <span
                class="material-symbols-outlined text-primary text-4xl mb-4"
                style="
                  font-variation-settings:
                    'FILL' 1,
                    'wght' 400,
                    'GRAD' 0,
                    'opsz' 24;
                "
                >verified</span
              >
              <h3 class="text-h3 font-h3 text-on-surface mb-2 font-jakarta">
                Miembros Verificados
              </h3>
              <p class="text-body-md text-on-surface-variant">
                Nuestra comunidad garantiza que cada miembro esté verificado para un ambiente de
                juego más seguro.
              </p>
            </div>
            <div
              class="col-span-12 md:col-span-5 row-span-1 bg-[#382615] rounded-2xl p-8 flex items-center justify-between group cursor-pointer overflow-hidden relative"
            >
              <div class="z-10">
                <h3 class="text-h3 font-h3 text-[#F4C07D] mb-2 font-jakarta">Únete al Club</h3>
                <p class="text-body-md text-white/70">Eventos exclusivos y acceso anticipado.</p>
              </div>
              <span
                class="material-symbols-outlined text-[#F4C07D] text-6xl opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-300"
                >pets</span
              >
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-xl bg-primary text-on-primary">
        <div class="max-w-4xl mx-auto px-8 text-center">
          <h2 class="text-h1 font-h1 mb-6 font-jakarta">¿Listo para más colas meneando?</h2>
          <p class="text-body-lg mb-10 opacity-90">
            Empieza hoy y encuentra al cuate que tu perro ha estado esperando.
          </p>
          <NuxtLink
            to="/auth/register"
            class="inline-block bg-[#F4C07D] text-[#382615] font-medium text-lg px-12 py-5 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-200"
          >
            Únete a WeraWoof
          </NuxtLink>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <LayoutPublicFooter />

    <LayoutPublicBottomNav />
  </div>
</template>
