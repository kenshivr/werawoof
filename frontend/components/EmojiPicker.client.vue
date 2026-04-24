<script setup lang="ts">
import data from '@emoji-mart/data'
import { Picker } from 'emoji-mart'

const emit = defineEmits<{
  select: [native: string]
}>()

const container = ref<HTMLDivElement | null>(null)

onMounted(() => {
  const picker = new Picker({
    data,
    locale: 'es',
    theme: 'light',
    previewPosition: 'none',
    skinTonePosition: 'none',
    onEmojiSelect: (emoji: { native: string }) => emit('select', emoji.native),
  })
  container.value?.appendChild(picker as unknown as Node)
})
</script>

<template>
  <div ref="container" class="emoji-picker-wrap" />
</template>

<style>
.emoji-picker-wrap em-emoji-picker {
  --border-radius: 16px;
  --font-family: 'Plus Jakarta Sans', sans-serif;
  --color-border: #d3c4b4;
  --color-border-over: #F4C07D;
  --rgb-accent: 124, 87, 30;
  width: 100%;
  height: 360px;
}
</style>
