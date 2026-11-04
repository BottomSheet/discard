<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter, type RouteLocationRaw } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import {
  SLIDE_THUMB_INSET,
  clampSlideOffset,
  getSlideFillOpacity,
  getSlideFillWidth,
  getSlideTravel,
} from '@/utils/slideGeometry'

const props = withDefaults(defineProps<{
  to: RouteLocationRaw
  label: string
  hint?: string
  srLabel?: string
}>(), {
  hint: 'Проведи вправо',
  srLabel: '',
})

const emit = defineEmits<{ (event: 'beforeNavigate'): void }>()
const router = useRouter()
const track = ref<HTMLElement | null>(null)
const thumb = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const isCompleted = ref(false)
const offset = ref(0)
const travel = ref(0)
const thumbWidth = ref(80)

let activePointer: number | null = null
let startX = 0
let startOffset = 0
let lastX = 0
let lastTime = 0
let navigateTimer: ReturnType<typeof setTimeout> | undefined
let resizeObserver: ResizeObserver | undefined

const progress = computed(() => travel.value > 0 ? offset.value / travel.value : 0)
const thumbStyle = computed(() => ({ transform: `translate3d(${offset.value}px, 0, 0)` }))
const fillStyle = computed(() => ({
  width: `${getSlideFillWidth(offset.value, travel.value, thumbWidth.value, SLIDE_THUMB_INSET)}px`,
  opacity: String(getSlideFillOpacity(offset.value, travel.value)),
}))

function measure(): void {
  if (!track.value || !thumb.value) return
  thumbWidth.value = thumb.value.offsetWidth
  travel.value = getSlideTravel(track.value.clientWidth, thumbWidth.value)
  offset.value = isCompleted.value ? travel.value : clampSlideOffset(offset.value, travel.value)
}

function complete(): void {
  if (isCompleted.value) return
  measure()
  isCompleted.value = true
  isDragging.value = false
  offset.value = travel.value
  const destination = props.to
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'reduced'
  navigateTimer = setTimeout(() => {
    emit('beforeNavigate')
    void router.push(destination)
  }, reduced ? 0 : 280)
}

function onPointerDown(event: PointerEvent): void {
  if (isCompleted.value || activePointer !== null) return
  if (event.pointerType === 'mouse' && event.button !== 0) return
  measure()
  activePointer = event.pointerId
  startX = event.clientX
  startOffset = offset.value
  lastX = event.clientX
  lastTime = event.timeStamp
  isDragging.value = true
  thumb.value?.setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent): void {
  if (!isDragging.value || activePointer !== event.pointerId) return
  offset.value = clampSlideOffset(startOffset + event.clientX - startX, travel.value)
  lastX = event.clientX
  lastTime = event.timeStamp
  // Как в примере Flutter: доведение почти до края подтверждает действие сразу.
  if (travel.value > 0 && progress.value >= 0.95) complete()
}

function onPointerUp(event: PointerEvent): void {
  if (activePointer !== event.pointerId) return
  const finish = travel.value > 0 && progress.value >= 0.90
  // На быстрый короткий бросок тоже реагируем, но только после половины пути.
  const velocity = (event.clientX - lastX) / Math.max(1, event.timeStamp - lastTime)
  const quickFling = velocity > 1.35 && progress.value > 0.50
  isDragging.value = false
  activePointer = null
  if (thumb.value?.hasPointerCapture(event.pointerId)) thumb.value.releasePointerCapture(event.pointerId)
  if (finish || quickFling) complete()
  else if (!isCompleted.value) offset.value = 0
}

function cancelDrag(): void {
  isDragging.value = false
  activePointer = null
  if (!isCompleted.value) offset.value = 0
}

// Нативная кнопка остаётся доступной клавиатурой и скринридером,
// но обычный клик по дорожке не подменяет свайп.
function onClick(event: MouseEvent): void {
  if (event.detail === 0) complete()
}

onMounted(() => {
  measure()
  if (typeof ResizeObserver !== 'undefined' && track.value) {
    resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(track.value)
  } else {
    window.addEventListener('resize', measure)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', measure)
  if (navigateTimer) clearTimeout(navigateTimer)
})
</script>

<template>
  <button
    type="button"
    class="slide-action glass-panel glass-panel--elevated"
    :class="{ 'slide-action--dragging': isDragging, 'slide-action--completed': isCompleted }"
    :aria-label="`${srLabel || label}. Проведи ползунок вправо или нажми Enter`"
    @click="onClick"
  >
    <span ref="track" class="slide-action__track">
      <span class="slide-action__content">
        <strong>{{ label }}</strong>
        <small>{{ hint }}</small>
      </span>
      <span class="slide-action__fill" :style="fillStyle" aria-hidden="true"></span>
      <span
        ref="thumb"
        class="slide-action__thumb"
        :style="thumbStyle"
        aria-hidden="true"
        @pointerdown.stop="onPointerDown"
        @pointermove.stop="onPointerMove"
        @pointerup.stop="onPointerUp"
        @pointercancel.stop="cancelDrag"
        @lostpointercapture="cancelDrag"
      >
        <AppIcon :name="isCompleted ? 'check' : 'arrow-right'" :size="22" />
      </span>
    </span>
  </button>
</template>
