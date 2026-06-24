/* Shtark INK — единый симулятор загрузки (логотип + бегущие полоски CMYK).
   Подключается в <head> на страницах разделов и презентаций.
   Время показа: 4 c при первом входе на сайт, 2 c при последующих переходах.
   Также включается при скачивании PDF/документов. */
(function () {
  if (window.__siLoaderInit) return;
  window.__siLoaderInit = true;

  var BLUE_TOP = '#49A7EF', BLUE_BOT = '#3A99E6';

  var CSS = [
    '#si-loader{position:fixed;inset:0;z-index:99999;background:linear-gradient(160deg,' + BLUE_TOP + ' 0%,' + BLUE_BOT + ' 100%);display:flex;align-items:center;justify-content:center;padding:24px;transition:opacity .55s ease,visibility .55s ease;}',
    '#si-loader.is-done{opacity:0;visibility:hidden;pointer-events:none;}',
    '.si-loader__inner{display:flex;flex-direction:column;align-items:center;gap:20px;width:min(460px,84vw);text-align:center;}',
    '.si-loader__logo{width:78%;height:auto;display:block;animation:siLogoIn .55s ease both;}',
    ".si-loader__tag{font-family:'Inter',system-ui,sans-serif;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#ED1C24;margin:2px 0 6px;min-height:1.2em;}",
    '.si-loader__tag span{display:inline-block;white-space:pre;opacity:0;transform:translateY(4px);animation:siLetter .32s ease forwards;}',
    '@keyframes siLetter{to{opacity:1;transform:none;}}',
    '.si-loader__bar{position:relative;width:88%;height:7px;border-radius:7px;overflow:hidden;background:rgba(255,255,255,.22);}',
    '.si-loader__run{position:absolute;top:0;left:0;height:100%;width:300%;background:repeating-linear-gradient(90deg,#00AEEF 0,#00AEEF 16px,#EC008C 16px,#EC008C 32px,#FFD200 32px,#FFD200 48px,#0F1115 48px,#0F1115 64px);animation:siRun .85s linear infinite;}',
    ".si-loader__cap{font-family:'Inter',system-ui,sans-serif;font-size:13px;line-height:1.5;letter-spacing:.3px;color:rgba(255,255,255,.92);max-width:32ch;}",
    '@keyframes siRun{to{transform:translateX(-64px);}}',
    '@keyframes siLogoIn{from{opacity:0;transform:translateY(8px) scale(.985);}to{opacity:1;transform:none;}}',
    '@media (max-width:600px){',
      '.si-loader__inner{width:88vw;gap:18px;}',
      '.si-loader__logo{width:86%;}',
      '.si-loader__tag{font-size:11px;letter-spacing:1.4px;}',
      '.si-loader__cap{font-size:12px;max-width:28ch;}',
    '}',
    '@media (prefers-reduced-motion:reduce){.si-loader__run{animation:none;background:linear-gradient(90deg,#00AEEF,#EC008C,#FFD200,#0F1115);}.si-loader__logo{animation:none;}}',
    '@media print{#si-loader{display:none!important;}}'
  ].join('');

  var style = document.createElement('style');
  style.id = 'si-loader-style';
  style.textContent = CSS;
  (document.head || document.documentElement).appendChild(style);

  var ov = document.createElement('div');
  ov.id = 'si-loader';
  ov.setAttribute('role', 'status');
  ov.setAttribute('aria-label', 'Загрузка сайта Shtark INK');
  ov.innerHTML =
    '<div class="si-loader__inner">' +
      '<img class="si-loader__logo" src="shtark-ink/img/loader-logo-white.png" alt="Shtark INK" />' +
      '<div class="si-loader__tag">ENGINEERED FOR EXCELLENCE. PRINTED FOR IMPACT.</div>' +
      '<div class="si-loader__bar"><div class="si-loader__run"></div></div>' +
      '<div class="si-loader__cap">Производство спиртовых красок для печати на гибкой упаковке</div>' +
    '</div>';

  function mount() {
    if (document.body) { document.body.appendChild(ov); }
    else { document.documentElement.appendChild(ov); }
  }
  mount();

  // Побуквенное появление слогана (эффект печати).
  var TAG_TEXT = 'ENGINEERED FOR EXCELLENCE. PRINTED FOR IMPACT.';
  function buildTag() {
    var tag = ov.querySelector('.si-loader__tag');
    if (!tag) return;
    tag.textContent = '';
    for (var i = 0; i < TAG_TEXT.length; i++) {
      var sp = document.createElement('span');
      sp.textContent = TAG_TEXT[i];
      sp.style.animationDelay = (i * 40) + 'ms';
      tag.appendChild(sp);
    }
  }
  buildTag();

  var hideTimer = null;
  function reallyRemove() { /* keep in DOM for reuse */ }
  function hide() {
    ov.classList.add('is-done');
  }
  function showFor(ms) {
    if (!ov.isConnected) mount();
    ov.classList.remove('is-done');
    buildTag(); // перезапускаем анимацию слогана
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, ms);
  }

  // Публичный API для повторного показа (например, при скачивании PDF).
  window.SILoader = { show: showFor, hide: hide };

  // ----- Первичный показ при загрузке страницы -----
  var firstEntry = false;
  try {
    firstEntry = !sessionStorage.getItem('si_entered');
    if (firstEntry) sessionStorage.setItem('si_entered', '1');
  } catch (e) {}

  var t0 = Date.now(), MIN = firstEntry ? 2000 : 1000, MAX = firstEntry ? 5000 : 3500, doneInitial = false;
  function hideInitial() {
    if (doneInitial) return;
    doneInitial = true;
    hide();
  }
  function ready() {
    if (Date.now() - t0 >= MIN) { hideInitial(); return; }
    setTimeout(ready, 120);
  }
  setTimeout(hideInitial, MAX); // safety net
  if (document.readyState === 'complete') ready();
  else window.addEventListener('load', ready);

  // ----- Симулятор при скачивании PDF / документов -----
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = (a.getAttribute('href') || '').toLowerCase();
    var isDownload = a.hasAttribute('download');
    var isPdf = /\.pdf(\?|#|$)/.test(href);
    if (isDownload || isPdf) {
      showFor(2200);
    }
  }, true);
})();
