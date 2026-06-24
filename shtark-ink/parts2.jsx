/* ============================================================
   Shtark INK — Part 2: Lab, Faces, Form, Footer, App
============================================================ */

// ---------- GLOBAL FORM MODAL (Telegram + Email relay) ----------
// Opened via: window.dispatchEvent(new CustomEvent('open-form-modal', { detail: {...} }))
// Заявки уходят на Cloudflare Worker → Telegram боту + почта (Formspree → minionslaba@gmail.com).
const FORMSPREE_ENDPOINT = 'https://shtark-form.minionslaba.workers.dev/';

const GlobalFormModal = () => {
  const [cfg, setCfg] = React.useState(null);
  const [status, setStatus] = React.useState('idle');

  React.useEffect(() => {
    const open = (e) => { setCfg(e.detail || {}); setStatus('idle'); };
    window.addEventListener('open-form-modal', open);
    return () => window.removeEventListener('open-form-modal', open);
  }, []);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setCfg(null); };
    if (cfg) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cfg]);

  if (!cfg) return null;
  const close = () => setCfg(null);

  const submit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setStatus('sending');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) { setStatus('ok'); form.reset(); }
      else setStatus('error');
    } catch (err) { setStatus('error'); }
  };

  return (
    <div className="modal" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="modal__box" role="dialog" aria-modal="true" aria-label={cfg.title}>
        <button className="modal__close" aria-label="Закрыть" onClick={close}>×</button>
        <div className="modal__tag">{cfg.tag || 'Заявка'}</div>
        <h3 className="modal__title">{cfg.title}</h3>
        {cfg.subtitle && <p className="modal__sub">{cfg.subtitle}</p>}

        {status === 'ok' ? (
          <div className="modal__ok">
            <div className="modal__ok-ic">✓</div>
            <div className="modal__ok-h">Отправлено!</div>
            <p className="modal__ok-p">{cfg.successText || 'Мы получили вашу заявку и свяжемся с вами в рабочее время. Спасибо!'}</p>
            <button type="button" className="btn btn--dark" onClick={close}>Закрыть</button>
          </div>
        ) : (
          <form className="modal__form" onSubmit={submit}>
            <input type="hidden" name="_subject" value={cfg.subject || 'Заявка с сайта Shtark INK'} />
            <input type="hidden" name="Тип заявки" value={cfg.kind || ''} />
            {(cfg.fields || []).map((f, i) => (
              <div className={'modal__field' + (f.textarea ? ' modal__field--wide' : '')} key={i}>
                <label className="modal__label">{f.label}{f.required ? ' *' : ''}</label>
                {f.file ? (
                  <input className="modal__input modal__file" name={f.name} type="file" accept={f.accept || 'image/*,application/pdf'} required={f.required} />
                ) : f.textarea ? (
                  <textarea className="modal__input modal__textarea" name={f.name} placeholder={f.placeholder || ''} defaultValue={f.value || ''} required={f.required} />
                ) : (
                  <input className="modal__input" name={f.name} type={f.type || 'text'} placeholder={f.placeholder || ''} defaultValue={f.value || ''} required={f.required} />
                )}
                {f.hint && <span className="modal__hint">{f.hint}</span>}
              </div>
            ))}
            <label className="modal__check">
              <input type="checkbox" required defaultChecked />
              <span>Согласен на обработку персональных данных согласно <a href="policy.html" target="_blank" rel="noopener">политике конфиденциальности</a>.</span>
            </label>
            {status === 'error' && <p className="modal__error">Не удалось отправить. Попробуйте ещё раз или напишите на info@shtarkink.com.</p>}
            <button type="submit" className="btn btn--primary btn--lg modal__submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Отправляем…' : <>{cfg.cta || 'Отправить'} <span className="btn__arrow">→</span></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const openSupplierForm = () => window.dispatchEvent(new CustomEvent('open-form-modal', { detail: {
  tag: 'Поставщикам',
  kind: 'Предложение поставщика',
  subject: 'Предложение поставщика — сайт Shtark INK',
  title: 'Отправить предложение о поставке',
  subtitle: 'Заполните форму — отдел закупок свяжется с вами в рабочее время.',
  cta: 'Отправить предложение',
  successText: 'Предложение получено. Отдел закупок рассмотрит его и свяжется с вами.',
  fields: [
    { name: 'Компания', label: 'Компания / поставщик', placeholder: 'ООО «Химснаб»', required: true },
    { name: 'Контактное лицо', label: 'Контактное лицо', placeholder: 'Иван Петров', required: true },
    { name: 'Телефон', label: 'Телефон', type: 'tel', placeholder: '+7 (___) ___-__-__', required: true },
    { name: 'E-mail', label: 'E-mail', type: 'email', placeholder: 'you@company.ru', required: true },
    { name: 'Что предлагаете', label: 'Категория и позиции', placeholder: 'Растворители: этилацетат, изопропанол · до 30 т/мес', required: true, textarea: true },
    { name: 'Комментарий', label: 'Комментарий (условия, цены, сертификаты)', placeholder: 'Цена, отсрочка, наличие ТУ/ГОСТ…', textarea: true },
  ],
}}));

const openResumeForm = (position) => window.dispatchEvent(new CustomEvent('open-form-modal', { detail: {
  tag: 'Вакансии',
  kind: 'Отклик на вакансию',
  subject: 'Отклик на вакансию — сайт Shtark INK',
  title: position ? 'Отклик: ' + position : 'Отправить резюме',
  subtitle: 'Заполните форму — HR свяжется с вами в рабочее время.',
  cta: 'Отправить резюме',
  successText: 'Спасибо! Ваш отклик получен, HR рассмотрит его и свяжется с вами.',
  fields: [
    { name: 'Желаемая позиция', label: 'Желаемая позиция', placeholder: 'Менеджер по продажам', value: position || '', required: true },
    { name: 'Имя', label: 'Имя', placeholder: 'Иван Петров', required: true },
    { name: 'Телефон', label: 'Телефон', type: 'tel', placeholder: '+7 (___) ___-__-__', required: true },
    { name: 'E-mail', label: 'E-mail', type: 'email', placeholder: 'you@mail.ru', required: true },
    { name: 'Ссылка на резюме', label: 'Ссылка на резюме (hh.ru, облако)', placeholder: 'https://…' },
    { name: 'Об опыте', label: 'Коротко об опыте', placeholder: 'Опыт, ключевые навыки, зарплатные ожидания…', textarea: true },
  ],
}}));

// Контакт с конкретным специалистом → та же релейная форма (Telegram + почта).
const ContactIcon = () => (
  <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v12H5.17L4 17.17V4z"/><path d="M8 9h8M8 12h5"/></svg>
);
const openContactPerson = (name, role, instr) => window.dispatchEvent(new CustomEvent('open-form-modal', { detail: {
  tag: 'Связь со специалистом',
  kind: 'Сообщение специалисту: ' + name + (role ? ' (' + role + ')' : ''),
  subject: 'Связаться с ' + (instr || name) + ' — сайт Shtark INK',
  title: 'Связаться с ' + (instr || name),
  subtitle: 'Заполните форму — ' + name + ' свяжется с вами в рабочее время. Сообщение придёт на почту и в Telegram.',
  cta: 'Отправить сообщение',
  successText: 'Спасибо! Сообщение отправлено — ' + name + ' свяжется с вами в рабочее время.',
  fields: [
    { name: 'Имя', label: 'Ваше имя', placeholder: 'Иван Петров', required: true },
    { name: 'Телефон', label: 'Телефон', type: 'tel', placeholder: '+7 (___) ___-__-__', required: true },
    { name: 'E-mail', label: 'E-mail', type: 'email', placeholder: 'you@mail.ru' },
    { name: 'Комментарий', label: 'Сообщение', placeholder: 'Коротко опишите ваш вопрос…', required: true, textarea: true },
  ],
}}));

const openDevContact = () => window.dispatchEvent(new CustomEvent('open-form-modal', { detail: {
  tag: 'Поддержка сайта',
  kind: 'Сообщение разработчику сайта (Моисеенко Константин)',
  subject: 'Разработка и поддержка сайта — Shtark INK',
  title: 'Разработка и поддержка сайта',
  subtitle: 'Моисеенко Константин — разработка и поддержка сайта. Напишите по вопросам работы сайта — сообщение придёт на почту и в Telegram.',
  cta: 'Отправить сообщение',
  successText: 'Спасибо! Сообщение отправлено — ответим в ближайшее время.',
  fields: [
    { name: 'Имя', label: 'Ваше имя', placeholder: 'Иван Петров', required: true },
    { name: 'Контакт', label: 'Телефон или e-mail для ответа', placeholder: '+7 … / you@mail.ru', required: true },
    { name: 'Комментарий', label: 'Сообщение', placeholder: 'Опишите вопрос по работе сайта…', required: true, textarea: true },
  ],
}}));

// ---------- LABORATORY ----------
const Lab = () =>
<section className="section section--tint" id="lab" data-screen-label="05 Lab">
    <div className="wrap">
      <div className="lab__grid">
        <image-slot
        id="lab-viscose"
        src="shtark-ink/img/lab-photo.png"
        class="lab__visual"
        style={{ width: '100%', aspectRatio: '5/4', height: 'auto', display: 'block' }}
        shape="rounded"
        radius="10"
        placeholder="ИИ-фото: вискозиметр ВЗ-4 + спектрофотометр X-Rite. Перетащите файл, чтобы заменить заглушку.">
      </image-slot>

        <div>
          <div className="section__tag">Лаборатория и&nbsp;контроль качества</div>
          <h2 className="section__title">Каждая партия проходит контроль до отгрузки</h2>

          <div className="lab__bullets" style={{ marginTop: 28 }}>
            <div className="lab__bullet">
              <div className="lab__bullet-dot" />
              <div className="lab__bullet-text">
                <b>Pantone color-matching</b> · подбираем рецепт под ваш анилокс и&nbsp;запечатываемый материал.
              </div>
            </div>
            <div className="lab__bullet">
              <div className="lab__bullet-dot" />
              <div className="lab__bullet-text">
                <b>Контроль вязкости</b> на каждом замесе · виско­зиметр ВЗ-4, контроль pH и&nbsp;сухого остатка.
              </div>
            </div>
            <div className="lab__bullet">
              <div className="lab__bullet-dot" />
              <div className="lab__bullet-text">
                <b>Спектрофотометр X-Rite eXact</b> · фиксируем Δe&nbsp;каждой&nbsp;партии и&nbsp;сохраняем в&nbsp;CRM&nbsp;по&nbsp;клиенту.
              </div>
            </div>
            <div className="lab__bullet">
              <div className="lab__bullet-dot" />
              <div className="lab__bullet-text">
                <b>Импортозамещение сырья</b> · все ключевые компоненты — российского происхождения.
              </div>
            </div>
          </div>

          <div className="lab__stats">
            <div className="lab__stat">
              <div className="lab__stat-num">Δe&nbsp;&lt;&nbsp;1.5</div>
              <div className="lab__stat-lbl">отклонение от&nbsp;эталона</div>
            </div>
            <div className="lab__stat">
              <div className="lab__stat-num">100%</div>
              <div className="lab__stat-lbl">партий проходят&nbsp;тест</div>
            </div>
            <div className="lab__stat">
              <div className="lab__stat-num">24 ч</div>
              <div className="lab__stat-lbl">выезд тех­сервиса</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <a href="#request" className="btn btn--dark">Скачать сертификаты <span className="btn__arrow">↓</span></a>
            <a href="#catalog" className="btn btn--ghost">Технические описания серий</a>
          </div>
        </div>
      </div>
    </div>
  </section>;


// ---------- FACES OF COMPANY ----------
// Имена в творительном падеже для «Связаться с …»
const FACE_INSTR = {
  'Екатерина': 'Екатериной',
  'Оксана': 'Оксаной',
  'Константин': 'Константином',
  'Максим': 'Максимом',
  'Вадим': 'Вадимом',
  'Ольга': 'Ольгой',
  'Татьяна': 'Татьяной',
};
const Faces = () =>
<section className="section" id="team" data-screen-label="06 Faces">
    <div className="wrap">
      <div className="section__head">
        <div className="section__head-text">
          <div className="section__tag">Компания в&nbsp;лицах</div>
          <h2 className="section__title">Люди, которые отвечают за&nbsp;каждый&nbsp;килограмм краски</h2>
        </div>
        <p className="section__sub">
          Производство · колористика · техсервис. Каждый специалист&nbsp;— на&nbsp;связи в&nbsp;рабочие часы и&nbsp;готов выехать к&nbsp;вам. Ищете работу в&nbsp;команде? Смотрите <a href="#careers">открытые вакансии</a>.
        </p>
      </div>

      {/* CEO hero */}
      <div className="faces__hero">
        <image-slot
        id="face-ceo"
        src="shtark-ink/img/face-ceo.png"
        class="faces__hero-visual"
        style={{ width: '100%', aspectRatio: '4/5', height: 'auto', display: 'block' }}
        shape="rect"
        placeholder="ИИ-портрет CEO. Перетащите файл, чтобы заменить.">
      </image-slot>
        <div className="faces__hero-body">
          <div className="faces__hero-role">Стратегическое руководство</div>
          <h3 className="faces__hero-name">Екатерина</h3>
          <p className="faces__hero-position">Исполнительный директор · руководитель департамента ВЭД и&nbsp;логистики</p>
          <blockquote className="faces__hero-quote">Наша миссия — дать российским производителям гибкой упаковки стабильный продукт и бесперебойные поставки, не зависящие от импорта и санкций. Екатерина стояла у истоков компании и руководит ВЭД и логистикой: под её началом выстроены надёжные цепочки поставок, на которых держится стабильность производства.


        </blockquote>
          <div className="faces__hero-meta">
            <div>
              <div className="faces__hero-meta-k">В компании</div>
              <div className="faces__hero-meta-v">с истоков</div>
            </div>
            <div>
              <div className="faces__hero-meta-k">Направление</div>
              <div className="faces__hero-meta-v">ВЭД · логистика</div>
            </div>
            <div>
              <div className="faces__hero-meta-k">Партнёров</div>
              <div className="faces__hero-meta-v">140+</div>
            </div>
            <div>
              <div className="faces__hero-meta-k">Руководство</div>
              <div className="faces__hero-meta-v">исп. директор</div>
            </div>
          </div>
          <button type="button" className="faces__hero-contact" onClick={() => openContactPerson('Екатерина', 'Исполнительный директор', 'Екатериной')} style={{ marginTop: 28 }}>
            <ContactIcon />Связаться с Екатериной
          </button>
        </div>
      </div>

      {/* Tech team */}
      <div className="faces__grid">
        {[
      {
        tag: 'СНАБЖЕНИЕ И\u00a0ВЭД',
        name: 'Оксана',
        role: 'Менеджер отдела снабжения и\u00a0ВЭД',
        desc: 'Большой опыт в&nbsp;закупках и&nbsp;внешнеэкономической деятельности. В&nbsp;компании с&nbsp;2024&nbsp;года&nbsp;— активный и&nbsp;вовлечённый сотрудник: ведёт переговоры с&nbsp;поставщиками, контролирует поставки и&nbsp;логистику от&nbsp;заявки до&nbsp;склада.',
        slotId: 'face-oksana',
        ph: 'Фото: Оксана, менеджер отдела снабжения и ВЭД, деловой стиль, офис Shtark INK.'
      },
      {
        tag: 'ФИНАНСЫ',
        name: 'Константин',
        role: 'Главный бухгалтер · Chief Accounting Officer (CAO)',
        desc: 'Руководит финансовым блоком и&nbsp;бухгалтерией компании. Работает в&nbsp;компании со&nbsp;дня основания, параллельно курирует вопросы автоматизации учёта и&nbsp;цифровизации.',
        slotId: 'face-konstantin',
        ph: 'Фото: Константин, главный бухгалтер (CAO), деловой стиль, офис Shtark INK.'
      },
      {
        tag: 'ТЕХ. ПОДДЕРЖКА',
        name: 'Максим',
        role: 'Инженер по\u00a0технической поддержке клиентов · технолог флексопечати (TSE)',
        desc: 'В&nbsp;индустрии 12&nbsp;лет, в&nbsp;компании с&nbsp;2023&nbsp;года. Выезжает к&nbsp;клиентам и&nbsp;настраивает оборудование под&nbsp;краски Shtark&nbsp;INK, подбирает продукты и&nbsp;сопровождает на&nbsp;всех этапах. Совместно с&nbsp;заказчиком разрабатывает образцы&nbsp;— от&nbsp;лабораторных до&nbsp;промышленных партий.',
        slotId: 'face-maxim',
        photo: true,
        ph: 'Фото: Максим, инженер по технической поддержке, деловой стиль, офис Shtark INK.'
      },
      {
        tag: 'ПРОИЗВОДСТВО',
        name: 'Вадим',
        role: 'Старший мастер цеха изготовления красок',
        desc: 'Контролирует технологический процесс — от&nbsp;загрузки компонентов до&nbsp;фасовки готовой продукции. Следит за&nbsp;работой бисерных мельниц и&nbsp;дисольверов. Опыт в&nbsp;производстве красок — более 8&nbsp;лет.',
        slotId: 'face-vadim',
        ph: 'Фото: Вадим, старший мастер цеха изготовления красок, цех Shtark INK.'
      },
      {
        tag: 'СНАБЖЕНИЕ И\u00a0ВЭД',
        name: 'Ольга',
        role: 'Менеджер отдела снабжения и\u00a0ВЭД',
        desc: 'Отвечает за&nbsp;закупки сырья и&nbsp;тары, логистику и&nbsp;внешнеэкономическую деятельность. В&nbsp;компании с&nbsp;2026&nbsp;года&nbsp;— выстраивает стабильные поставки и&nbsp;помогает расширять пул надёжных партнёров.',
        slotId: 'face-olga',
        ph: 'Фото: Ольга, менеджер отдела снабжения и ВЭД, деловой стиль, офис Shtark INK.'
      },
      {
        tag: 'ЛОГИСТИКА И\u00a0ВЭД',
        name: 'Татьяна',
        role: 'Специалист по\u00a0логистике и\u00a0ВЭД',
        desc: 'Отвечает за&nbsp;мультимодальные перевозки и&nbsp;внешнеэкономическую деятельность. Скрупулёзно решает любые задачи&nbsp;— от&nbsp;маршрута и&nbsp;таможни до&nbsp;сроков доставки. Ведёт мониторинг рынка перевозок и&nbsp;подбирает оптимальные логистические схемы, чтобы сырьё и&nbsp;продукция приходили вовремя и&nbsp;без&nbsp;сбоев.',
        slotId: 'face-tatiana',
        ph: 'Фото: Татьяна, специалист по логистике и ВЭД, деловой стиль, офис Shtark INK.'
      }].
      map((p, i) =>
      <article className="faces__card" key={i}>
            {p.photo ?
        <div
          className="faces__card-img faces__photo-maxim"
          role="img"
          aria-label={p.ph}>
        </div> :
        <image-slot
          id={p.slotId}
          src={`shtark-ink/img/${p.slotId}.png`}
          class="faces__card-img"
          style={{ width: '100%', aspectRatio: '1/1', height: 'auto', display: 'block' }}
          shape="rect"
          placeholder={p.ph}>
        </image-slot>}
            <div className="faces__card-body">
              <div className="faces__card-tag">{p.tag}</div>
              <h4 className="faces__card-name">{p.name.replace(/&nbsp;/g, '\u00a0')}</h4>
              <p className="faces__card-role">{p.role}</p>
              <p className="faces__card-desc" dangerouslySetInnerHTML={{ __html: p.desc }} />
              <button type="button" className="faces__card-contact" onClick={() => openContactPerson(p.name.replace(/&nbsp;/g, '\u00a0'), p.role.replace(/&nbsp;/g, '\u00a0'), FACE_INSTR[p.name] || p.name)}>
                <ContactIcon />Связаться с {FACE_INSTR[p.name] || p.name}
              </button>
            </div>
          </article>
      )}
      </div>
    </div>
  </section>;


// ---------- LEAD FORM ----------
const LeadForm = () => {
  const [agreed, setAgreed] = React.useState(true);
  const [status, setStatus] = React.useState('idle'); // idle | sending | ok | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setStatus('sending');
    try {
      const res = await fetch('https://shtark-form.minionslaba.workers.dev/', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('ok');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section className="section" id="request" data-screen-label="07 Request form">
      <div className="wrap">
        <div className="form">
          <div className="form__head">
            <div>
              <div className="section__tag" style={{ color: '#9CA0AB' }}>Заявка на расчёт и&nbsp;образцы</div>
              <h2 className="form__title">Закажите бесплатные тестовые образцы под&nbsp;<em>ваш материал</em></h2>
            </div>
            <p className="form__sub">
              Заполните поля — технолог свяжется в&nbsp;течение 2&nbsp;часов в&nbsp;рабочее время, уточнит&nbsp;параметры и&nbsp;отправит образцы с&nbsp;курьером. Сначала прикиньте объём в&nbsp;<a href="#calc" style={{ color: 'var(--accent)' }}>онлайн&#8209;калькуляторе расхода</a>.
            </p>
          </div>

          {status === 'ok' ? (
            <div className="form__success">
              <div className="form__success-ic">✓</div>
              <div>
                <div className="form__success-h">Заявка отправлена!</div>
                <p className="form__success-p">Технолог свяжется с&nbsp;вами в&nbsp;течение 2&nbsp;часов в&nbsp;рабочее время. Спасибо за&nbsp;обращение в&nbsp;Shtark&nbsp;INK.</p>
                <button type="button" className="btn btn--ghost-on-dark" onClick={() => setStatus('idle')}>Отправить ещё одну заявку</button>
              </div>
            </div>
          ) : (
          <form className="form__grid" onSubmit={handleSubmit}>
            <input type="hidden" name="_subject" value="Заявка с сайта Shtark INK" />
            <div className="form__field">
              <label className="form__field-label">Имя · контактное лицо</label>
              <input className="form__input" name="Имя" placeholder="Иван Петров" required />
            </div>
            <div className="form__field">
              <label className="form__field-label">Название компании</label>
              <input className="form__input" name="Компания" placeholder="ООО «Пакпринт»" required />
            </div>
            <div className="form__field">
              <label className="form__field-label">ИНН организации</label>
              <input className="form__input" name="ИНН" placeholder="7802677495" inputMode="numeric" pattern="\d{10,12}" title="ИНН: 10 или 12 цифр" required />
            </div>
            <div className="form__field">
              <label className="form__field-label">Телефон</label>
              <input className="form__input" name="Телефон" placeholder="+7 (___) ___-__-__" type="tel" required />
            </div>
            <div className="form__field">
              <label className="form__field-label">Ваш e-mail</label>
              <input className="form__input" name="E-mail" placeholder="you@company.ru" type="email" required />
            </div>
            <div className="form__field">
              <label className="form__field-label">Запечатываемый материал · скорость</label>
              <input className="form__input" name="Материал и скорость" placeholder="ПЭТ 30 мкм · 300 м/мин" required />
            </div>
            <div className="form__field form__field--wide">
              <label className="form__field-label">Комментарий · текущие проблемы (необязательно)</label>
              <textarea className="form__textarea" name="Комментарий" placeholder="Нужен Pantone 7556C под наш анилокс 4.5 см³/м², скоростная подача под ламинацию…" />
            </div>

            <div className="form__field form__field--wide form__foot">
              <label className="form__check">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span>Согласен на обработку персональных данных согласно <a href="policy.html" target="_blank" rel="noopener">политике конфиденциальности</a>. Данные нужны только для связи и&nbsp;отправки образцов.</span>
              </label>
              <button type="submit" className="btn btn--primary btn--lg" disabled={!agreed || status === 'sending'}>
                {status === 'sending' ? 'Отправляем…' : <>Отправить запрос на&nbsp;расчёт <span className="btn__arrow">→</span></>}
              </button>
            </div>
            {status === 'error' && (
              <div className="form__field form__field--wide">
                <p className="form__error">Не удалось отправить заявку. Попробуйте ещё раз или напишите на&nbsp;info@shtarkink.com.</p>
              </div>
            )}
          </form>
          )}
        </div>
      </div>
    </section>);

};

// ---------- FOOTER ----------
const Footer = () =>
<footer className="ftr" data-screen-label="08 Footer">
    <div className="wrap">
      <div className="ftr__grid">
        <div>
          <div className="ftr__brand" style={{ background: 'white', padding: '14px 18px', borderRadius: 10, display: 'inline-flex', alignItems: 'center' }}>
            <img src="shtark-ink/img/logo.png" alt="Shtark INK" style={{ height: 90, width: 'auto', display: 'block' }} />
          </div>
          <p className="ftr__about"><b>Официальный сайт компании.</b> Общество с ограниченной ответственностью «Штарк Инк». Производство спиртовых красок и лаков для высокоскоростной печати на гибкой упаковке.<br /><br />ИНН/КПП 7802677495 / 470601001<br />ОГРН 1187847283238<br />Юридический адрес: 188670, Ленинградская обл., Всеволожский район, с.п. Романовское, местечко Углово, д. 9А/19</p>
        </div>

        <div className="ftr__col">
          <h4>Продукция</h4>
          <ul>
            <li><a href="#catalog">Серия SURF</a></li>
            <li><a href="uni-tech.html">Серия UNI</a></li>
            <li><a href="lam-tech.html">Серия LAM</a></li>
            <li><a href="top-tech.html">Серия TOP</a></li>
            <li><a href="pcbase-tech.html">Серия PC BASE</a></li>
            <li><a href="laquer-tech.html">Серия LAQUER</a></li>
          </ul>
        </div>

        <div className="ftr__col">
          <h4>Компании</h4>
          <ul>
            <li><a href="#lab">Лаборатория</a></li>
            <li><a href="#team">Команда</a></li>
            <li><a href="#suppliers">Поставщикам</a></li>
            <li><a href="#careers">Вакансии</a></li>
            <li><a href="#contact">Контакты</a></li>
          </ul>
        </div>
      </div>

      <div className="ftr__docs-wrap">
        <div className="ftr__edo">
          <div className="ftr__edo-h">Электронный документооборот (ЭДО)</div>
          <p className="ftr__edo-text">Работаем с&nbsp;контрагентами через систему электронного документооборота&nbsp;— обмениваемся счетами, УПД и&nbsp;договорами в&nbsp;электронном виде с&nbsp;юридической значимостью. Для&nbsp;приглашения к&nbsp;ЭДО используйте наши реквизиты:</p>
          <div className="ftr__edo-rows">
            <div className="ftr__edo-row"><span className="ftr__edo-k">Оператор ЭДО</span><span className="ftr__edo-v">АО «Калуга Астрал»</span></div>
            <div className="ftr__edo-row"><span className="ftr__edo-k">Идентификатор</span><span className="ftr__edo-v">2AEE8E869E0-F8C1-4EB9-9EA6-6138A9F96B47</span></div>
          </div>
        </div>

        <div className="ftr__edo ftr__docs">
          <div className="ftr__edo-h">Документация</div>
          <p className="ftr__edo-text">Карточка предприятия, политика конфиденциальности и&nbsp;другие документы компании.</p>
          <a className="ftr__docs-link" href="docs.html">Документация, раскрытие информации <span aria-hidden="true">→</span></a>
        </div>
      </div>

      <div className="ftr__bot">
        <span>© 2026 SHTARK INK · ВСЕ ПРАВА ЗАЩИЩЕНЫ</span>
        <span style={{ display: 'flex', gap: 18 }}>
          <a href="sitemap.html">Карта сайта</a>
          <a href="policy.html" target="_blank" rel="noopener">Политика конфиденциальности</a>
          <a href="policy.html#consent" target="_blank" rel="noopener">Согласие на обработку данных</a>
        </span>
      </div>

      <div className="ftr__dev">
        <button type="button" className="ftr__dev-link" onClick={openDevContact}>
          Разработка и поддержка сайта — Моисеенко Константин
        </button>
      </div>
    </div>
  </footer>;


// ---------- APP ----------
const App = () =>
<>
    <SI_Header />
    <div className="pinstack">
      <SI_IntroBand />
      <SI_Production />
      <SI_Catalog />
      <SI_InkCalc />
      <SI_QuizSelector />
      <SI_CompareBand />
      <SI_Clients />
    </div>
    <SI_Calculator />
    <Lab />
    <Faces />
    <SI_Suppliers />
    <SI_Vacancies />
    <LeadForm />
    <SI_Contacts />
    <Footer />
    <SI_PartnerFab />
    <SI_CallbackFab />
    <SI_ScrollTop />
    <SI_ExitIntent />
    <SI_NewsletterPopup />
    <GlobalFormModal />
  </>;


// ---------- SUPPLIERS ----------
const SUPPLIER_DOCS = `
    <p><b>Для юридических лиц (ООО, АО и др.):</b></p>
    <ul>
      <li><b>Устав</b> — копия действующей редакции со всеми изменениями.</li>
      <li><b>Лист записи ЕГРЮЛ</b> (форма № Р50007) или Свидетельство ОГРН.</li>
      <li><b>Свидетельство ИНН</b> — о постановке на учёт в налоговом органе.</li>
      <li><b>Подтверждение полномочий</b> — копия решения/протокола о назначении генерального директора (или приказ о вступлении в должность).</li>
      <li><b>Карточка предприятия</b> с банковскими реквизитами.</li>
      <li><b>Доверенность</b> — если договор подписывает не директор (плюс копия приказа о наделении полномочиями).</li>
    </ul>
    <p><b>Для индивидуальных предпринимателей (ИП):</b></p>
    <ul>
      <li><b>Паспорт</b> — копии главной страницы и прописки.</li>
      <li><b>Лист записи ЕГРИП</b> или Свидетельство ОГРНИП.</li>
      <li><b>Свидетельство ИНН</b> — о постановке на учёт в налоговом органе.</li>
    </ul>
    <p><b>По продукции дополнительно запрашиваем:</b></p>
    <ul>
      <li>Сертификаты соответствия, паспорта качества, ТУ / ГОСТ на сырьё.</li>
      <li>Паспорта безопасности (SDS) на химическую продукцию.</li>
      <li>Спецификацию и прайс-лист с условиями отгрузки.</li>
    </ul>
  `;
const SUPPLIER_FAQ = [
  ['Кого вы рассматриваете как поставщика?', 'Производителей и официальных дистрибьюторов сырья (смолы, пигменты, растворители) и тары. Работаем с юридическими лицами и ИП с возможностью отгрузки от 1 т в месяц и наличием сертификатов качества.'],
  ['Как стать поставщиком?', 'Отправьте предложение через форму в этом разделе или на coo@shtarkink.com — с прайсом, спецификацией и сертификатами. Отдел закупок рассмотрит его, при интересе запросит образцы и документы для договора.'],
  ['Как проходит тестирование сырья?', 'Образцы тестируются в нашей лаборатории за 3 дня — проверяем соответствие спецификации и поведение в рецептуре. По результатам принимаем решение о закупке.'],
  ['Какие условия оплаты и договора?', 'Договоры поставки от 6 месяцев с фиксированной ценой, прозрачный конкурс по цене и качеству, своевременная оплата по договору. Возможен импорт через брокера компании.'],
  ['Какие документы нужны для договора поставки?', SUPPLIER_DOCS],
];

const Suppliers = () =>
<section className="section section--tint" id="suppliers" data-screen-label="07a Suppliers">
    <div className="wrap">
      <div className="sup__top">
        <div>
          <div className="section__tag">Поставщикам</div>
          <h2 className="section__title">Закупаем сырьё и&nbsp;тару — стабильно, по&nbsp;долгосрочным контрактам</h2>
        </div>
        <p className="sup__intro">
          Расширяем пул поставщиков. <b>Готовы рассматривать новых партнёров</b> с&nbsp;сертификатами качества и&nbsp;возможностью отгрузки от&nbsp;1&nbsp;т в&nbsp;месяц. Оплата по&nbsp;договору. Каждая партия сырья проходит проверку в&nbsp;нашей <a href="#lab">лаборатории</a>.
        </p>
      </div>

      <div className="sup__grid">
        {[
      { n: '01', t: 'Смолы и&nbsp;связующие', v: 'до 40 т / мес', items: ['Полиолы', 'Нитроцеллюлоза', 'Полиуретановые смолы', 'Алкидные смолы'] },
      { n: '02', t: 'Пигменты и&nbsp;красители', v: 'до 12 т / мес', items: ['Органические пигменты', 'Неорганические пигменты', 'Сажа', 'Двуокись титана'] },
      { n: '03', t: 'Растворители', v: 'до 60 т / мес', items: ['Этанол ректиф.', 'Этилацетат', 'Изопропанол', 'Пропиленгликоль'] },
      { n: '04', t: 'Тара и&nbsp;упаковка', v: 'без ограничений', items: ['Канистры 11.6 / 20 кг', 'Бочки 200 / 220 кг', 'Этикетка самокл.', 'Поддоны 1200×800'] }].
      map((c, i) =>
      <article className="sup__cat" key={i}>
            <div className="sup__cat-num">{c.n}</div>
            <h3 className="sup__cat-title" dangerouslySetInnerHTML={{ __html: c.t }} />
            <p className="sup__cat-vol">{c.v}</p>
            <ul className="sup__cat-list">{c.items.map((it, k) => <li key={k}>{it}</li>)}</ul>
          </article>
      )}
      </div>

      <div className="sup__terms">
        <div>
          <h3 className="sup__terms-head">Условия работы с&nbsp;отделом закупок</h3>
          <ul className="sup__terms-list">
            <li>Прозрачный конкурс &mdash; решения по&nbsp;цене и&nbsp;качеству</li>
            <li>Своевременная оплата по договору поставки</li>
            <li>Договоры от&nbsp;6 месяцев с&nbsp;фиксированной ценой</li>
            <li>Тестируем образцы в&nbsp;нашей лаборатории за&nbsp;3&nbsp;дня</li>
            <li>Принимаем сырьё с&nbsp;сертификатом ТУ&nbsp;/&nbsp;ГОСТ</li>
            <li>Возможен импорт через брокера компании</li>
          </ul>
        </div>
        <div className="sup__terms-cta">
          <span className="lbl">ОТДЕЛ ЗАКУПОК · ЕКАТЕРИНА</span>
          <span className="val">coo@shtarkink.com</span>
          <span className="val">+7 921 746-95-15 (Wechat/WhatsApp)</span>
          <button type="button" onClick={openSupplierForm} className="btn btn--primary" style={{ alignSelf: 'flex-start', marginTop: 10 }}>
            Отправить предложение <span className="btn__arrow">→</span>
          </button>
        </div>
      </div>

      <a className="sup__deck" href="suppliers-presentation.html" target="_blank" rel="noopener">
        <span className="sup__deck-ic">↓</span>
        <span className="sup__deck-txt">Открыть презентацию отдела закупок<span className="sup__deck-sub">Условия, объёмы закупа, как стать поставщиком</span></span>
        <span className="sup__deck-arrow">→</span>
      </a>

      <div className="cli__faq">
        <h3 className="cli__faq-h">Частые вопросы поставщиков</h3>
        {SUPPLIER_FAQ.map(([q, a], i) => (
          <details className="cli__faq-item" key={i} open={i === 0}>
            <summary>{q}</summary>
            <div className="cli__faq-body" dangerouslySetInnerHTML={{ __html: a }} />
          </details>
        ))}
        <div className="cli__legal">
          <a href="policy.html" target="_blank" rel="noopener">Политика конфиденциальности →</a>
          <a href="policy.html#consent" target="_blank" rel="noopener">Согласие на обработку данных →</a>
        </div>
      </div>
    </div>
  </section>;


// ---------- VACANCIES ----------
const VACANCIES = [
{
  dept: 'ПРОИЗВОДСТВО',
  title: 'Аппаратчик-смесительщик красок',
  money: '120 000–160 000 ₽',
  moneyNote: 'gross / мес',
  list: ['От 1 года на ЛКМ-производстве', 'Допуск к работе с растворителями', 'График 5/2, 40 часов'],
  loc: 'Углово'
},
{
  dept: 'ЛАБОРАТОРИЯ',
  title: 'Инженер-колорист (Pantone matching)',
  money: '140 000–180 000 ₽',
  moneyNote: 'gross / мес',
  list: ['Опыт с X-Rite eXact от 2 лет', 'Знание ΔE, спектрофотометрии', 'Высшее химико-технологическое'],
  loc: 'Углово'
},
{
  dept: 'ПРОДАЖИ',
  title: 'Менеджер по продажам',
  money: 'от 120 000 ₽',
  moneyNote: 'оклад + % с продаж',
  list: ['Опыт продаж B2B (ЛКМ, упаковка, полиграфия — плюс)', 'Развитие клиентской базы и работа с дилерами', 'Ведение сделки от заявки до отгрузки'],
  loc: 'г. Санкт-Петербург'
}];

const Vacancies = () =>
<section className="section" id="careers" data-screen-label="07b Vacancies">
    <div className="wrap">
      <div className="vac__top">
        <div className="vac__top-text">
          <div className="section__tag">Вакансии</div>
          <h2 className="section__title">Растём — ищем&nbsp;технологов, химиков и&nbsp;сервис-инженеров</h2>
        </div>
        <span className="vac__count">
          <span className="vac__count-num">3</span>
          <span className="vac__count-lbl">открытые<br />вакансии</span>
        </span>
      </div>

      <div className="vac__grid">
        {VACANCIES.map((v, i) =>
      <article className="vac__card" key={i}>
            <div className="vac__card-meta">
              <span className="vac__card-dept">{v.dept}</span>
              <span>0{i + 1} / {String(VACANCIES.length).padStart(2, '0')}</span>
            </div>
            <h3 className="vac__card-title">{v.title}</h3>
            <p className="vac__card-money">{v.money}<small>{v.moneyNote}</small></p>
            <ul className="vac__card-list">
              {v.list.map((l, k) => <li key={k}>{l}</li>)}
            </ul>
            <div className="vac__card-foot">
              <span className="vac__card-loc">📍 {v.loc}</span>
              <button type="button" onClick={() => openResumeForm(v.title)} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink)', textDecoration: 'none', fontWeight: 600, background: 'none', border: 0, cursor: 'pointer', padding: 0 }}>
                Откликнуться →
              </button>
            </div>
          </article>
      )}
      </div>

      <div className="vac__cta-row">
        <div className="vac__cta-text">
          <b>Не нашли свою позицию?</b> Пришлите резюме на&nbsp;info@shtarkink.com&nbsp;— технологи, химики, сервис-инженеры и&nbsp;операторы нужны постоянно. Кто уже в&nbsp;команде&nbsp;— смотрите в&nbsp;разделе <a href="#team">«Команда»</a>.
        </div>
        <a href="mailto:info@shtarkink.com" className="btn btn--dark btn--lg" onClick={(e) => { e.preventDefault(); openResumeForm(''); }}>Отправить резюме <span className="btn__arrow">→</span></a>
      </div>
    </div>
  </section>;


// ---------- CLIENTS (Клиентам) ----------
const FAQ = [
  ['Какой минимальный заказ?', 'Работаем оптом и мелким оптом. Минимальная партия зависит от серии — уточняйте у менеджера при оформлении заявки; как правило, это одна заводская фасовка (канистра/ведро) по позиции.'],
  ['Можно ли купить как физлицо?', 'Нет. Мы отгружаем продукцию только юридическим лицам и индивидуальным предпринимателям по договору поставки. Розничных продаж физическим лицам не ведём.'],
  ['Как происходит оплата?', 'Только безналичный расчёт по счёту на расчётный счёт ООО «Штарк Инк». Отгрузка — после поступления оплаты либо на условиях, согласованных в договоре. Все документы (счёт-фактура, УПД) предоставляем.'],
  ['Даёте ли образцы перед заказом?', 'Да. Бесплатно предоставляем тестовые образцы под ваш материал и оборудование. Технолог подбирает рецепт и при необходимости выезжает на производство.'],
  ['Сколько занимает разработка продуктов?', 'Продукты под клиента разрабатываются от 5 дней.'],
  ['Как получить дилерскую цену?', 'Дилерская цена и шкала скидок — в разделе «Дилерам». Оставьте заявку, менеджер пришлёт условия и проект договора.'],
  ['Какие документы нужны для заключения договора поставки?', `
    <p><b>Для юридических лиц (ООО, АО и др.):</b></p>
    <ul>
      <li><b>Устав</b> — копия действующей редакции со всеми изменениями.</li>
      <li><b>Лист записи ЕГРЮЛ</b> (форма № Р50007) или Свидетельство ОГРН.</li>
      <li><b>Свидетельство ИНН</b> — о постановке на учёт в налоговом органе.</li>
      <li><b>Подтверждение полномочий</b> — копия решения/протокола о назначении генерального директора (или приказ о вступлении в должность).</li>
      <li><b>Доверенность</b> — если договор подписывает не директор, а другое лицо (плюс копия приказа о наделении полномочиями).</li>
    </ul>
    <p><b>Для индивидуальных предпринимателей (ИП):</b></p>
    <ul>
      <li><b>Паспорт</b> — копии главной страницы и прописки.</li>
      <li><b>Лист записи ЕГРИП</b> или Свидетельство ОГРНИП.</li>
      <li><b>Свидетельство ИНН</b> — о постановке на учёт в налоговом органе.</li>
    </ul>
    <p><b>Дополнительно могут быть запрошены:</b></p>
    <ul>
      <li>Бухгалтерский баланс за последний год — для оценки финансовой устойчивости.</li>
      <li>Документы на право собственности / аренды офиса или склада.</li>
      <li>Штатное расписание (форма Т-3).</li>
      <li>Оборотно-сальдовые ведомости (ОСВ) по счетам 01, 10, 41, 51, 60/62 за последний квартал.</li>
      <li>Реестр договоров с крупнейшими клиентами или рекомендательные письма с контактами для проверки.</li>
      <li>Кредитная история компании или справки банков об отсутствии картотеки №2 и приостановлений по счетам.</li>
    </ul>
  `],
];

const Clients = () => (
  <section className="section section--tint" id="clients" data-screen-label="07c Clients">
    <div className="wrap">
      <div className="section__head">
        <div className="section__head-text">
          <div className="section__tag">Клиентам</div>
          <h2 className="section__title">Как заказать продукцию Shtark&nbsp;INK&nbsp;— коротко и&nbsp;по&nbsp;существу</h2>
        </div>
        <p className="section__sub">
          Завод-производитель. Прямые отгрузки оптом и&nbsp;мелким оптом по&nbsp;всей&nbsp;РФ. Развиваете продажи в&nbsp;регионе? Узнайте об&nbsp;условиях <a href="#dealers">для&nbsp;дилеров</a>.
        </p>
      </div>

      <div className="cli__banner">
        <span className="cli__banner-ic">B2B</span>
        <span className="cli__banner-text">
          Работаем <b>только с&nbsp;юридическими лицами и&nbsp;ИП</b> по&nbsp;договору поставки. Оплата&nbsp;— <b>только безналичная</b> по&nbsp;счёту.
        </span>
      </div>

      <a className="sup__deck" href="company-presentation.html" target="_blank" rel="noopener">
        <span className="sup__deck-ic">↓</span>
        <span className="sup__deck-txt">Открыть презентацию компании<span className="sup__deck-sub">О компании, производство, продукция, миссия и команда</span></span>
        <span className="sup__deck-arrow">→</span>
      </a>

      <div className="cli__grid" style={{ marginTop: 44 }}>
        <article className="cli__card cli__card--wide">
          <div className="cli__card-head">
            <span className="cli__card-num">01</span>
            <h3 className="cli__card-title">Как оформить заказ</h3>
          </div>
          <ol className="cli__steps">
            <li>Выберите серии и&nbsp;позиции в&nbsp;каталоге продукции или запросите подбор у&nbsp;технолога.</li>
            <li>Оставьте заявку через форму на&nbsp;сайте или напишите на&nbsp;info@shtarkink.com&nbsp;— с&nbsp;реквизитами компании.</li>
            <li>Менеджер согласует объём, цену и&nbsp;сроки, оформит договор и&nbsp;выставит счёт.</li>
            <li>После оплаты счёта запускаем отгрузку и&nbsp;передаём отгрузочные документы.</li>
          </ol>
        </article>

        <article className="cli__card">
          <div className="cli__card-head">
            <span className="cli__card-num">02</span>
            <h3 className="cli__card-title">Оплата</h3>
          </div>
          <ul className="cli__list">
            <li><b>Только безналичный расчёт</b> по&nbsp;счёту</li>
            <li>Договор поставки с&nbsp;юрлицами и&nbsp;ИП</li>
            <li>Счёт-фактура и&nbsp;УПД, работа с&nbsp;НДС</li>
            <li>Отсрочка&nbsp;— по&nbsp;согласованию в&nbsp;договоре</li>
          </ul>
        </article>

        <article className="cli__card">
          <div className="cli__card-head">
            <span className="cli__card-num">03</span>
            <h3 className="cli__card-title">Доставка</h3>
          </div>
          <ul className="cli__list">
            <li><b>Самовывоз</b> со&nbsp;склада в&nbsp;Ленинградской обл.</li>
            <li>Отгрузка <b>транспортными компаниями</b> по&nbsp;РФ</li>
            <li>Доставка до&nbsp;терминала ТК&nbsp;— бесплатно*</li>
            <li>Сроки&nbsp;— от&nbsp;1&nbsp;дня со&nbsp;склада</li>
          </ul>
        </article>

        <article className="cli__card">
          <div className="cli__card-head">
            <span className="cli__card-num">04</span>
            <h3 className="cli__card-title">Лояльность</h3>
          </div>
          <ul className="cli__list">
            <li>Дилерская цена и&nbsp;шкала скидок от&nbsp;объёма</li>
            <li>Спецусловия для&nbsp;постоянных клиентов</li>
            <li>Фиксация цены по&nbsp;долгосрочному договору</li>
            <li>Приоритетная отгрузка партнёрам</li>
          </ul>
        </article>

        <article className="cli__card">
          <div className="cli__card-head">
            <span className="cli__card-num">05</span>
            <h3 className="cli__card-title">Гарантия и&nbsp;сервис</h3>
          </div>
          <ul className="cli__list">
            <li>Паспорт качества на&nbsp;каждую партию</li>
            <li>Гарантийный срок хранения&nbsp;— по&nbsp;TDS</li>
            <li>Техсопровождение и&nbsp;выезд технолога</li>
            <li>Контроль Δe и&nbsp;вязкости в&nbsp;лаборатории</li>
          </ul>
        </article>
      </div>

      <div className="cli__faq">
        <h3 className="cli__faq-h">Частые вопросы</h3>
        {FAQ.map(([q, a], i) => (
          <details className="cli__faq-item" key={i} open={i === 0}>
            <summary>{q}</summary>
            <div className="cli__faq-body" dangerouslySetInnerHTML={{ __html: a }} />
          </details>
        ))}
      </div>

      <div className="cli__legal">
        <a href="policy.html" target="_blank" rel="noopener">Договор оферты →</a>
        <a href="policy.html" target="_blank" rel="noopener">Политика конфиденциальности →</a>
        <a href="policy.html#consent" target="_blank" rel="noopener">Согласие на обработку данных →</a>
      </div>
    </div>
  </section>
);

window.SI_Suppliers = Suppliers;
window.SI_Vacancies = Vacancies;
window.SI_Clients = Clients;
window.SI_Lab = Lab;
window.SI_Faces = Faces;
window.SI_LeadForm = LeadForm;
window.SI_Footer = Footer;

// ---------- CONTACTS ----------
const MAP_LINK = 'https://yandex.ru/maps/?text=' + encodeURIComponent('Ленинградская область, Всеволожский район, Углово, 9А/19');
const Contacts = () => (
  <section className="section section--tint" id="contact" data-screen-label="08 Contacts">
    <div className="wrap">
      <div className="section__head">
        <div className="section__head-text">
          <div className="section__tag">Контакты</div>
          <h2 className="section__title">Свяжитесь с&nbsp;нами&nbsp;— ответим в&nbsp;рабочее время</h2>
        </div>
        <p className="section__sub">
          Отдел продаж, технологи и&nbsp;закупки&nbsp;— на&nbsp;связи пн–пт. Напишите или&nbsp;позвоните, либо&nbsp;<a href="#request" style={{ color: 'var(--ink)', fontWeight: 600 }}>оставьте заявку</a>. Реквизиты и&nbsp;документы&nbsp;— в&nbsp;<a href="docs.html" style={{ color: 'var(--ink)', fontWeight: 600 }}>разделе документации</a>.
        </p>
      </div>

      <div className="contacts__grid">
        <div className="contacts__cards">
          <button type="button" className="contacts__card contacts__card--btn" onClick={() => window.dispatchEvent(new CustomEvent('open-form-modal', { detail: {
            tag: 'Контакты',
            kind: 'Заявка с раздела «Контакты»',
            subject: 'Заявка с сайта (контакты) — Shtark INK',
            title: 'Написать нам сейчас',
            subtitle: 'Оставьте контакты и вопрос — менеджер или технолог свяжется с вами в рабочее время.',
            cta: 'Отправить сообщение',
            successText: 'Сообщение отправлено. Мы свяжемся с вами в рабочее время. Спасибо!',
            fields: [
              { name: 'Имя', label: 'Имя', placeholder: 'Иван Петров', required: true },
              { name: 'Телефон', label: 'Телефон', type: 'tel', placeholder: '+7 (___) ___-__-__', required: true },
              { name: 'E-mail', label: 'E-mail', type: 'email', placeholder: 'you@company.ru' },
              { name: 'Сообщение', label: 'Сообщение', placeholder: 'Ваш вопрос или запрос…', textarea: true, required: true }
            ]
          } }))}>
            <span className="contacts__ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </span>
            <span>
              <span className="contacts__k">Написать нам сейчас</span>
              <span className="contacts__v">Форма обратной связи<span className="sub">Ответим в рабочее время</span></span>
            </span>
          </button>

          <a className="contacts__card" href="tel:+79110374855">
            <span className="contacts__ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.97.36 1.92.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.89.34 1.84.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </span>
            <span>
              <span className="contacts__k">Телефон</span>
              <span className="contacts__v">+7&nbsp;911&nbsp;037-48-55<span className="sub">Пн–Пт, 9:00–18:00 (МСК)</span></span>
            </span>
          </a>

          <a className="contacts__card" href="mailto:info@shtarkink.com">
            <span className="contacts__ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </span>
            <span>
              <span className="contacts__k">Электронная почта</span>
              <span className="contacts__v">info@shtarkink.com<span className="sub">Заявки, КП, документы</span></span>
            </span>
          </a>

          <a className="contacts__card contacts__card--vk" href="https://vk.com/share.php?url=https%3A%2F%2Fshtarkink.com&title=Shtark%20INK%20%E2%80%94%20%D1%81%D0%BF%D0%B8%D1%80%D1%82%D0%BE%D0%B2%D1%8B%D0%B5%20%D1%84%D0%BB%D0%B5%D0%BA%D1%81%D0%BE%D0%BA%D1%80%D0%B0%D1%81%D0%BA%D0%B8" target="_blank" rel="noopener" onClick={(e) => {
            if (/android|iphone|ipad|ipod/i.test(navigator.userAgent)) {
              e.preventDefault();
              var u = 'https://shtarkink.com';
              var deep = 'vk://vk.com/share.php?url=' + encodeURIComponent(u);
              var web = 'https://vk.com/share.php?url=' + encodeURIComponent(u);
              var t = Date.now();
              var fb = setTimeout(function(){ if (Date.now() - t < 1600) window.open(web, '_blank'); }, 700);
              window.location.href = deep;
              window.addEventListener('pagehide', function(){ clearTimeout(fb); }, { once: true });
            }
          }}>
            <span className="contacts__ic contacts__ic--vk">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.16 17.2c-5.46 0-8.78-3.78-8.92-10.05h2.74c.1 4.6 2.18 6.56 3.8 6.96V7.15h2.6v3.9c1.58-.17 3.24-2 3.8-3.9h2.58c-.43 2.32-2.23 4.15-3.5 4.9 1.27.62 3.32 2.22 4.1 5.15h-2.85c-.6-1.92-2.1-3.4-4.13-3.6v3.6h-.2z"/></svg>
            </span>
            <span>
              <span className="contacts__k">Рассказать друзьям</span>
              <span className="contacts__v">Поделиться в&nbsp;VK.com<span className="sub">ВКонтакте</span></span>
            </span>
          </a>

          <a className="contacts__card" href={MAP_LINK} target="_blank" rel="noopener">
            <span className="contacts__ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </span>
            <span>
              <span className="contacts__k">Производство и&nbsp;склад</span>
              <span className="contacts__v" style={{ fontSize: 17, lineHeight: 1.35 }}>Ленинградская обл.,<br />Всеволожский р-н, Углово, 9А/19<span className="sub">188670 · с.п. Романовское</span></span>
            </span>
          </a>
        </div>

        <div className="contacts__map">
          <img src="shtark-ink/img/contacts-map.png" alt="Схема проезда: Углово, 9А/19" />
          <span className="contacts__map-tag"><b>Shtark INK</b><br />Углово, д.&nbsp;9А/19</span>
          <a className="contacts__map-link" href={MAP_LINK} target="_blank" rel="noopener">Открыть в&nbsp;Яндекс.Картах ↗</a>
        </div>
      </div>
    </div>
  </section>
);

// ---------- FLOATING PARTNER CTA ----------
const PartnerFab = () => {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <a href="#request" className={'partner-fab' + (show ? ' is-visible' : '')} aria-label="Связаться с отделом продаж и получить бесплатные образцы">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      Связаться с отделом продаж и&nbsp;получить бесплатные образцы
    </a>
  );
};

// ---------- SCROLL NAV (up / down by one section) ----------
const ScrollNav = () => {
  const [showUp, setShowUp] = React.useState(false);
  const [showDown, setShowDown] = React.useState(true);
  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const winH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      setShowUp(y > 700);
      setShowDown(y + winH < docH - 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const HEADER = 84; // sticky header offset
  const goUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const goDown = () => {
    const secs = Array.prototype.slice.call(document.querySelectorAll('#app section[id]'));
    const y = window.scrollY;
    let target = null;
    for (let i = 0; i < secs.length; i++) {
      const top = secs[i].getBoundingClientRect().top + window.scrollY - HEADER;
      if (top > y + 6) { target = top; break; }
    }
    window.scrollTo({
      top: target != null ? target : document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="scrollnav">
      <button
        type="button"
        className={'scrolltop scrolltop--up' + (showUp ? ' is-visible' : '')}
        aria-label="Наверх"
        onClick={goUp}
      >
        ↑
      </button>
      <button
        type="button"
        className={'scrolltop scrolltop--down' + (showDown ? ' is-visible' : '')}
        aria-label="К следующему разделу"
        onClick={goDown}
      >
        ↓
      </button>
    </div>
  );
};

window.SI_Contacts = Contacts;
window.SI_PartnerFab = PartnerFab;
window.SI_ScrollTop = ScrollNav;

// ---------- EXIT-INTENT LEAD CATCHER ----------
const ExitIntent = () => {
  React.useEffect(() => {
    let fired = false;
    try { if (sessionStorage.getItem('si-exit-shown')) fired = true; } catch (e) {}

    const trigger = () => {
      if (fired) return;
      fired = true;
      try { sessionStorage.setItem('si-exit-shown', '1'); } catch (e) {}
      window.dispatchEvent(new CustomEvent('open-form-modal', { detail: {
        tag: 'Спецпредложение',
        kind: 'Exit-intent · бесплатный образец',
        subject: 'Exit-intent заявка — сайт Shtark INK',
        title: 'Заберите бесплатный образец',
        subtitle: 'Оставьте контакты — технолог подберёт краску под ваш материал и пришлёт бесплатный тестовый образец.',
        cta: 'Получить образец',
        successText: 'Заявка принята. Технолог Shtark INK свяжется с вами в рабочее время.',
        fields: [
          { name: 'Имя', label: 'Имя', placeholder: 'Иван Петров', required: true },
          { name: 'Телефон', label: 'Телефон', type: 'tel', placeholder: '+7 (___) ___-__-__', required: true },
          { name: 'E-mail', label: 'E-mail', type: 'email', placeholder: 'you@company.ru', required: true }
        ]
      } }));
    };

    // Desktop: cursor leaves viewport top
    const onLeave = (e) => { if (e.clientY <= 0) trigger(); };
    document.addEventListener('mouseout', onLeave);

    // Mobile/touch: fast upward scroll near top after some engagement
    let lastY = window.scrollY, lastT = Date.now();
    const onScroll = () => {
      const y = window.scrollY, t = Date.now();
      const v = (lastY - y) / Math.max(1, t - lastT); // upward velocity
      if (y < 240 && v > 1.4 && (t - lastT) < 250) trigger();
      lastY = y; lastT = t;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseout', onLeave);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  return null;
};

window.SI_ExitIntent = ExitIntent;
window.SI_App = App;