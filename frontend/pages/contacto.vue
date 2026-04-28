<script setup lang="ts">
definePageMeta({ layout: false })

const config = useRuntimeConfig()

const form = reactive({
  name: '',
  phone: '',
  email: '',
  message: '',
})

const loading = ref(false)
const success = ref(false)
const error = ref('')

const handleSubmit = async () => {
  error.value = ''
  loading.value = true
  try {
    const res = await fetch(`${config.public.apiBase}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (!res.ok) throw new Error('No se pudo enviar el mensaje')
    success.value = true
    form.name = ''
    form.phone = ''
    form.email = ''
    form.message = ''
  } catch {
    error.value =
      'Hubo un problema al enviar tu mensaje. Intenta de nuevo o escríbenos directo a vidal.fullstack@gmail.com'
  } finally {
    loading.value = false
  }
}
</script>

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

    <main class="flex-1 pt-28 pb-16 px-6 relative z-10">
      <div class="max-w-2xl mx-auto">
        <!-- Page title -->
        <div class="mb-10 text-center">
          <span
            class="inline-flex items-center gap-2 text-[#7d571e] text-sm font-medium uppercase tracking-widest mb-4"
          >
            <span class="material-symbols-outlined text-base">mail</span>
            Escríbenos
          </span>
          <h1
            class="text-[36px] md:text-[48px] font-extrabold text-[#382615] font-jakarta leading-tight"
          >
            Contacto
          </h1>
          <p class="text-[#7d571e] mt-3 text-base max-w-md mx-auto leading-relaxed">
            ¿Tienes alguna pregunta, sugerencia o simplemente quieres saludar? Con gusto te
            respondemos.
          </p>
        </div>

        <!-- Success state -->
        <div
          v-if="success"
          class="bg-white rounded-2xl p-10 shadow-[0_4px_20px_rgba(113,62,24,0.06)] text-center"
        >
          <div
            class="w-20 h-20 bg-[#F4C07D]/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <span
              class="material-symbols-outlined text-[#382615] text-4xl"
              style="font-variation-settings: 'FILL' 1"
              >check_circle</span
            >
          </div>
          <h2 class="text-2xl font-bold text-[#382615] font-jakarta mb-3">¡Mensaje enviado!</h2>
          <p class="text-[#7d571e] mb-8 leading-relaxed">
            Gracias por escribirnos. Te responderemos a la brevedad posible.
          </p>
          <button
            class="inline-flex items-center gap-2 bg-[#F4C07D] text-[#382615] px-8 py-4 rounded-2xl font-bold font-jakarta hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 active:scale-95"
            @click="success = false"
          >
            <span class="material-symbols-outlined">edit</span>
            Enviar otro mensaje
          </button>
        </div>

        <!-- Form -->
        <form
          v-else
          class="bg-white rounded-2xl p-8 md:p-10 shadow-[0_4px_20px_rgba(113,62,24,0.06)] space-y-6"
          @submit.prevent="handleSubmit"
        >
          <!-- Nombre -->
          <div class="space-y-2">
            <label
              class="text-sm font-semibold text-[#382615] font-jakarta block"
              for="contact-name"
            >
              Nombre completo <span class="text-red-400">*</span>
            </label>
            <div class="relative group">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#B78F64] group-focus-within:text-[#382615] transition-colors text-xl"
                >person</span
              >
              <input
                id="contact-name"
                v-model="form.name"
                type="text"
                required
                placeholder="Tu nombre"
                class="w-full pl-12 pr-4 py-4 bg-[#DBD8D0]/30 rounded-2xl border-[1.5px] border-[#DBD8D0] focus:border-[#B78F64] focus:ring-4 focus:ring-[#F4C07D]/20 transition-all outline-none text-[#382615] text-sm"
              />
            </div>
          </div>

          <!-- Teléfono -->
          <div class="space-y-2">
            <label
              class="text-sm font-semibold text-[#382615] font-jakarta block"
              for="contact-phone"
            >
              Número de teléfono
            </label>
            <div class="relative group">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#B78F64] group-focus-within:text-[#382615] transition-colors text-xl"
                >phone</span
              >
              <input
                id="contact-phone"
                v-model="form.phone"
                type="tel"
                placeholder="+52 55 0000 0000"
                class="w-full pl-12 pr-4 py-4 bg-[#DBD8D0]/30 rounded-2xl border-[1.5px] border-[#DBD8D0] focus:border-[#B78F64] focus:ring-4 focus:ring-[#F4C07D]/20 transition-all outline-none text-[#382615] text-sm"
              />
            </div>
          </div>

          <!-- Correo -->
          <div class="space-y-2">
            <label
              class="text-sm font-semibold text-[#382615] font-jakarta block"
              for="contact-email"
            >
              Correo electrónico <span class="text-red-400">*</span>
            </label>
            <div class="relative group">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#B78F64] group-focus-within:text-[#382615] transition-colors text-xl"
                >mail</span
              >
              <input
                id="contact-email"
                v-model="form.email"
                type="email"
                required
                placeholder="tu@correo.com"
                class="w-full pl-12 pr-4 py-4 bg-[#DBD8D0]/30 rounded-2xl border-[1.5px] border-[#DBD8D0] focus:border-[#B78F64] focus:ring-4 focus:ring-[#F4C07D]/20 transition-all outline-none text-[#382615] text-sm"
              />
            </div>
          </div>

          <!-- Mensaje -->
          <div class="space-y-2">
            <label
              class="text-sm font-semibold text-[#382615] font-jakarta block"
              for="contact-message"
            >
              Comentario o pregunta <span class="text-red-400">*</span>
            </label>
            <textarea
              id="contact-message"
              v-model="form.message"
              required
              rows="5"
              placeholder="Escribe tu mensaje aquí..."
              class="w-full px-4 py-4 bg-[#DBD8D0]/30 rounded-2xl border-[1.5px] border-[#DBD8D0] focus:border-[#B78F64] focus:ring-4 focus:ring-[#F4C07D]/20 transition-all outline-none text-[#382615] text-sm resize-none"
            />
          </div>

          <!-- Error -->
          <p v-if="error" class="text-red-500 text-sm text-center bg-red-50 rounded-xl px-4 py-3">
            {{ error }}
          </p>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-[#382615] text-[#F4C07D] py-5 px-6 rounded-2xl font-bold font-jakarta text-base shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="material-symbols-outlined animate-spin"
              >progress_activity</span
            >
            <span v-else class="material-symbols-outlined">send</span>
            {{ loading ? 'Enviando...' : 'Enviar mensaje' }}
          </button>

          <p class="text-center text-xs text-[#B78F64]">
            También puedes escribirnos directo a
            <a
              href="mailto:vidal.fullstack@gmail.com"
              class="underline hover:text-[#382615] transition-colors"
              >vidal.fullstack@gmail.com</a
            >
          </p>
        </form>
      </div>
    </main>

    <!-- Footer -->
    <LayoutPublicFooter />
    <LayoutPublicBottomNav />
  </div>
</template>
