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
    <!-- Nav -->
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

    <main class="pt-20 pb-20 md:pb-0">
      <!-- Hero -->
      <section class="relative min-h-[870px] flex items-center overflow-hidden">
        <div class="absolute inset-0 z-0">
          <img
            :src="'/images/floor.jpg'"
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
              Únete a la comunidad más chida para amantes de los perritos. Ya sea para jugar,
              salir a caminar o vivir nuevas aventuras, el mejor cuate de tu perro está a un
              swipe de distancia.
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
            <h2 class="text-h2 font-h2 text-on-surface font-jakarta">Así de fácil es la felicidad</h2>
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
                Cuéntanos sobre ti y tu peludo. Comparte su nivel de energía, sus juguetes
                favoritos y todo lo que lo hace único.
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
                Explora perritos y dueños de tu zona. Encuentra los que mejor se lleven con
                el tuyo.
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
                Cuando hagan match, coordinen un encuentro seguro en un parque cercano.
                ¡Las colas no van a parar de moverse!
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
                  Descubre los mejores parques, cafés y senderos recomendados por la comunidad WeraWoof.
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
              <h3 class="text-h3 font-h3 text-on-surface mb-2 font-jakarta">Miembros Verificados</h3>
              <p class="text-body-md text-on-surface-variant">
                Nuestra comunidad garantiza que cada miembro esté verificado para un ambiente de juego más seguro.
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
    <footer class="bg-[#382615] text-white pt-xl pb-24 md:pb-12">
      <div class="max-w-7xl mx-auto px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div class="col-span-1">
            <div class="text-3xl font-black text-[#F4C07D] italic mb-6 font-jakarta">WeraWoof</div>
            <p class="text-white/60 text-body-md mb-6 leading-relaxed">
              Construyendo la comunidad más chida de amantes de los perritos, enfocada en
              una convivencia segura y llena de alegría.
            </p>
            <div class="flex gap-4">
              <a
                href="#"
                class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <span class="material-symbols-outlined text-sm">public</span>
              </a>
              <a
                href="#"
                class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <span class="material-symbols-outlined text-sm">share</span>
              </a>
            </div>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-6 font-jakarta">Plataforma</h4>
            <ul class="space-y-4 text-white/60 text-body-md">
              <li><a href="#" class="hover:text-[#F4C07D] transition-colors">Encontrar Matches</a></li>
              <li>
                <a href="#" class="hover:text-[#F4C07D] transition-colors">Seguridad</a>
              </li>
              <li><a href="#" class="hover:text-[#F4C07D] transition-colors">Beneficios Premium</a></li>
              <li>
                <a href="#" class="hover:text-[#F4C07D] transition-colors">Historias de Éxito</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-6 font-jakarta">Empresa</h4>
            <ul class="space-y-4 text-white/60 text-body-md">
              <li><a href="#" class="hover:text-[#F4C07D] transition-colors">Quiénes Somos</a></li>
              <li><a href="#" class="hover:text-[#F4C07D] transition-colors">Trabaja con Nosotros</a></li>
              <li><a href="#" class="hover:text-[#F4C07D] transition-colors">Contacto</a></li>
              <li><a href="#" class="hover:text-[#F4C07D] transition-colors">Prensa</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-6 font-jakarta">Boletín</h4>
            <p class="text-white/60 text-body-md mb-4">Mantente al día con eventos y tips.</p>
            <div class="flex">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                class="bg-white/10 border border-white/20 rounded-l-xl px-4 py-3 w-full outline-none text-sm focus:ring-1 focus:ring-[#F4C07D]"
              />
              <button
                class="bg-[#F4C07D] text-[#382615] px-4 rounded-r-xl font-bold hover:opacity-90 transition-opacity"
              >
                <span class="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
        <div
          class="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm"
        >
          <div class="flex gap-8">
            <a href="#" class="hover:text-white transition-colors">Aviso de Privacidad</a>
            <a href="#" class="hover:text-white transition-colors">Términos de Servicio</a>
          </div>
          <p>© 2026 WeraWoof. Todos los meneos reservados.</p>
        </div>
      </div>
    </footer>

    <!-- Bottom Nav (mobile only) -->
    <nav
      class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 py-3 bg-white shadow-[0_-4px_20px_rgba(113,62,24,0.08)] rounded-t-3xl border-t border-[#DBD8D0]"
    >
      <NuxtLink to="/app" class="flex flex-col items-center justify-center text-[#713E18]/50">
        <span class="material-symbols-outlined text-2xl">pets</span>
        <span class="text-[10px] font-bold uppercase tracking-tighter mt-1 font-jakarta"
          >Swipe</span
        >
      </NuxtLink>
      <NuxtLink
        to="/app/matches"
        class="flex flex-col items-center justify-center text-[#713E18]/50"
      >
        <span class="material-symbols-outlined text-2xl">favorite</span>
        <span class="text-[10px] font-bold uppercase tracking-tighter mt-1 font-jakarta"
          >Matches</span
        >
      </NuxtLink>
      <NuxtLink to="/app/dogs" class="flex flex-col items-center justify-center text-[#713E18]/50">
        <span class="material-symbols-outlined text-2xl">house</span>
        <span class="text-[10px] font-bold uppercase tracking-tighter mt-1 font-jakarta"
          >Mis Perros</span
        >
      </NuxtLink>
      <NuxtLink
        to="/app/profile"
        class="flex flex-col items-center justify-center text-[#713E18]/50"
      >
        <span class="material-symbols-outlined text-2xl">person</span>
        <span class="text-[10px] font-bold uppercase tracking-tighter mt-1 font-jakarta"
          >Perfil</span
        >
      </NuxtLink>
    </nav>
  </div>
</template>
