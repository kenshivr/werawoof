<template>
  <div class="min-h-full bg-[#DBD8D0]">


    <!-- ─── DESKTOP ─── -->
    <div class="hidden md:block max-w-[1280px] mx-auto px-6 py-16">

      <!-- Progress -->
      <div class="w-full max-w-2xl mx-auto mb-10">
        <div class="flex justify-between items-end mb-3">
          <div>
            <span class="text-[#7d571e] font-bold text-xs uppercase tracking-widest block mb-1 font-jakarta">
              Paso {{ currentStep }} de {{ hasDogs ? 1 : 2 }}
            </span>
            <h1 class="text-[32px] font-bold leading-tight tracking-tight text-[#281808] font-jakarta">
              {{ currentStep === 1 ? 'Sobre ti' : `¡Agreguemos a ${dogForm.name || 'tu perro'}!` }}
            </h1>
          </div>
          <span class="text-2xl font-bold text-[#281808] font-jakarta">
            {{ hasDogs || currentStep === 2 ? '100%' : '50%' }}
          </span>
        </div>
        <div class="w-full h-2 bg-[#ffeadb] rounded-full overflow-hidden">
          <div :style="{ width: hasDogs || currentStep === 2 ? '100%' : '50%' }" class="h-full bg-[#F4C07D] rounded-full transition-all duration-500"></div>
        </div>
      </div>

      <!-- STEP 1: Owner Profile -->
      <template v-if="currentStep === 1">
        <div class="bg-white rounded-3xl shadow-[0_4px_20px_rgba(113,62,24,0.08)] w-full max-w-2xl mx-auto overflow-hidden">
          <div class="p-12">
            <form class="space-y-10" @submit.prevent="handleSaveStep1">

              <!-- Avatar -->
              <div class="flex flex-col items-center gap-5">
                <label class="relative cursor-pointer">
                  <input type="file" accept="image/*" class="sr-only" @change="handleFileChange" />
                  <div class="w-32 h-32 rounded-full bg-[#fff1e8] flex items-center justify-center border-2 border-dashed border-[#d3c4b4] overflow-hidden hover:border-[#F4C07D] transition-colors">
                    <img
                      v-if="avatarPreview"
                      :src="avatarPreview"
                      alt="Foto de perfil"
                      class="w-full h-full object-cover"
                    />
                    <span v-else class="material-symbols-outlined text-5xl text-[#d3c4b4]">person</span>
                  </div>
                  <div class="absolute -bottom-2 -right-2 bg-[#f4c07d] w-8 h-8 rounded-full shadow-md text-[#382615] flex items-center justify-center pointer-events-none">
                    <span class="material-symbols-outlined text-sm leading-none">edit</span>
                  </div>
                </label>
                <div class="text-center">
                  <p class="text-xs font-bold uppercase tracking-widest text-[#281808] font-jakarta">Sube tu foto de perfil</p>
                  <p class="text-xs text-[#4f4539] mt-1">¡Muestrales a otros dueños quién eres!</p>
                </div>
              </div>

              <!-- Inputs -->
              <div class="space-y-5">
                <!-- Nombre -->
                <div class="flex flex-col gap-2">
                  <label for="owner-name" class="text-xs font-bold uppercase tracking-widest text-[#7d571e] font-jakarta">
                    Tu nombre
                  </label>
                  <input
                    id="owner-name"
                    v-model="form.name"
                    type="text"
                    placeholder="¿Cómo te llamamos?"
                    required
                    class="w-full h-14 px-4 bg-white rounded-2xl border border-[#DBD8D0] focus:border-[#B78F64] focus:ring-0 text-[#281808] text-base outline-none transition-colors"
                  />
                </div>

                <!-- Ciudad -->
                <div class="flex flex-col gap-2">
                  <label for="location" class="text-xs font-bold uppercase tracking-widest text-[#7d571e] font-jakarta">
                    Ciudad / Ubicación
                  </label>
                  <div class="relative">
                    <input
                      id="location"
                      v-model="form.location"
                      type="text"
                      placeholder="ej. Buenos Aires, CABA"
                      class="w-full h-14 pl-12 pr-4 bg-white rounded-2xl border border-[#DBD8D0] focus:border-[#B78F64] focus:ring-0 text-[#281808] text-base outline-none transition-colors"
                    />
                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#d3c4b4]">location_on</span>
                  </div>
                </div>

                <!-- Bio -->
                <div class="flex flex-col gap-2">
                  <label for="bio" class="text-xs font-bold uppercase tracking-widest text-[#7d571e] font-jakarta">
                    Algo sobre ti
                  </label>
                  <textarea
                    id="bio"
                    v-model="form.bio"
                    placeholder="Amante del senderismo y fanático del café..."
                    rows="3"
                    class="w-full px-4 py-4 bg-white rounded-2xl border border-[#DBD8D0] focus:border-[#B78F64] focus:ring-0 text-[#281808] text-base outline-none transition-colors resize-none"
                  ></textarea>
                </div>
              </div>

              <!-- Error -->
              <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

              <!-- Actions -->
              <div class="flex items-center justify-between pt-6 border-t border-[#ffeadb]">
                <button
                  type="button"
                  class="text-[#4f4539] text-sm font-bold uppercase tracking-widest hover:text-[#281808] transition-colors flex items-center gap-2 font-jakarta"
                  @click="$router.back()"
                >
                  <span class="material-symbols-outlined text-lg">arrow_back</span>
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="bg-[#F4C07D] text-[#382615] px-10 py-4 rounded-2xl font-bold text-xl font-jakarta shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 active:scale-95 flex items-center gap-3 disabled:opacity-60"
                >
                  {{ saving ? 'Guardando...' : hasDogs ? 'Guardar cambios' : 'Siguiente: Tu perro' }}
                  <span v-if="!saving" class="material-symbols-outlined">{{ hasDogs ? 'check' : 'arrow_forward' }}</span>
                </button>
              </div>

            </form>
          </div>
        </div>

        <!-- Disclaimer -->
        <div class="mt-10 text-center text-[#4f4539] max-w-md mx-auto">
          <p class="text-sm italic">"Usamos tu ubicación para encontrar los mejores matches cerca tuyo. Podés cambiarlo cuando quieras desde la configuración."</p>
        </div>
      </template>

      <!-- STEP 2: Dog Profile -->
      <template v-if="currentStep === 2">
        <div class="grid grid-cols-12 gap-8 max-w-[1000px] mx-auto">

          <!-- Left col: form -->
          <div class="col-span-7 space-y-6">

            <!-- Vital Statistics -->
            <div class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.08)] p-8 space-y-6">
              <h2 class="text-2xl font-bold text-[#7d571e] font-jakarta border-b border-[#ffeadb] pb-3">
                Estadísticas Vitales
              </h2>

              <!-- Name + Breed -->
              <div class="grid grid-cols-2 gap-5">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold uppercase tracking-widest text-[#4f4539] font-jakarta">Nombre del perro</label>
                  <input
                    v-model="dogForm.name"
                    type="text"
                    placeholder="ej. Buster"
                    required
                    class="w-full bg-white border border-[#DBD8D0] rounded-xl px-4 py-3 focus:border-[#B78F64] focus:ring-0 outline-none transition-all"
                  />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold uppercase tracking-widest text-[#4f4539] font-jakarta">Raza</label>
                  <div class="relative">
                    <select
                      v-model="dogForm.breed"
                      class="w-full appearance-none bg-white border border-[#DBD8D0] rounded-xl px-4 py-3 focus:border-[#B78F64] focus:ring-0 outline-none transition-all pr-10 text-[#281808]"
                      required
                    >
                      <option value="">Seleccioná la raza</option>
                      <option v-for="b in breeds" :key="b" :value="b">{{ b }}</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#4f4539]">expand_more</span>
                  </div>
                </div>
              </div>

              <!-- Age slider -->
              <div class="flex flex-col gap-3">
                <div class="flex justify-between items-center">
                  <label class="text-xs font-bold uppercase tracking-widest text-[#4f4539] font-jakarta">Edad</label>
                  <span class="text-[#7d571e] font-bold font-jakarta">{{ dogForm.age }} {{ dogForm.age === 1 ? 'año' : 'años' }}</span>
                </div>
                <input
                  v-model.number="dogForm.age"
                  type="range"
                  min="0"
                  max="20"
                  class="w-full h-2 bg-[#ffeadb] rounded-lg appearance-none cursor-pointer age-slider"
                />
              </div>

              <!-- Sex + Size -->
              <div class="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold uppercase tracking-widest text-[#4f4539] font-jakarta">Sexo</label>
                  <div class="flex p-1 bg-[#fff1e8] rounded-xl w-full">
                    <button
                      type="button"
                      class="flex-1 py-2 px-4 rounded-[10px] font-bold transition-all text-sm font-jakarta"
                      :class="dogForm.sex === 'male' ? 'bg-white text-[#7d571e] shadow-sm' : 'text-[#4f4539]'"
                      @click="dogForm.sex = 'male'"
                    >Macho</button>
                    <button
                      type="button"
                      class="flex-1 py-2 px-4 rounded-[10px] font-bold transition-all text-sm font-jakarta"
                      :class="dogForm.sex === 'female' ? 'bg-white text-[#7d571e] shadow-sm' : 'text-[#4f4539]'"
                      @click="dogForm.sex = 'female'"
                    >Hembra</button>
                  </div>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-bold uppercase tracking-widest text-[#4f4539] font-jakarta">Tamaño</label>
                  <div class="flex gap-2">
                    <button
                      v-for="s in sizes"
                      :key="s.value"
                      type="button"
                      class="px-4 py-2 rounded-full border text-sm font-medium transition-all"
                      :class="dogForm.size === s.value
                        ? 'bg-[#B78F64]/10 border-[#B78F64] text-[#B78F64] font-bold'
                        : 'border-[#DBD8D0] text-[#4f4539] hover:border-[#B78F64]'"
                      @click="dogForm.size = s.value"
                    >{{ s.label }}</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- About -->
            <div class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.08)] p-8 space-y-6">
              <h2 class="text-2xl font-bold text-[#7d571e] font-jakarta border-b border-[#ffeadb] pb-3">
                Sobre {{ dogForm.name || 'tu perro' }}
              </h2>

              <!-- Personality tags -->
              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold uppercase tracking-widest text-[#4f4539] font-jakarta">Personalidad</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="tag in personalityOptions"
                    :key="tag"
                    type="button"
                    class="px-4 py-1.5 rounded-full text-sm font-medium transition-all border"
                    :class="dogForm.personality_tags.includes(tag)
                      ? 'bg-[#B78F64]/10 border-[#B78F64] text-[#B78F64] font-bold'
                      : 'bg-[#ffeadb] border-transparent text-[#4f4539] hover:bg-[#fdddc3]'"
                    @click="toggleTag(tag)"
                  >{{ tag }}</button>
                </div>
              </div>

              <!-- Bio -->
              <div class="flex flex-col gap-1.5">
                <div class="flex justify-between items-center">
                  <label class="text-xs font-bold uppercase tracking-widest text-[#4f4539] font-jakarta">Bio</label>
                  <span class="text-xs text-[#4f4539]/60">{{ dogForm.bio.length }} / 150</span>
                </div>
                <textarea
                  v-model="dogForm.bio"
                  maxlength="150"
                  rows="4"
                  placeholder="Contanos qué hace especial a tu perro..."
                  class="w-full bg-white border border-[#DBD8D0] rounded-xl px-4 py-3 focus:border-[#B78F64] focus:ring-0 outline-none transition-all resize-none"
                />
              </div>
            </div>

          </div>

          <!-- Right col: photos + CTA -->
          <div class="col-span-5 space-y-6">

            <!-- Photos -->
            <div class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.08)] p-8">
              <h2 class="text-2xl font-bold text-[#7d571e] font-jakarta border-b border-[#ffeadb] pb-3 mb-5">
                Fotos (hasta 5)
              </h2>

              <!-- Grid preview -->
              <div class="grid grid-cols-2 gap-2 mb-4">
                <div
                  v-for="i in 2"
                  :key="i"
                  class="aspect-square rounded-xl overflow-hidden relative"
                >
                  <template v-if="dogPhotoPreviews[i - 1]">
                    <img :src="dogPhotoPreviews[i - 1]" class="w-full h-full object-cover" />
                    <button
                      type="button"
                      class="absolute top-2 right-2 bg-black/50 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                      @click="removeDogPhoto(i - 1)"
                    >
                      <span class="material-symbols-outlined text-sm leading-none">close</span>
                    </button>
                  </template>
                  <div
                    v-else
                    class="w-full h-full border-2 border-dashed border-[#DBD8D0] bg-[#fff1e8] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#F4C07D] transition-all"
                    @click="triggerDogFileInput"
                  >
                    <span class="material-symbols-outlined text-[#4f4539]/50">add_a_photo</span>
                    <span class="text-[10px] font-bold uppercase text-[#4f4539]/50">Subir</span>
                  </div>
                </div>
              </div>

              <!-- Drop zone -->
              <div
                class="border-2 border-dashed border-[#DBD8D0] rounded-xl p-8 flex flex-col items-center text-center gap-3 bg-[#fff1e8]/30 hover:bg-[#fff1e8] transition-all cursor-pointer"
                @click="triggerDogFileInput"
                @dragover.prevent
                @drop.prevent="handleDogDrop"
              >
                <div class="w-12 h-12 rounded-full bg-[#F4C07D]/20 flex items-center justify-center text-[#7d571e]">
                  <span class="material-symbols-outlined">upload_file</span>
                </div>
                <div>
                  <p class="font-bold text-[#281808] text-sm">Arrastrá o elegí tus fotos</p>
                  <p class="text-[#4f4539]/60 text-xs mt-0.5">JPEG o PNG, máx. 5MB cada una</p>
                </div>
                <span class="text-xs text-[#4f4539]/50 font-medium">{{ dogPhotoPreviews.length }}/5 subidas</span>
              </div>
              <input ref="dogFileInput" type="file" accept="image/*" multiple class="hidden" @change="handleDogFileChange" />
            </div>

            <!-- CTA -->
            <div class="flex flex-col gap-3">
              <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
              <button
                type="button"
                :disabled="saving"
                class="w-full py-4 bg-[#F4C07D] text-[#382615] rounded-xl font-bold text-xl font-jakarta shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-60"
                @click="handleSaveStep2"
              >
                {{ saving ? 'Guardando...' : 'Completar Perfil' }}
              </button>
              <button
                type="button"
                class="w-full py-3 text-[#4f4539] font-medium hover:text-[#382615] transition-colors flex items-center justify-center gap-2 text-sm"
                @click="currentStep = 1"
              >
                <span class="material-symbols-outlined text-sm">arrow_back</span>
                Volver
              </button>
            </div>

          </div>
        </div>
      </template>

    </div>

    <!-- ─── MOBILE ─── -->
    <div class="md:hidden relative min-h-screen">

      <!-- Decorative paw -->
      <div class="fixed top-0 right-0 pointer-events-none overflow-hidden -z-10 opacity-20">
        <span class="material-symbols-outlined text-[200px] text-[#382615] -mr-20 -mt-10">pets</span>
      </div>

      <!-- Mobile header -->
      <div class="px-6 pt-6 pb-4 flex flex-col items-center gap-4">
        <div class="w-full max-w-md bg-[#382615]/10 h-1.5 rounded-full overflow-hidden">
          <div :style="{ width: hasDogs || currentStep === 2 ? '100%' : '50%' }" class="bg-[#F4C07D] h-full rounded-full transition-all duration-500"></div>
        </div>
        <div class="w-full flex justify-between px-1">
          <span class="text-xs font-bold uppercase tracking-widest text-[#795832] font-jakarta">Paso {{ currentStep }} de {{ hasDogs ? 1 : 2 }}</span>
          <span class="text-xs font-bold uppercase tracking-widest text-[#795832] font-jakarta flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">{{ currentStep === 1 ? 'account_circle' : 'pets' }}</span>
            {{ currentStep === 1 ? 'Tu perfil' : 'Tu perro' }}
          </span>
        </div>
      </div>

      <!-- STEP 1: Owner Profile Mobile -->
      <template v-if="currentStep === 1">
        <div class="px-6 pb-40">
          <section class="mb-7">
            <h1 class="text-[32px] font-bold leading-tight tracking-tight text-[#382615] font-jakarta mb-1">
              Cuentanos sobre ti.
            </h1>
            <p class="text-base text-[#382615]/70">Dejá que la manada sepa quién maneja la correa.</p>
          </section>

          <form class="flex flex-col gap-6" @submit.prevent="handleSaveStep1">

            <!-- Avatar -->
            <section class="flex flex-col items-center">
              <label class="relative cursor-pointer">
                <input type="file" accept="image/*" class="sr-only" @change="handleFileChange" />
                <div class="w-32 h-32 rounded-full bg-white shadow-[0_4px_20px_rgba(113,62,24,0.08)] border-4 border-white overflow-hidden flex items-center justify-center">
                  <img
                    v-if="avatarPreview"
                    :src="avatarPreview"
                    alt="Foto de perfil"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="material-symbols-outlined text-5xl text-[#d3c4b4]">person</span>
                </div>
                <div class="absolute bottom-0 right-0 bg-[#f4c07d] w-9 h-9 rounded-full shadow-lg border-2 border-white flex items-center justify-center pointer-events-none">
                  <span class="material-symbols-outlined text-[#382615] text-lg leading-none">photo_camera</span>
                </div>
              </label>
              <p class="text-xs font-bold uppercase tracking-widest text-[#795832] mt-4 font-jakarta">Sube tu foto de perfil</p>
            </section>

            <!-- Nombre -->
            <div class="flex flex-col gap-2">
              <label for="owner-name-m" class="text-xs font-bold uppercase tracking-widest text-[#7d571e] font-jakarta">
                Tu nombre
              </label>
              <input
                id="owner-name-m"
                v-model="form.name"
                type="text"
                placeholder="¿Cómo te llamamos?"
                required
                class="w-full h-14 px-4 bg-white border border-[#DBD8D0] rounded-xl focus:ring-0 focus:border-[#B78F64] text-base text-[#281808] outline-none transition-colors"
              />
            </div>

            <!-- Ciudad -->
            <div class="flex flex-col gap-2">
              <label for="location-m" class="text-xs font-bold uppercase tracking-widest text-[#7d571e] font-jakarta">
                Ciudad / Ubicación
              </label>
              <div class="relative">
                <input
                  id="location-m"
                  v-model="form.location"
                  type="text"
                  placeholder="ej. Buenos Aires, CABA"
                  class="w-full h-14 pl-12 pr-4 bg-white border border-[#DBD8D0] rounded-xl focus:ring-0 focus:border-[#B78F64] text-base text-[#281808] outline-none transition-colors"
                />
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#d3c4b4]">location_on</span>
              </div>
            </div>

            <!-- Bio -->
            <div class="flex flex-col gap-2">
              <label for="bio-m" class="text-xs font-bold uppercase tracking-widest text-[#7d571e] font-jakarta">
                Algo sobre ti
              </label>
              <textarea
                id="bio-m"
                v-model="form.bio"
                placeholder="Amante del senderismo y fanático del café..."
                rows="3"
                class="w-full px-4 py-4 bg-white border border-[#DBD8D0] rounded-xl focus:ring-0 focus:border-[#B78F64] text-base text-[#281808] outline-none transition-colors resize-none"
              ></textarea>
            </div>

            <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

          </form>
        </div>

        <!-- Fixed bottom CTA Step 1 -->
        <div class="fixed bottom-[72px] left-0 w-full bg-white/80 backdrop-blur-md px-6 py-5 border-t border-[#DBD8D0]/50 z-[60]">
          <div class="max-w-md mx-auto">
            <button
              :disabled="saving"
              class="w-full h-14 bg-[#F4C07D] text-[#382615] rounded-xl font-bold text-lg font-jakarta flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(244,192,125,0.4)] hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
              @click="handleSaveStep1"
            >
              <span>{{ saving ? 'Guardando...' : hasDogs ? 'Guardar cambios' : 'Siguiente' }}</span>
              <span v-if="!saving" class="material-symbols-outlined">{{ hasDogs ? 'check' : 'arrow_forward' }}</span>
            </button>
            <p class="text-center mt-3 text-xs text-[#795832]/60 font-jakarta">Podés cambiar estos datos cuando quieras</p>
          </div>
        </div>
      </template>

      <!-- STEP 2: Dog Profile Mobile -->
      <template v-if="currentStep === 2">
        <div class="px-5 space-y-6">

          <!-- Photos -->
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-[#795832] mb-3 font-jakarta">
              Subí fotos (hasta 5)
            </p>
            <div class="grid grid-cols-3 gap-2">
              <div
                v-for="i in 5"
                :key="i"
                class="aspect-square rounded-xl overflow-hidden relative"
              >
                <template v-if="dogPhotoPreviews[i - 1]">
                  <img :src="dogPhotoPreviews[i - 1]" class="w-full h-full object-cover" />
                  <button
                    type="button"
                    class="absolute top-1 right-1 bg-black/50 text-white w-5 h-5 rounded-full flex items-center justify-center"
                    @click="removeDogPhoto(i - 1)"
                  >
                    <span class="material-symbols-outlined text-xs leading-none">close</span>
                  </button>
                </template>
                <div
                  v-else
                  class="w-full h-full border-2 border-dashed border-[#DBD8D0] bg-[#fff1e8] flex items-center justify-center cursor-pointer hover:border-[#F4C07D] transition-all"
                  @click="triggerDogFileInput"
                >
                  <span class="material-symbols-outlined text-[#4f4539]/40 text-xl">add</span>
                </div>
              </div>
            </div>
            <input ref="dogFileInputMobile" type="file" accept="image/*" multiple class="hidden" @change="handleDogFileChange" />
          </div>

          <!-- Name -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold uppercase tracking-widest text-[#795832] font-jakarta">Nombre del perro</label>
            <input
              v-model="dogForm.name"
              type="text"
              placeholder="Barkley"
              required
              class="w-full h-14 px-4 bg-white border border-[#DBD8D0] rounded-xl focus:border-[#B78F64] focus:ring-0 outline-none transition-all shadow-sm"
            />
          </div>

          <!-- Breed + Age -->
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-widest text-[#795832] font-jakarta">Raza</label>
              <input
                v-model="dogForm.breed"
                type="text"
                placeholder="Golden Retriever"
                required
                class="w-full h-14 px-4 bg-white border border-[#DBD8D0] rounded-xl focus:border-[#B78F64] focus:ring-0 outline-none transition-all shadow-sm"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-widest text-[#795832] font-jakarta">Edad (años)</label>
              <input
                v-model.number="dogForm.age"
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
            <label class="text-xs font-bold uppercase tracking-widest text-[#795832] font-jakarta">Sexo</label>
            <div class="flex p-1 bg-[#fff1e8] rounded-xl">
              <button
                type="button"
                class="flex-1 h-12 rounded-[10px] font-bold transition-all font-jakarta"
                :class="dogForm.sex === 'male' ? 'bg-[#F4C07D] text-[#382615] shadow-sm' : 'text-[#4f4539]'"
                @click="dogForm.sex = 'male'"
              >Macho</button>
              <button
                type="button"
                class="flex-1 h-12 rounded-[10px] font-bold transition-all font-jakarta"
                :class="dogForm.sex === 'female' ? 'bg-[#F4C07D] text-[#382615] shadow-sm' : 'text-[#4f4539]'"
                @click="dogForm.sex = 'female'"
              >Hembra</button>
            </div>
          </div>

          <!-- Size -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold uppercase tracking-widest text-[#795832] font-jakarta">Tamaño</label>
            <div class="flex gap-2">
              <button
                v-for="s in sizes"
                :key="s.value"
                type="button"
                class="flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all font-jakarta"
                :class="dogForm.size === s.value
                  ? 'bg-[#F4C07D] border-[#F4C07D] text-[#382615]'
                  : 'border-[#DBD8D0] bg-white text-[#4f4539]'"
                @click="dogForm.size = s.value"
              >{{ s.label }}</button>
            </div>
          </div>

          <!-- Personality -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold uppercase tracking-widest text-[#795832] font-jakarta">Personalidad</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in personalityOptions"
                :key="tag"
                type="button"
                class="px-3 py-1.5 rounded-full text-sm font-medium transition-all border"
                :class="dogForm.personality_tags.includes(tag)
                  ? 'bg-[#F4C07D] border-[#F4C07D] text-[#382615] font-bold'
                  : 'bg-white border-[#DBD8D0] text-[#4f4539]'"
                @click="toggleTag(tag)"
              >{{ tag }}</button>
            </div>
          </div>

          <!-- Bio -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold uppercase tracking-widest text-[#795832] font-jakarta">Bio</label>
            <textarea
              v-model="dogForm.bio"
              maxlength="150"
              rows="3"
              placeholder="Contanos sobre los juguetes y hobbies favoritos..."
              class="w-full p-4 bg-white border border-[#DBD8D0] rounded-xl focus:border-[#B78F64] focus:ring-0 outline-none transition-all resize-none shadow-sm"
            />
          </div>

          <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

        </div>

        <!-- Fixed bottom CTA Step 2 -->
        <div class="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md px-6 py-5 border-t border-[#DBD8D0]/50 z-50">
          <div class="max-w-md mx-auto space-y-3">
            <button
              type="button"
              :disabled="saving"
              class="w-full h-14 bg-[#F4C07D] text-[#382615] rounded-xl font-bold text-lg font-jakarta flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(244,192,125,0.4)] active:scale-95 transition-all disabled:opacity-60"
              @click="handleSaveStep2"
            >
              <span>{{ saving ? 'Guardando...' : 'Completar' }}</span>
              <span v-if="!saving" class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">pets</span>
            </button>
            <button
              type="button"
              class="w-full h-10 text-[#4f4539] font-medium text-sm rounded-xl hover:bg-[#ffeadb] transition-colors"
              @click="currentStep = 1"
            >
              Volver
            </button>
          </div>
        </div>
      </template>

    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const authStore = useAuthStore()
const dogsStore = useDogsStore()
const router = useRouter()

const currentStep = ref(1)
const hasDogs = computed(() => dogsStore.dogs.length > 0)
const avatarFile = ref<File | null>(null)
const dogFileInput = ref<HTMLInputElement | null>(null)
const dogFileInputMobile = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<string | null>(null)
const saving = ref(false)
const error = ref('')

const form = reactive({
  name: authStore.user?.name ?? '',
  location: authStore.user?.location ?? '',
  bio: authStore.user?.bio ?? '',
})

const dogForm = reactive({
  name: '',
  breed: '',
  age: 2,
  sex: 'male' as string,
  size: 'medium' as string,
  bio: '',
  personality_tags: [] as string[],
})

const dogPhotoFiles = ref<File[]>([])
const dogPhotoPreviews = ref<string[]>([])

const breeds = [
  'Labrador Retriever', 'Golden Retriever', 'French Bulldog', 'Pastor Alemán',
  'Bulldog', 'Poodle', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Dachshund',
  'Boxer', 'Border Collie', 'Shih Tzu', 'Maltés', 'Cocker Spaniel', 'Doberman',
  'Australian Shepherd', 'Siberian Husky', 'Chihuahua', 'Mestizo',
]

const sizes = [
  { value: 'small', label: 'Chico' },
  { value: 'medium', label: 'Mediano' },
  { value: 'large', label: 'Grande' },
]

const personalityOptions = [
  'Juguetón', 'Amigable', 'Tranquilo', 'Enérgico',
  'Tímido', 'Protector', 'Cariñoso', 'Activo',
]

onMounted(async () => {
  await dogsStore.fetchDogs().catch(() => {})
  if (!authStore.user?.location && !authStore.user?.bio) {
    try {
      await authStore.fetchProfile()
      form.name = authStore.user?.name ?? ''
      form.location = authStore.user?.location ?? ''
      form.bio = authStore.user?.bio ?? ''
    } catch (_) {
      // profile already loaded from store
    }
  }
  if (authStore.user?.avatar) {
    avatarPreview.value = authStore.user.avatar
  }
})

const triggerDogFileInput = () => {
  const input = dogFileInput.value ?? dogFileInputMobile.value
  input?.click()
}

const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  avatarFile.value = file
  const reader = new FileReader()
  reader.onload = (evt) => {
    avatarPreview.value = (evt.target?.result as string) ?? null
  }
  reader.readAsDataURL(file)
}

const handleDogFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  addDogFiles(target.files)
  target.value = ''
}

const handleDogDrop = (e: DragEvent) => {
  addDogFiles(e.dataTransfer?.files ?? null)
}

const addDogFiles = (files: FileList | null) => {
  if (!files) return
  for (const file of Array.from(files)) {
    if (dogPhotoFiles.value.length >= 5) break
    dogPhotoFiles.value.push(file)
    dogPhotoPreviews.value.push(URL.createObjectURL(file))
  }
}

const removeDogPhoto = (index: number) => {
  URL.revokeObjectURL(dogPhotoPreviews.value[index])
  dogPhotoFiles.value.splice(index, 1)
  dogPhotoPreviews.value.splice(index, 1)
}

const toggleTag = (tag: string) => {
  const idx = dogForm.personality_tags.indexOf(tag)
  if (idx === -1) dogForm.personality_tags.push(tag)
  else dogForm.personality_tags.splice(idx, 1)
}

const handleSaveStep1 = async () => {
  error.value = ''
  if (!form.name.trim()) {
    error.value = 'El nombre es obligatorio.'
    return
  }

  if (hasDogs.value) {
    // Usuario editando perfil existente — guardar y redirigir
    saving.value = true
    try {
      await authStore.updateProfile(
        { name: form.name.trim(), location: form.location.trim(), bio: form.bio.trim() },
        avatarFile.value ?? undefined,
      )
      await router.push('/app/dogs')
    } catch {
      error.value = 'No se pudo guardar el perfil. Intentá de nuevo.'
    } finally {
      saving.value = false
    }
  } else {
    // Onboarding — solo avanzar al paso 2, sin llamada a la API
    currentStep.value = 2
  }
}

const handleSaveStep2 = async () => {
  error.value = ''
  if (!dogForm.name.trim()) {
    error.value = 'El nombre del perro es obligatorio.'
    return
  }
  saving.value = true
  try {
    // Guardar perfil del dueño (no se guardó en paso 1 durante onboarding)
    await authStore.updateProfile(
      { name: form.name.trim(), location: form.location.trim(), bio: form.bio.trim() },
      avatarFile.value ?? undefined,
    )

    // Crear perro
    const dog = await dogsStore.createDog({
      name: dogForm.name.trim(),
      breed: dogForm.breed.trim(),
      age: dogForm.age,
      sex: dogForm.sex,
      size: dogForm.size,
      bio: dogForm.bio.trim(),
      personality_tags: dogForm.personality_tags,
    })

    for (const file of dogPhotoFiles.value) {
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
  background: #F4C07D;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(113, 62, 24, 0.2);
}
</style>
