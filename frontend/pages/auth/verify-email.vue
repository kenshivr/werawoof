<template>
  <div class="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
    <div v-if="pending">
      <p class="text-gray-600">Verificando tu cuenta...</p>
    </div>
    <div v-else-if="success" class="text-green-600">
      <p class="text-xl font-bold mb-2">✅ Email verificado</p>
      <p class="text-sm text-gray-500 mb-4">Tu cuenta está activa. Ya podés ingresar.</p>
      <NuxtLink to="/auth/login" class="text-orange-500 font-medium hover:underline"
        >Ir al login</NuxtLink
      >
    </div>
    <div v-else class="text-red-500">
      <p class="text-xl font-bold mb-2">❌ Link inválido o expirado</p>
      <NuxtLink to="/auth/login" class="text-orange-500 font-medium hover:underline"
        >Volver al login</NuxtLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const api = useApi()

const pending = ref(true)
const success = ref(false)

onMounted(async () => {
  try {
    await api.get(`/auth/verify-email?token=${route.query.token}`)
    success.value = true
  } catch {
    success.value = false
  } finally {
    pending.value = false
  }
})
</script>
