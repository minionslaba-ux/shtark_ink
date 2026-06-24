# Сборка и деплой сайта Shtark INK (GitHub Pages)

Этот пакет добавляет **сборку** сайта: предкомпиляцию JSX в обычный JS и
пре-рендер главной страницы в статический HTML — то, ради чего нужен
Node-тулчейн. На GitHub всё выполняется автоматически в GitHub Actions.

## Что делает сборка (`build.mjs`)

1. **Предкомпиляция JSX → JS.** `shtark-ink/parts1|2|3.jsx` компилируются в
   `parts1|2|3.js` (esbuild, JSX → `React.createElement`). В рантайме сайта
   **больше не нужен** `@babel/standalone` — страница грузится заметно быстрее,
   а роботам отдаётся нормальный JS, а не трансформируемый «на лету».
2. **Пре-рендер главной.** `index.html` рендерится на сервере
   (`react-dom/server` + `jsdom`), и готовый HTML вшивается в `<div id="app">…</div>`.
   Поисковый робот (Google, **Яндекс**) видит весь контент сразу, без выполнения JS.
   Если пре-рендер по какой-то причине не удался — сборка не падает: страница
   остаётся client-side, но уже без Babel (и с `<noscript>`-фолбэком).
3. **Production-сборка React** вместо development (меньше вес, быстрее).
4. Складывает результат в `dist/` вместе со всеми ассетами, `robots.txt`,
   `sitemap.xml`, `CNAME` и `.nojekyll`.

> Остальные страницы (`*-tech.html`, `docs.html`, `policy.html`, `news*.html`,
> `sitemap.html`) — уже статический HTML, их сборка просто копирует.

## Как включить на GitHub (один раз)

1. Залейте репозиторий на GitHub (ветка `main`).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Готово. При каждом push в `main` workflow `.github/workflows/deploy.yml`
   соберёт `dist/` и опубликует его. Домен `shtarkink.com` берётся из `CNAME`.

## Локальный запуск (опционально)

```bash
npm install
npm run build      # результат в dist/
npm run preview    # собрать и поднять локальный сервер
```

## Важно про источник правды

- Редактируйте **корневые** файлы (`index.html`, `shtark-ink/*.jsx`, `*.html`).
- Папки `site/` и `site-pages/` **удалены** — Pages теперь публикует `dist/`,
  который собирается из корня. Единый источник правды — корень репозитория.
- После правок просто push — Actions пересоберёт и переразвернёт сайт.

## Проверка SEO после деплоя

- Google Search Console и Яндекс.Вебмастер: добавьте `sitemap.xml`
  (`https://shtarkink.com/sitemap.xml`).
- Проверьте, что в исходном коде главной (View Source) виден текст контента
  внутри `<div id="app">…</div>` — значит пре-рендер сработал.
- Богатые сниппеты: тест структурированных данных (JSON-LD Organization/WebSite).
