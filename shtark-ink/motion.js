/* ============================================================
   Shtark INK — Motion layer
   • Scroll reveal (IntersectionObserver, staggered)
   • Parallax (rAF, hero visual + ambient aurora)
   • Ambient background motion (CMYK aurora + lead-form glow)

   Fully progressive: hidden states are gated behind the
   `.motion-on` class that THIS script adds, and behind
   prefers-reduced-motion. Without JS (or with reduced motion)
   everything is simply visible and static.
============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Wait until the page is ready. On the React homepage we wait for #app to
  // render; on the static pages (tech, syrye, docs…) there is no #app, so we
  // just wait for DOM ready.
  function whenReady(cb) {
    var app = document.getElementById('app');
    if (!app) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', cb, { once: true });
      } else { cb(); }
      return;
    }
    var n = 0;
    (function poll() {
      if (app.children && app.children.length) return cb();
      if (n++ > 150) return cb(); // ~18s safety net
      setTimeout(poll, 120);
    })();
  }

  whenReady(function () { setTimeout(start, 60); });

  function start() {
    setupSlogan();           // header tagline — runs even with reduced motion
    if (reduce) return;
    document.documentElement.classList.add('motion-on');
    setupReveal();
    setupParallax();
    setupPinStack();
    setupNavLoader();
  }

  /* ---------- Header slogan (typing effect, repeats every 90s) ---------- */
  function setupSlogan() {
    var el = document.querySelector('.hdr__slogan');
    if (!el) return;

    var lang = 'ru';
    try {
      lang = localStorage.getItem('si-lang') ||
             document.documentElement.lang || 'ru';
    } catch (e) {}

    var TEXT = (lang === 'ru')
      ? 'СОЗДАНО ДЛЯ СОВЕРШЕНСТВА. НАПЕЧАТАНО ДЛЯ ВПЕЧАТЛЕНИЯ.'
      : 'ENGINEERED FOR EXCELLENCE. PRINTED FOR IMPACT.';

    function build() {
      el.textContent = '';
      if (reduce) { el.textContent = TEXT; return; }
      for (var i = 0; i < TEXT.length; i++) {
        var sp = document.createElement('span');
        sp.textContent = TEXT.charAt(i);
        sp.style.animationDelay = (i * 40) + 'ms';
        el.appendChild(sp);
      }
    }

    build();
    if (reduce) return;
    setInterval(build, 15000); // повторяющееся появление каждые 15 секунд
  }

  /* ---------- Scroll reveal ---------- */
  function setupReveal() {
    // Elements revealed individually (rise + fade).
    var SINGLES = [
      '.hero__grid > div:first-child',
      '.section__head',
      '.cat__intro-head',
      '.cat__intro-body',
      '.lab__grid',
      '.compare',
      '.form__head',
      '.form__grid',
      '.sup__top',
      '.vac__top',
      '.dealers__lead',
      '.calc__form'
    ];
    // Containers whose direct children reveal with a stagger.
    var GROUPS = [
      '.cat__grid',
      '.dealers__cards',
      '.faces__grid',
      '.sup__grid',
      '.vac__grid',
      '.cli__grid',
      '.contacts__grid',
      '.hero__strip'
    ];

    var items = [];

    function tag(el, dir, delay) {
      if (!el || el.hasAttribute('data-reveal')) return;
      el.setAttribute('data-reveal', dir || '');
      if (delay) el.style.transitionDelay = delay + 'ms';
      items.push(el);
    }

    SINGLES.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) { tag(el, ''); });
    });

    GROUPS.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (grid) {
        Array.prototype.slice.call(grid.children).forEach(function (child, i) {
          tag(child, '', Math.min(i, 6) * 80);
        });
      });
    });

    // Production rows: the photo slides in from its side, text fades up.
    document.querySelectorAll('.prod-rows .prod-row').forEach(function (row, i) {
      var img = row.querySelector('.prod-row__img');
      var body = row.querySelector('.prod-row__body');
      if (img) tag(img, i % 2 === 1 ? 'right' : 'left');
      if (body) tag(body, '');
    });

    if (!('IntersectionObserver' in window) || !items.length) {
      items.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Parallax (opt-in via [data-parallax]) ---------- */
  function setupParallax() {
    var items = [];

    // Any element explicitly opted in via [data-parallax] (translate only).
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      items.push({
        el: el,
        base: 1,
        range: (parseFloat(el.getAttribute('data-parallax-speed')) || 0.1) * 600
      });
    });

    if (!items.length) return;

    var ticking = false;

    function update() {
      ticking = false;
      var vh = window.innerHeight;
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        var box = it.el.parentElement || it.el;
        var rect = box.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > vh + 120) continue;
        var p = (vh - rect.top) / (vh + rect.height); // 0 entering bottom → 1 leaving top
        if (p < 0) p = 0; else if (p > 1) p = 1;
        var ty = (p - 0.5) * it.range;
        it.el.style.transform =
          (it.base !== 1 ? 'scale(' + it.base + ') ' : '') +
          'translate3d(0,' + ty.toFixed(1) + 'px,0)';
      }
    }

    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* ---------- Pin-stack: each section pins only at its END (so you read it
     to the end first), then the next covers it with a ~0.4cm peek. ---------- */
  function setupPinStack() {
    var stack = document.querySelector('.pinstack');
    if (!stack) return;
    var secs = [].slice.call(stack.children).filter(function (s) {
      return s.tagName === 'SECTION';
    });
    if (!secs.length) return;
    var HEADER = 76;   // sticky header height
    var LEDGE = 15;    // ~0.4 cm peek of a covered section

    function layout() {
      var enabled = window.matchMedia('(min-width: 768px)').matches;
      var vh = window.innerHeight;
      for (var i = 0; i < secs.length; i++) {
        var s = secs[i];
        if (!enabled) { s.style.top = ''; continue; }
        if (s.classList.contains('introband')) { s.style.top = HEADER + 'px'; continue; }
        // Negative top → the section pins only once its bottom reaches the
        // viewport bottom (i.e. fully scrolled / read), then the next covers it.
        var top = Math.min(HEADER + i * LEDGE, vh - s.offsetHeight);
        s.style.top = top + 'px';
      }
    }

    layout();
    window.addEventListener('resize', layout, { passive: true });
    window.addEventListener('load', layout);
    setTimeout(layout, 400);
    setTimeout(layout, 1200);
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function () { layout(); });
      secs.forEach(function (s) { ro.observe(s); });
    }
  }

  /* ---------- Branded loader on same-tab navigation between pages ---------- */
  function setupNavLoader() {
    var loader = document.getElementById('si-loader');
    if (!loader) return;
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a') : null;
      if (!a) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      var href = a.getAttribute('href') || '';
      if (!/\.html(\?|#|$)/i.test(href)) return;
      if (/^https?:\/\//i.test(href) && href.indexOf(location.host) === -1) return;
      loader.classList.remove('is-done'); // show until the next page takes over
    }, true);
  }
})();
