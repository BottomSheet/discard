<script setup lang="ts">
import type { Choice } from '@/types/quest'

withDefaults(defineProps<{ choice: Choice; disabled?: boolean }>(), { disabled: false })
const emit = defineEmits<{ select: [id: Choice['id']] }>()
</script>

<template>
  <button class="choice-option" type="button" :disabled="disabled" @click="emit('select', choice.id)">
    <span class="choice-option__letter" aria-hidden="true">{{ choice.id }}</span>
    <span class="choice-option__text">{{ choice.text }}</span>
  </button>
</template>
