/* ============================================================
   Shtark INK — Cookie consent + Yandex Metrika consent gate
   Shows a branded banner; Metrika loads only after consent.
============================================================ */
(function () {
  var KEY = 'si-cookie-consent';     // 'accepted' | 'declined'
  var YM_ID = 110070978;

  function getConsent() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setConsent(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  // ---- Yandex.Metrika loader (called only after consent) ----
  function loadMetrika() {
    if (window.__siYmLoaded) return;
    window.__siYmLoaded = true;
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      for (var j = 0; j < e.scripts.length; j++) { if (e.scripts[j].src === r) { return; } }
      k = e.createElement(t); a = e.getElementsByTagName(t)[0];
      k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + YM_ID, 'ym');
    window.ym(YM_ID, 'init', {
      ssr: true, webvisor: true, clickmap: true, ecommerce: 'dataLayer',
      referrer: document.referrer, url: location.href,
      accurateTrackBounce: true, trackLinks: true
    });
  }

  // ---- Top100 (Kraken / Rambler) loader (called only after consent) ----
  function loadTop100() {
    if (window.__siTop100Loaded) return;
    window.__siTop100Loaded = true;
    (function (w, d, c) {
      (w[c] = w[c] || []).push(function () {
        try { w.top100Counter = new top100({ project: 7751942, trackHashes: true, user_id: null }); } catch (e) {}
      });
      var n = d.getElementsByTagName('script')[0],
        s = d.createElement('script'),
        f = function () { n.parentNode.insertBefore(s, n); };
      s.type = 'text/javascript'; s.async = true;
      s.src = (d.location.protocol == 'https:' ? 'https:' : 'http:') + '//st.top100.ru/top100/top100.js';
      if (w.opera == '[object Opera]') { d.addEventListener('DOMContentLoaded', f, false); } else { f(); }
    })(window, document, '_top100q');
  }

  // ---- Banner ----
  function buildBanner() {
    if (document.querySelector('.si-cookie')) return;
    var s = document.createElement('style');
    s.textContent =
      '.si-cookie{position:fixed;left:16px;right:16px;bottom:16px;z-index:300;max-width:760px;margin:0 auto;' +
      'background:#0F1115;color:#F4F5F7;border-radius:14px;box-shadow:0 24px 60px -20px rgba(0,0,0,.6);' +
      'display:flex;align-items:center;gap:20px;padding:18px 22px;font-family:Inter,system-ui,sans-serif;' +
      'animation:siCookieUp .35s cubic-bezier(.2,.8,.2,1);}' +
      '@keyframes siCookieUp{from{transform:translateY(20px);opacity:0}to{transform:none;opacity:1}}' +
      '.si-cookie__bar{width:5px;align-self:stretch;border-radius:3px;background:linear-gradient(#00AEEF,#EC008C 33%,#F5C518 66%,#E2231A);flex-shrink:0;}' +
      '.si-cookie__txt{flex:1;font-size:13.5px;line-height:1.55;color:#C6CAD2;}' +
      '.si-cookie__txt b{color:#fff;font-weight:600;}' +
      '.si-cookie__txt a{color:#F5C518;text-decoration:underline;}' +
      '.si-cookie__btns{display:flex;gap:8px;flex-shrink:0;}' +
      '.si-cookie__btn{font-family:inherit;font-size:13px;font-weight:600;border-radius:7px;padding:11px 18px;cursor:pointer;border:1.5px solid transparent;white-space:nowrap;transition:background .14s,border-color .14s,color .14s;}' +
      '.si-cookie__btn--ok{background:#F5C518;color:#0F1115;border-color:#F5C518;}' +
      '.si-cookie__btn--ok:hover{background:#E0AF00;border-color:#E0AF00;}' +
      '.si-cookie__btn--no{background:transparent;color:#9CA0AB;border-color:rgba(255,255,255,.2);}' +
      '.si-cookie__btn--no:hover{color:#fff;border-color:#fff;}' +
      '@media(max-width:640px){.si-cookie{flex-direction:column;align-items:stretch;gap:14px;padding:18px;}' +
      '.si-cookie__bar{width:auto;height:4px;}.si-cookie__btns{justify-content:stretch;}.si-cookie__btn{flex:1;}}';
    document.head.appendChild(s);

    var policyHref = (location.pathname.indexOf('policy') !== -1) ? '#policy' : 'policy.html';

    var box = document.createElement('div');
    box.className = 'si-cookie';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Согласие на использование cookie');
    box.innerHTML =
      '<div class="si-cookie__bar"></div>' +
      '<div class="si-cookie__txt"><b>Мы используем файлы cookie.</b> Сайт применяет cookie и&nbsp;сервис Яндекс.Метрика для&nbsp;аналитики и&nbsp;улучшения работы. Продолжая пользоваться сайтом, вы&nbsp;соглашаетесь с&nbsp;этим. Подробнее&nbsp;— в&nbsp;<a href="' + policyHref + '" target="_blank" rel="noopener">политике конфиденциальности</a>.</div>' +
      '<div class="si-cookie__btns">' +
      '<button class="si-cookie__btn si-cookie__btn--no" type="button">Только необходимые</button>' +
      '<button class="si-cookie__btn si-cookie__btn--ok" type="button">Принять</button>' +
      '</div>';
    document.body.appendChild(box);

    box.querySelector('.si-cookie__btn--ok').addEventListener('click', function () {
      setConsent('accepted'); box.remove(); loadMetrika(); loadTop100();
    });
    box.querySelector('.si-cookie__btn--no').addEventListener('click', function () {
      setConsent('declined'); box.remove();
    });
  }

  function start() {
    var c = getConsent();
    if (c === 'accepted') { loadMetrika(); loadTop100(); return; }
    if (c === 'declined') { return; }
    buildBanner();
  }

  // ---- Ненавязчивая подсказка «добавить в закладки» (только ПК, один раз) ----
  var BM_KEY = 'si-bookmark-hint';   // 'dismissed'
  function bmDone() { try { return localStorage.getItem(BM_KEY) === 'dismissed'; } catch (e) { return false; } }
  function bmSet() { try { localStorage.setItem(BM_KEY, 'dismissed'); } catch (e) {} }

  function buildBookmarkHint() {
    if (bmDone()) return;
    if (!window.matchMedia('(min-width: 1024px)').matches) return;   // только ПК
    if (document.querySelector('.si-cookie')) { setTimeout(buildBookmarkHint, 4000); return; } // не перекрывать cookie-баннер
    if (document.querySelector('.si-bm')) return;
    var isMac = /Mac|iPad|iPhone/.test(navigator.platform || navigator.userAgent);
    var combo = isMac ? '⌘ + D' : 'Ctrl + D';

    var s = document.createElement('style');
    s.textContent =
      '.si-bm{position:fixed;right:18px;bottom:18px;z-index:280;max-width:320px;' +
      'background:#fff;color:#0F1115;border:1px solid #E3E6EB;border-radius:13px;' +
      'box-shadow:0 20px 48px -22px rgba(15,17,21,.45);padding:15px 16px 15px 17px;' +
      'font-family:Inter,system-ui,sans-serif;display:flex;gap:12px;align-items:flex-start;' +
      'animation:siBmIn .4s cubic-bezier(.2,.8,.2,1);}' +
      '@keyframes siBmIn{from{transform:translateY(16px);opacity:0}to{transform:none;opacity:1}}' +
      '.si-bm__ic{flex:none;width:30px;height:30px;border-radius:8px;background:#FFF7DC;' +
      'display:flex;align-items:center;justify-content:center;font-size:16px;}' +
      '.si-bm__body{flex:1;font-size:13px;line-height:1.5;color:#3F4451;}' +
      '.si-bm__body b{color:#0F1115;font-weight:600;}' +
      '.si-bm__kbd{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:12px;font-weight:600;' +
      'background:#0F1115;color:#F5C518;border-radius:5px;padding:2px 7px;white-space:nowrap;}' +
      '.si-bm__x{flex:none;background:none;border:0;cursor:pointer;color:#9CA3AF;font-size:18px;' +
      'line-height:1;padding:2px 4px;border-radius:6px;transition:color .14s,background .14s;}' +
      '.si-bm__x:hover{color:#0F1115;background:#F2F3F5;}';
    document.head.appendChild(s);

    var box = document.createElement('div');
    box.className = 'si-bm';
    box.setAttribute('role', 'note');
    box.innerHTML =
      '<div class="si-bm__ic">★</div>' +
      '<div class="si-bm__body">Чтобы не потерять <b>Shtark INK</b>, добавьте сайт в закладки — нажмите <span class="si-bm__kbd">' + combo + '</span></div>' +
      '<button class="si-bm__x" type="button" aria-label="Закрыть">×</button>';
    document.body.appendChild(box);

    function dismiss() { bmSet(); if (box.parentNode) box.remove(); document.removeEventListener('keydown', onCombo); }
    box.querySelector('.si-bm__x').addEventListener('click', dismiss);
    // если пользователь реально нажал Ctrl/⌘+D — прячем подсказку навсегда
    function onCombo(e) { if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) dismiss(); }
    document.addEventListener('keydown', onCombo);
    // автоскрытие через 14 с (без пометки «dismissed» — покажем ещё раз в следующий визит)
    setTimeout(function () { if (box.parentNode) { box.remove(); document.removeEventListener('keydown', onCombo); } }, 14000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
  // подсказку показываем с задержкой, чтобы не отвлекать сразу
  setTimeout(buildBookmarkHint, 8000);

  /* ── Открывать отдельные страницы (тех-страницы, каталог сырья) в новой
     вкладке ТОЛЬКО на ПК. Якоря (#…) и прочие ссылки не затрагиваются. ── */
  var NEW_TAB_RE = /(?:^|\/)(?:uni|lam|top|pcbase|laquer|surf)-tech\.html(?:[?#]|$)|(?:^|\/)syrye(?:-[a-z]+)?\.html(?:[?#]|$)/i;
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || /^(https?:|mailto:|tel:|#)/i.test(href)) return;
    if (a.target === '_blank') return;
    if (!window.matchMedia('(min-width: 1024px)').matches) return;
    if (!NEW_TAB_RE.test(href)) return;
    e.preventDefault();
    window.open(href, '_blank', 'noopener');
  });
})();
