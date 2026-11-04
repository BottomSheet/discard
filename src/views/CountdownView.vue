<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { getSecondsUntilBirthday, splitCountdown } from '@/utils/access'
import { useFocusHeading } from '@/composables/useFocusHeading'
import SlideAction from '@/components/ui/SlideAction.vue'
import WaveBackdrop from '@/components/prelude/WaveBackdrop.vue'

const secondsLeft = ref(getSecondsUntilBirthday())
const parts = computed(() => splitCountdown(secondsLeft.value))
const isBirthday = computed(() => secondsLeft.value === 0)
const items = computed(() => [
  { label: 'дней', value: parts.value.days },
  { label: 'часов', value: parts.value.hours },
  { label: 'минут', value: parts.value.minutes },
  { label: 'секунд', value: parts.value.seconds },
])
let interval: number | undefined

useFocusHeading('countdown-title')

onMounted(() => {
  secondsLeft.value = getSecondsUntilBirthday()
  interval = window.setInterval(() => {
    secondsLeft.value = getSecondsUntilBirthday()
    if (secondsLeft.value === 0 && interval !== undefined) window.clearInterval(interval)
  }, 1000)
})

onBeforeUnmount(() => {
  if (interval !== undefined) window.clearInterval(interval)
})
</script>

<template>
  <section class="prelude-page countdown-page" aria-labelledby="countdown-title">
    <WaveBackdrop />
    <div class="prelude-brand"><span class="prelude-brand__flower" aria-hidden="true">✳</span> для Евочки <span class="prelude-brand__date">05 / 11</span></div>

    <div class="countdown-layout">
      <div class="countdown-intro">
        <span class="prelude-eyebrow">Пятое ноября · восемнадцать</span>
        <h1 v-if="!isBirthday" id="countdown-title" class="countdown-title" tabindex="-1">Ещё немного.<br /><em>И наступит твой день.</em></h1>
        <h1 v-else id="countdown-title" class="countdown-title" tabindex="-1">С днём рождения,<br /><em>Евочка.</em></h1>
        <p>{{ isBirthday ? 'Всё готово. Я очень хотел, чтобы этот момент наступил.' : 'Я приготовил для тебя кое-что личное. И очень хочу, чтобы ты увидела это в свой день рождения.' }}</p>
      </div>

      <div class="countdown-frame glass-panel glass-panel--elevated">
        <div class="countdown-frame__top"><span>05.11.2026</span><span>18 лет</span></div>
        <div class="countdown-frame__date" aria-hidden="true">05<span>ноября</span></div>
        <template v-if="!isBirthday">
          <span class="countdown-frame__caption">До полуночи осталось</span>
          <div class="countdown-clock" role="timer" aria-label="Время до пятого ноября">
            <div v-for="item in items" :key="item.label" class="countdown-clock__item">
              <strong>{{ String(item.value).padStart(2, '0') }}</strong>
              <span>{{ item.label }}</span>
            </div>
          </div>
          <p class="countdown-frame__note">Отсчёт идёт по времени твоего телефона</p>
        </template>
        <div v-else class="countdown-open">
          <p>Твой сюрприз уже здесь.</p>
          <SlideAction :to="{ name: 'home' }" label="Открыть подарок" hint="Проведи вправо" />
        </div>
      </div>
      <p class="countdown-touch-hint" aria-hidden="true">Проведи пальцем по фону — волны откликнутся.</p>
    </div>
  </section>
</template>
