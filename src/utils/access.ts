/** Сюрприз без серверной авторизации: код предназначен только для игрового входа. */
export const ACCESS_CODE = '07022026'
export const ACCESS_CODE_LENGTH = ACCESS_CODE.length

export function normalizeAccessCode(value: string): string {
  return value.replace(/[^0-9]/g, '').slice(0, ACCESS_CODE_LENGTH)
}

export function matchesAccessCode(value: string): boolean {
  return normalizeAccessCode(value) === ACCESS_CODE
}

/** 5 ноября 2026 года, 00:00 по местному времени устройства. */
export function getBirthdayDate(): Date {
  return new Date(2026, 10, 5, 0, 0, 0, 0)
}

export function getSecondsUntilBirthday(now: number = Date.now()): number {
  return Math.max(0, Math.ceil((getBirthdayDate().getTime() - now) / 1000))
}

export interface CountdownParts {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function splitCountdown(totalSeconds: number): CountdownParts {
  const remaining = Math.max(0, Math.floor(totalSeconds))
  return {
    days: Math.floor(remaining / 86400),
    hours: Math.floor((remaining % 86400) / 3600),
    minutes: Math.floor((remaining % 3600) / 60),
    seconds: remaining % 60,
  }
}
