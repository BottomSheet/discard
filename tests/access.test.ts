import { describe, expect, it } from 'vitest'
import { ACCESS_CODE_LENGTH, getBirthdayDate, getSecondsUntilBirthday, matchesAccessCode, normalizeAccessCode, splitCountdown } from '../src/utils/access'

describe('экран кода и отсчёт', () => {
  it('сохраняет ведущие нули и убирает недопустимые символы', () => {
    expect(ACCESS_CODE_LENGTH).toBe(8)
    expect(normalizeAccessCode('07.02.2026')).toBe('07022026')
    expect(normalizeAccessCode('07022026123')).toBe('07022026')
    expect(matchesAccessCode('07022026')).toBe(true)
    expect(matchesAccessCode('07022025')).toBe(false)
  })

  it('использует локальную полночь пятого ноября', () => {
    const target = getBirthdayDate()
    expect([target.getFullYear(), target.getMonth(), target.getDate(), target.getHours()]).toEqual([2026, 10, 5, 0])
    expect(getSecondsUntilBirthday(target.getTime() - 1100)).toBe(2)
    expect(getSecondsUntilBirthday(target.getTime())).toBe(0)
    expect(getSecondsUntilBirthday(target.getTime() + 10000)).toBe(0)
  })

  it('разбивает остаток на дни, часы, минуты и секунды', () => {
    expect(splitCountdown(90061)).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 1 })
    expect(splitCountdown(-1)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  })
})
