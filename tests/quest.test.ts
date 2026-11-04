import { describe, expect, it } from 'vitest'
import { chapters, getChapter, getChoiceText, getQuestion, questions } from '../src/data/quest'

const choiceIds = ['А', 'Б', 'В', 'Г']

describe('содержание квеста', () => {
  it('содержит ровно 18 вопросов с уникальными номерами', () => {
    expect(questions).toHaveLength(18)
    expect(questions.map(({ id }) => id)).toEqual(Array.from({ length: 18 }, (_, i) => i + 1))
  })

  it('у каждого вопроса четыре уникальных варианта и заполненные поля', () => {
    for (const item of questions) {
      expect(item.options.map(({ id }) => id)).toEqual(choiceIds)
      expect(item.options.find(({ id }) => id === item.actualAnswer)).toBeTruthy()
      expect(item.title.trim().length).toBeGreaterThan(10)
      expect(item.explanation.trim().length).toBeGreaterThan(10)
      expect(item.reflection.trim().length).toBeGreaterThan(10)
      expect(getChoiceText(item, item.actualAnswer).length).toBeGreaterThan(2)
    }
  })

  it('распределяет все вопросы по четырём главам', () => {
    expect(chapters).toHaveLength(4)
    expect(questions.map(({ id }) => getChapter(id).id)).toEqual([
      'beginning', 'beginning', 'beginning',
      'talks', 'talks', 'talks', 'talks', 'talks',
      'moments', 'moments', 'moments', 'moments', 'moments',
      'language', 'language', 'language', 'language', 'language',
    ])
  })

  it('не находит несуществующий вопрос', () => {
    expect(getQuestion(19)).toBeUndefined()
  })
})
