<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'guest' })

const authStore = useAuthStore()
const config = useRuntimeConfig()
const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const loginWithGoogle = () => {
  window.location.href = `${config.public.apiBase}/auth/google`
}

const heroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBSRJrDXTAUPRdQb_rcU2rznew6qav938_yk_RwRmV_VkZZYuZCfGLbji43Qo08LLoWzz6XwVU9Q3RaXVL_Hj63tHG1ijzV9djC8_S7mOYH_2U3vuEY-pXy_y9MNdFifZMeshO2SgtUmiZ9PkacisaAG9_rN2Kz7mYGysg-DDkXdQLNHB6-7sMa_rU3ct5Yr7XgHAm-wH4-BYN9G4UxEJQhZrr0MDnObHJRJKtFM2uB6HvoQSpTmuTJLqXxKN42TYgSUEvonUr7Kg'

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(form)
    await navigateTo('/app')
  } catch (e: unknown) {
    error.value = (e as Error).message ?? 'Error al ingresar'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <!-- Mobile branding — hidden on desktop -->
    <div class="md:hidden w-full max-w-[400px] text-center mb-10">
      <h1 class="font-black italic text-h2 font-jakarta text-on-surface">WeraWoof</h1>
      <p class="text-body-md text-on-surface-variant mt-1">Find your dog's perfect companion</p>
    </div>

    <!-- Main card -->
    <main
      class="w-full max-w-[400px] md:max-w-5xl bg-white rounded-2xl md:rounded-[32px] overflow-hidden shadow-[0_12px_40px_rgba(113,62,24,0.12)] flex flex-col md:flex-row md:min-h-[720px]"
    >
      <!-- Left: photo panel — desktop only -->
      <section class="hidden md:block relative w-1/2 overflow-hidden">
        <img
          :src="heroImage"
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
              WeraWoof Community
            </span>
          </div>
          <h2 class="text-h1 font-h1 text-white mb-4 leading-tight font-jakarta">
            Where every tail<br />finds its tale.
          </h2>
          <p class="text-body-lg text-white/90 max-w-md">
            Join the most sophisticated community of dog lovers and find the perfect companion for
            your pet's next adventure.
          </p>
        </div>
      </section>

      <!-- Right: form panel -->
      <section class="w-full md:w-1/2 flex flex-col bg-white">
        <!-- Mobile: image banner inside card -->
        <div class="md:hidden h-40 w-full overflow-hidden">
          <img :src="heroImage" alt="Wera" class="w-full h-full object-cover" />
        </div>

        <!-- Form area -->
        <div class="flex-1 flex items-center justify-center p-6 md:p-16">
          <div class="w-full max-w-md space-y-6">
            <!-- Header -->
            <div class="text-center md:text-left">
              <h2 class="text-h2 font-h2 text-on-surface mb-2 font-jakarta">Welcome Back</h2>
              <p class="text-body-md text-on-surface-variant">
                <span class="hidden md:inline">
                  Don't have an account?
                  <NuxtLink
                    to="/auth/register"
                    class="text-primary font-bold hover:underline decoration-primary-container decoration-4 underline-offset-4"
                    >Create one now</NuxtLink
                  >
                </span>
                <span class="md:hidden">Sign in to see who's wagging nearby</span>
              </p>
            </div>

            <!-- Google OAuth — desktop: before form -->
            <button
              type="button"
              class="hidden md:flex w-full items-center justify-center gap-4 bg-white border-[1.5px] border-outline-variant hover:border-outline py-4 px-6 rounded-2xl transition-all duration-200 shadow-sm active:scale-[0.98]"
              @click="loginWithGoogle"
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
              <span class="text-label-md font-label-md text-on-surface">Continue with Google</span>
            </button>

            <!-- OR divider — desktop only -->
            <div class="hidden md:flex items-center gap-4">
              <div class="flex-grow border-t border-outline-variant" />
              <span class="text-label-md font-label-md text-outline">OR</span>
              <div class="flex-grow border-t border-outline-variant" />
            </div>

            <!-- Form -->
            <form class="space-y-5" @submit.prevent="handleLogin">
              <!-- Email -->
              <div class="space-y-2">
                <label class="text-label-md font-label-md text-on-surface block px-1" for="email"
                  >Email Address</label
                >
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
                    placeholder="woof@example.com"
                    class="w-full px-4 md:pl-12 md:pr-4 py-4 bg-white rounded-2xl border-[1.5px] border-[#DBD8D0] focus:border-[#B78F64] focus:ring-4 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-body-md"
                  />
                </div>
              </div>

              <!-- Password -->
              <div class="space-y-2">
                <div class="flex justify-between items-center px-1">
                  <label class="text-label-md font-label-md text-on-surface block" for="password"
                    >Password</label
                  >
                  <NuxtLink
                    to="/auth/forgot-password"
                    class="text-label-md font-label-md text-primary hover:underline hidden md:block"
                    >Forgot?</NuxtLink
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

              <!-- Remember + Forgot (mobile: same row) -->
              <div class="flex items-center justify-between px-1">
                <label class="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    id="remember"
                    type="checkbox"
                    class="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary-container"
                  />
                  <span class="text-body-md text-on-surface-variant">
                    <span class="hidden md:inline">Keep me wagging (Remember me)</span>
                    <span class="md:hidden">Remember me</span>
                  </span>
                </label>
                <NuxtLink
                  to="/auth/forgot-password"
                  class="text-label-md font-label-md text-primary hover:underline md:hidden"
                  >Forgot password?</NuxtLink
                >
              </div>

              <!-- Error -->
              <p v-if="error" class="text-error text-sm text-center">{{ error }}</p>

              <!-- Submit -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full bg-[#F4C07D] text-[#382615] py-5 px-6 rounded-2xl font-h3 text-h3 font-jakarta shadow-lg shadow-primary-container/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {{ loading ? 'Signing in...' : 'Sign In' }}
                <span v-if="!loading" class="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>

            <!-- OR + Google — mobile: after form -->
            <div class="md:hidden space-y-4">
              <div class="flex items-center gap-4">
                <div class="flex-grow border-t border-[#DBD8D0]" />
                <span class="text-label-md font-label-md text-on-surface-variant">OR</span>
                <div class="flex-grow border-t border-[#DBD8D0]" />
              </div>
              <button
                type="button"
                class="w-full flex items-center justify-center gap-3 bg-white border-[1.5px] border-[#B78F64] text-[#382615] text-label-md font-label-md rounded-2xl py-4 px-6 hover:bg-stone-50 active:scale-95 transition-all duration-200"
                @click="loginWithGoogle"
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
                Continue with Google
              </button>
            </div>

            <!-- Register link — mobile only -->
            <div class="md:hidden text-center">
              <p class="text-body-md text-on-surface-variant">
                Don't have an account?
                <NuxtLink to="/auth/register" class="text-primary font-bold hover:underline"
                  >Register</NuxtLink
                >
              </p>
            </div>

            <!-- Terms — desktop only -->
            <p class="hidden md:block text-center text-label-md font-label-md text-outline pt-2">
              By continuing, you agree to WeraWoof's
              <a
                href="#"
                class="underline decoration-outline-variant decoration-1 underline-offset-4"
                >Terms of Service</a
              >.
            </p>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer — mobile only -->
    <footer class="md:hidden w-full max-w-[400px] mt-8 text-center space-y-2">
      <div class="flex justify-center gap-6">
        <a
          href="#"
          class="text-label-md font-label-md text-on-surface-variant/60 hover:text-on-surface-variant transition-colors"
          >Privacy Policy</a
        >
        <a
          href="#"
          class="text-label-md font-label-md text-on-surface-variant/60 hover:text-on-surface-variant transition-colors"
          >Terms of Service</a
        >
      </div>
      <p class="text-label-md font-label-md text-on-surface-variant/40">© 2026 WeraWoof Inc.</p>
    </footer>
  </div>
</template>
