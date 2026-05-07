<template>
  <div class="min-h-full bg-[#DBD8D0] p-4 sm:p-6 md:p-10">
    <div class="max-w-[1400px] mx-auto space-y-6 md:space-y-8">
      <!-- Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-[#281808] font-jakarta">
            Panel de Admin
          </h1>
          <p class="text-xs sm:text-sm text-[#4f4539] mt-1 font-jakarta">
            WeraWoof — vista completa del proyecto
          </p>
        </div>
        <button
          class="self-start sm:self-auto flex items-center gap-2 bg-white border border-[#DBD8D0] text-[#4f4539] px-4 py-2 rounded-xl text-sm font-bold font-jakarta hover:border-[#B78F64] transition-all"
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
        class="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 sm:px-6 py-4 text-sm font-jakarta"
      >
        {{ error }}
      </div>

      <!-- Stats row 1: tráfico -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          v-for="stat in trafficCards"
          :key="stat.label"
          class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.07)] p-4 sm:p-5 lg:p-6"
        >
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-[#F4C07D] text-xl sm:text-2xl">{{
              stat.icon
            }}</span>
            <span
              class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#7d571e] font-jakarta leading-tight"
              >{{ stat.label }}</span
            >
          </div>
          <span class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#281808] font-jakarta">{{
            stat.value
          }}</span>
        </div>
      </div>

      <!-- Stats row 2: engagement -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          v-for="stat in engagementCards"
          :key="stat.label"
          class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.07)] p-4 sm:p-5 lg:p-6"
        >
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-[#B78F64] text-xl sm:text-2xl">{{
              stat.icon
            }}</span>
            <span
              class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#7d571e] font-jakarta leading-tight"
              >{{ stat.label }}</span
            >
          </div>
          <span class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#281808] font-jakarta">{{
            stat.value
          }}</span>
          <p v-if="stat.sub" class="text-[11px] text-[#7d571e] font-jakarta mt-1">{{ stat.sub }}</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold font-jakarta transition-all"
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
            <div class="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div class="shrink-0">
                <img
                  v-if="user.avatar"
                  :src="user.avatar"
                  :alt="user.name"
                  class="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#ffeadb]"
                />
                <div
                  v-else
                  class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#fff1e8] flex items-center justify-center border-2 border-[#ffeadb]"
                >
                  <span class="material-symbols-outlined text-2xl sm:text-3xl text-[#d3c4b4]"
                    >person</span
                  >
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    class="text-base sm:text-lg font-bold text-[#281808] font-jakarta truncate"
                    >{{ user.name }}</span
                  >
                  <span
                    class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full font-jakarta shrink-0"
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
                    class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-jakarta shrink-0"
                  >
                    Verificado
                  </span>
                  <span
                    v-if="user.google_id"
                    class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-jakarta shrink-0"
                  >
                    Google
                  </span>
                </div>
                <p class="text-xs sm:text-sm text-[#4f4539] font-jakarta">{{ user.email }}</p>
                <div class="flex flex-wrap gap-3 sm:gap-4 mt-2 text-xs text-[#7d571e] font-jakarta">
                  <span v-if="user.location" class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">location_on</span
                    >{{ user.location }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">pets</span>
                    {{ user.dogs?.length ?? 0 }}
                    {{ (user.dogs?.length ?? 0) === 1 ? 'perro' : 'perros' }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">calendar_today</span
                    >{{ formatDate(user.created_at) }}
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

            <div
              v-if="user.dogs && user.dogs.length > 0"
              class="border-t border-[#ffeadb] px-4 sm:px-6 py-4"
            >
              <p
                class="text-xs font-bold uppercase tracking-widest text-[#7d571e] mb-3 font-jakarta"
              >
                Perros ({{ user.dogs.length }})
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                <div
                  v-for="dog in user.dogs"
                  :key="dog.id"
                  class="bg-[#fff8f3] rounded-2xl overflow-hidden border border-[#ffeadb]"
                >
                  <div class="aspect-video relative bg-[#ffeadb]">
                    <img
                      v-if="dog.photos?.length"
                      :src="dog.photos[0]"
                      :alt="dog.name"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <span class="material-symbols-outlined text-4xl text-[#d3c4b4]">pets</span>
                    </div>
                    <span
                      v-if="dog.sex"
                      class="absolute top-2 right-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/90 text-[#7d571e] font-jakarta"
                    >
                      {{ translateSex(dog.sex) }}
                    </span>
                  </div>
                  <div class="p-3 sm:p-4">
                    <div class="flex items-start justify-between gap-2 mb-1">
                      <p
                        class="font-bold text-[#281808] font-jakarta text-sm sm:text-base leading-tight"
                      >
                        {{ dog.name }}
                      </p>
                      <span class="text-xs text-[#7d571e] font-jakarta shrink-0"
                        >{{ dog.age }} {{ dog.age === 1 ? 'año' : 'años' }}</span
                      >
                    </div>
                    <p class="text-xs text-[#4f4539] font-jakarta mb-2">
                      {{ dog.breed }}<span v-if="dog.size"> · {{ translateSize(dog.size) }}</span>
                    </p>
                    <div v-if="dog.bio">
                      <p
                        class="text-xs text-[#4f4539]/80 font-jakarta italic"
                        :class="expandedDogs.has(dog.id) ? '' : 'line-clamp-2'"
                      >
                        "{{ dog.bio }}"
                      </p>
                      <button
                        class="text-[11px] text-[#B78F64] font-bold font-jakarta mt-1 hover:text-[#7d571e] transition-colors"
                        @click="toggleDog(dog.id)"
                      >
                        {{ expandedDogs.has(dog.id) ? 'Ver menos ↑' : 'Ver más ↓' }}
                      </button>
                    </div>
                    <div v-if="dog.personality_tags?.length" class="flex flex-wrap gap-1 mt-2">
                      <span
                        v-for="tag in dog.personality_tags"
                        :key="tag"
                        class="text-[10px] px-2 py-0.5 rounded-full bg-[#ffeadb] text-[#7d571e] font-jakarta font-medium"
                        >{{ tag }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: Analytics -->
      <div v-if="activeTab === 'analytics'" class="space-y-6">
        <!-- Dispositivos -->
        <div class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.07)] p-4 sm:p-6">
          <h2 class="text-sm font-bold uppercase tracking-widest text-[#7d571e] font-jakarta mb-4">
            Dispositivos
          </h2>
          <div v-if="data?.devices" class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div class="sm:col-span-2 space-y-3">
              <div>
                <div class="flex justify-between text-xs font-jakarta mb-1">
                  <span class="font-bold text-[#281808]">Mobile</span>
                  <span class="text-[#7d571e]"
                    >{{ data.devices.mobile_visits.toLocaleString() }} visitas ·
                    {{ data.devices.mobile_rate.toFixed(1) }}%</span
                  >
                </div>
                <div class="h-3 bg-[#ffeadb] rounded-full overflow-hidden">
                  <div
                    class="h-full bg-[#F4C07D] rounded-full transition-all"
                    :style="{ width: `${data.devices.mobile_rate}%` }"
                  />
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs font-jakarta mb-1">
                  <span class="font-bold text-[#281808]">Desktop</span>
                  <span class="text-[#7d571e]"
                    >{{ data.devices.desktop_visits.toLocaleString() }} visitas ·
                    {{ (100 - data.devices.mobile_rate).toFixed(1) }}%</span
                  >
                </div>
                <div class="h-3 bg-[#ffeadb] rounded-full overflow-hidden">
                  <div
                    class="h-full bg-[#281808] rounded-full transition-all"
                    :style="{ width: `${100 - data.devices.mobile_rate}%` }"
                  />
                </div>
              </div>
            </div>
            <div
              class="flex flex-col items-center justify-center text-center bg-[#fff8f3] rounded-2xl p-4"
            >
              <span class="material-symbols-outlined text-3xl text-[#F4C07D] mb-1">{{
                data.devices.mobile_rate >= 50 ? 'smartphone' : 'computer'
              }}</span>
              <p class="text-xs text-[#7d571e] font-jakarta">Mayoría en</p>
              <p class="text-lg font-bold text-[#281808] font-jakarta">
                {{ data.devices.mobile_rate >= 50 ? 'Mobile' : 'Desktop' }}
              </p>
            </div>
          </div>
          <p v-else class="text-xs text-[#4f4539] font-jakarta">Sin datos de dispositivos aún.</p>
        </div>

        <!-- Páginas -->
        <div class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.07)] overflow-hidden">
          <div class="px-4 sm:px-6 py-4 border-b border-[#ffeadb]">
            <h2 class="text-sm font-bold uppercase tracking-widest text-[#7d571e] font-jakarta">
              Páginas más visitadas
            </h2>
          </div>
          <p v-if="!data" class="p-6 text-[#4f4539] text-sm font-jakarta">Cargando...</p>
          <div
            v-else-if="data.visits.length === 0"
            class="p-10 text-center text-[#4f4539] font-jakarta text-sm"
          >
            Sin registros aún.
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full min-w-[480px]">
              <thead>
                <tr class="border-b border-[#ffeadb]">
                  <th
                    class="text-left px-4 sm:px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#7d571e] font-jakarta"
                  >
                    Página
                  </th>
                  <th
                    class="text-right px-4 sm:px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#7d571e] font-jakarta"
                  >
                    Visitas
                  </th>
                  <th
                    class="text-right px-4 sm:px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#7d571e] font-jakarta"
                  >
                    IPs únicas
                  </th>
                  <th
                    class="text-right px-4 sm:px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#7d571e] font-jakarta hidden sm:table-cell"
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
                  <td class="px-4 sm:px-6 py-3">
                    <div class="flex items-center gap-2">
                      <span
                        class="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-jakarta shrink-0"
                        :class="
                          i === 0 ? 'bg-[#F4C07D] text-[#382615]' : 'bg-[#ffeadb] text-[#7d571e]'
                        "
                        >{{ i + 1 }}</span
                      >
                      <span
                        class="text-xs sm:text-sm font-medium text-[#281808] font-jakarta truncate max-w-[120px] sm:max-w-none"
                        >{{ visit.path }}</span
                      >
                    </div>
                  </td>
                  <td class="px-4 sm:px-6 py-3 text-right">
                    <span class="text-base sm:text-lg font-bold text-[#281808] font-jakarta">{{
                      visit.total_visits
                    }}</span>
                  </td>
                  <td class="px-4 sm:px-6 py-3 text-right">
                    <span class="text-xs sm:text-sm font-bold text-[#4f4539] font-jakarta">{{
                      visit.unique_ips
                    }}</span>
                  </td>
                  <td class="px-4 sm:px-6 py-3 text-right hidden sm:table-cell">
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

      <!-- TAB: Engagement -->
      <div v-if="activeTab === 'engagement'" class="space-y-6">
        <p v-if="!data" class="text-[#4f4539] text-sm font-jakarta">Cargando...</p>
        <template v-else>
          <!-- Swipes -->
          <div class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.07)] p-4 sm:p-6">
            <h2
              class="text-sm font-bold uppercase tracking-widest text-[#7d571e] font-jakarta mb-4"
            >
              Actividad de swipes
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-jakarta text-[#281808] font-bold">Total swipes</span>
                  <span class="text-lg font-bold text-[#281808] font-jakarta">{{
                    (data.engagement.total_likes + data.engagement.total_dislikes).toLocaleString()
                  }}</span>
                </div>
                <div>
                  <div class="flex justify-between text-xs font-jakarta mb-1">
                    <span class="font-bold text-green-700">Likes</span>
                    <span class="text-[#7d571e]"
                      >{{ data.engagement.total_likes.toLocaleString() }} ·
                      {{ likesRate.toFixed(1) }}%</span
                    >
                  </div>
                  <div class="h-3 bg-[#ffeadb] rounded-full overflow-hidden">
                    <div
                      class="h-full bg-green-400 rounded-full transition-all"
                      :style="{ width: `${likesRate}%` }"
                    />
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs font-jakarta mb-1">
                    <span class="font-bold text-red-500">Dislikes</span>
                    <span class="text-[#7d571e]"
                      >{{ data.engagement.total_dislikes.toLocaleString() }} ·
                      {{ (100 - likesRate).toFixed(1) }}%</span
                    >
                  </div>
                  <div class="h-3 bg-[#ffeadb] rounded-full overflow-hidden">
                    <div
                      class="h-full bg-red-300 rounded-full transition-all"
                      :style="{ width: `${100 - likesRate}%` }"
                    />
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-3">
                <div class="bg-[#fff8f3] rounded-2xl p-4 text-center">
                  <p class="text-xs text-[#7d571e] font-jakarta mb-1">Match rate</p>
                  <p class="text-3xl font-bold text-[#281808] font-jakarta">
                    {{ data.engagement.match_rate.toFixed(1) }}<span class="text-base">%</span>
                  </p>
                  <p class="text-[11px] text-[#4f4539] font-jakarta mt-1">
                    de los likes se convierten en match
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Matches -->
          <div class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.07)] p-4 sm:p-6">
            <h2
              class="text-sm font-bold uppercase tracking-widest text-[#7d571e] font-jakarta mb-4"
            >
              Matches y conversaciones
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="bg-[#fff8f3] rounded-2xl p-4 text-center">
                <span class="material-symbols-outlined text-2xl text-[#F4C07D] mb-2 block"
                  >favorite</span
                >
                <p class="text-2xl sm:text-3xl font-bold text-[#281808] font-jakarta">
                  {{ data.engagement.total_matches.toLocaleString() }}
                </p>
                <p class="text-xs text-[#7d571e] font-jakarta mt-1">Matches totales</p>
              </div>
              <div class="bg-[#fff8f3] rounded-2xl p-4 text-center">
                <span class="material-symbols-outlined text-2xl text-green-500 mb-2 block"
                  >chat</span
                >
                <p class="text-2xl sm:text-3xl font-bold text-[#281808] font-jakarta">
                  {{ data.engagement.matches_with_messages.toLocaleString() }}
                </p>
                <p class="text-xs text-[#7d571e] font-jakarta mt-1">Con conversación activa</p>
              </div>
              <div class="bg-[#fff8f3] rounded-2xl p-4 text-center">
                <span class="material-symbols-outlined text-2xl text-[#d3c4b4] mb-2 block"
                  >chat_bubble</span
                >
                <p class="text-2xl sm:text-3xl font-bold text-[#281808] font-jakarta">
                  {{ data.engagement.ghost_matches.toLocaleString() }}
                </p>
                <p class="text-xs text-[#7d571e] font-jakarta mt-1">Ghost matches (sin mensajes)</p>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="bg-[#ffeadb]/40 rounded-2xl p-4 flex items-center gap-4">
                <span class="material-symbols-outlined text-3xl text-[#B78F64]">forum</span>
                <div>
                  <p class="text-2xl font-bold text-[#281808] font-jakarta">
                    {{ data.engagement.total_messages.toLocaleString() }}
                  </p>
                  <p class="text-xs text-[#7d571e] font-jakarta">Mensajes enviados en total</p>
                </div>
              </div>
              <div class="bg-[#ffeadb]/40 rounded-2xl p-4 flex items-center gap-4">
                <span class="material-symbols-outlined text-3xl text-[#B78F64]">trending_up</span>
                <div>
                  <p class="text-2xl font-bold text-[#281808] font-jakarta">
                    {{ data.engagement.avg_msgs_per_match.toFixed(1) }}
                  </p>
                  <p class="text-xs text-[#7d571e] font-jakarta">
                    Mensajes promedio por match activo
                  </p>
                </div>
              </div>
            </div>

            <!-- Match quality bar -->
            <div v-if="data.engagement.total_matches > 0" class="mt-4">
              <div class="flex justify-between text-xs font-jakarta mb-1">
                <span class="text-[#4f4539]">Matches con conversación</span>
                <span class="font-bold text-[#281808]">{{ matchActivityRate.toFixed(1) }}%</span>
              </div>
              <div class="h-2 bg-[#ffeadb] rounded-full overflow-hidden">
                <div
                  class="h-full bg-[#F4C07D] rounded-full transition-all"
                  :style="{ width: `${matchActivityRate}%` }"
                />
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- TAB: Comunidad -->
      <div v-if="activeTab === 'comunidad'" class="space-y-6">
        <p v-if="!data" class="text-[#4f4539] text-sm font-jakarta">Cargando...</p>
        <template v-else>
          <!-- Perfil de usuarios -->
          <div class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.07)] p-4 sm:p-6">
            <h2
              class="text-sm font-bold uppercase tracking-widest text-[#7d571e] font-jakarta mb-4"
            >
              Perfil de usuarios
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <!-- Activación -->
              <div>
                <div class="flex justify-between text-xs font-jakarta mb-1">
                  <span class="font-bold text-[#281808]">Tasa de activación</span>
                  <span class="text-[#7d571e]"
                    >{{ data.community.activation_rate.toFixed(1) }}%</span
                  >
                </div>
                <div class="h-3 bg-[#ffeadb] rounded-full overflow-hidden mb-1">
                  <div
                    class="h-full bg-[#F4C07D] rounded-full"
                    :style="{ width: `${data.community.activation_rate}%` }"
                  />
                </div>
                <p class="text-[11px] text-[#4f4539] font-jakarta">
                  {{ data.community.users_with_dogs.toLocaleString() }} de
                  {{ data.stats.total_users.toLocaleString() }} usuarios crearon un perro
                </p>
              </div>
              <!-- Verificados -->
              <div>
                <div class="flex justify-between text-xs font-jakarta mb-1">
                  <span class="font-bold text-[#281808]">Cuentas verificadas</span>
                  <span class="text-[#7d571e]">{{ verifiedRate.toFixed(1) }}%</span>
                </div>
                <div class="h-3 bg-[#ffeadb] rounded-full overflow-hidden mb-1">
                  <div
                    class="h-full bg-green-400 rounded-full"
                    :style="{ width: `${verifiedRate}%` }"
                  />
                </div>
                <p class="text-[11px] text-[#4f4539] font-jakarta">
                  {{ data.community.verified_users.toLocaleString() }} de
                  {{ data.stats.total_users.toLocaleString() }} verificados
                </p>
              </div>
              <!-- Auth method -->
              <div>
                <div class="flex justify-between text-xs font-jakarta mb-1">
                  <span class="font-bold text-[#281808]">Registro con Google</span>
                  <span class="text-[#7d571e]">{{ googleRate.toFixed(1) }}%</span>
                </div>
                <div class="h-3 bg-[#ffeadb] rounded-full overflow-hidden mb-1">
                  <div
                    class="h-full bg-blue-400 rounded-full"
                    :style="{ width: `${googleRate}%` }"
                  />
                </div>
                <p class="text-[11px] text-[#4f4539] font-jakarta">
                  {{ data.community.google_users.toLocaleString() }} Google ·
                  {{ (data.stats.total_users - data.community.google_users).toLocaleString() }}
                  Email
                </p>
              </div>
            </div>
          </div>

          <!-- Crecimiento semanal -->
          <div class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.07)] p-4 sm:p-6">
            <h2
              class="text-sm font-bold uppercase tracking-widest text-[#7d571e] font-jakarta mb-4"
            >
              Crecimiento semanal (últimas 8 semanas)
            </h2>
            <div v-if="reversedGrowth.length === 0" class="text-xs text-[#4f4539] font-jakarta">
              Sin datos de crecimiento aún.
            </div>
            <div v-else>
              <div class="flex items-end gap-1 sm:gap-2 h-32">
                <div
                  v-for="point in reversedGrowth"
                  :key="point.week"
                  class="flex-1 flex flex-col items-center gap-1"
                >
                  <span class="text-[10px] sm:text-xs font-bold text-[#281808] font-jakarta">{{
                    point.new_users
                  }}</span>
                  <div
                    class="w-full rounded-t-lg bg-[#ffeadb] relative overflow-hidden"
                    style="height: 80px"
                  >
                    <div
                      class="absolute bottom-0 w-full bg-[#F4C07D] rounded-t-lg transition-all"
                      :style="{
                        height: `${maxGrowth > 0 ? (point.new_users / maxGrowth) * 100 : 0}%`,
                      }"
                    />
                  </div>
                  <span
                    class="text-[9px] sm:text-[10px] text-[#7d571e] font-jakarta text-center leading-tight"
                    >{{ formatWeek(point.week) }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Ubicaciones + Razas -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Top ubicaciones -->
            <div class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.07)] p-4 sm:p-6">
              <h2
                class="text-sm font-bold uppercase tracking-widest text-[#7d571e] font-jakarta mb-4"
              >
                Top ubicaciones
              </h2>
              <div v-if="!data.locations?.length" class="text-xs text-[#4f4539] font-jakarta">
                Sin datos de ubicación aún.
              </div>
              <div v-else class="space-y-3">
                <div
                  v-for="loc in data.locations"
                  :key="loc.location"
                  class="flex items-center gap-3"
                >
                  <span class="text-xs font-jakarta text-[#281808] w-28 shrink-0 truncate">{{
                    loc.location
                  }}</span>
                  <div class="flex-1 h-2 bg-[#ffeadb] rounded-full overflow-hidden">
                    <div
                      class="h-full bg-[#F4C07D] rounded-full"
                      :style="{
                        width: `${maxLocationCount > 0 ? (loc.count / maxLocationCount) * 100 : 0}%`,
                      }"
                    />
                  </div>
                  <span
                    class="text-xs font-bold font-jakarta text-[#281808] w-6 text-right shrink-0"
                    >{{ loc.count }}</span
                  >
                </div>
              </div>
            </div>

            <!-- Razas populares -->
            <div class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.07)] p-4 sm:p-6">
              <h2
                class="text-sm font-bold uppercase tracking-widest text-[#7d571e] font-jakarta mb-4"
              >
                Razas más populares
              </h2>
              <div v-if="!data.breeds?.length" class="text-xs text-[#4f4539] font-jakarta">
                Sin datos de razas aún.
              </div>
              <div v-else class="space-y-3">
                <div
                  v-for="breed in data.breeds"
                  :key="breed.breed"
                  class="flex items-center gap-3"
                >
                  <span class="text-xs font-jakarta text-[#281808] w-28 shrink-0 truncate">{{
                    breed.breed
                  }}</span>
                  <div class="flex-1 h-2 bg-[#ffeadb] rounded-full overflow-hidden">
                    <div
                      class="h-full bg-[#B78F64] rounded-full"
                      :style="{
                        width: `${maxBreedCount > 0 ? (breed.count / maxBreedCount) * 100 : 0}%`,
                      }"
                    />
                  </div>
                  <span
                    class="text-xs font-bold font-jakarta text-[#281808] w-6 text-right shrink-0"
                    >{{ breed.count }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews + Newsletter -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Reviews -->
            <div class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.07)] p-4 sm:p-6">
              <h2
                class="text-sm font-bold uppercase tracking-widest text-[#7d571e] font-jakarta mb-4"
              >
                Reseñas de usuarios
              </h2>
              <div v-if="!data.community.total_reviews" class="text-xs text-[#4f4539] font-jakarta">
                Sin reseñas aún.
              </div>
              <div v-else class="flex items-center gap-6">
                <div class="text-center">
                  <p class="text-4xl font-bold text-[#281808] font-jakarta">
                    {{ data.community.avg_rating.toFixed(1) }}
                  </p>
                  <div class="flex gap-0.5 mt-1 justify-center">
                    <span
                      v-for="i in 5"
                      :key="i"
                      class="text-lg"
                      :class="
                        i <= Math.round(data.community.avg_rating)
                          ? 'text-[#F4C07D]'
                          : 'text-[#e0d0c0]'
                      "
                      >★</span
                    >
                  </div>
                  <p class="text-xs text-[#7d571e] font-jakarta mt-1">promedio</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-[#281808] font-jakarta">
                    {{ data.community.total_reviews.toLocaleString() }}
                  </p>
                  <p class="text-xs text-[#7d571e] font-jakarta">reseñas totales</p>
                </div>
              </div>
            </div>

            <!-- Newsletter -->
            <div class="bg-white rounded-2xl shadow-[0_4px_20px_rgba(113,62,24,0.07)] p-4 sm:p-6">
              <h2
                class="text-sm font-bold uppercase tracking-widest text-[#7d571e] font-jakarta mb-4"
              >
                Newsletter
              </h2>
              <div class="flex items-center gap-4">
                <span class="material-symbols-outlined text-3xl text-[#F4C07D]">mail</span>
                <div>
                  <p class="text-3xl font-bold text-[#281808] font-jakarta">
                    {{ data.community.total_subscribers.toLocaleString() }}
                  </p>
                  <p class="text-xs text-[#7d571e] font-jakarta mt-1">suscriptores al newsletter</p>
                </div>
              </div>
            </div>
          </div>
        </template>
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
  sex: string
  size: string
  bio: string
  photos: string[]
  personality_tags: string[]
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
  google_id: string
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

interface EngagementStats {
  total_likes: number
  total_dislikes: number
  total_matches: number
  match_rate: number
  total_messages: number
  matches_with_messages: number
  ghost_matches: number
  avg_msgs_per_match: number
}

interface CommunityStats {
  verified_users: number
  google_users: number
  users_with_dogs: number
  activation_rate: number
  total_subscribers: number
  total_reviews: number
  avg_rating: number
}

interface GrowthPoint {
  week: string
  new_users: number
}

interface LocationStat {
  location: string
  count: number
}

interface BreedStat {
  breed: string
  count: number
}

interface DeviceStats {
  mobile_visits: number
  desktop_visits: number
  mobile_rate: number
}

interface DashboardData {
  users: AdminUser[]
  visits: VisitStat[]
  stats: Stats
  engagement: EngagementStats
  community: CommunityStats
  growth: GrowthPoint[]
  locations: LocationStat[]
  breeds: BreedStat[]
  devices: DeviceStats
}

const config = useRuntimeConfig()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')
const data = ref<DashboardData | null>(null)
const activeTab = ref<'users' | 'analytics' | 'engagement' | 'comunidad'>('users')
const expandedDogs = ref(new Set<number>())

const tabs = [
  { key: 'users', label: 'Usuarios' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'engagement', label: 'Engagement' },
  { key: 'comunidad', label: 'Comunidad' },
] as const

const sizeMap: Record<string, string> = {
  small: 'Pequeño',
  medium: 'Mediano',
  large: 'Grande',
  extra_large: 'Extra grande',
}
const sexMap: Record<string, string> = { male: 'Macho', female: 'Hembra' }
const translateSize = (s: string) => sizeMap[s?.toLowerCase()] ?? s
const translateSex = (s: string) => sexMap[s?.toLowerCase()] ?? s

// Summary card rows
const trafficCards = computed(() => [
  { label: 'Usuarios', icon: 'group', value: data.value?.stats.total_users ?? '—' },
  { label: 'Perros', icon: 'pets', value: data.value?.stats.total_dogs ?? '—' },
  { label: 'Visitas totales', icon: 'visibility', value: data.value?.stats.total_visits ?? '—' },
  {
    label: 'Visitantes únicos',
    icon: 'fingerprint',
    value: data.value?.stats.unique_visitors ?? '—',
  },
])

const engagementCards = computed(() => {
  const e = data.value?.engagement
  const c = data.value?.community
  return [
    {
      label: 'Matches',
      icon: 'favorite',
      value: e?.total_matches.toLocaleString() ?? '—',
      sub: undefined,
    },
    {
      label: 'Match rate',
      icon: 'percent',
      value: e ? `${e.match_rate.toFixed(1)}%` : '—',
      sub: 'de likes a match',
    },
    {
      label: 'Mensajes',
      icon: 'forum',
      value: e?.total_messages.toLocaleString() ?? '—',
      sub: undefined,
    },
    {
      label: 'Suscriptores',
      icon: 'mail',
      value: c?.total_subscribers.toLocaleString() ?? '—',
      sub: 'newsletter',
    },
  ]
})

// Engagement computed
const likesRate = computed(() => {
  const e = data.value?.engagement
  if (!e) return 0
  const total = e.total_likes + e.total_dislikes
  return total > 0 ? (e.total_likes / total) * 100 : 0
})

const matchActivityRate = computed(() => {
  const e = data.value?.engagement
  if (!e || e.total_matches === 0) return 0
  return (e.matches_with_messages / e.total_matches) * 100
})

// Community computed
const verifiedRate = computed(() => {
  const c = data.value?.community
  const total = data.value?.stats.total_users ?? 0
  if (!c || total === 0) return 0
  return (c.verified_users / total) * 100
})

const googleRate = computed(() => {
  const c = data.value?.community
  const total = data.value?.stats.total_users ?? 0
  if (!c || total === 0) return 0
  return (c.google_users / total) * 100
})

// Growth chart
const reversedGrowth = computed(() => [...(data.value?.growth ?? [])].reverse())
const maxGrowth = computed(() => Math.max(...(data.value?.growth ?? []).map((g) => g.new_users), 1))

// Bar charts max values
const maxLocationCount = computed(() =>
  Math.max(...(data.value?.locations ?? []).map((l) => l.count), 1)
)
const maxBreedCount = computed(() => Math.max(...(data.value?.breeds ?? []).map((b) => b.count), 1))

const toggleDog = (id: number) => {
  const next = new Set(expandedDogs.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  expandedDogs.value = next
}

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

const formatWeek = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

onMounted(fetchData)
</script>
