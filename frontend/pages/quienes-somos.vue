<script setup lang="ts">
definePageMeta({ layout: false })
</script>

<template>
  <div
    class="bg-[#DBD8D0] text-on-background font-vietnam overflow-x-hidden min-h-screen flex flex-col"
  >
    <LayoutPublicHeader />

    <!-- Hero -->
    <section class="relative min-h-[560px] flex items-end overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img
          :src="'/images/horizontal.webp'"
          alt="Wera"
          class="w-full h-full object-cover object-[center_30%]"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-[#382615]/90 via-[#382615]/50 to-transparent"
        />
      </div>
      <div class="relative z-10 w-full max-w-7xl mx-auto px-8 pb-20 pt-40">
        <span
          class="inline-block px-4 py-1 bg-primary-container text-on-primary-container text-label-md font-label-md rounded-full mb-6 font-jakarta"
        >
          Nuestra historia
        </span>
        <h1 class="text-h1 font-h1 text-white font-jakarta leading-tight mb-4 max-w-3xl">
          Hecha con amor.<br />Inspirada en una patita.
        </h1>
        <p class="text-body-lg text-white/80 max-w-xl">
          WeraWoof nació de una pérdida, pero sobre todo de todo lo que una perrita pequeña fue
          capaz de dar.
        </p>
      </div>
    </section>

    <!-- Intro -->
    <section class="py-24 bg-[#DBD8D0]">
      <div class="max-w-7xl mx-auto px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span class="text-primary font-medium uppercase tracking-[0.2em] text-sm block mb-4"
              >El proyecto</span
            >
            <h2 class="text-h2 font-h2 text-on-surface font-jakarta mb-6">¿Qué es WeraWoof?</h2>
            <p class="text-body-lg text-on-surface-variant leading-relaxed mb-6">
              WeraWoof es una plataforma que conecta a dueños de canes para que sus peludos
              encuentren compañeros de juego, aventura y cariño. Como Tinder, pero para los que ya
              tienen dueño en el corazón.
            </p>
            <p class="text-body-md text-on-surface-variant leading-relaxed">
              Creemos que cada can merece tener una red de amigos tan grande como su energía, y que
              cada dueño merece una comunidad que entiende lo mucho que vale un can en la vida de
              una persona.
            </p>
          </div>
          <div class="relative h-[400px] rounded-3xl overflow-hidden shadow-xl">
            <img :src="'/images/piso.webp'" alt="WeraWoof" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#382615]/40 to-transparent" />
            <div class="absolute bottom-6 left-6 right-6">
              <div
                class="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/20"
              >
                <p class="text-white font-medium font-jakarta text-sm">
                  "Conectá patitas, creá recuerdos."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Historia de Wera -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-8">
        <div class="text-center mb-16">
          <span class="text-primary font-medium uppercase tracking-[0.2em] text-sm block mb-4"
            >La inspiración</span
          >
          <h2 class="text-h2 font-h2 text-on-surface font-jakarta">La historia de Wera</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
          <!-- Imagen placeholder Wera -->
          <div
            class="relative h-[480px] rounded-3xl overflow-hidden shadow-xl bg-surface-container order-2 md:order-1"
          >
            <img :src="'/images/bb.webp'" alt="Wera" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#382615]/60 to-transparent" />
            <div class="absolute bottom-6 left-6">
              <span
                class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20 font-jakarta"
              >
                <span class="material-symbols-outlined text-[#F4C07D] text-base">favorite</span>
                Wera & Canela
              </span>
            </div>
          </div>

          <div class="order-1 md:order-2">
            <p class="text-body-lg text-on-surface-variant leading-relaxed mb-6">
              Wera era la perrita de mi novia. Una compañera de 7 años llena de vida, carácter y ese
              amor incondicional que solo los canes saben dar. Cuando la conocí a ella, conocí
              también a Wera y a su hermana Canela.
            </p>
            <p class="text-body-md text-on-surface-variant leading-relaxed mb-6">
              Debo ser honesto: yo no siempre tuve una buena relación con los canes. Malas
              experiencias en mi infancia me hicieron mantener distancia. Pero Wera y Canela fueron
              distintas. Pacientes, cariñosas, sin juzgar. Me enseñaron, sin decir una palabra, que
              los canes no son una amenaza — son una de las cosas más bonitas que le pueden pasar a
              una persona.
            </p>
            <p class="text-body-md text-on-surface-variant leading-relaxed">
              Gracias a ellas y a mi novia, me volví a enamorar de los canes. Y ese amor cambió algo
              en mí.
            </p>
          </div>
        </div>

        <!-- La pérdida -->
        <div class="bg-[#382615] rounded-3xl p-10 md:p-16 text-white relative overflow-hidden">
          <span
            class="material-symbols-outlined absolute right-8 top-8 text-white/5 text-[180px] leading-none select-none"
            style="
              font-variation-settings:
                'FILL' 1,
                'wght' 400,
                'GRAD' 0,
                'opsz' 48;
            "
            >pets</span
          >
          <div class="relative z-10 max-w-2xl">
            <span
              class="inline-block px-4 py-1 bg-white/10 text-[#F4C07D] text-label-md font-label-md rounded-full mb-6 font-jakarta border border-white/10"
            >
              Su legado
            </span>
            <h3 class="text-h2 font-h2 font-jakarta mb-6 leading-tight">
              Wera ya no está,<br />pero su historia sigue.
            </h3>
            <p class="text-body-lg text-white/80 leading-relaxed mb-4">
              Su partida nos entristeció profundamente. Ese vacío que deja un can cuando se va es
              difícil de explicar si no lo has vivido, pero quien lo ha sentido sabe exactamente de
              qué se habla.
            </p>
            <p class="text-body-md text-white/70 leading-relaxed">
              Fue en ese momento cuando decidí que era hora de hacer algo que la honrara. De crear
              un espacio donde más personas pudieran vivir lo que yo viví con ella — esa conexión
              única entre humanos y canes que transforma la vida. WeraWoof lleva su nombre porque
              lleva su espíritu.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Sobre Brayan -->
    <section class="py-24 bg-[#DBD8D0]">
      <div class="max-w-7xl mx-auto px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span class="text-primary font-medium uppercase tracking-[0.2em] text-sm block mb-4"
              >El desarrollador</span
            >
            <h2 class="text-h2 font-h2 text-on-surface font-jakarta mb-2">Brayan Vidal</h2>
            <p class="text-body-md text-primary font-medium mb-6">
              Desarrollador de Software · FES Acatlán, UNAM
            </p>
            <p class="text-body-lg text-on-surface-variant leading-relaxed mb-6">
              Soy desarrollador de software egresado de la FES Acatlán. Con más de 2 años de
              experiencia profesional, he trabajado en múltiples proyectos personales y de clientes
              que me han permitido crecer técnicamente y entender que el mejor código es el que
              resuelve problemas reales.
            </p>
            <p class="text-body-md text-on-surface-variant leading-relaxed mb-8">
              WeraWoof es el proyecto más personal que he construido. No nació de una oportunidad de
              negocio ni de una clase — nació de una historia, de un amor y de querer hacer algo que
              importara.
            </p>
            <div class="flex flex-wrap gap-3">
              <span
                class="px-4 py-2 bg-white rounded-xl text-on-surface-variant text-sm font-medium shadow-sm"
                >Go · Gin</span
              >
              <span
                class="px-4 py-2 bg-white rounded-xl text-on-surface-variant text-sm font-medium shadow-sm"
                >Vue 3 · Nuxt</span
              >
              <span
                class="px-4 py-2 bg-white rounded-xl text-on-surface-variant text-sm font-medium shadow-sm"
                >PostgreSQL</span
              >
              <span
                class="px-4 py-2 bg-white rounded-xl text-on-surface-variant text-sm font-medium shadow-sm"
                >Redis</span
              >
            </div>
          </div>

          <!-- Stats / highlight cards -->
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-2">
              <span
                class="material-symbols-outlined text-primary text-3xl"
                style="
                  font-variation-settings:
                    'FILL' 1,
                    'wght' 400,
                    'GRAD' 0,
                    'opsz' 24;
                "
                >school</span
              >
              <p class="text-h3 font-h3 text-on-surface font-jakarta">FES Acatlán</p>
              <p class="text-body-md text-on-surface-variant">
                UNAM · Matemáticas Aplicadas y Computación
              </p>
            </div>
            <div class="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-2">
              <span
                class="material-symbols-outlined text-primary text-3xl"
                style="
                  font-variation-settings:
                    'FILL' 1,
                    'wght' 400,
                    'GRAD' 0,
                    'opsz' 24;
                "
                >work</span
              >
              <p class="text-h3 font-h3 text-on-surface font-jakarta">2 años</p>
              <p class="text-body-md text-on-surface-variant">Experiencia profesional</p>
            </div>
            <div class="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-2">
              <span
                class="material-symbols-outlined text-primary text-3xl"
                style="
                  font-variation-settings:
                    'FILL' 1,
                    'wght' 400,
                    'GRAD' 0,
                    'opsz' 24;
                "
                >folder_special</span
              >
              <p class="text-h3 font-h3 text-on-surface font-jakarta">Proyectos</p>
              <p class="text-body-md text-on-surface-variant">Personales y profesionales</p>
            </div>
            <div class="bg-[#382615] rounded-2xl p-6 shadow-sm flex flex-col gap-2">
              <span
                class="material-symbols-outlined text-[#F4C07D] text-3xl"
                style="
                  font-variation-settings:
                    'FILL' 1,
                    'wght' 400,
                    'GRAD' 0,
                    'opsz' 24;
                "
                >favorite</span
              >
              <p class="text-h3 font-h3 text-white font-jakarta">Hecho con</p>
              <p class="text-white/70 text-body-md">amor por Wera</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-24 bg-white">
      <div class="max-w-4xl mx-auto px-8 text-center">
        <span
          class="material-symbols-outlined text-primary text-5xl mb-6 block"
          style="
            font-variation-settings:
              'FILL' 1,
              'wght' 400,
              'GRAD' 0,
              'opsz' 48;
          "
          >pets</span
        >
        <h2 class="text-h1 font-h1 text-on-surface font-jakarta mb-6">
          Únete a la comunidad<br />que Wera inspiró
        </h2>
        <p class="text-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto">
          Cada conexión que se haga en WeraWoof es un poco de su legado viviendo en el mundo.
        </p>
        <NuxtLink
          to="/auth/register"
          class="inline-flex items-center gap-3 bg-[#F4C07D] text-[#382615] font-medium text-lg px-12 py-5 rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-200 font-jakarta"
        >
          Crear mi cuenta
          <span class="material-symbols-outlined">arrow_forward</span>
        </NuxtLink>
      </div>
    </section>

    <LayoutPublicFooter />
    <LayoutPublicBottomNav />
  </div>
</template>
