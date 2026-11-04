<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink, onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { questions, getQuestion } from '@/data/quest'
import { useQuestStore } from '@/stores/quest'
import { useFocusHeading } from '@/composables/useFocusHeading'
import AppIcon from '@/components/ui/AppIcon.vue'
import QuestProgress from '@/components/quest/QuestProgress.vue'
import ChoiceOption from '@/components/quest/ChoiceOption.vue'
import type { ChoiceId } from '@/types/quest'

const route = useRoute()
const router = useRouter()
const quest = useQuestStore()
const number = computed(() => Number(route.params.number))
useFocusHeading(() => `question-title-${number.value}`)
const current = computed(() => getQuestion(number.value))
const pending = ref(false)
const direction = ref<'forward' | 'backward'>('forward')
const transitionName = computed(() => direction.value === 'backward' ? 'question-backward' : 'question-forward')
let transitionTimer: ReturnType<typeof setTimeout> | undefined

function selectAnswer(choice: ChoiceId): void {
  if (!current.value || pending.value) return
  pending.value = true
  quest.choose(current.value.id, choice)

  // Без отдельной паузы «загрузка вопроса»: новая карточка начинает движение
  // сразу после фиксации выбора. Состояние и прогресс остаются на том же экране.
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const reducedBySetting = document.documentElement.dataset.motion === 'reduced'
  transitionTimer = setTimeout(() => {
    const nextNumber = number.value + 1
    void router.push(nextNumber > questions.length
      ? { name: 'birthday' }
      : { name: 'question', params: { number: nextNumber } })
  }, prefersReduced || reducedBySetting ? 0 : 95)
}

watch(number, (next, previous) => {
  direction.value = next < previous ? 'backward' : 'forward'
  pending.value = false
  // Роутер не прокручивает между вопросами сам, чтобы не было резкого скачка.
  // Прокрутка выполняется лишь когда заголовок уже вне видимой области.
  if (window.scrollY > 110) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'reduced'
    window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' })
  }
}, { flush: 'sync' })

onBeforeRouteLeave(() => { if (transitionTimer) clearTimeout(transitionTimer) })
onBeforeUnmount(() => { if (transitionTimer) clearTimeout(transitionTimer) })
</script>

<template>
  <section v-if="current" class="question-page site-container" :aria-labelledby="`question-title-${number}`">
    <div class="question-content glass-panel glass-panel--elevated">
      <QuestProgress :number="number" />
      <div class="question-viewport">
        <Transition :name="transitionName">
          <div :key="current.id" class="question-slide">
            <div class="question-topline">ВОПРОС {{ String(number).padStart(2, '0') }}</div>
            <h1 :id="`question-title-${current.id}`" tabindex="-1" class="question-title">{{ current.title }}</h1>
            <p class="question-instruction">Выбери то, что помнишь. Дальше перейдём автоматически.</p>
            <div class="choices-list" role="group" :aria-label="`Варианты ответа на вопрос ${number}`">
              <ChoiceOption
                v-for="option in current.options"
                :key="option.id"
                :choice="option"
                :disabled="pending"
                @select="selectAnswer"
              />
            </div>
          </div>
        </Transition>
      </div>
      <div class="question-bottom">
        <RouterLink class="quiet-link" :to="number === 1 ? { name: 'home' } : { name: 'question', params: { number: number - 1 } }">
          <AppIcon name="arrow-left" :size="16" /> {{ number === 1 ? 'На главную' : 'Назад' }}
        </RouterLink>
        <span>Можно вернуться и изменить выбор</span>
      </div>
      <span class="sr-only" role="status" aria-live="polite">{{ pending ? 'Выбор сохранён. Следующий вопрос.' : '' }}</span>
    </div>
  </section>
</template>
