import { createRouter, createWebHashHistory } from 'vue-router'
import { questions } from '@/data/quest'
import { useQuestStore } from '@/stores/quest'
import { useAccessStore } from '@/stores/access'
import { getSecondsUntilBirthday } from '@/utils/access'

export const router = createRouter({
  // GitHub Pages: прямые URL с hash работают и после перезагрузки.
  history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.name === 'question' && from.name === 'question') return false
    if (to.fullPath === from.fullPath) return undefined
    return { top: 0, behavior: 'instant' }
  },
  routes: [
    { path: '/kod', name: 'unlock', component: () => import('@/views/AccessView.vue') },
    { path: '/ozhidanie', name: 'countdown', component: () => import('@/views/CountdownView.vue') },
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/vopros/:number(\\d+)', name: 'question', component: () => import('@/views/QuestionView.vue') },
    { path: '/pozdravlenie', name: 'birthday', component: () => import('@/views/BirthdayView.vue') },
    { path: '/otvety', name: 'answers', component: () => import('@/views/AnswersView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const access = useAccessStore()
  if (!access.isUnlocked) {
    if (to.name !== 'unlock') return { name: 'unlock' }
    return
  }
  if (to.name === 'unlock') return { name: 'countdown' }
  // До наступления дня рождения ссылка на вопросы не обходит страницу отсчёта.
  if (getSecondsUntilBirthday() > 0 && to.name !== 'countdown') return { name: 'countdown' }
  if (to.name === 'countdown') return

  const quest = useQuestStore()
  if (to.name === 'birthday' || to.name === 'answers') {
    if (!quest.isComplete) return { name: 'question', params: { number: quest.firstUnanswered } }
  }

  if (to.name === 'question') {
    const number = Number(to.params.number)
    if (!Number.isInteger(number) || number < 1 || number > questions.length) {
      return { name: 'question', params: { number: quest.firstUnanswered > questions.length ? questions.length : quest.firstUnanswered } }
    }
    if (!quest.isComplete && number > quest.firstUnanswered) {
      return { name: 'question', params: { number: quest.firstUnanswered } }
    }
  }
})
