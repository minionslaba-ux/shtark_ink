/* Shtark INK — адаптация слайд-презентаций под мобильные.
   Слайды имеют фиксированный размер 1280×720. На узких экранах
   масштабируем каждый слайд, оборачивая его в контейнер с уже
   масштабированными размерами — так нет горизонтальной прокрутки. */
(function () {
  var BASE_W = 1280, BASE_H = 720;

  function wrapSlides() {
    var slides = document.querySelectorAll('.slide');
    for (var i = 0; i < slides.length; i++) {
      var s = slides[i];
      if (s.parentNode && s.parentNode.classList && s.parentNode.classList.contains('slide-fit')) continue;
      var w = document.createElement('div');
      w.className = 'slide-fit';
      s.parentNode.insertBefore(w, s);
      w.appendChild(s);
    }
  }

  function fit() {
    var vw = document.documentElement.clientWidth || window.innerWidth;
    var pad = vw < 700 ? 16 : 40;            // отступы .deck по бокам
    var scale = Math.min(1, (vw - pad) / BASE_W);
    var wraps = document.querySelectorAll('.slide-fit');
    for (var i = 0; i < wraps.length; i++) {
      var w = wraps[i];
      var s = w.firstChild;
      if (scale >= 1) {
        s.style.transform = '';
        s.style.transformOrigin = '';
        w.style.width = '';
        w.style.height = '';
      } else {
        s.style.transformOrigin = 'top left';
        s.style.transform = 'scale(' + scale + ')';
        w.style.width = (BASE_W * scale) + 'px';
        w.style.height = (BASE_H * scale) + 'px';
      }
    }
  }

  function init() {
    wrapSlides();
    fit();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(fit, 120);
  });
  // повторный расчёт после загрузки шрифтов/картинок
  window.addEventListener('load', fit);
})();
