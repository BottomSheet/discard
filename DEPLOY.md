# Публикация на GitHub Pages

Репозиторий: https://github.com/BottomSheet/discard

Адрес сайта **после успешного развёртывания**: https://bottomsheet.github.io/discard/

Проект уже настроен: `vite.config.ts` собирает ресурсы относительно `/discard/`, Vue Router использует hash-маршруты, а `.github/workflows/deploy.yml` публикует папку `dist`.

## Первый запуск

1. Открой репозиторий `BottomSheet/discard` на GitHub.
2. Перейди в **Settings → Pages** и в поле **Source** выбери **GitHub Actions**.
3. Загрузить файлы проекта в корень репозитория (не сам ZIP, а его содержимое), включая скрытую папку `.github`.
4. После коммита открой вкладку **Actions** → **Публикация квеста на GitHub Pages**, проверь успешное выполнение.
5. Открой https://bottomsheet.github.io/discard/ — адрес заработает после успешной публикации.

## Безопасная загрузка через терминал на Mac

Если репозиторий уже существует, лучше сначала клонировать его, не переписывая историю коммитов:

```bash
git clone https://github.com/BottomSheet/discard.git
```

Скопируй содержимое распакованной папки проекта в созданную папку `discard` (вместе со скрытой `.github`). Не удаляй папку `discard/.git`.

Далее:

```bash
cd discard
git add .
git commit -m "Подготовить квест ко дню рождения к GitHub Pages"
git push
```

Если репозиторий пустой и клонирование не создаёт рабочую ветку, сначала убедись, что файлы добавлены и создан первый коммит. После `git push` открой **Settings → Pages → Source: GitHub Actions**.

Если GitHub запрашивает вход, используй Git Credential Manager / GitHub CLI (`gh auth login`) либо авторизацию через браузер. Не вставляй токены в исходники и не отправляй их в чат.

## Локальная проверка

```bash
npm install
npm run dev
npm run build
npm run preview
```

Ссылка в режиме разработки — обычно `http://localhost:5173/`. Для проверки production-сборки через `npm run preview` путь сайта — `/discard/`.

## Особенности

- Данные вопросов, пояснения и поздравление находятся в **публичном JavaScript-коде** после публикации. Не размещай сайт публично, если содержимое переписки не предназначено для всех.
- GitHub Pages — статический хостинг. Ответы Евы сохраняются только в её браузере, в `localStorage`.
- URL внутренних страниц будут вида `https://bottomsheet.github.io/discard/#/vopros/1` — это предотвращает ошибку 404 при обновлении страницы.
- При каждом новом `git push` в `main` или `master` GitHub Actions автоматически собирает и обновляет сайт.
- Если нужна своя доменная зона, поменяй `base` и настрой домен GitHub Pages отдельно.
