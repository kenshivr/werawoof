<script setup lang="ts">
import type { Coords } from '~/stores/location'

/* Punto del dueño + radio de búsqueda. No guarda nada: el padre persiste
   ambos con "Guardar cambios" (v-model:coords y v-model:radius). */
defineProps<{ coords: Coords | null; radius: number }>()
const emit = defineEmits<{
  'update:coords': [Coords | null]
  'update:radius': [number]
  /** "Cuauhtémoc, Ciudad de México": el padre lo usa para llenar Ciudad si está vacía */
  city: [string]
}>()

const locationStore = useLocationStore()
const locating = ref(false)
const describing = ref(false)
/* Margen de error en metros que reporta el navegador; solo se conoce
   justo después de ubicarse (GPS ≈ decenas de metros, WiFi/IP ≈ km). */
const accuracy = ref<number | null>(null)
const error = ref('')
/* Falló solo la dirección legible (no el punto): aviso suave, no rojo */
const softError = ref('')

const onRadiusInput = (e: Event) => {
  emit('update:radius', Number((e.target as HTMLInputElement).value))
}

const clear = () => {
  accuracy.value = null
  emit('update:coords', null)
}

const locate = async () => {
  error.value = ''
  softError.value = ''
  locating.value = true
  try {
    const pos = await locationStore.locate()
    accuracy.value = pos.accuracy
    const point = { lat: pos.lat, lng: pos.lng }
    emit('update:coords', point)

    /* La dirección legible es un extra: si falla, el punto igual sirve */
    describing.value = true
    try {
      const { label, city } = await locationStore.describe(point)
      emit('update:coords', { ...point, label })
      emit('city', city)
    } catch {
      softError.value =
        'No pudimos obtener tu dirección, pero tu ubicación queda lista igual. Probá "Actualizar" en un rato.'
    } finally {
      describing.value = false
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No pudimos obtener tu ubicación.'
  } finally {
    locating.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Punto -->
    <div class="flex flex-col gap-2">
      <span class="text-xs font-bold uppercase tracking-widest text-[#7d571e] font-jakarta"
        >Tu ubicación</span
      >
      <div class="flex items-center gap-3 h-14 px-4 bg-white rounded-2xl border border-[#DBD8D0]">
        <span
          class="material-symbols-outlined"
          :class="coords ? 'text-[#F4C07D]' : 'text-[#d3c4b4]'"
          :style="coords ? 'font-variation-settings: \'FILL\' 1' : ''"
          >my_location</span
        >
        <p
          class="flex-1 min-w-0 truncate text-base"
          :class="coords ? 'text-[#281808]' : 'text-[#4f4539]/60'"
        >
          {{ coords ? 'Ubicación lista' : 'Todavía no compartiste tu ubicación' }}
        </p>
        <button
          type="button"
          :disabled="locating"
          class="shrink-0 whitespace-nowrap text-sm font-bold text-[#795832] hover:text-[#382615] disabled:opacity-60 transition-colors font-jakarta"
          @click="locate"
        >
          {{ locating ? 'Buscando…' : coords ? 'Actualizar' : 'Usar mi ubicación' }}
        </button>
        <button
          v-if="coords"
          type="button"
          class="shrink-0 text-sm font-bold text-red-400 hover:text-red-500 transition-colors font-jakarta"
          @click="clear"
        >
          Quitar
        </button>
      </div>
      <!-- Dirección aproximada para que confirme que es su ubicación -->
      <p v-if="coords && (coords.label || describing)" class="text-sm text-[#281808]">
        <template v-if="coords.label">
          {{ coords.label
          }}<span v-if="accuracy" class="text-[#4f4539]/60"> · ±{{ Math.round(accuracy) }} m</span>
        </template>
        <span v-else class="text-[#4f4539]/60">Buscando tu dirección…</span>
      </p>
      <p v-if="coords?.label" class="text-[10px] text-[#4f4539]/50">
        Dirección por
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener"
          class="underline"
          >© OpenStreetMap contributors</a
        >
      </p>
      <p class="text-xs text-[#4f4539]">
        Se guarda junto con tu perfil y solo se usa para mostrarte canes cerca. Nadie ve tu punto
        exacto, solo la distancia.
      </p>
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      <p v-else-if="softError" class="text-sm text-[#4f4539]">{{ softError }}</p>
    </div>

    <!-- Radio: barra de 1 a 100 km (el mismo tope que valida la base) -->
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <label
          for="search-radius"
          class="text-xs font-bold uppercase tracking-widest text-[#7d571e] font-jakarta"
        >
          Radio de búsqueda
        </label>
        <span class="text-sm font-bold text-[#382615] font-jakarta">{{ radius }} km</span>
      </div>
      <input
        id="search-radius"
        type="range"
        min="1"
        max="100"
        step="1"
        :value="radius"
        class="w-full h-2 bg-[#ffeadb] rounded-lg appearance-none cursor-pointer radius-slider"
        @input="onRadiusInput"
      />
      <div
        class="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#4f4539]/60 font-jakarta"
      >
        <span>1 km</span>
        <span>100 km</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Mismo pulgar circular que el slider de edad del perfil */
.radius-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: #f4c07d;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(113, 62, 24, 0.2);
}
.radius-slider::-moz-range-thumb {
  height: 24px;
  width: 24px;
  border: none;
  border-radius: 50%;
  background: #f4c07d;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(113, 62, 24, 0.2);
}
</style>
