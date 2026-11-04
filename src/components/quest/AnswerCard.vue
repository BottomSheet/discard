<script setup lang="ts">
import { computed } from 'vue'
import type { ChoiceId, QuestQuestion } from '@/types/quest'
import { getChoiceText } from '@/data/quest'
import GlassPanel from '@/components/ui/GlassPanel.vue'

const props = defineProps<{
  question: QuestQuestion
  selected?: ChoiceId
}>()
const remembered = computed(() => props.selected === props.question.actualAnswer)
</script>

<template>
  <GlassPanel as="article" class="answer-card" :class="{ 'answer-card--remembered': remembered }" :aria-labelledby="`answer-title-${question.id}`">
    <div class="answer-card__header"><span>ВОПРОС {{ String(question.id).padStart(2, '0') }}</span><span class="answer-card__ornament" aria-hidden="true">✳</span></div>
    <h3 :id="`answer-title-${question.id}`" class="answer-card__title">{{ question.title }}</h3>
    <div class="answer-pair">
      <div class="answer-pair__box">
        <span class="answer-label">ТЫ ВЫБРАЛА</span>
        <p><span v-if="selected" class="answer-letter">{{ selected }}</span>{{ selected ? getChoiceText(question, selected) : 'Ответ не сохранился' }}</p>
      </div>
      <div class="answer-pair__box answer-pair__box--actual" :class="{ 'answer-pair__box--same': remembered }">
        <span class="answer-label">КАК БЫЛО</span>
        <p><span class="answer-letter">{{ question.actualAnswer }}</span>{{ getChoiceText(question, question.actualAnswer) }}</p>
      </div>
    </div>
    <div class="answer-card__story"><span class="answer-label">ИЗ НАШЕЙ ПЕРЕПИСКИ</span><p>{{ question.explanation }}</p></div>
    <div class="answer-card__reflection"><span class="reflection-symbol" aria-hidden="true">↳</span><div><span class="answer-label">ПОДУМАТЬ</span><p>{{ question.reflection }}</p></div></div>
  </GlassPanel>
</template>
