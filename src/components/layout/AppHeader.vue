<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import BloomMark from '@/components/ui/BloomMark.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import SettingsDialog from '@/components/ui/SettingsDialog.vue'

const dialog = ref<InstanceType<typeof SettingsDialog> | null>(null)
function showSettings(event: MouseEvent): void {
  dialog.value?.open(event.currentTarget as HTMLElement)
}
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner site-container">
      <RouterLink class="brand" to="/" aria-label="На первую страницу квеста">
        <span class="brand__mark"><BloomMark :size="23" /></span>
        <span class="brand__name">для Евочки<span class="brand__dot">.</span></span>
      </RouterLink>
      <div class="header-right">
        <span class="header-date" aria-label="5 ноября">05 <span class="header-date__slash">/</span> 11</span>
        <span class="header-separator" aria-hidden="true"></span>
        <button type="button" class="icon-button header-settings" aria-label="Настройки оформления" @click="showSettings"><AppIcon name="sliders" :size="20" /></button>
      </div>
    </div>
    <SettingsDialog ref="dialog" />
  </header>
</template>
