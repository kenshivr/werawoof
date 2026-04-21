<template>
  <div class="max-w-lg mx-auto py-8">
    <h1 class="text-xl font-bold text-gray-800 mb-6">Mi perfil</h1>
    <div v-if="user" class="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-3">
      <p><span class="font-medium text-gray-600">Nombre:</span> {{ user.name }}</p>
      <p><span class="font-medium text-gray-600">Email:</span> {{ user.email }}</p>
      <p>
        <span class="font-medium text-gray-600">Email verificado:</span>
        {{ user.emailVerified ? '✅ Sí' : '❌ No' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const authStore = useAuthStore()
const user = computed(() => authStore.user)
</script>
