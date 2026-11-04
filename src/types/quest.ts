export type ChoiceId = 'А' | 'Б' | 'В' | 'Г'

export interface Choice {
  id: ChoiceId
  text: string
}

export interface QuestQuestion {
  id: number
  title: string
  options: readonly Choice[]
  actualAnswer: ChoiceId
  explanation: string
  reflection: string
}

export interface QuestChapter {
  id: string
  title: string
  caption: string
  start: number
  end: number
}

export type AnswerMap = Partial<Record<number, ChoiceId>>
export type ColorTheme = 'system' | 'light' | 'dark'
