<script setup lang="ts">
withDefaults(defineProps<{ size?: number; decorative?: boolean }>(), {
  size: 40,
  decorative: true,
})
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 100 100" fill="none" :aria-hidden="decorative" :role="decorative ? undefined : 'img'" :aria-label="decorative ? undefined : 'Цветок'" focusable="false">
    <path d="M50 50C34 38 25 14 39 9c12-4 14 16 11 41ZM50 50C54 26 69 9 79 19c10 9-5 25-29 31ZM50 50c25-7 43-1 40 12-3 15-24 9-40-12ZM50 50c16 20 15 39 3 42-14 2-15-19-3-42ZM50 50c-21 16-39 17-42 5-4-14 16-19 42-5Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="50" cy="50" r="7.4" stroke="currentColor" stroke-width="2.4" />
    <circle cx="50" cy="50" r="2.2" fill="currentColor" />
  </svg>
</template>
