<script setup lang="ts">
withDefaults(defineProps<{
  name: 'arrow-right' | 'arrow-left' | 'arrow-up-right' | 'settings' | 'close' | 'heart' | 'check' | 'restart' | 'sun' | 'moon' | 'sliders' | 'book' | 'sparkle'
  size?: number
}>(), { size: 20 })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <template v-if="name === 'arrow-right'"><path d="M4 12h16m-7-7 7 7-7 7" /></template>
    <template v-else-if="name === 'arrow-left'"><path d="M20 12H4m7 7-7-7 7-7" /></template>
    <template v-else-if="name === 'arrow-up-right'"><path d="M5 19 19 5M8 5h11v11" /></template>
    <template v-else-if="name === 'settings'"><circle cx="12" cy="12" r="3" /><path d="M4.6 10.2 3 12l1.6 1.8.5 2.1 2.2.4L9 18l.5 2 2.5 1 2.5-1 .5-2 1.7-1.7 2.2-.4.5-2.1L21 12l-1.6-1.8-.5-2.1-2.2-.4L15 6l-.5-2L12 3 9.5 4 9 6 7.3 7.7l-2.2.4-.5 2.1Z" /></template>
    <template v-else-if="name === 'close'"><path d="m5 5 14 14M19 5 5 19" /></template>
    <template v-else-if="name === 'heart'"><path d="M20 8.6c0 4.8-8 10-8 10s-8-5.2-8-10a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3Z" /></template>
    <template v-else-if="name === 'check'"><path d="m5 12 4 4L19 6" /></template>
    <template v-else-if="name === 'restart'"><path d="M3 11a9 9 0 1 1 2.6 6.4M3 4v7h7" /></template>
    <template v-else-if="name === 'sun'"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></template>
    <template v-else-if="name === 'moon'"><path d="M20.4 15.1A8 8 0 0 1 8.9 3.6 8.5 8.5 0 1 0 20.4 15.1Z" /></template>
    <template v-else-if="name === 'sliders'"><path d="M4 7h16M4 17h16" /><circle cx="9" cy="7" r="2.5" fill="var(--surface-solid)" /><circle cx="15" cy="17" r="2.5" fill="var(--surface-solid)" /></template>
    <template v-else-if="name === 'book'"><path d="M12 6c-2.6-2-5.8-2.2-9-1v14c3.2-1.2 6.4-1 9 1 2.6-2 5.8-2.2 9-1V5c-3.2-1.2-6.4-1-9 1Zm0 0v14" /></template>
    <template v-else-if="name === 'sparkle'"><path d="m12 2 2.1 7.9L22 12l-7.9 2.1L12 22l-2.1-7.9L2 12l7.9-2.1L12 2Z" /></template>
  </svg>
</template>
