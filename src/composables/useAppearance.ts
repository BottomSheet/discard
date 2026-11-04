import { onMounted, onUnmounted, watchEffect } from 'vue'
import { useSettingsStore } from '@/stores/settings'

/** Единственная точка применения пользовательских параметров к документу. */
export function useAppearance(): void {
  const settings = useSettingsStore()
  let media: MediaQueryList | undefined
  const apply = () => {
    const systemDark = media?.matches ?? false
    const dark = settings.theme === 'dark' || (settings.theme === 'system' && systemDark)
    const root = document.documentElement

    root.dataset.theme = dark ? 'dark' : 'light'
    root.dataset.motion = settings.reduceMotion ? 'reduced' : 'full'
    root.style.setProperty('--glass-alpha', String(0.36 + (settings.glass / 100) * 0.58))
    root.style.setProperty('--glass-blur', `${Math.round(9 + (settings.glass / 100) * 18)}px`)
    root.style.colorScheme = dark ? 'dark' : 'light'
    // Fallback для тех браузеров, которые учитывают theme-color.
    // Корневой фон задаётся градиентом в CSS: сплошную подложку не создаём.
    const themeColor = dark ? '#251d2b' : '#fffafc'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor)
  }

  watchEffect(apply)

  onMounted(() => {
    media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', apply)
    apply()
  })

  onUnmounted(() => media?.removeEventListener('change', apply))
}
