import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { getQuestion, questions } from '@/data/quest'
import type { AnswerMap, ChoiceId } from '@/types/quest'
import { readStorage, writeStorage } from '@/utils/storage'

const STORAGE_KEY = 'eva-quest:answers:v1'

function restoreAnswers(): AnswerMap {
  const stored = readStorage(STORAGE_KEY)
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {}

  const parsed = stored as Record<string, unknown>
  const valid: AnswerMap = {}

  for (const current of questions) {
    const value = parsed[String(current.id)]
    if (current.options.some((option) => option.id === value)) {
      valid[current.id] = value as ChoiceId
    }
  }

  return valid
}

export const useQuestStore = defineStore('quest', () => {
  const answers = ref<AnswerMap>(restoreAnswers())

  const answeredCount = computed(() => questions.filter(({ id }) => answers.value[id]).length)
  const isComplete = computed(() => answeredCount.value === questions.length)
  const firstUnanswered = computed(() => questions.find(({ id }) => !answers.value[id])?.id ?? questions.length + 1)

  function choose(questionNumber: number, choiceId: ChoiceId): void {
    const current = getQuestion(questionNumber)
    if (!current || !current.options.some(({ id }) => id === choiceId)) return
    answers.value = { ...answers.value, [questionNumber]: choiceId }
  }

  function reset(): void {
    answers.value = {}
  }

  // Основной сценарий всегда начинается с вопросов — даже после старого прохождения.
  function beginQuest(): number {
    if (isComplete.value) reset()
    return firstUnanswered.value
  }

  watch(answers, (value) => writeStorage(STORAGE_KEY, value), { deep: true })

  return { answers, answeredCount, isComplete, firstUnanswered, choose, reset, beginQuest }
})
