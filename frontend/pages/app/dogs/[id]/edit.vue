<template>
  <div class="bg-[#DBD8D0] min-h-full pb-32 md:pb-16">
    <div class="max-w-[1000px] mx-auto px-6 pt-10 pb-6 text-center">
      <h1
        class="text-[32px] md:text-[42px] font-extrabold text-[#382615] font-jakarta leading-tight mb-2"
      >
        Editar a {{ form.name || 'tu can' }}
      </h1>
      <p class="text-[#4f4539] text-lg">Actualizá la información de tu compañero.</p>
    </div>

    <div class="hidden md:grid max-w-[1000px] mx-auto px-6 grid-cols-12 gap-8">
      <div class="col-span-7 space-y-6">
        <div class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.08)] p-8 space-y-6">
          <h2 class="text-2xl font-bold text-[#7d571e] font-jakarta border-b border-[#ffeadb] pb-3">
            Estadísticas Vitales
          </h2>

          <div class="grid grid-cols-2 gap-5">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-widest text-[#4f4539] font-jakarta"
                >Nombre del can</label
              >
              <input
                v-model="form.name"
                type="text"
                placeholder="ej. Buster"
                required
                class="w-full bg-white border border-[#DBD8D0] rounded-xl px-4 py-3 focus:border-[#B78F64] focus:ring-0 outline-none transition-all"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-widest text-[#4f4539] font-jakarta"
                >Raza</label
              >
              <div class="relative">
                <select
                  v-model="form.breed"
                  class="w-full appearance-none bg-white border border-[#DBD8D0] rounded-xl px-4 py-3 focus:border-[#B78F64] focus:ring-0 outline-none transition-all pr-10 text-[#281808]"
                  required
                >
                  <option value="">Seleccioná la raza</option>
                  <option v-for="b in breeds" :key="b" :value="b">{{ b }}</option>
                </select>
                <span
                  class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#4f4539]"
                  >expand_more</span
                >
              </div>
            </div>
          </div>

          <!-- Age slider -->
          <div class="flex flex-col gap-3">
            <div class="flex justify-between items-center">
              <label class="text-xs font-bold uppercase tracking-widest text-[#4f4539] font-jakarta"
                >Edad</label
              >
              <span class="text-[#7d571e] font-bold font-jakarta"
                >{{ form.age }} {{ form.age === 1 ? 'año' : 'años' }}</span
              >
            </div>
            <input
              v-model.number="form.age"
              type="range"
              min="0"
              max="20"
              class="w-full h-2 bg-[#ffeadb] rounded-lg appearance-none cursor-pointer age-slider"
            />
          </div>

          <!-- Sex + Size -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-widest text-[#4f4539] font-jakarta"
                >Sexo</label
              >
              <div class="flex p-1 bg-[#fff1e8] rounded-xl w-full">
                <button
                  type="button"
                  class="flex-1 py-2 px-4 rounded-[10px] font-bold transition-all text-sm font-jakarta"
                  :class="
                    form.sex === 'male' ? 'bg-white text-[#7d571e] shadow-sm' : 'text-[#4f4539]'
                  "
                  @click="form.sex = 'male'"
                >
                  Macho
                </button>
                <button
                  type="button"
                  class="flex-1 py-2 px-4 rounded-[10px] font-bold transition-all text-sm font-jakarta"
                  :class="
                    form.sex === 'female' ? 'bg-white text-[#7d571e] shadow-sm' : 'text-[#4f4539]'
                  "
                  @click="form.sex = 'female'"
                >
                  Hembra
                </button>
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-widest text-[#4f4539] font-jakarta"
                >Tamaño</label
              >
              <div class="flex gap-2">
                <button
                  v-for="s in sizes"
                  :key="s.value"
                  type="button"
                  class="px-4 py-2 rounded-full border text-sm font-medium transition-all"
                  :class="
                    form.size === s.value
                      ? 'bg-[#B78F64]/10 border-[#B78F64] text-[#B78F64] font-bold'
                      : 'border-[#DBD8D0] text-[#4f4539] hover:border-[#B78F64]'
                  "
                  @click="form.size = s.value"
                >
                  {{ s.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- About -->
        <div class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.08)] p-8 space-y-6">
          <h2 class="text-2xl font-bold text-[#7d571e] font-jakarta border-b border-[#ffeadb] pb-3">
            Sobre {{ form.name || 'tu can' }}
          </h2>

          <!-- Personality tags -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold uppercase tracking-widest text-[#4f4539] font-jakarta"
              >Personalidad</label
            >
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in personalityOptions"
                :key="tag"
                type="button"
                class="px-4 py-1.5 rounded-full text-sm font-medium transition-all border"
                :class="
                  form.personality_tags.includes(tag)
                    ? 'bg-[#B78F64]/10 border-[#B78F64] text-[#B78F64] font-bold'
                    : 'bg-[#ffeadb] border-transparent text-[#4f4539] hover:bg-[#fdddc3]'
                "
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </button>
            </div>
          </div>

          <!-- Bio -->
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-center">
              <label class="text-xs font-bold uppercase tracking-widest text-[#4f4539] font-jakarta"
                >Bio</label
              >
              <span class="text-xs text-[#4f4539]/60">{{ form.bio.length }} / 150</span>
            </div>
            <textarea
              v-model="form.bio"
              maxlength="150"
              rows="4"
              placeholder="Contanos qué hace especial a tu can..."
              class="w-full bg-white border border-[#DBD8D0] rounded-xl px-4 py-3 focus:border-[#B78F64] focus:ring-0 outline-none transition-all resize-none"
            />
          </div>
        </div>
      </div>

      <!-- Right col: photos + CTA -->
      <div class="col-span-5 space-y-6">
        <!-- Photos -->
        <div class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.08)] p-8">
          <h2
            class="text-2xl font-bold text-[#7d571e] font-jakarta border-b border-[#ffeadb] pb-3 mb-5"
          >
            Fotos (hasta 5)
          </h2>

          <!-- Grid de fotos arrastrables (desktop) -->
          <div class="grid grid-cols-2 gap-2 mb-4">
            <draggable v-model="photos" item-key="url" tag="div" class="contents" :animation="150">
              <template #item="{ element: photo, index: i }">
                <div
                  class="aspect-[4/3] rounded-xl overflow-hidden relative cursor-grab active:cursor-grabbing select-none"
                >
                  <img :src="photo.url" class="w-full h-full object-cover pointer-events-none" />
                  <span
                    class="absolute top-2 left-2 bg-black/40 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-jakarta"
                    >{{ i + 1 }}</span
                  >
                  <button
                    type="button"
                    class="absolute top-2 right-2 bg-black/50 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                    @click.stop="removePhoto(i)"
                  >
                    <span class="material-symbols-outlined text-sm leading-none">close</span>
                  </button>
                  <span
                    class="material-symbols-outlined absolute bottom-1.5 left-1/2 -translate-x-1/2 text-white/50 text-base pointer-events-none"
                    >drag_indicator</span
                  >
                </div>
              </template>
            </draggable>

            <div
              v-for="j in 5 - photos.length"
              :key="'slot-' + j"
              class="aspect-[4/3] rounded-xl border-2 border-dashed border-[#DBD8D0] bg-[#fff1e8] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#F4C07D] transition-all"
              @click="triggerFileInput"
            >
              <span class="material-symbols-outlined text-[#4f4539]/50">add_a_photo</span>
              <span class="text-[10px] font-bold uppercase text-[#4f4539]/50">Subir</span>
            </div>
          </div>

          <!-- Drop zone compacto -->
          <div
            class="border-2 border-dashed border-[#DBD8D0] rounded-xl px-4 py-3 flex items-center justify-between gap-3 bg-[#fff1e8]/30 hover:bg-[#fff1e8] transition-all cursor-pointer"
            @click="triggerFileInput"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <div class="flex items-center gap-2 text-[#4f4539]">
              <span class="material-symbols-outlined text-lg">upload_file</span>
              <span class="text-sm font-medium">Arrastrá o elegí fotos</span>
            </div>
            <span class="text-xs text-[#4f4539]/50 font-medium shrink-0"
              >{{ allPhotos.length }}/5</span
            >
          </div>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="handleFileChange"
          />
        </div>

        <!-- CTA -->
        <div class="flex flex-col gap-3">
          <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
          <button
            type="button"
            :disabled="saving"
            class="w-full py-4 bg-[#F4C07D] text-[#382615] rounded-xl font-bold text-xl font-jakarta shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-60"
            @click="handleSubmit"
          >
            {{ saving ? 'Guardando...' : 'Guardar cambios' }}
          </button>
          <NuxtLink
            to="/app/dogs"
            class="w-full py-3 text-[#4f4539] font-medium hover:text-[#382615] transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <span class="material-symbols-outlined text-sm">arrow_back</span>
            Volver
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- ─── Mobile ─── -->
    <div class="md:hidden px-5 space-y-6">
      <!-- Photos -->
      <div>
        <p class="text-xs font-bold uppercase tracking-widest text-[#795832] mb-3 font-jakarta">
          Subí fotos (hasta 5)
        </p>
        <div class="grid grid-cols-3 gap-2">
          <draggable v-model="photos" item-key="url" tag="div" class="contents" :animation="150">
            <template #item="{ element: photo, index: i }">
              <div
                class="aspect-square rounded-xl overflow-hidden relative cursor-grab active:cursor-grabbing select-none"
              >
                <img :src="photo.url" class="w-full h-full object-cover pointer-events-none" />
                <span
                  class="absolute top-1 left-1 bg-black/40 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  >{{ i + 1 }}</span
                >
                <button
                  type="button"
                  class="absolute top-1 right-1 bg-black/50 text-white w-5 h-5 rounded-full flex items-center justify-center"
                  @click.stop="removePhoto(i)"
                >
                  <span class="material-symbols-outlined text-xs leading-none">close</span>
                </button>
              </div>
            </template>
          </draggable>
          <div
            v-for="j in 5 - photos.length"
            :key="'empty-' + j"
            class="aspect-square rounded-xl border-2 border-dashed border-[#DBD8D0] bg-[#fff1e8] flex items-center justify-center cursor-pointer hover:border-[#F4C07D] transition-all"
            @click="triggerFileInput"
          >
            <span class="material-symbols-outlined text-[#4f4539]/40 text-xl">add</span>
          </div>
        </div>
        <input
          ref="fileInputMobile"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="handleFileChange"
        />
      </div>

      <!-- Name -->
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-bold uppercase tracking-widest text-[#795832] font-jakarta"
          >Nombre del can</label
        >
        <input
          v-model="form.name"
          type="text"
          placeholder="Barkley"
          required
          class="w-full h-14 px-4 bg-white border border-[#DBD8D0] rounded-xl focus:border-[#B78F64] focus:ring-0 outline-none transition-all shadow-sm"
        />
      </div>

      <!-- Breed + Age -->
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold uppercase tracking-widest text-[#795832] font-jakarta"
            >Raza</label
          >
          <input
            v-model="form.breed"
            type="text"
            placeholder="Golden Retriever"
            required
            class="w-full h-14 px-4 bg-white border border-[#DBD8D0] rounded-xl focus:border-[#B78F64] focus:ring-0 outline-none transition-all shadow-sm"
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold uppercase tracking-widest text-[#795832] font-jakarta"
            >Edad (años)</label
          >
          <input
            v-model.number="form.age"
            type="number"
            min="0"
            max="20"
            placeholder="3"
            class="w-full h-14 px-4 bg-white border border-[#DBD8D0] rounded-xl focus:border-[#B78F64] focus:ring-0 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <!-- Sex -->
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-bold uppercase tracking-widest text-[#795832] font-jakarta"
          >Sexo</label
        >
        <div class="flex p-1 bg-[#fff1e8] rounded-xl">
          <button
            type="button"
            class="flex-1 h-12 rounded-[10px] font-bold transition-all font-jakarta"
            :class="
              form.sex === 'male' ? 'bg-[#F4C07D] text-[#382615] shadow-sm' : 'text-[#4f4539]'
            "
            @click="form.sex = 'male'"
          >
            Macho
          </button>
          <button
            type="button"
            class="flex-1 h-12 rounded-[10px] font-bold transition-all font-jakarta"
            :class="
              form.sex === 'female' ? 'bg-[#F4C07D] text-[#382615] shadow-sm' : 'text-[#4f4539]'
            "
            @click="form.sex = 'female'"
          >
            Hembra
          </button>
        </div>
      </div>

      <!-- Size -->
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-bold uppercase tracking-widest text-[#795832] font-jakarta"
          >Tamaño</label
        >
        <div class="flex gap-2">
          <button
            v-for="s in sizes"
            :key="s.value"
            type="button"
            class="flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all font-jakarta"
            :class="
              form.size === s.value
                ? 'bg-[#F4C07D] border-[#F4C07D] text-[#382615]'
                : 'border-[#DBD8D0] bg-white text-[#4f4539]'
            "
            @click="form.size = s.value"
          >
            {{ s.label }}
          </button>
        </div>
      </div>

      <!-- Personality -->
      <div class="flex flex-col gap-2">
        <label class="text-xs font-bold uppercase tracking-widest text-[#795832] font-jakarta"
          >Personalidad</label
        >
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in personalityOptions"
            :key="tag"
            type="button"
            class="px-3 py-1.5 rounded-full text-sm font-medium transition-all border"
            :class="
              form.personality_tags.includes(tag)
                ? 'bg-[#F4C07D] border-[#F4C07D] text-[#382615] font-bold'
                : 'bg-white border-[#DBD8D0] text-[#4f4539]'
            "
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- Bio -->
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-bold uppercase tracking-widest text-[#795832] font-jakarta"
          >Bio</label
        >
        <textarea
          v-model="form.bio"
          maxlength="150"
          rows="3"
          placeholder="Contanos sobre los juguetes y hobbies favoritos..."
          class="w-full p-4 bg-white border border-[#DBD8D0] rounded-xl focus:border-[#B78F64] focus:ring-0 outline-none transition-all resize-none shadow-sm"
        />
      </div>

      <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
    </div>

    <!-- Mobile fixed CTA -->
    <div
      class="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md px-6 py-5 border-t border-[#DBD8D0]/50 z-50"
    >
      <button
        type="button"
        :disabled="saving"
        class="w-full h-14 bg-[#F4C07D] text-[#382615] rounded-xl font-bold text-lg font-jakarta flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(244,192,125,0.4)] active:scale-95 transition-all disabled:opacity-60"
        @click="handleSubmit"
      >
        <span>{{ saving ? 'Guardando...' : 'Guardar cambios' }}</span>
        <span
          v-if="!saving"
          class="material-symbols-outlined"
          style="font-variation-settings: 'FILL' 1"
          >edit</span
        >
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'

definePageMeta({ layout: 'app', middleware: 'auth' })

const route = useRoute()
const dogsStore = useDogsStore()
const router = useRouter()
const id = route.params.id as string

interface PhotoItem {
  url: string
  file?: File
}

const fileInput = ref<HTMLInputElement | null>(null)
const fileInputMobile = ref<HTMLInputElement | null>(null)
const photos = ref<PhotoItem[]>([])
const saving = ref(false)
const error = ref('')
const loading = ref(true)

const form = reactive({
  name: '',
  breed: '',
  age: 2,
  sex: 'male' as string,
  size: 'medium' as string,
  bio: '',
  personality_tags: [] as string[],
})

const breeds = [
  'Labrador Retriever',
  'Golden Retriever',
  'French Bulldog',
  'Pastor Alemán',
  'Bulldog',
  'Poodle',
  'Beagle',
  'Rottweiler',
  'Yorkshire Terrier',
  'Dachshund',
  'Boxer',
  'Border Collie',
  'Shih Tzu',
  'Maltés',
  'Cocker Spaniel',
  'Doberman',
  'Australian Shepherd',
  'Siberian Husky',
  'Chihuahua',
  'Mestizo',
]

const sizes = [
  { value: 'small', label: 'Chico' },
  { value: 'medium', label: 'Mediano' },
  { value: 'large', label: 'Grande' },
]

const personalityOptions = [
  'Juguetón',
  'Amigable',
  'Tranquilo',
  'Enérgico',
  'Tímido',
  'Protector',
  'Cariñoso',
  'Activo',
]

const allPhotos = computed(() => photos.value.map((p) => p.url))

onMounted(async () => {
  loading.value = true
  try {
    await dogsStore.fetchDogs()
    const dog = dogsStore.dogs.find((d) => String(d.id) === id)
    if (dog) {
      form.name = dog.name
      form.breed = dog.breed
      form.age = dog.age
      form.sex = dog.sex ?? 'male'
      form.size = dog.size ?? 'medium'
      form.bio = dog.bio ?? ''
      form.personality_tags = dog.personality_tags ?? []
      photos.value = (dog.photos ?? []).map((url: string) => ({ url }))
    }
  } finally {
    loading.value = false
  }
})

function toggleTag(tag: string) {
  const idx = form.personality_tags.indexOf(tag)
  if (idx === -1) form.personality_tags.push(tag)
  else form.personality_tags.splice(idx, 1)
}

function triggerFileInput() {
  const input = fileInput.value ?? fileInputMobile.value
  input?.click()
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  addFiles(target.files)
  target.value = ''
}

function handleDrop(e: DragEvent) {
  addFiles(e.dataTransfer?.files ?? null)
}

function addFiles(files: FileList | null) {
  if (!files) return
  for (const file of Array.from(files)) {
    if (photos.value.length >= 5) break
    photos.value.push({ url: URL.createObjectURL(file), file })
  }
}

function removePhoto(index: number) {
  const item = photos.value[index]
  if (item?.file) URL.revokeObjectURL(item.url)
  photos.value.splice(index, 1)
}

async function handleSubmit() {
  error.value = ''
  if (!form.name.trim()) {
    error.value = 'El nombre del can es obligatorio.'
    return
  }
  saving.value = true
  try {
    // Subir fotos nuevas primero y capturar sus URLs del servidor
    const newItems = photos.value.filter((p) => p.file)
    const uploadedURLs: string[] = []
    for (const item of newItems) {
      const dog = await dogsStore.uploadPhoto(id, item.file!)
      uploadedURLs.push(dog.photos[dog.photos.length - 1])
    }

    // Construir el orden final reemplazando blob URLs por URLs del servidor
    let uploadIdx = 0
    const finalPhotos = photos.value.map((item) =>
      item.file ? uploadedURLs[uploadIdx++] : item.url
    )

    await dogsStore.updateDog(id, {
      name: form.name.trim(),
      breed: form.breed.trim(),
      age: form.age,
      sex: form.sex,
      size: form.size,
      bio: form.bio.trim(),
      personality_tags: form.personality_tags,
      photos: finalPhotos,
    })

    await router.push('/app/dogs')
  } catch {
    error.value = 'No se pudo guardar. Intentá de nuevo.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.age-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: #f4c07d;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(113, 62, 24, 0.2);
}
</style>
