<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { chapters, questions } from '@/data/quest'
import { useQuestStore } from '@/stores/quest'
import { useFocusHeading } from '@/composables/useFocusHeading'
import AnswerCard from '@/components/quest/AnswerCard.vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const router = useRouter()
const quest = useQuestStore()
const heading = useFocusHeading()
const activeChapter = ref('all')
const visibleQuestions = computed(() => {
  const current = chapters.find(({ id }) => id === activeChapter.value)
  return current ? questions.filter(({ id }) => id >= current.start && id <= current.end) : questions
})

function startOver(): void {
  if (!window.confirm('Пройти все 18 вопросов заново? Твои предыдущие выборы будут удалены.')) return
  quest.reset()
  void router.push({ name: 'home' })
}
</script>

<template>
  <section class="answers-page site-container" aria-labelledby="answers-title">
    <div class="answers-intro">
      <span class="section-label"><span class="section-label__line"></span> Вспомнить всё</span>
      <h1 id="answers-title" ref="heading" tabindex="-1">А вот как<br /><em>было на самом деле.</em></h1>
      <p>Здесь — твой выбор и то, что мы действительно писали друг другу. Можно перечитать сообщения и ещё раз вспомнить эти моменты.</p>
    </div>
    <div class="answers-toolbar" aria-label="Фильтр глав">
      <button class="chapter-filter" type="button" :aria-pressed="activeChapter === 'all'" @click="activeChapter = 'all'">Все <span>18</span></button>
      <button v-for="chapter in chapters" :key="chapter.id" class="chapter-filter" type="button" :aria-pressed="activeChapter === chapter.id" @click="activeChapter = chapter.id">{{ chapter.title }}</button>
    </div>
    <span class="sr-only" role="status" aria-live="polite">Показано вопросов: {{ visibleQuestions.length }}</span>
    <div class="answer-list">
      <AnswerCard v-for="item in visibleQuestions" :key="item.id" :question="item" :selected="quest.answers[item.id]" />
    </div>
    <div class="answers-finish">
      <span class="answers-finish__star" aria-hidden="true">✳</span>
      <h2>Я тебя люблю.</h2>
      <p>Спасибо тебе за все наши разговоры, Евочка. С днём рождения.</p>
      <button type="button" class="secondary-button" @click="startOver"><AppIcon name="restart" :size="17" /> Пройти ещё раз</button>
    </div>
  </section>
</template>
