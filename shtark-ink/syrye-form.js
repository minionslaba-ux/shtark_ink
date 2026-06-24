/* Shtark INK — всплывающая форма (прайс / SDS / связаться) для статических страниц.
   Переиспользует CSS-классы .modal из styles.css. Отправка на релей (Telegram + почта).
   Язык: русский по умолчанию; при выбранном не-русском языке сайта форма на английском. */
(function(){
  var ENDPOINT = 'https://shtark-form.minionslaba.workers.dev/';
  function lang(){ try { var l = localStorage.getItem('si-lang'); return (l && l !== 'ru') ? 'en' : 'ru'; } catch(e){ return 'ru'; } }

  var FIELDS = {
    ru: {
      buy: [
        {name:'Имя', label:'Имя', type:'text', ph:'Иван Петров'},
        {name:'Компания', label:'Компания', type:'text', ph:'ООО «Полиграф»'},
        {name:'Телефон', label:'Телефон', type:'tel', ph:'+7 (___) ___-__-__'},
        {name:'E-mail', label:'E-mail', type:'email', ph:'you@company.ru'}
      ],
      contact: [
        {name:'Имя', label:'Имя', type:'text', ph:'Иван Петров'},
        {name:'Телефон', label:'Телефон', type:'tel', ph:'+7 (___) ___-__-__'},
        {name:'E-mail', label:'E-mail', type:'email', ph:'you@company.ru'},
        {name:'Сообщение', label:'Сообщение', textarea:true, ph:'Коротко опишите ваш вопрос…'}
      ],
      consent:'Согласен на обработку персональных данных согласно ',
      policy:'политике конфиденциальности',
      err:'Не удалось отправить. Попробуйте ещё раз или напишите на info@shtarkink.com.',
      sending:'Отправляем…'
    },
    en: {
      buy: [
        {name:'Имя', label:'Name', type:'text', ph:'John Smith'},
        {name:'Компания', label:'Company', type:'text', ph:'Acme Printing'},
        {name:'Телефон', label:'Phone', type:'tel', ph:'+1 (___) ___-____'},
        {name:'E-mail', label:'E-mail', type:'email', ph:'you@company.com'}
      ],
      contact: [
        {name:'Имя', label:'Name', type:'text', ph:'John Smith'},
        {name:'Телефон', label:'Phone', type:'tel', ph:'+1 (___) ___-____'},
        {name:'E-mail', label:'E-mail', type:'email', ph:'you@company.com'},
        {name:'Сообщение', label:'Message', textarea:true, ph:'Briefly describe your enquiry…'}
      ],
      consent:'I agree to the processing of personal data under the ',
      policy:'privacy policy',
      err:'Could not send. Please try again or write to info@shtarkink.com.',
      sending:'Sending…'
    }
  };

  var CONFIGS = {
    ru: {
      price: { fields:'buy', product:true, tag:'Прайс-лист', title:'Запросить прайс',
        sub:function(p){ return 'Менеджер по продажам пришлёт актуальную цену, наличие и условия' + (p?' на «'+p+'»':'') + '. Все поля обязательны для заполнения.'; },
        kind:function(p){ return 'Запрос прайса' + (p?' · '+p:''); },
        subject:function(p){ return 'Запрос прайса' + (p?' ('+p+')':'') + ' — сайт Shtark INK'; },
        cta:'Запросить прайс', ok:'Запрос принят. Менеджер по продажам свяжется с вами и пришлёт прайс.' },
      sds: { fields:'buy', product:true, tag:'Паспорт безопасности (SDS)', title:'Запросить SDS',
        sub:function(p){ return 'Менеджер по продажам пришлёт паспорт безопасности (SDS)' + (p?' на «'+p+'»':'') + ' на вашу почту. Все поля обязательны для заполнения.'; },
        kind:function(p){ return 'Запрос SDS' + (p?' · '+p:''); },
        subject:function(p){ return 'Запрос SDS' + (p?' ('+p+')':'') + ' — сайт Shtark INK'; },
        cta:'Запросить SDS', ok:'Запрос принят. Менеджер по продажам пришлёт SDS на указанную почту.' },
      contact: { fields:'contact', product:false, tag:'Контакты', title:'Связаться с нами',
        sub:function(){ return 'Отдел продаж и технологи на связи пн–пт. Напишите — ответим в рабочее время. Все поля обязательны для заполнения.'; },
        kind:function(){ return 'Обращение с сайта (связаться с нами)'; },
        subject:function(){ return 'Обращение с сайта — Shtark INK'; },
        cta:'Отправить сообщение', ok:'Спасибо! Сообщение отправлено — менеджер свяжется с вами в рабочее время.' }
    },
    en: {
      price: { fields:'buy', product:true, tag:'Price list', title:'Request a price list',
        sub:function(p){ return 'Our sales manager will send the current price, availability and terms' + (p?' for «'+p+'»':'') + '. All fields are required.'; },
        kind:function(p){ return 'Price request' + (p?' · '+p:''); },
        subject:function(p){ return 'Price request' + (p?' ('+p+')':'') + ' — Shtark INK website'; },
        cta:'Request price list', ok:'Request received. Our sales manager will contact you and send the price list.' },
      sds: { fields:'buy', product:true, tag:'Safety data sheet (SDS)', title:'Request an SDS',
        sub:function(p){ return 'Our sales manager will send the safety data sheet (SDS)' + (p?' for «'+p+'»':'') + ' to your email. All fields are required.'; },
        kind:function(p){ return 'SDS request' + (p?' · '+p:''); },
        subject:function(p){ return 'SDS request' + (p?' ('+p+')':'') + ' — Shtark INK website'; },
        cta:'Request SDS', ok:'Request received. Our sales manager will email you the SDS.' },
      contact: { fields:'contact', product:false, tag:'Contacts', title:'Contact us',
        sub:function(){ return 'Our sales and technical team are available Mon–Fri. Drop us a message — we will reply during business hours. All fields are required.'; },
        kind:function(){ return 'Website enquiry (contact us)'; },
        subject:function(){ return 'Website enquiry — Shtark INK'; },
        cta:'Send message', ok:'Thank you! Your message has been sent — a manager will contact you during business hours.' }
    }
  };

  var overlay = null;
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function onKey(e){ if(e.key==='Escape') close(); }
  function close(){ if(overlay){ overlay.remove(); overlay=null; document.removeEventListener('keydown', onKey); } }
  function showOk(c){
    if(!overlay) return;
    var box = overlay.querySelector('.modal__box');
    box.innerHTML =
      '<button class="modal__close" aria-label="Close" type="button">×</button>'+
      '<div class="modal__ok"><div class="modal__ok-ic">✓</div><div class="modal__ok-h">'+(lang()==='en'?'Sent!':'Отправлено!')+'</div>'+
      '<p class="modal__ok-p">'+esc(c.ok)+'</p>'+
      '<button type="button" class="btn btn--dark modal__ok-close">'+(lang()==='en'?'Close':'Закрыть')+'</button></div>';
    box.querySelector('.modal__close').addEventListener('click', close);
    box.querySelector('.modal__ok-close').addEventListener('click', close);
  }
  window.siForm = function(mode, product){
    var L = lang();
    var c = (CONFIGS[L] && CONFIGS[L][mode]) || CONFIGS[L].contact;
    var fl = FIELDS[L];
    product = (c.product && product) ? product : '';
    close();
    var fieldsHtml = fl[c.fields].map(function(f){
      var cls = 'modal__field' + (f.textarea ? ' modal__field--wide' : '');
      var input = f.textarea
        ? '<textarea class="modal__input modal__textarea" name="'+f.name+'" placeholder="'+esc(f.ph)+'" required></textarea>'
        : '<input class="modal__input" name="'+f.name+'" type="'+(f.type||'text')+'" placeholder="'+esc(f.ph)+'" required>';
      return '<div class="'+cls+'"><label class="modal__label">'+esc(f.label)+' *</label>'+input+'</div>';
    }).join('');
    overlay = document.createElement('div');
    overlay.className = 'modal';
    overlay.innerHTML =
      '<div class="modal__box" role="dialog" aria-modal="true" aria-label="'+esc(c.title)+'">'+
        '<button class="modal__close" aria-label="Close" type="button">×</button>'+
        '<div class="modal__tag">'+esc(c.tag)+'</div>'+
        '<h3 class="modal__title">'+esc(c.title)+(product?': '+esc(product):'')+'</h3>'+
        '<p class="modal__sub">'+esc(c.sub(product))+'</p>'+
        '<form class="modal__form" novalidate>'+
          '<input type="hidden" name="_subject" value="'+esc(c.subject(product))+'">'+
          '<input type="hidden" name="Тип заявки" value="'+esc(c.kind(product))+'">'+
          (product?'<input type="hidden" name="Продукт" value="'+esc(product)+'">':'')+
          '<input type="hidden" name="Адресат" value="Менеджер по продажам">'+
          fieldsHtml +
          '<label class="modal__check"><input type="checkbox" required checked><span>'+fl.consent+'<a href="policy.html" target="_blank" rel="noopener">'+fl.policy+'</a>.</span></label>'+
          '<p class="modal__error" style="display:none">'+fl.err+'</p>'+
          '<button type="submit" class="btn btn--primary btn--lg modal__submit">'+esc(c.cta)+' <span class="btn__arrow">→</span></button>'+
        '</form>';
    document.body.appendChild(overlay);
    document.addEventListener('keydown', onKey);
    overlay.addEventListener('mousedown', function(e){ if(e.target===overlay) close(); });
    overlay.querySelector('.modal__close').addEventListener('click', close);
    var form = overlay.querySelector('form');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!form.checkValidity()){ form.reportValidity(); return; }
      var btn = form.querySelector('.modal__submit');
      var err = form.querySelector('.modal__error');
      err.style.display='none';
      var orig = btn.innerHTML; btn.disabled=true; btn.textContent=fl.sending;
      fetch(ENDPOINT, { method:'POST', body:new FormData(form), headers:{Accept:'application/json'} })
        .then(function(res){ if(res.ok){ showOk(c); } else { err.style.display='block'; btn.disabled=false; btn.innerHTML=orig; } })
        .catch(function(){ err.style.display='block'; btn.disabled=false; btn.innerHTML=orig; });
    });
  };
})();
