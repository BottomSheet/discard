import { createRouter, createWebHashHistory } from 'vue-router'
import { questions } from '@/data/quest'
import { useQuestStore } from '@/stores/quest'

export const router = createRouter({
  // GitHub Pages не поддерживает SPA fallback для прямых URL.
  // Hash-маршруты корректно открываются при обновлении страницы и по ссылке.
  history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.name === 'question' && from.name === 'question') return false
    if (to.fullPath === from.fullPath) return undefined
    return { top: 0, behavior: 'instant' }
  },
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/vopros/:number(\\d+)', name: 'question', component: () => import('@/views/QuestionView.vue') },
    { path: '/pozdravlenie', name: 'birthday', component: () => import('@/views/BirthdayView.vue') },
    { path: '/otvety', name: 'answers', component: () => import('@/views/AnswersView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const store = useQuestStore()
  if (to.name === 'birthday' || to.name === 'answers') {
    if (!store.isComplete) return { name: 'question', params: { number: store.firstUnanswered } }
  }

  if (to.name === 'question') {
    const number = Number(to.params.number)
    if (!Number.isInteger(number) || number < 1 || number > questions.length) {
      return { name: 'question', params: { number: store.firstUnanswered > questions.length ? questions.length : store.firstUnanswered } }
    }
    // Нельзя пропустить вопрос ссылкой, но к пройденным можно вернуться.
    if (!store.isComplete && number > store.firstUnanswered) {
      return { name: 'question', params: { number: store.firstUnanswered } }
    }
  }
})
