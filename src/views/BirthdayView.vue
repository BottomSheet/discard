<script setup lang="ts">
import { useFocusHeading } from '@/composables/useFocusHeading'
import SlideAction from '@/components/ui/SlideAction.vue'

useFocusHeading('birthday-title')
</script>

<template>
  <section class="birthday-page site-container" aria-labelledby="birthday-title">
    <div class="birthday-eyebrow">05 / 11 / 2026</div>
    <h1 id="birthday-title" tabindex="-1" class="birthday-title">С днём рождения,<br /><em>Евочка.</em></h1>
    <div class="birthday-age">18 лет ♡</div>

    <div class="birthday-letter glass-panel">
      <p class="birthday-letter__intro">Моя любимая,</p>
      <p>Сегодня тебе восемнадцать. И я очень рад, что могу провести этот день с тобой — даже если сначала заставил отвечать на восемнадцать вопросов.</p>
      <p>Пока делал этот маленький квест, перечитывал нашу переписку и постоянно улыбался. Там есть всё: наши первые «люблю», твои «муся» и «котён», мои «пушистых снов», разговоры про теорию струн и те самые пять поцелуев в час.</p>
      <p>Мне нравится, как мы с тобой можем смеяться над полной ерундой. Как я жду твоих сообщений. Как хочется делиться с тобой даже самой маленькой новостью. И как здорово знать, что у меня есть ты.</p>
      <p>Я хочу, чтобы впереди у нас было ещё очень много таких дней, слов и историй. Чтобы мы чаще виделись, больше обнимались и продолжали смешить друг друга.</p>
      <p>Я тебя очень сильно люблю, Евочка. Спасибо, что ты у меня есть.</p>
      <div class="birthday-signature"><span>Твой Костя</span><span aria-hidden="true">♡</span></div>
    </div>

    <div class="birthday-end">
      <p>Ну а теперь давай вспомним, как всё было.</p>
      <SlideAction :to="{ name: 'answers' }" label="Узнать ответы" hint="Проведи вправо" sr-label="Узнать ответы" />
    </div>
  </section>
</template>
