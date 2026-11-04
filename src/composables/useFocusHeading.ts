import { nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Переводит фокус на заголовок после входа на экран или смены вопроса.
 * ID позволяет не привязывать template ref к каждому заголовку.
 */
export function useFocusHeading(targetId: string | (() => string)): void {
  const route = useRoute()

  const focus = (): void => {
    void nextTick(() => {
      const id = typeof targetId === 'function' ? targetId() : targetId
      document.getElementById(id)?.focus({ preventScroll: true })
    })
  }

  onMounted(focus)
  watch(() => route.fullPath, focus)
}
