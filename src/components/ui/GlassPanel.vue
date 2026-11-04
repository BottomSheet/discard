<script setup lang="ts">
withDefaults(defineProps<{ as?: string; elevated?: boolean }>(), { as: 'div', elevated: false })
</script>

<template>
  <component :is="as" class="glass-panel" :class="{ 'glass-panel--elevated': elevated }"><slot /></component>
</template>
