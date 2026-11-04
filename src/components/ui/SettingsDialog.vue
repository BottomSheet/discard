<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import AppIcon from '@/components/ui/AppIcon.vue'

const settings = useSettingsStore()
const themeOptions = [
  { id: 'system', text: 'Системная' },
  { id: 'light', text: 'Светлая' },
  { id: 'dark', text: 'Тёмная' },
] as const
const dialog = ref<HTMLDialogElement | null>(null)
const opener = ref<HTMLElement | null>(null)

function open(source?: HTMLElement): void {
  if (!dialog.value || dialog.value.open) return
  opener.value = source ?? null
  dialog.value.showModal()
}
function close(): void {
  dialog.value?.close()
}
function restoreFocus(): void {
  opener.value?.focus()
}

// Нативный dialog обеспечивает удержание фокуса, Escape и инертный фон.
defineExpose({ open })

</script>

<template>
  <dialog ref="dialog" class="settings-dialog" aria-labelledby="settings-title" @click.self="close" @close="restoreFocus">
    <div class="settings-content">
      <div class="settings-heading">
        <div>
          <p class="eyebrow">ПОД СЕБЯ</p>
          <h2 id="settings-title">Настройки</h2>
        </div>
        <button class="icon-button" type="button" aria-label="Закрыть настройки" @click="close"><AppIcon name="close" :size="19" /></button>
      </div>

      <fieldset class="setting-field">
        <legend>Оформление</legend>
        <div class="theme-switcher" role="group" aria-label="Тема сайта">
          <label v-for="option in themeOptions" :key="option.id" class="theme-option">
            <input v-model="settings.theme" type="radio" name="theme" :value="option.id" />
            <span>{{ option.text }}</span>
          </label>
        </div>
      </fieldset>

      <div class="setting-field">
        <div class="setting-row"><label for="glass-strength">Плотность стекла</label><output for="glass-strength">{{ settings.glass }}%</output></div>
        <input id="glass-strength" v-model.number="settings.glass" type="range" min="0" max="100" step="1" />
        <p class="setting-hint">Меняет прозрачность и размытие карточек.</p>
      </div>

      <label class="motion-setting">
        <span><strong>Меньше анимации</strong><small>Плавность без лишнего движения</small></span>
        <input v-model="settings.reduceMotion" type="checkbox" role="switch" aria-label="Уменьшить анимацию" />
      </label>
      <p class="settings-footnote">Ваши настройки сохраняются только на этом устройстве.</p>
    </div>
  </dialog>
</template>
