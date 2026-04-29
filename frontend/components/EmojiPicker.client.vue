<script setup lang="ts">
import 'emoji-picker-element'

const emit = defineEmits<{
  select: [native: string]
}>()

const onEmojiClick = (e: Event) => {
  const detail = (e as CustomEvent).detail
  if (detail?.emoji?.unicode) {
    emit('select', detail.emoji.unicode)
  }
}
</script>

<template>
  <div class="emoji-picker-wrap">
    <emoji-picker locale="es" @emoji-click="onEmojiClick" />
  </div>
</template>

<style>
.emoji-picker-wrap emoji-picker {
  --border-radius: 16px;
  --font-family: 'Plus Jakarta Sans', sans-serif;
  --input-border-color: #d3c4b4;
  --outline-color: #f4c07d;
  --emoji-padding: 6px;
  width: 100%;
  height: 360px;
}
</style>
