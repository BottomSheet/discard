import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { ColorTheme } from '@/types/quest'
import { readStorage, writeStorage } from '@/utils/storage'

const STORAGE_KEY = 'eva-quest:settings:v2'
const themes: readonly ColorTheme[] = ['system', 'light', 'dark']

function initialSettings(): { theme: ColorTheme; glass: number; reduceMotion: boolean } {
  const stored = readStorage(STORAGE_KEY)
  const value = (stored && typeof stored === 'object' ? stored : {}) as Record<string, unknown>

  return {
    theme: themes.includes(value.theme as ColorTheme) ? (value.theme as ColorTheme) : 'light',
    glass: typeof value.glass === 'number' && Number.isFinite(value.glass)
      ? Math.max(0, Math.min(100, value.glass))
      : 58,
    reduceMotion: value.reduceMotion === true,
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const initial = initialSettings()
  const theme = ref<ColorTheme>(initial.theme)
  const glass = ref(initial.glass)
  const reduceMotion = ref(initial.reduceMotion)

  watch([theme, glass, reduceMotion], () => {
    writeStorage(STORAGE_KEY, {
      theme: theme.value,
      glass: glass.value,
      reduceMotion: reduceMotion.value,
    })
  })

  return { theme, glass, reduceMotion }
})
