<script setup lang="ts">
import type { Dog } from '~/types/dog'

const props = defineProps<{
  myDog: Dog
  otherDog: Dog
  matchId: string | number
}>()

const emit = defineEmits<{
  message: []
  continue: []
  home: []
}>()

const myPhoto = computed(() => props.myDog.photos?.[0] ?? '')
const otherPhoto = computed(() => props.otherDog.photos?.[0] ?? '')
</script>

<template>
  <Transition name="celebration">
    <div class="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden paw-bg">

      <!-- Fondo oscuro -->
      <div class="absolute inset-0 bg-[#2a1c0e]" />

      <!-- Iconos decorativos flotantes -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <span class="material-symbols-outlined absolute top-10 left-[12%] text-[#F4C07D]/20 text-7xl -rotate-12 float-icon">pets</span>
        <span class="material-symbols-outlined absolute bottom-24 left-[8%] text-[#F4C07D]/10 text-9xl rotate-45 float-icon-slow">eco</span>
        <span class="material-symbols-outlined absolute top-1/4 right-[8%] text-[#F4C07D]/20 text-8xl rotate-12 float-icon" style="font-variation-settings: 'FILL' 1">favorite</span>
        <span class="material-symbols-outlined absolute bottom-1/4 right-[12%] text-[#F4C07D]/15 text-6xl -rotate-6 float-icon-slow">pets</span>
        <span class="material-symbols-outlined absolute top-1/3 left-[5%] text-[#F4C07D]/10 text-5xl rotate-12 float-icon">star</span>
        <span class="material-symbols-outlined absolute bottom-1/3 right-[5%] text-[#F4C07D]/10 text-5xl -rotate-12 float-icon-slow" style="font-variation-settings: 'FILL' 1">favorite</span>
      </div>

      <!-- Contenido principal -->
      <div class="relative z-10 flex flex-col items-center text-center px-8 max-w-2xl w-full">

        <!-- Fotos solapadas -->
        <div class="flex items-center justify-center mb-10 relative">
          <!-- Mi perro (izquierda) -->
          <div class="relative w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-[#F4C07D] shadow-2xl overflow-hidden z-20 -mr-10 md:-mr-14 dog-card-left">
            <img v-if="myPhoto" :src="myPhoto" :alt="myDog.name" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-[#3d2510] flex items-center justify-center">
              <span class="material-symbols-outlined text-[#F4C07D] text-5xl">pets</span>
            </div>
          </div>

          <!-- Corazón central -->
          <div class="absolute z-30 bg-[#F4C07D] w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-xl heart-bounce" style="top: 50%; transform: translateY(-60%)">
            <span class="material-symbols-outlined text-[#382615] text-3xl md:text-4xl" style="font-variation-settings: 'FILL' 1">favorite</span>
          </div>

          <!-- Otro perro (derecha) -->
          <div class="relative w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-[#F4C07D] shadow-2xl overflow-hidden z-10 dog-card-right">
            <img v-if="otherPhoto" :src="otherPhoto" :alt="otherDog.name" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-[#3d2510] flex items-center justify-center">
              <span class="material-symbols-outlined text-[#F4C07D] text-5xl">pets</span>
            </div>
          </div>
        </div>

        <!-- Título -->
        <h1 class="text-4xl md:text-6xl font-extrabold text-[#F4C07D] font-jakarta mb-4 drop-shadow-md title-pop">
          ¡Es un Match! <span class="inline-block">🐾</span>
        </h1>

        <!-- Subtítulo -->
        <p class="text-white/80 text-base md:text-lg mb-10 max-w-sm leading-relaxed">
          <strong class="text-white">{{ myDog.name }}</strong> y <strong class="text-white">{{ otherDog.name }}</strong>
          encontraron un nuevo amigo de juego. ¡Organicen una cita en el parque!
        </p>

        <!-- Botones -->
        <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            class="bg-[#F4C07D] text-[#382615] font-bold font-jakarta px-10 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
            @click="emit('message')"
          >
            <span class="material-symbols-outlined text-xl">chat</span>
            Enviar Mensaje
          </button>
          <button
            class="border-2 border-[#B78F64] text-[#F4C07D] font-bold font-jakarta px-10 py-4 rounded-2xl flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200"
            @click="emit('continue')"
          >
            <span class="material-symbols-outlined text-xl">swipe</span>
            Seguir Explorando
          </button>
        </div>

        <!-- Link menor -->
        <button
          class="mt-8 text-white/40 hover:text-white/70 transition-colors text-xs uppercase tracking-widest font-bold"
          @click="emit('home')"
        >
          No por ahora, llévame al inicio
        </button>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.paw-bg {
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM5 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm15 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-7 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0z' fill='%23F4C07D' fill-opacity='0.04' fill-rule='evenodd'/%3E%3C/svg%3E");
}

/* Entrada de la celebración */
.celebration-enter-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.celebration-leave-active {
  transition: opacity 0.3s ease;
}
.celebration-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.celebration-leave-to {
  opacity: 0;
}

/* Fotos con entrada animada */
.dog-card-left {
  animation: slideInLeft 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
}
.dog-card-right {
  animation: slideInRight 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.35s both;
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-40px) rotate(-8deg); }
  to   { opacity: 1; transform: translateX(0) rotate(0); }
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(40px) rotate(8deg); }
  to   { opacity: 1; transform: translateX(0) rotate(0); }
}

/* Corazón pulsante */
.heart-bounce {
  animation: heartPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both;
}
@keyframes heartPop {
  from { opacity: 0; transform: translateY(-60%) scale(0); }
  to   { opacity: 1; transform: translateY(-60%) scale(1); }
}

/* Título con pop */
.title-pop {
  animation: titlePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s both;
}
@keyframes titlePop {
  from { opacity: 0; transform: translateY(10px) scale(0.9); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* Iconos flotantes */
.float-icon {
  animation: floatA 6s ease-in-out infinite;
}
.float-icon-slow {
  animation: floatB 8s ease-in-out infinite;
}
@keyframes floatA {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-12px); }
}
@keyframes floatB {
  0%, 100% { transform: translateY(0) rotate(45deg); }
  50%       { transform: translateY(-16px) rotate(45deg); }
}
</style>
