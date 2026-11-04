<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAccessStore } from '@/stores/access'
import { ACCESS_CODE_LENGTH, normalizeAccessCode } from '@/utils/access'
import { useFocusHeading } from '@/composables/useFocusHeading'
import AppIcon from '@/components/ui/AppIcon.vue'

const router = useRouter()
const access = useAccessStore()
const code = ref('')
const focused = ref(false)
const invalid = ref(false)
const message = ref('')
const field = ref<HTMLInputElement | null>(null)
const positions = Array.from({ length: ACCESS_CODE_LENGTH }, (_, index) => index)
const canSubmit = computed(() => code.value.length === ACCESS_CODE_LENGTH)

useFocusHeading('access-title')

function updateCode(event: Event): void {
  const input = event.target as HTMLInputElement
  code.value = normalizeAccessCode(input.value)
  input.value = code.value
  message.value = ''
  invalid.value = false
}

function submitCode(): void {
  if (!canSubmit.value) {
    message.value = 'Введи все восемь цифр.'
    field.value?.focus()
    return
  }
  if (!access.unlock(code.value)) {
    invalid.value = true
    message.value = 'Эта дата не подходит. Попробуй ещё раз.'
    code.value = ''
    void nextTick(() => field.value?.focus())
    return
  }
  void router.replace({ name: 'countdown' })
}
</script>

<template>
  <section class="prelude-page access-page" aria-labelledby="access-title">
    <div class="prelude-page__glow prelude-page__glow--left" aria-hidden="true"></div>
    <div class="prelude-page__glow prelude-page__glow--right" aria-hidden="true"></div>

    <div class="prelude-brand"><span class="prelude-brand__flower" aria-hidden="true">✳</span> для Евочки <span class="prelude-brand__date">05 / 11</span></div>

    <div class="access-layout">
      <div class="access-ornament" aria-hidden="true">
        <span class="access-ornament__halo"></span>
        <span class="access-ornament__inner">♡</span>
        <span class="access-ornament__small">К + Е</span>
      </div>

      <div class="access-panel glass-panel glass-panel--elevated">
        <span class="prelude-eyebrow">Перед тем как начать</span>
        <h1 id="access-title" class="access-title" tabindex="-1">Для тебя есть<br /><em>кое-что особенное.</em></h1>
        <p class="access-description">Только сначала вспомни одну дату. В ней — начало нашей истории.</p>

        <form class="access-form" novalidate @submit.prevent="submitCode">
          <label class="access-form__label" for="access-code">Наша дата</label>
          <div class="access-digits" :class="{ 'access-digits--invalid': invalid, 'access-digits--focused': focused }">
            <template v-for="position in positions" :key="position">
              <span v-if="position === 2 || position === 4" class="access-digits__separator" aria-hidden="true">/</span>
              <span
                class="access-digits__cell"
                :class="{ 'access-digits__cell--active': focused && (code.length === position || (position === 7 && code.length === 8)), 'access-digits__cell--filled': position < code.length }"
                aria-hidden="true"
              >{{ code[position] ?? '' }}</span>
            </template>
            <input
              id="access-code"
              ref="field"
              class="access-digits__input"
              type="text"
              name="access-code"
              inputmode="numeric"
              pattern="[0-9]*"
              :maxlength="ACCESS_CODE_LENGTH"
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
              :value="code"
              aria-label="Введи восьмизначную дату: день, месяц и год"
              :aria-invalid="invalid"
              :aria-describedby="message ? 'access-message' : 'access-help'"
              @input="updateCode"
              @focus="focused = true"
              @blur="focused = false"
            />
          </div>
          <p v-if="message" id="access-message" class="access-message" role="status">{{ message }}</p>
          <p v-else id="access-help" class="access-help">Восемь цифр, без пробелов. Можно вставить код целиком.</p>
          <button class="access-submit" type="submit" :disabled="!canSubmit">
            <span>Подтвердить</span>
            <span class="access-submit__arrow"><AppIcon name="arrow-right" :size="19" /></span>
          </button>
        </form>
      </div>
      <p class="access-footnote">Не спеши. Всё начинается с одного воспоминания.</p>
    </div>
  </section>
</template>
