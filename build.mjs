/**
 * build.mjs — сборка сайта Shtark INK для GitHub Pages.
 *
 * Что делает:
 *  1. Предкомпилирует shtark-ink/parts1|2|3.jsx → обычный JS (esbuild, JSX→React.createElement).
 *     В рантайме сайта больше НЕ нужен @babel/standalone — страница грузится быстрее,
 *     а поисковые роботы получают нормальный JS.
 *  2. Пре-рендерит главную (index.html): React-приложение рендерится в статический HTML
 *     на сервере (jsdom + react-dom/server) и вшивается в <div id="app">…</div>.
 *     Робот (Google, Яндекс) видит полный контент сразу, без выполнения JS.
 *  3. Переключает React с development- на production-сборку.
 *  4. Собирает всё в папку dist/ (её и публикует GitHub Pages).
 *
 * Источник правды — корень репозитория (index.html, shtark-ink/, *-tech.html и т.д.).
 * Папки site/ и site-pages/ при таком деплое не нужны — Pages публикует dist/.
 */

import esbuild from 'esbuild';
import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'dist');
const DOMAIN = 'https://shtarkink.com';

// ──────────────────────────────────────────────────────────── helpers
const log = (...a) => console.log('[build]', ...a);

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) copyRecursive(path.join(src, name), path.join(dest, name));
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// ──────────────────────────────────────────────────────────── 1. clean dist
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// ──────────────────────────────────────────────────────────── 2. copy assets
const COPY = [
  'shtark-ink',
  'index.html', 'uni-tech.html', 'lam-tech.html', 'top-tech.html', 'pcbase-tech.html',
  'laquer-tech.html', 'surf-tech.html', 'news.html', 'news-uni.html', 'docs.html',
  'policy.html', 'sitemap.html', 'syrye.html',
  'syrye-pigments.html', 'syrye-solvents.html', 'syrye-resins.html', 'syrye-other.html',
  'robots.txt', 'sitemap.xml',
  'favicon.ico', 'favicon.png', 'favicon-16.png', 'favicon-32.png', 'favicon-48.png',
  'favicon-180.png', 'favicon-512.png', 'apple-touch-icon.png',
  'google33e6a51ca32808d5.html', 'yandex_fd08ddc45489e180.html',
  'dealers-presentation.html',
  'company-presentation.html',
  'suppliers-presentation.html',
  'commercial-offer.html',
];
for (const rel of COPY) {
  const src = path.join(ROOT, rel);
  if (fs.existsSync(src)) copyRecursive(src, path.join(OUT, rel));
  else log('skip (not found):', rel);
}
// GitHub Pages: свой домен shtarkink.com + отключение Jekyll.
fs.writeFileSync(path.join(OUT, 'CNAME'), 'shtarkink.com\n');
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

// ──────────────────────────────────────────────────────────── 3–5. оптимизация
// Компиляция JSX→JS + пре-рендер + переписывание index.html делаются «начисто».
// Если ЛЮБОЙ шаг падает — откатываемся на рабочую Babel-версию (как в исходнике),
// чтобы сборка НИКОГДА не падала и сайт всегда публиковался рабочим.
const PARTS = ['parts1', 'parts2', 'parts3'];
let optimized = false;
try {
  // 3. compile JSX → JS
  const compiled = [];
  for (const p of PARTS) {
    const code = fs.readFileSync(path.join(ROOT, 'shtark-ink', `${p}.jsx`), 'utf8');
    const out = await esbuild.transform(code, {
      loader: 'jsx', jsx: 'transform',
      jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment',
      target: ['es2019'],
    });
    fs.writeFileSync(path.join(OUT, 'shtark-ink', `${p}.js`), out.code);
    compiled.push(out.code);
    log('compiled', `${p}.jsx → ${p}.js`, `(${out.code.length} b)`);
  }

  // 4. prerender index.html (необязательный шаг — ошибка тут не валит сборку)
  let prerendered = '';
  try {
    const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: DOMAIN + '/' });
    const win = dom.window;
    globalThis.window = win;
    globalThis.document = win.document;
    globalThis.navigator = win.navigator;
    globalThis.HTMLElement = win.HTMLElement;
    globalThis.customElements = win.customElements;
    globalThis.localStorage = win.localStorage;
    globalThis.location = win.location;
    if (!win.matchMedia) {
      win.matchMedia = () => ({ matches: false, media: '', onchange: null,
        addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return false; } });
    }
    globalThis.matchMedia = win.matchMedia;
    globalThis.React = React;
    vm.runInThisContext(compiled.join('\n;\n'));
    const SI_App = globalThis.window.SI_App || globalThis.SI_App;
    if (typeof SI_App !== 'function') throw new Error('SI_App не найден после выполнения бандла');
    prerendered = renderToStaticMarkup(React.createElement(SI_App));
    log('prerender OK:', prerendered.length, 'символов HTML');
  } catch (e) {
    log('пре-рендер пропущен (страница останется client-side):', e && e.message);
    prerendered = '';
  }

  // 5. rewrite index.html
  let idx = fs.readFileSync(path.join(OUT, 'index.html'), 'utf8');
  for (const p of PARTS) {
    idx = idx.replace(`type="text/babel" src="shtark-ink/${p}.jsx"`, `src="shtark-ink/${p}.js"`);
  }
  idx = idx.replace(/\s*<script src="https:\/\/unpkg\.com\/@babel\/standalone[^>]*><\/script>/, '');
  idx = idx.replace('umd/react.development.js', 'umd/react.production.min.js')
           .replace('umd/react-dom.development.js', 'umd/react-dom.production.min.js');
  idx = idx.replace(/(umd\/react(?:-dom)?\.production\.min\.js")\s+integrity="[^"]*"/g, '$1');
  idx = idx.replace(
    /<script type="text\/babel">\s*ReactDOM\.createRoot\(document\.getElementById\('app'\)\)\.render\(<SI_App \/>\);\s*<\/script>/,
    `<script>ReactDOM.createRoot(document.getElementById('app')).render(React.createElement(window.SI_App));</script>`
  );
  if (prerendered) idx = idx.replace('<div id="app"></div>', `<div id="app">${prerendered}</div>`);

  // sanity: убеждаемся, что переписывание реально сработало
  if (/type="text\/babel" src="shtark-ink\/parts1\.jsx"/.test(idx)) {
    throw new Error('переписывание index.html не сработало — структура скриптов отличается');
  }
  fs.writeFileSync(path.join(OUT, 'index.html'), idx);

  // успех: удаляем исходные .jsx из dist (в индексе теперь .js)
  for (const p of PARTS) fs.rmSync(path.join(OUT, 'shtark-ink', `${p}.jsx`), { force: true });
  optimized = true;
  log('index.html пересобран (оптимизированная версия)');
} catch (e) {
  // ОТКАТ: публикуем рабочую Babel-версию из исходников (как в макете)
  log('!! оптимизация не удалась — откат на Babel-версию:', e && e.stack || e);
  copyRecursive(path.join(ROOT, 'index.html'), path.join(OUT, 'index.html'));
  for (const p of PARTS) {
    copyRecursive(path.join(ROOT, 'shtark-ink', `${p}.jsx`), path.join(OUT, 'shtark-ink', `${p}.jsx`));
    fs.rmSync(path.join(OUT, 'shtark-ink', `${p}.js`), { force: true });
  }
  log('откат выполнен: сайт опубликован в режиме Babel-runtime (рабочий)');
}

log(`Готово. Каталог публикации: dist/ (режим: ${optimized ? 'оптимизированный' : 'Babel-runtime'})`);
