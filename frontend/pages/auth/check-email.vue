<template>
  <div class="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center space-y-6">
    <div class="w-16 h-16 bg-[#ffeadb] rounded-full flex items-center justify-center mx-auto">
      <span class="material-symbols-outlined text-3xl text-[#F4C07D]">mark_email_unread</span>
    </div>

    <div>
      <h2 class="text-xl font-bold text-[#281808] font-jakarta mb-2">Revisá tu correo</h2>
      <p class="text-sm text-[#4f4539] font-jakarta leading-relaxed">
        Te enviamos un link de verificación. Hacé click en él para activar tu cuenta.
      </p>
      <p class="text-xs text-[#7d571e] font-jakarta mt-3">
        El link expira en 24 horas. Si no lo ves, revisá la carpeta de spam.
      </p>
    </div>

    <div class="border-t border-[#ffeadb] pt-4 space-y-3">
      <p class="text-xs text-[#4f4539] font-jakarta">
        Al hacer click en el link entrás a la app automáticamente.
      </p>
      <NuxtLink
        to="/auth/login"
        class="block w-full bg-[#F4C07D] text-[#382615] py-3 px-6 rounded-2xl font-bold font-jakarta text-sm hover:bg-[#e8b06a] transition-all"
      >
        Ir al login
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })
</script>
