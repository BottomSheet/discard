<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, type CSSProperties } from 'vue'

interface ConfettiPiece {
  id: number
  side: 'left' | 'right'
  style: CSSProperties
}

/** Две веерные струи, без случайных изменений при каждом рендере. */
const palette = ['#d66c9d', '#e98fb5', '#f2adcc', '#bb5b87', '#f7c4db']
const pieces: ConfettiPiece[] = Array.from({ length: 52 }, (_, id) => {
  const side = id % 2 === 0 ? 'left' : 'right'
  const number = Math.floor(id / 2)
  const sign = side === 'left' ? 1 : -1
  const spread = 14 + (number * 17) % 32
  const distance = 15 + (number * 11) % 28
  return {
    id,
    side,
    style: {
      '--start-y': `${23 + (number * 13) % 32}vh`,
      '--mid-x': `${sign * spread}vw`,
      '--mid-y': `${-42 - (number * 19) % 105}px`,
      '--end-x': `${sign * (spread + distance)}vw`,
      '--end-y': `${26 + (number * 7) % 34}vh`,
      '--delay': `${(number % 9) * 0.085}s`,
      '--duration': `${3.8 + (number % 7) * 0.22}s`,
      '--size': `${6 + (number * 3) % 6}px`,
      '--color': palette[(id * 3 + number) % palette.length]!,
      '--turn': `${480 + (number % 5) * 110}deg`,
      '--mid-turn': `${Math.round((480 + (number % 5) * 110) * .45)}deg`,
    } as CSSProperties,
  }
})

const visible = ref(false)
let hideTimer: number | undefined
let raf: number | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'reduced') return
  raf = window.requestAnimationFrame(() => { visible.value = true })
  hideTimer = window.setTimeout(() => { visible.value = false }, 6200)
})

onBeforeUnmount(() => {
  if (raf !== undefined) window.cancelAnimationFrame(raf)
  if (hideTimer !== undefined) window.clearTimeout(hideTimer)
})
</script>

<template>
  <div v-if="visible" class="birthday-confetti" aria-hidden="true">
    <span
      v-for="piece in pieces"
      :key="piece.id"
      class="birthday-confetti__piece"
      :class="[`birthday-confetti__piece--${piece.side}`, { 'birthday-confetti__piece--round': piece.id % 5 === 0 }]"
      :style="piece.style"
    ></span>
  </div>
</template>
