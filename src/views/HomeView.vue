<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useQuestStore } from '@/stores/quest'
import { useFocusHeading } from '@/composables/useFocusHeading'
import SlideAction from '@/components/ui/SlideAction.vue'

const quest = useQuestStore()
const heading = useFocusHeading()
const target = computed(() => ({
  name: 'question',
  params: { number: quest.isComplete ? 1 : quest.firstUnanswered }
}))
const actionText = computed(() => quest.isComplete
  ? 'Пройти ещё раз'
  : quest.answeredCount > 0 ? 'Продолжить' : 'Начать')

function startQuest(): void {
  quest.beginQuest()
}
</script>

<template>
  <section class="home-page site-container" aria-labelledby="home-title">
    <div class="home-intro">
      <span class="section-label">5 ноября · тебе 18</span>
      <h1 id="home-title" ref="heading" tabindex="-1" class="home-title">С днём<br />рождения,<br /><em>Евочка.</em></h1>
      <div class="home-copy">
        <p>Я собрал для тебя кое-что из нашей переписки: первые признания, странные шутки и слова, которые стали только нашими.</p>
        <p>Здесь 18 вопросов. Просто выбирай, как помнишь. В конце покажу, что было на самом деле.</p>
      </div>
      <div class="home-actions">
        <SlideAction :to="target" :label="actionText" hint="Проведи вправо" :sr-label="actionText" @before-navigate="startQuest" />
        <span class="home-meta">18 вопросов</span>
        <RouterLink v-if="quest.isComplete" class="home-finished-link" :to="{ name: 'birthday' }">Вернуться к поздравлению</RouterLink>
      </div>
      <p v-if="quest.answeredCount > 0 && !quest.isComplete" class="resume-note">Сохранено ответов: {{ quest.answeredCount }} из 18.</p>
    </div>

    <div class="home-art" aria-hidden="true">
      <div class="art-card glass-panel">
        <div class="art-card__top"><span>05 / 11</span><span>для тебя</span></div>
        <div class="art-card__center">
          <span class="art-card__number">18</span>
          <span class="art-card__years">лет</span>
        </div>
        <div class="art-card__bottom"><span>ЕВА</span><span>с любовью, Костя ♡</span></div>
      </div>
    </div>
  </section>
</template>
