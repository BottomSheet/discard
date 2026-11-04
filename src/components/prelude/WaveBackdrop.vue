<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

/** Лёгкая Canvas-подложка: плавные волны и отклик на касание без блокировки скролла. */
const canvas = ref<HTMLCanvasElement | null>(null)
let context: CanvasRenderingContext2D | null = null
let width = 1
let height = 1
let raf = 0
let previousFrame = 0
let resizeObserver: ResizeObserver | null = null
const touch = { x: 0.5, y: 0.5, force: 0 }
const pulses: Array<{ x: number; y: number; born: number }> = []

const isReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'reduced'

function resize(): void {
  const node = canvas.value
  if (!node) return
  const rect = node.getBoundingClientRect()
  width = Math.max(1, rect.width)
  height = Math.max(1, rect.height)
  const ratio = Math.min(window.devicePixelRatio || 1, 1.7)
  node.width = Math.round(width * ratio)
  node.height = Math.round(height * ratio)
  context = node.getContext('2d', { alpha: false })
  context?.setTransform(ratio, 0, 0, ratio, 0, 0)
  draw(performance.now())
}

function waveY(x: number, time: number, index: number): number {
  const fraction = x / width
  const base = [0.24, 0.48, 0.70, 0.86][index] ?? 0.5
  const amplitude = height * ([0.054, 0.068, 0.057, 0.045][index] ?? 0.05)
  const phase = fraction * Math.PI * (2.1 + index * 0.29) + time * (0.43 + index * 0.15) + index * 1.6
  const naturalWave = Math.sin(phase) * amplitude + Math.cos(phase * 0.55 + time * 0.16) * amplitude * 0.48
  const distance = (fraction - touch.x) / 0.23
  const interaction = Math.exp(-(distance * distance)) * touch.force * height * 0.06 * Math.sin(phase * 1.7)
  return height * base + naturalWave + interaction
}

function draw(now: number): void {
  const ctx = context
  if (!ctx) return
  const dark = document.documentElement.dataset.theme === 'dark'
  const time = now / 1000
  const base = ctx.createLinearGradient(width * 0.15, 0, width * 0.9, height)
  if (dark) {
    base.addColorStop(0, '#1e1825')
    base.addColorStop(0.44, '#38233a')
    base.addColorStop(1, '#251b2c')
  } else {
    base.addColorStop(0, '#fffdfd')
    base.addColorStop(0.46, '#fff3fa')
    base.addColorStop(1, '#fff9fd')
  }
  ctx.fillStyle = base
  ctx.fillRect(0, 0, width, height)

  // Не рисуем отдельные размытые круги — только широкие полупрозрачные ленты.
  const ribbons = dark
    ? ['151,78,133', '198,102,157', '129,88,169', '202,119,157']
    : ['241,179,208', '224,151,197', '229,197,234', '247,188,214']

  const steps = 42
  for (let i = 0; i < 4; i++) {
    const thickness = height * (i === 3 ? 0.28 : 0.35)
    ctx.beginPath()
    for (let j = 0; j <= steps; j++) {
      const x = width * j / steps
      const y = waveY(x, time, i)
      if (j === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    for (let j = steps; j >= 0; j--) {
      const x = width * j / steps
      ctx.lineTo(x, waveY(x, time, i) + thickness)
    }
    ctx.closePath()
    const start = height * ([0.15, 0.38, 0.59, 0.75][i] ?? 0.4)
    const fill = ctx.createLinearGradient(0, start, width * .14, start + thickness * 1.2)
    const pigment = ribbons[i] ?? '240,173,209'
    fill.addColorStop(0, `rgba(${pigment}, 0)`)
    fill.addColorStop(0.35, `rgba(${pigment}, ${dark ? 0.26 : 0.36})`)
    fill.addColorStop(0.72, `rgba(${pigment}, ${dark ? 0.17 : 0.24})`)
    fill.addColorStop(1, `rgba(${pigment}, 0)`)
    ctx.fillStyle = fill
    ctx.fill()
  }

  if (touch.force > 0.01) {
    const x = touch.x * width
    const y = touch.y * height
    const glow = ctx.createRadialGradient(x, y, 0, x, y, Math.min(width, height) * .42)
    glow.addColorStop(0, dark ? `rgba(255,203,229,${touch.force * .12})` : `rgba(255,255,255,${touch.force * .46})`)
    glow.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, width, height)
  }

  // Одно почти незаметное кольцо на касание — взаимодействие ощущается тактильно.
  for (const pulse of pulses) {
    const age = (now - pulse.born) / 1000
    if (age < 0 || age > 1.05) continue
    ctx.beginPath()
    ctx.arc(pulse.x * width, pulse.y * height, 15 + age * 170, 0, Math.PI * 2)
    ctx.strokeStyle = dark ? `rgba(255,221,240,${(1 - age) * 0.15})` : `rgba(207,113,165,${(1 - age) * 0.16})`
    ctx.lineWidth = 1.6
    ctx.stroke()
  }
}

function tick(now: number): void {
  raf = window.requestAnimationFrame(tick)
  if (document.hidden || now - previousFrame < 32) return
  previousFrame = now
  if (!isReducedMotion()) {
    touch.force *= 0.965
    while (pulses.length > 0 && now - (pulses[0]?.born ?? now) > 1050) pulses.shift()
    draw(now)
  }
}

function setPointer(event: PointerEvent, isDown = false): void {
  if (isReducedMotion()) return
  touch.x = Math.min(1, Math.max(0, event.clientX / width))
  touch.y = Math.min(1, Math.max(0, event.clientY / height))
  touch.force = isDown ? 1 : Math.max(touch.force, event.pointerType === 'mouse' ? 0.30 : 0.65)
  if (isDown) pulses.push({ x: touch.x, y: touch.y, born: performance.now() })
}

function pointerDown(event: PointerEvent): void { setPointer(event, true) }
function pointerMove(event: PointerEvent): void { setPointer(event) }

onMounted(() => {
  resize()
  if (typeof ResizeObserver !== 'undefined' && canvas.value) {
    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas.value)
  } else window.addEventListener('resize', resize)
  window.addEventListener('pointerdown', pointerDown, { passive: true })
  window.addEventListener('pointermove', pointerMove, { passive: true })
  if (!isReducedMotion()) raf = window.requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(raf)
  resizeObserver?.disconnect()
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointerdown', pointerDown)
  window.removeEventListener('pointermove', pointerMove)
})
</script>

<template>
  <canvas ref="canvas" class="prelude-wave" aria-hidden="true"></canvas>
</template>
