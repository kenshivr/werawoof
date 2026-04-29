<template>
  <div class="bg-[#DBD8D0] min-h-full pb-52 md:pb-16">
    <div class="max-w-[1000px] mx-auto px-6 pt-6 md:pt-10 pb-6 text-center">
      <h1
        class="text-[28px] md:text-[48px] font-extrabold text-[#382615] font-jakarta leading-tight mb-2"
      >
        ¡Encontremos al amigo de {{ form.name || 'tu can' }}!
      </h1>
      <p class="text-[#4f4539] text-base md:text-lg font-vietnam">
        Cuentanos todo sobre tu compañero peludo.
      </p>
    </div>

    <div class="hidden md:grid max-w-[1000px] mx-auto px-6 grid-cols-12 gap-8">
      <div class="col-span-7 space-y-6">
        <div class="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(113,62,24,0.08)] p-8 space-y-6">
          <h2
            class="text-2xl font-bold text-primary font-jakarta border-b border-surface-container pb-3"
          >
            Estadísticas Vitales
          </h2>

          <div class="grid grid-cols-2 gap-5">
            <div class="flex flex-col gap-1.5">
              <label class="text-label-md font-jakarta text-on-surface-variant"
                >Nombre del can</label
              >
              <input
                v-model="form.name"
                type="text"
                placeholder="ej. Buster"
                required
                class="w-full bg-white border-[1.5px] border-[#DBD8D0] rounded-[16px] px-4 py-3 focus:border-[#B78F64] focus:ring-0 outline-none transition-all"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-label-md font-jakarta text-on-surface-variant">Raza</label>
              <div class="relative">
                <select
                  v-model="form.breed"
                  required
                  class="w-full appearance-none bg-white border-[1.5px] border-[#DBD8D0] rounded-[16px] px-4 py-3 focus:border-[#B78F64] focus:ring-0 outline-none transition-all pr-10 text-[#281808]"
                >
                  <option value="">Seleccioná la raza</option>
                  <option v-for="b in breeds" :key="b" :value="b">{{ b }}</option>
                </select>
                <span
                  class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
                >
                  expand_more
                </span>
              </div>
            </div>
          </div>

          <!-- Age slider -->
          <div class="flex flex-col gap-3">
            <div class="flex justify-between items-center">
              <label class="text-label-md font-jakarta text-on-surface-variant">Edad</label>
              <span class="text-primary font-bold font-jakarta">
                {{ form.age }} {{ form.age === 1 ? 'año' : 'años' }}
              </span>
            </div>
            <input
              v-model.number="form.age"
              type="range"
              min="0"
              max="20"
              class="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer age-slider"
            />
          </div>

          <!-- Sex + Size -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div class="flex flex-col gap-1.5">
              <label class="text-label-md font-jakarta text-on-surface-variant">Sexo</label>
              <div class="flex p-1 bg-surface-container-low rounded-[16px] w-full">
                <button
                  type="button"
                  class="flex-1 py-2 px-4 rounded-[12px] font-bold transition-all text-sm font-jakarta"
                  :class="
                    form.sex === 'male'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-on-surface-variant hover:bg-white/50'
                  "
                  @click="form.sex = 'male'"
                >
                  Macho
                </button>
                <button
                  type="button"
                  class="flex-1 py-2 px-4 rounded-[12px] font-bold transition-all text-sm font-jakarta"
                  :class="
                    form.sex === 'female'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-on-surface-variant hover:bg-white/50'
                  "
                  @click="form.sex = 'female'"
                >
                  Hembra
                </button>
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-label-md font-jakarta text-on-surface-variant">Tamaño</label>
              <div class="flex gap-2">
                <button
                  v-for="s in sizes"
                  :key="s.value"
                  type="button"
                  class="px-4 py-2 rounded-full border-[1.5px] text-sm font-medium transition-all"
                  :class="
                    form.size === s.value
                      ? 'bg-[#B78F64]/10 border-[#B78F64] text-[#B78F64] font-bold'
                      : 'border-[#DBD8D0] text-on-surface-variant hover:border-[#B78F64]'
                  "
                  @click="form.size = s.value"
                >
                  {{ s.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(113,62,24,0.08)] p-8 space-y-6">
          <h2
            class="text-2xl font-bold text-primary font-jakarta border-b border-surface-container pb-3"
          >
            Sobre {{ form.name || 'tu can' }}
          </h2>

          <div class="flex flex-col gap-2">
            <label class="text-label-md font-jakarta text-on-surface-variant">Personalidad</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in personalityOptions"
                :key="tag"
                type="button"
                class="px-4 py-1.5 rounded-full text-sm font-medium transition-all border flex items-center gap-1"
                :class="
                  form.personality_tags.includes(tag)
                    ? 'bg-[#B78F64]/10 border-[#B78F64]/20 text-[#B78F64] font-bold'
                    : 'bg-surface-container border-transparent text-on-surface-variant hover:bg-surface-variant'
                "
                @click="toggleTag(tag)"
              >
                {{ tag }}
                <span
                  v-if="form.personality_tags.includes(tag)"
                  class="material-symbols-outlined"
                  style="font-size: 14px; line-height: 1"
                  >close</span
                >
              </button>
            </div>
          </div>

          <!-- Bio -->
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-center">
              <label class="text-label-md font-jakarta text-on-surface-variant">Bio</label>
              <span class="text-xs text-on-surface-variant/60">{{ form.bio.length }} / 150</span>
            </div>
            <textarea
              v-model="form.bio"
              maxlength="150"
              rows="4"
              placeholder="Cuentanos qué hace especial a tu can..."
              class="w-full bg-white border-[1.5px] border-[#DBD8D0] rounded-[16px] px-4 py-3 focus:border-[#B78F64] focus:ring-0 outline-none transition-all resize-none custom-scrollbar"
            />
          </div>
        </div>
      </div>

      <!-- Right col: photos + CTA -->
      <div class="col-span-5 space-y-6">
        <!-- Photos card -->
        <div class="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(113,62,24,0.08)] p-8">
          <h2
            class="text-2xl font-bold text-primary font-jakarta border-b border-surface-container pb-3 mb-5"
          >
            Fotos (hasta 6)
          </h2>

          <!-- photo preview grid: 3 per row -->
          <div class="grid grid-cols-3 gap-2 mb-4">
            <div
              v-for="i in 6"
              :key="i"
              class="aspect-square rounded-[12px] overflow-hidden relative"
            >
              <template v-if="photoPreviews[i - 1]">
                <img
                  :src="photoPreviews[i - 1]"
                  class="w-full h-full object-cover"
                  alt="Foto del can"
                />
                <button
                  type="button"
                  class="absolute top-2 right-2 bg-on-surface/50 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-error transition-colors"
                  @click="removePhoto(i - 1)"
                >
                  <span class="material-symbols-outlined text-sm leading-none">close</span>
                </button>
              </template>
              <div
                v-else
                class="w-full h-full border-2 border-dashed border-[#DBD8D0] bg-surface-container-low flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#F4C07D] transition-all group"
                @click="triggerFileInput"
              >
                <span
                  class="material-symbols-outlined text-on-surface-variant group-hover:text-[#B78F64] transition-colors"
                  >add_a_photo</span
                >
                <span
                  class="text-[10px] uppercase font-bold text-on-surface-variant group-hover:text-[#B78F64]"
                  >Subir</span
                >
              </div>
            </div>
          </div>

          <!-- Drop zone -->
          <div
            class="border-2 border-dashed border-[#DBD8D0] rounded-[16px] p-8 flex flex-col items-center text-center gap-3 bg-surface-container-low/30 hover:bg-surface-container-low transition-all"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <div
              class="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary"
            >
              <span class="material-symbols-outlined">upload_file</span>
            </div>
            <div>
              <p class="font-bold text-on-surface text-sm">Arrastrá tus fotos acá</p>
              <p class="text-on-surface-variant text-xs mt-0.5">JPEG o PNG, máx. 5MB cada una</p>
            </div>
            <button
              type="button"
              class="mt-1 px-6 py-2 border-2 border-[#B78F64] text-primary rounded-[16px] font-bold text-sm hover:bg-[#B78F64]/5 transition-all"
              @click="triggerFileInput"
            >
              Elegir archivos
            </button>
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
            class="w-full py-4 bg-[#F4C07D] text-[#382615] rounded-[16px] font-bold text-2xl font-jakarta shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-60"
            @click="handleSubmit"
          >
            {{ saving ? 'Guardando...' : 'Completar Perfil' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ─── Mobile ─── -->
    <div class="md:hidden px-5 space-y-5">
      <!-- Photo grid -->
      <div>
        <p class="text-xs font-bold uppercase tracking-widest text-secondary mb-3 font-jakarta">
          Subí fotos (hasta 6)
        </p>
        <div class="grid grid-cols-3 gap-2">
          <div v-for="i in 6" :key="i" class="aspect-square rounded-xl overflow-hidden relative">
            <template v-if="photoPreviews[i - 1]">
              <img
                :src="photoPreviews[i - 1]"
                class="w-full h-full object-cover"
                alt="Foto del can"
              />
              <button
                type="button"
                class="absolute top-1 right-1 bg-black/50 text-white w-5 h-5 rounded-full flex items-center justify-center"
                @click="removePhoto(i - 1)"
              >
                <span class="material-symbols-outlined" style="font-size: 12px; line-height: 1"
                  >close</span
                >
              </button>
            </template>
            <div
              v-else
              class="w-full h-full border-2 border-dashed border-[#DBD8D0] bg-[#fff1e8] flex items-center justify-center cursor-pointer hover:border-[#F4C07D] transition-all"
              @click="triggerFileInput"
            >
              <span class="material-symbols-outlined text-[#4f4539]/40 text-xl">add</span>
            </div>
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

      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-bold uppercase tracking-widest text-secondary font-jakarta"
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

      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold uppercase tracking-widest text-secondary font-jakarta"
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
          <label class="text-xs font-bold uppercase tracking-widest text-secondary font-jakarta"
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
        <label class="text-xs font-bold uppercase tracking-widest text-secondary font-jakarta"
          >Sexo</label
        >
        <div class="flex p-1 bg-[#fff1e8] rounded-xl">
          <button
            type="button"
            class="flex-1 h-12 rounded-[10px] font-bold transition-all font-jakarta text-sm"
            :class="
              form.sex === 'male' ? 'bg-[#F4C07D] text-[#382615] shadow-sm' : 'text-[#4f4539]'
            "
            @click="form.sex = 'male'"
          >
            Macho
          </button>
          <button
            type="button"
            class="flex-1 h-12 rounded-[10px] font-bold transition-all font-jakarta text-sm"
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
        <label class="text-xs font-bold uppercase tracking-widest text-secondary font-jakarta"
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
        <label class="text-xs font-bold uppercase tracking-widest text-secondary font-jakarta"
          >Personalidad</label
        >
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in personalityOptions"
            :key="tag"
            type="button"
            class="px-3 py-1.5 rounded-full text-sm font-medium transition-all border flex items-center gap-1"
            :class="
              form.personality_tags.includes(tag)
                ? 'bg-[#F4C07D] border-[#F4C07D] text-[#382615] font-bold'
                : 'bg-white border-[#DBD8D0] text-[#4f4539]'
            "
            @click="toggleTag(tag)"
          >
            {{ tag }}
            <span
              v-if="form.personality_tags.includes(tag)"
              class="material-symbols-outlined"
              style="font-size: 14px; line-height: 1"
              >close</span
            >
          </button>
        </div>
      </div>

      <!-- Bio -->
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-bold uppercase tracking-widest text-secondary font-jakarta"
          >Bio</label
        >
        <textarea
          v-model="form.bio"
          maxlength="150"
          rows="3"
          placeholder="Contanos sobre los juguetes y hobbies favoritos de tu can..."
          class="w-full p-4 bg-white border border-[#DBD8D0] rounded-xl focus:border-[#B78F64] focus:ring-0 outline-none transition-all resize-none shadow-sm"
        />
      </div>

      <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
    </div>

    <!-- Mobile fixed CTA — sits above the bottom nav (~80px tall) -->
    <div
      class="md:hidden fixed bottom-20 left-0 w-full bg-white/90 backdrop-blur-md px-6 py-4 border-t border-[#DBD8D0]/50 z-40"
    >
      <button
        type="button"
        :disabled="saving"
        class="w-full h-14 bg-[#F4C07D] text-[#382615] rounded-xl font-bold text-lg font-jakarta flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(244,192,125,0.4)] active:scale-95 transition-all disabled:opacity-60"
        @click="handleSubmit"
      >
        <span>{{ saving ? 'Guardando...' : 'Completar Perfil' }}</span>
        <span
          v-if="!saving"
          class="material-symbols-outlined"
          style="font-variation-settings: 'FILL' 1"
          >pets</span
        >
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const dogsStore = useDogsStore()
const router = useRouter()

const fileInput = ref<HTMLInputElement | null>(null)
const fileInputMobile = ref<HTMLInputElement | null>(null)
const photoFiles = ref<File[]>([])
const photoPreviews = ref<string[]>([])
const saving = ref(false)
const error = ref('')

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
    if (photoFiles.value.length >= 6) break
    photoFiles.value.push(file)
    photoPreviews.value.push(URL.createObjectURL(file))
  }
}

function removePhoto(index: number) {
  URL.revokeObjectURL(photoPreviews.value[index])
  photoFiles.value.splice(index, 1)
  photoPreviews.value.splice(index, 1)
}

async function handleSubmit() {
  error.value = ''
  if (!form.name.trim()) {
    error.value = 'El nombre del can es obligatorio.'
    return
  }
  saving.value = true
  try {
    const dog = await dogsStore.createDog({
      name: form.name.trim(),
      breed: form.breed.trim(),
      age: form.age,
      sex: form.sex,
      size: form.size,
      bio: form.bio.trim(),
      personality_tags: form.personality_tags,
    })

    for (const file of photoFiles.value) {
      await dogsStore.uploadPhoto(String(dog.id), file)
    }

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

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #dbd8d0;
  border-radius: 10px;
}
</style>
