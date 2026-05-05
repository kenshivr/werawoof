<template>
  <div class="min-h-full bg-[#DBD8D0] p-6 md:p-10">
    <div class="max-w-[1400px] mx-auto space-y-8">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-[#281808] font-jakarta">Panel de Admin</h1>
          <p class="text-sm text-[#4f4539] mt-1 font-jakarta">
            WeraWoof — vista completa del proyecto
          </p>
        </div>
        <button
          class="flex items-center gap-2 bg-white border border-[#DBD8D0] text-[#4f4539] px-4 py-2 rounded-xl text-sm font-bold font-jakarta hover:border-[#B78F64] transition-all"
          :disabled="loading"
          @click="fetchData"
        >
          <span class="material-symbols-outlined text-base" :class="{ 'animate-spin': loading }"
            >refresh</span
          >
          {{ loading ? 'Cargando...' : 'Actualizar' }}
        </button>
      </div>

      <!-- Error -->
      <div
        v-if="error"
        class="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-6 py-4 text-sm font-jakarta"
      >
        {{ error }}
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="stat in summaryCards"
          :key="stat.label"
          class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.07)] p-6"
        >
          <div class="flex items-center gap-3 mb-2">
            <span class="material-symbols-outlined text-[#F4C07D] text-2xl">{{ stat.icon }}</span>
            <span class="text-xs font-bold uppercase tracking-widest text-[#7d571e] font-jakarta">{{
              stat.label
            }}</span>
          </div>
          <span class="text-4xl font-bold text-[#281808] font-jakarta">{{ stat.value }}</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="px-5 py-2.5 rounded-xl text-sm font-bold font-jakarta transition-all"
          :class="
            activeTab === tab.key
              ? 'bg-[#281808] text-white shadow-sm'
              : 'bg-white text-[#4f4539] hover:bg-[#ffeadb]'
          "
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- TAB: Usuarios -->
      <div v-if="activeTab === 'users'">
        <p v-if="!data" class="text-[#4f4539] text-sm font-jakarta">Cargando usuarios...</p>
        <div
          v-else-if="data.users.length === 0"
          class="bg-white rounded-2xl p-10 text-center text-[#4f4539] font-jakarta"
        >
          No hay usuarios registrados aún.
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="user in data.users"
            :key="user.id"
            class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.07)] overflow-hidden"
          >
            <!-- User row -->
            <div class="p-6 flex flex-col md:flex-row md:items-center gap-5">
              <!-- Avatar -->
              <div class="shrink-0">
                <img
                  v-if="user.avatar"
                  :src="user.avatar"
                  :alt="user.name"
                  class="w-16 h-16 rounded-full object-cover border-2 border-[#ffeadb]"
                />
                <div
                  v-else
                  class="w-16 h-16 rounded-full bg-[#fff1e8] flex items-center justify-center border-2 border-[#ffeadb]"
                >
                  <span class="material-symbols-outlined text-3xl text-[#d3c4b4]">person</span>
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <span class="text-lg font-bold text-[#281808] font-jakarta truncate">{{
                    user.name
                  }}</span>
                  <span
                    class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full font-jakarta"
                    :class="
                      user.role === 'admin'
                        ? 'bg-[#281808] text-[#F4C07D]'
                        : 'bg-[#ffeadb] text-[#7d571e]'
                    "
                  >
                    {{ user.role || 'user' }}
                  </span>
                  <span
                    v-if="user.verified"
                    class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-jakarta"
                  >
                    Verificado
                  </span>
                </div>
                <p class="text-sm text-[#4f4539] font-jakarta">{{ user.email }}</p>
                <div class="flex flex-wrap gap-4 mt-2 text-xs text-[#7d571e] font-jakarta">
                  <span v-if="user.location" class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">location_on</span>
                    {{ user.location }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">pets</span>
                    {{ user.dogs?.length ?? 0 }}
                    {{ (user.dogs?.length ?? 0) === 1 ? 'perro' : 'perros' }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">calendar_today</span>
                    {{ formatDate(user.created_at) }}
                  </span>
                </div>
                <p
                  v-if="user.bio"
                  class="text-xs text-[#4f4539]/70 mt-2 line-clamp-2 font-jakarta italic"
                >
                  "{{ user.bio }}"
                </p>
              </div>
            </div>

            <!-- Dogs section -->
            <div
              v-if="user.dogs && user.dogs.length > 0"
              class="border-t border-[#ffeadb] px-6 py-4"
            >
              <p
                class="text-xs font-bold uppercase tracking-widest text-[#7d571e] mb-3 font-jakarta"
              >
                Perros
              </p>
              <div class="flex flex-wrap gap-4">
                <div
                  v-for="dog in user.dogs"
                  :key="dog.id"
                  class="flex items-center gap-3 bg-[#fff8f3] rounded-xl px-4 py-3 min-w-[200px]"
                >
                  <!-- Dog photo -->
                  <div class="shrink-0">
                    <img
                      v-if="dog.photos && dog.photos.length > 0"
                      :src="dog.photos[0]"
                      :alt="dog.name"
                      class="w-12 h-12 rounded-xl object-cover"
                    />
                    <div
                      v-else
                      class="w-12 h-12 rounded-xl bg-[#ffeadb] flex items-center justify-center"
                    >
                      <span class="material-symbols-outlined text-xl text-[#d3c4b4]">pets</span>
                    </div>
                  </div>
                  <!-- Dog info -->
                  <div class="min-w-0">
                    <p class="font-bold text-[#281808] font-jakarta text-sm truncate">
                      {{ dog.name }}
                    </p>
                    <p class="text-xs text-[#4f4539] font-jakarta">
                      {{ dog.breed }} · {{ dog.age }} años
                    </p>
                    <p
                      v-if="dog.bio"
                      class="text-xs text-[#4f4539]/60 font-jakarta truncate max-w-[160px]"
                    >
                      {{ dog.bio }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: Analytics -->
      <div v-if="activeTab === 'analytics'">
        <p v-if="!data" class="text-[#4f4539] text-sm font-jakarta">Cargando analytics...</p>
        <div
          v-else-if="data.visits.length === 0"
          class="bg-white rounded-2xl p-10 text-center text-[#4f4539] font-jakarta"
        >
          No hay visitas registradas aún.
        </div>
        <div
          v-else
          class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.07)] overflow-hidden"
        >
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-[#ffeadb]">
                  <th
                    class="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#7d571e] font-jakarta"
                  >
                    Página
                  </th>
                  <th
                    class="text-right px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#7d571e] font-jakarta"
                  >
                    Visitas totales
                  </th>
                  <th
                    class="text-right px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#7d571e] font-jakarta"
                  >
                    IPs únicas
                  </th>
                  <th
                    class="text-right px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#7d571e] font-jakarta"
                  >
                    Última visita
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(visit, i) in data.visits"
                  :key="visit.path"
                  class="border-b border-[#ffeadb]/50 hover:bg-[#fff8f3] transition-colors"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <span
                        class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-jakarta shrink-0"
                        :class="
                          i === 0 ? 'bg-[#F4C07D] text-[#382615]' : 'bg-[#ffeadb] text-[#7d571e]'
                        "
                        >{{ i + 1 }}</span
                      >
                      <span class="text-sm font-medium text-[#281808] font-jakarta">{{
                        visit.path
                      }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <span class="text-lg font-bold text-[#281808] font-jakarta">{{
                      visit.total_visits
                    }}</span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <span class="text-sm font-bold text-[#4f4539] font-jakarta">{{
                      visit.unique_ips
                    }}</span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <span class="text-xs text-[#4f4539] font-jakarta">{{
                      formatDate(visit.last_visit_at)
                    }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: ['auth', 'admin'] })

interface Dog {
  id: number
  name: string
  breed: string
  age: number
  bio: string
  photos: string[]
}

interface AdminUser {
  id: number
  name: string
  email: string
  avatar: string
  bio: string
  location: string
  role: string
  verified: boolean
  created_at: string
  dogs: Dog[]
}

interface VisitStat {
  path: string
  total_visits: number
  unique_ips: number
  last_visit_at: string
}

interface Stats {
  total_users: number
  total_dogs: number
  total_visits: number
  unique_visitors: number
}

interface DashboardData {
  users: AdminUser[]
  visits: VisitStat[]
  stats: Stats
}

const config = useRuntimeConfig()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')
const data = ref<DashboardData | null>(null)

const activeTab = ref<'users' | 'analytics'>('users')

const tabs = [
  { key: 'users', label: 'Usuarios' },
  { key: 'analytics', label: 'Analytics' },
] as const

const summaryCards = computed(() => [
  { label: 'Usuarios', icon: 'group', value: data.value?.stats.total_users ?? '—' },
  { label: 'Perros', icon: 'pets', value: data.value?.stats.total_dogs ?? '—' },
  { label: 'Visitas totales', icon: 'visibility', value: data.value?.stats.total_visits ?? '—' },
  {
    label: 'Visitantes únicos',
    icon: 'fingerprint',
    value: data.value?.stats.unique_visitors ?? '—',
  },
])

const fetchData = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await $fetch<DashboardData>('/admin/dashboard', {
      baseURL: config.public.apiBase as string,
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    data.value = res
  } catch {
    error.value = 'No se pudo cargar el dashboard. ¿Estás logueado como admin?'
  } finally {
    loading.value = false
  }
}

const formatDate = (iso: string) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

onMounted(fetchData)
</script>
