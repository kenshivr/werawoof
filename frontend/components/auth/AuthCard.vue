<script setup lang="ts">
const props = defineProps<{ mode: 'login' | 'register' }>()

const isRegister = computed(() => props.mode === 'register')

const authStore = useAuthStore()
const config = useRuntimeConfig()

const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const touchedEmail = ref(false)
const touchedConfirm = ref(false)

const withGoogle = () => {
  window.location.href = `${config.public.apiBase}/auth/google`
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const isEmailValid = computed(() => emailRegex.test(form.email))
const passwordsMatch = computed(() => form.password === form.confirmPassword)
const isFormValid = computed(() => {
  if (isRegister.value) {
    return (
      form.name.trim() !== '' && isEmailValid.value && form.password !== '' && passwordsMatch.value
    )
  }
  return form.email !== '' && form.password !== ''
})

const emailInputClass = computed(() => {
  if (!isRegister.value || !touchedEmail.value || !form.email)
    return 'border-[#DBD8D0] focus:border-[#B78F64] focus:ring-primary-container/20'
  return isEmailValid.value
    ? 'border-green-400 focus:border-green-500 focus:ring-green-100'
    : 'border-red-400 focus:border-red-500 focus:ring-red-100'
})

const confirmPasswordInputClass = computed(() => {
  if (!touchedConfirm.value || !form.confirmPassword)
    return 'border-[#DBD8D0] focus:border-[#B78F64] focus:ring-primary-container/20'
  return passwordsMatch.value
    ? 'border-green-400 focus:border-green-500 focus:ring-green-100'
    : 'border-red-400 focus:border-red-500 focus:ring-red-100'
})

const handleSubmit = async () => {
  if (isRegister.value) {
    touchedEmail.value = true
    touchedConfirm.value = true
    if (!isFormValid.value) return
  }
  error.value = ''
  loading.value = true
  try {
    if (isRegister.value) {
      await authStore.register({ name: form.name, email: form.email, password: form.password })
    } else {
      await authStore.login({ email: form.email, password: form.password })
    }
    await navigateTo('/app')
  } catch (e: unknown) {
    error.value = isRegister.value
      ? ((e as Error).message ?? 'Ocurrió un error al crear tu cuenta. Intenta de nuevo.')
      : ((e as Error).message ?? 'Correo o contraseña incorrectos.')
  } finally {
    loading.value = false
  }
}

const copy = computed(() =>
  isRegister.value
    ? {
        leftTitleA: 'Tu can merece',
        leftTitleB: 'un mejor amigo.',
        leftBody:
          'Únete a miles de dueños que ya conectaron a sus peludos con nuevos compañeros de aventura, juego y cariño.',
        heading: 'Crea tu cuenta',
        desktopSubText: '¿Ya tienes cuenta?',
        desktopSubLink: 'Inicia sesión',
        desktopSubLinkTo: '/auth/login',
        mobileSub: 'Regístrate para ver quién menea cerca de ti',
        googleBtn: 'Registrarse con Google',
        submitBtn: 'Crear cuenta',
        loadingBtn: 'Creando cuenta...',
        mobileAltText: '¿Ya tienes cuenta?',
        mobileAltLink: 'Inicia sesión',
        mobileAltLinkTo: '/auth/login',
        termsPrefix: 'Al registrarte, aceptas los',
      }
    : {
        leftTitleA: 'Donde cada patita',
        leftTitleB: 'encuentra su historia.',
        leftBody:
          'Únete a la comunidad más grande de amantes de los canes y encuentra al compañero ideal para la próxima aventura de tu peludo.',
        heading: 'Bienvenido de nuevo',
        desktopSubText: '¿No tienes cuenta?',
        desktopSubLink: 'Crea una ahora',
        desktopSubLinkTo: '/auth/register',
        mobileSub: 'Inicia sesión para ver quién menea cerca de ti',
        googleBtn: 'Continuar con Google',
        submitBtn: 'Ingresar',
        loadingBtn: 'Ingresando...',
        mobileAltText: '¿No tienes cuenta?',
        mobileAltLink: 'Regístrate',
        mobileAltLinkTo: '/auth/register',
        termsPrefix: 'Al continuar, aceptas los',
      }
)
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <!-- Mobile branding -->
    <div class="md:hidden w-full max-w-[400px] text-center mb-5 flex flex-col justify-center gap-4">
      <img src="/images/logo-horizontal.webp" alt="WeraWoof" class="w-1/2 mx-auto" />
      <p class="text-body-md text-on-surface-variant mt-1">
        Encontrá al compañero perfecto para tu can
      </p>
    </div>

    <!-- Main card -->
    <main
      class="w-full max-w-[400px] md:max-w-5xl bg-white rounded-2xl md:rounded-[32px] overflow-hidden shadow-[0_12px_40px_rgba(113,62,24,0.12)] flex flex-col md:flex-row md:min-h-[720px]"
    >
      <!-- Left: photo panel — desktop only -->
      <section class="hidden md:block relative w-1/2 overflow-hidden">
        <img
          src="/images/vertical.webp"
          alt="Wera the dog"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-[#382615]/80 via-[#382615]/20 to-transparent"
        />
        <div class="absolute bottom-12 left-12 right-12">
          <div class="mb-4">
            <span
              class="inline-block px-4 py-1 bg-primary-container text-on-primary-container text-label-md font-label-md rounded-full shadow-sm font-jakarta"
            >
              Comunidad WeraWoof
            </span>
          </div>
          <h2 class="text-h1 font-h1 text-white mb-4 leading-tight font-jakarta">
            {{ copy.leftTitleA }}<br />{{ copy.leftTitleB }}
          </h2>
          <p class="text-body-lg text-white/90 max-w-md">{{ copy.leftBody }}</p>
        </div>
      </section>

      <!-- Right: form panel -->
      <section class="w-full md:w-1/2 flex flex-col bg-white">
        <!-- Mobile: image banner -->
        <div class="md:hidden h-40 w-full overflow-hidden">
          <img src="/images/horizontal.webp" alt="Wera" class="w-full h-full object-cover" />
        </div>

        <!-- Form area -->
        <div class="flex-1 flex items-center justify-center p-6 md:p-16">
          <div class="w-full max-w-md space-y-6">
            <!-- Header -->
            <div class="text-center md:text-left">
              <h2 class="text-h2 font-h2 text-on-surface mb-2 font-jakarta">{{ copy.heading }}</h2>
              <p class="text-body-md text-on-surface-variant">
                <span class="hidden md:inline">
                  {{ copy.desktopSubText }}
                  <NuxtLink
                    :to="copy.desktopSubLinkTo"
                    class="text-primary font-bold hover:underline decoration-primary-container decoration-4 underline-offset-4"
                    >{{ copy.desktopSubLink }}</NuxtLink
                  >
                </span>
                <span class="md:hidden">{{ copy.mobileSub }}</span>
              </p>
            </div>

            <!-- Google — desktop: antes del form -->
            <button
              type="button"
              class="hidden md:flex w-full items-center justify-center gap-4 bg-white border-[1.5px] border-outline-variant hover:border-outline py-4 px-6 rounded-2xl transition-all duration-200 shadow-sm active:scale-[0.98]"
              @click="withGoogle"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span class="text-label-md font-label-md text-on-surface">{{ copy.googleBtn }}</span>
            </button>

            <!-- OR divider — desktop -->
            <div class="hidden md:flex items-center gap-4">
              <div class="flex-grow border-t border-outline-variant" />
              <span class="text-label-md font-label-md text-outline">O</span>
              <div class="flex-grow border-t border-outline-variant" />
            </div>

            <!-- Form -->
            <form class="space-y-5" @submit.prevent="handleSubmit">
              <!-- Nombre — solo registro -->
              <div v-if="isRegister" class="space-y-2">
                <label class="text-label-md font-label-md text-on-surface block px-1" for="name">
                  Nombre
                </label>
                <div class="relative group">
                  <span
                    class="material-symbols-outlined hidden md:block absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors"
                    >person</span
                  >
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="Tu nombre"
                    class="w-full px-4 md:pl-12 md:pr-4 py-4 bg-white rounded-2xl border-[1.5px] border-[#DBD8D0] focus:border-[#B78F64] focus:ring-4 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-body-md"
                  />
                </div>
              </div>

              <!-- Correo -->
              <div class="space-y-2">
                <label class="text-label-md font-label-md text-on-surface block px-1" for="email">
                  Correo electrónico
                </label>
                <div class="relative group">
                  <span
                    class="material-symbols-outlined hidden md:block absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors"
                    >mail</span
                  >
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="tucorreo@ejemplo.com"
                    class="w-full px-4 md:pl-12 md:pr-4 py-4 bg-white rounded-2xl border-[1.5px] focus:ring-4 transition-all outline-none text-on-surface text-body-md"
                    :class="emailInputClass"
                    @blur="touchedEmail = true"
                  />
                </div>
                <p
                  v-if="isRegister && touchedEmail && form.email && !isEmailValid"
                  class="text-red-500 text-xs px-1"
                >
                  Ingresa un correo electrónico válido.
                </p>
              </div>

              <!-- Contraseña -->
              <div class="space-y-2">
                <div class="flex justify-between items-center px-1">
                  <label class="text-label-md font-label-md text-on-surface block" for="password">
                    Contraseña
                  </label>
                  <NuxtLink
                    v-if="!isRegister"
                    to="/auth/forgot-password"
                    class="text-label-md font-label-md text-primary hover:underline hidden md:block"
                    >¿Olvidaste?</NuxtLink
                  >
                </div>
                <div class="relative group">
                  <span
                    class="material-symbols-outlined hidden md:block absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors"
                    >lock</span
                  >
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    placeholder="••••••••"
                    class="w-full px-4 md:pl-12 pr-12 py-4 bg-white rounded-2xl border-[1.5px] border-[#DBD8D0] focus:border-[#B78F64] focus:ring-4 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-body-md"
                  />
                  <button
                    type="button"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
                    @click="showPassword = !showPassword"
                  >
                    <span class="material-symbols-outlined">{{
                      showPassword ? 'visibility_off' : 'visibility'
                    }}</span>
                  </button>
                </div>
              </div>

              <!-- Confirmar contraseña — solo registro -->
              <div v-if="isRegister" class="space-y-2">
                <label
                  class="text-label-md font-label-md text-on-surface block px-1"
                  for="confirmPassword"
                >
                  Confirmar contraseña
                </label>
                <div class="relative group">
                  <span
                    class="material-symbols-outlined hidden md:block absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors"
                    >lock_reset</span
                  >
                  <input
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    required
                    placeholder="••••••••"
                    class="w-full px-4 md:pl-12 pr-12 py-4 bg-white rounded-2xl border-[1.5px] focus:ring-4 transition-all outline-none text-on-surface text-body-md"
                    :class="confirmPasswordInputClass"
                    @blur="touchedConfirm = true"
                  />
                  <button
                    type="button"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <span class="material-symbols-outlined">{{
                      showConfirmPassword ? 'visibility_off' : 'visibility'
                    }}</span>
                  </button>
                </div>
                <p
                  v-if="touchedConfirm && form.confirmPassword && !passwordsMatch"
                  class="text-red-500 text-xs px-1"
                >
                  Las contraseñas no coinciden.
                </p>
              </div>

              <!-- Recuérdame + Olvidaste — solo login -->
              <div v-if="!isRegister" class="flex items-center justify-between px-1">
                <label class="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    class="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary-container"
                  />
                  <span class="text-body-md text-on-surface-variant">Recuérdame</span>
                </label>
                <NuxtLink
                  to="/auth/forgot-password"
                  class="text-label-md font-label-md text-primary hover:underline md:hidden"
                  >¿Olvidaste tu contraseña?</NuxtLink
                >
              </div>

              <!-- Error -->
              <p v-if="error" class="text-error text-sm text-center">{{ error }}</p>

              <!-- Submit -->
              <button
                type="submit"
                :disabled="loading || !isFormValid"
                class="w-full bg-[#F4C07D] text-[#382615] py-5 px-6 rounded-2xl font-h3 text-h3 font-jakarta shadow-lg shadow-primary-container/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
              >
                {{ loading ? copy.loadingBtn : copy.submitBtn }}
                <span v-if="!loading" class="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>

            <!-- OR + Google — mobile: después del form -->
            <div class="md:hidden space-y-4">
              <div class="flex items-center gap-4">
                <div class="flex-grow border-t border-[#DBD8D0]" />
                <span class="text-label-md font-label-md text-on-surface-variant">O</span>
                <div class="flex-grow border-t border-[#DBD8D0]" />
              </div>
              <button
                type="button"
                class="w-full flex items-center justify-center gap-3 bg-white border-[1.5px] border-[#B78F64] text-[#382615] text-label-md font-label-md rounded-2xl py-4 px-6 hover:bg-stone-50 active:scale-95 transition-all duration-200"
                @click="withGoogle"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {{ copy.googleBtn }}
              </button>
            </div>

            <!-- Link alternativo — mobile -->
            <div class="md:hidden text-center">
              <p class="text-body-md text-on-surface-variant">
                {{ copy.mobileAltText }}
                <NuxtLink
                  :to="copy.mobileAltLinkTo"
                  class="text-primary font-bold hover:underline"
                  >{{ copy.mobileAltLink }}</NuxtLink
                >
              </p>
            </div>

            <!-- Terms — desktop -->
            <p class="hidden md:block text-center text-label-md font-label-md text-outline pt-2">
              {{ copy.termsPrefix }}
              <NuxtLink
                to="/terminos-de-servicio"
                class="underline decoration-outline-variant decoration-1 underline-offset-4"
                >Términos de Servicio</NuxtLink
              >
              de WeraWoof.
            </p>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer — mobile -->
    <footer class="md:hidden w-full max-w-[400px] mt-8 text-center space-y-2">
      <div class="flex justify-center gap-6">
        <NuxtLink
          to="/politica-de-privacidad"
          class="text-label-md font-label-md text-on-surface-variant/60 hover:text-on-surface-variant transition-colors"
          >Política de Privacidad</NuxtLink
        >
        <NuxtLink
          to="/terminos-de-servicio"
          class="text-label-md font-label-md text-on-surface-variant/60 hover:text-on-surface-variant transition-colors"
          >Términos de Servicio</NuxtLink
        >
      </div>
      <p class="text-label-md font-label-md text-on-surface-variant/40">© 2026 WeraWoof Inc.</p>
    </footer>
  </div>
</template>
