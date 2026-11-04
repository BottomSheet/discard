import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useQuestStore } from '../src/stores/quest'

beforeEach(() => {
  const values = new Map<string, string>()
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value) },
    },
  })
  setActivePinia(createPinia())
})

describe('прогресс', () => {
  it('учитывает только реальные варианты существующих вопросов', () => {
    const store = useQuestStore()
    store.choose(42, 'Б')
    expect(store.answeredCount).toBe(0)
    store.choose(1, 'Б')
    expect(store.answeredCount).toBe(1)
    expect(store.firstUnanswered).toBe(2)
  })

  it('продолжает неполный квест без сброса ответов', () => {
    const store = useQuestStore()
    store.choose(1, 'А')
    expect(store.beginQuest()).toBe(2)
    expect(store.answers[1]).toBe('А')
  })

  it('сохраняет исправленный выбор без увеличения числа ответов', () => {
    const store = useQuestStore()
    store.choose(1, 'А')
    store.choose(1, 'Б')
    expect(store.answeredCount).toBe(1)
    expect(store.answers[1]).toBe('Б')
  })

  it('после всех 18 ответов вновь начинает квест с первого вопроса', () => {
    const store = useQuestStore()
    for (let number = 1; number <= 18; number++) store.choose(number, 'А')
    expect(store.isComplete).toBe(true)
    expect(store.firstUnanswered).toBe(19)
    expect(store.beginQuest()).toBe(1)
    expect(store.answeredCount).toBe(0)
    store.reset()
    expect(store.isComplete).toBe(false)
    expect(store.firstUnanswered).toBe(1)
  })
})
