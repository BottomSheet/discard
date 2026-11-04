import { nextTick, onMounted, ref, watch, type Ref } from 'vue'
import { useRoute } from 'vue-router'

/** После смены сцены переводит фокус на заголовок для клавиатуры и скринридера. */
export function useFocusHeading(): Ref<HTMLElement | null> {
  const heading = ref<HTMLElement | null>(null)
  const route = useRoute()

  const focus = () => {
    void nextTick(() => heading.value?.focus({ preventScroll: true }))
  }

  onMounted(focus)
  watch(() => route.fullPath, focus)

  return heading
}
