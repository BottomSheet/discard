<script setup lang="ts">
import { computed } from 'vue'
import { questions, getChapter } from '@/data/quest'

const props = defineProps<{ number: number }>()
const chapter = computed(() => getChapter(props.number))
const formatted = computed(() => String(props.number).padStart(2, '0'))
const completed = computed(() => Math.max(0, props.number - 1))
const progress = computed(() => `${(completed.value / questions.length) * 100}%`)
</script>

<template>
  <div class="quest-progress">
    <div class="quest-progress__top">
      <span class="quest-progress__chapter">{{ chapter.title }}</span>
      <span class="quest-progress__counter" :aria-label="`Вопрос ${number} из ${questions.length}`">
        {{ formatted }} <span>/ {{ questions.length }}</span>
      </span>
    </div>
    <div
      class="quest-progress__track"
      role="progressbar"
      :aria-valuenow="completed"
      :aria-valuemin="0"
      :aria-valuemax="questions.length"
      :aria-label="`Пройдено вопросов: ${completed} из ${questions.length}`"
    >
      <span :style="{ width: progress }"></span>
    </div>
  </div>
</template>
