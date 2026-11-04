<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useAppearance } from '@/composables/useAppearance'
import AppHeader from '@/components/layout/AppHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'

useAppearance()
const route = useRoute()
// Один экземпляр QuestionView для всех номеров: меняется только содержимое,
// не размонтируется стеклянная карточка и не сбрасываются её анимации.
const sceneKey = computed(() => route.name === 'question' ? 'question-screen' : route.fullPath)
</script>

<template>
  <div class="app-shell">
    <div class="ambient-layer" aria-hidden="true">
      <span class="ambient-layer__mesh ambient-layer__mesh--one"></span>
      <span class="ambient-layer__mesh ambient-layer__mesh--two"></span>
      <span class="ambient-layer__mesh ambient-layer__mesh--three"></span>
    </div>
    <AppHeader />
    <main id="main-content" class="main-area">
      <RouterView v-slot="{ Component }">
        <Transition name="scene" mode="out-in">
          <component :is="Component" :key="sceneKey" />
        </Transition>
      </RouterView>
    </main>
    <SiteFooter />
  </div>
</template>
