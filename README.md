# KANSAM — сайт автошколы

Одностраничный лендинг автошколы KANSAM (Алматы). Собран на **Vite + React**, стилизован через **Tailwind CSS**, иконки — **lucide-react**.

## 🚀 Запуск локально

```bash
npm install
npm run dev
```

Откроется адрес вида `http://localhost:5173`. Изменения в `src/App.jsx` подхватываются автоматически (hot reload).

Проверить сборку перед публикацией:

```bash
npm run build
npm run preview
```

## 🌍 Публикация на GitHub Pages (автоматически)

Сайт публикуется через **GitHub Actions** (`.github/workflows/deploy.yml`): при каждом `push` в ветку `main` workflow сам собирает проект (`npm run build`) и выкладывает содержимое папки `dist` на GitHub Pages. Вручную ничего собирать и заливать не нужно — достаточно запушить изменения в `main`.

### Настройка (нужно сделать один раз)

1. Откройте репозиторий на GitHub.
2. Перейдите в **Settings → Pages**.
3. В разделе **Build and deployment → Source** выберите **GitHub Actions** (не "Deploy from a branch").
4. Сохраните — больше туда возвращаться не нужно.

После этого при следующем `push` в `main` (или сразу после включения, если workflow уже запускался) в вкладке **Actions** появится job **"Deploy to GitHub Pages"**. Когда он позеленеет, ссылка на сайт появится там же и в **Settings → Pages**.

### Важно: имя репозитория

В `vite.config.js` указан `base: '/kansam-landing/'` — он должен **точно совпадать** с именем репозитория на GitHub (это нужно, чтобы правильно подгружались CSS/JS файлы на GitHub Pages). Если вы назвали репозиторий иначе, поменяйте эту строку под своё имя репозитория и запушьте изменение.

## 📁 Структура проекта

```
├── .github/workflows/deploy.yml   # автодеплой на GitHub Pages
├── public/                        # статические файлы (favicon и т.п.)
├── src/
│   ├── App.jsx                    # весь лендинг (секции, стили, логика)
│   ├── icons/Instagram.jsx        # локальная иконка Instagram (см. ниже)
│   ├── index.css                  # подключение Tailwind CSS
│   └── main.jsx                   # точка входа React
├── index.html                     # HTML-шаблон, подключение Google Fonts
├── vite.config.js                 # конфиг Vite + Tailwind + base-путь
└── package.json
```

## 🔧 Что было исправлено при переносе в Vite

- **Иконка Instagram**: актуальная версия `lucide-react` (1.x) убрала брендовые иконки соцсетей (Instagram, Twitter и т.д.) по юридическим причинам, из-за чего сборка падала с ошибкой `Instagram is not exported`. Добавлен локальный компонент `src/icons/Instagram.jsx`, который в точности повторяет исходную иконку lucide и подключается вместо неё — внешний вид не изменился.
- **Google Fonts**: шрифты Unbounded и Manrope теперь подключены через `<link>` в `index.html` (с `preconnect` для более быстрой загрузки), а не только через `@import` в инлайн-стиле — это устраняет двойную загрузку шрифта и ускоряет первую отрисовку.
- **Favicon**: заменена стандартная иконка шаблона Vite на простой брендированный вариант (буква "K" на градиенте KANSAM).
- Дизайн, контент и структура секций лендинга не менялись.

## 🛠 Технологии

- [Vite](https://vite.dev/)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/) через `@tailwindcss/vite`
- [lucide-react](https://lucide.dev/)
