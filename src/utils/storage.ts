/** Хранилище необязательно: приложение работает и в приватном режиме. */
export function readStorage(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as unknown) : null
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Отсутствие доступа к localStorage не должно прерывать игру.
  }
}
