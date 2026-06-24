/* ============================================================
   Shtark INK — Part 3: Quiz selector, Compare band, Callback
   All submissions go to the same Worker → Telegram + email.
============================================================ */

const SI_WORKER = 'https://shtark-form.minionslaba.workers.dev/';

// ---------- COMPARE WITH YOUR INK (band + file upload) ----------
const CompareBand = () =>
  <section className="section section--tight" id="compare" data-screen-label="04b Compare">
    <div className="wrap">
      <div className="compare">
        <div className="compare__text">
          <div className="section__tag">Уже покупаете краску?</div>
          <h2 className="compare__title">Сравним с&nbsp;вашей текущей краской&nbsp;— и&nbsp;сделаем аналог</h2>
          <p className="compare__sub">Пришлите техпаспорт (TDS) или&nbsp;фото этикетки вашей краски. Технолог Shtark&nbsp;INK подберёт аналог под&nbsp;ваш материал и&nbsp;оборудование&nbsp;— часто дешевле и&nbsp;без&nbsp;зависимости от&nbsp;импорта.</p>
          <ul className="compare__list">
            <li>Бесплатный подбор аналога</li>
            <li>Тестовый образец под&nbsp;ваш тираж</li>
            <li>Выезд технолога на&nbsp;производство</li>
          </ul>
        </div>
        <button type="button" className="compare__cta btn btn--primary btn--lg" onClick={() => window.dispatchEvent(new CustomEvent('open-form-modal', { detail: {
          tag: 'Сравнить краску',
          kind: 'Запрос аналога (сравнение с текущей краской)',
          subject: 'Запрос аналога краски — сайт Shtark INK',
          title: 'Сравнить с вашей краской',
          subtitle: 'Прикрепите техпаспорт или фото этикетки — технолог подберёт аналог Shtark INK и свяжется с вами.',
          cta: 'Отправить на подбор',
          successText: 'Заявка принята. Технолог Shtark INK изучит вашу краску, подберёт аналог и свяжется с вами в рабочее время.',
          fields: [
            { name: 'Файл (TDS/этикетка)', label: 'Техпаспорт или фото этикетки', file: true, accept: 'image/*,application/pdf', hint: 'PDF или фото. Если файла нет — опишите краску в комментарии ниже.' },
            { name: 'Текущая краска', label: 'Марка / производитель (если знаете)', placeholder: 'напр. Siegwerk, Flint, Sun Chemical…' },
            { name: 'Материал · оборудование', label: 'Материал и оборудование', placeholder: 'ПЭТ 30 мкм, флексо 8 секций, 300 м/мин', textarea: true },
            { name: 'Имя', label: 'Имя', placeholder: 'Иван Петров', required: true },
            { name: 'Телефон', label: 'Телефон', type: 'tel', placeholder: '+7 (___) ___-__-__', required: true },
            { name: 'E-mail', label: 'E-mail', type: 'email', placeholder: 'you@company.ru', required: true }
          ]
        } }))}>
          Прислать на&nbsp;подбор аналога <span className="btn__arrow">→</span>
        </button>
      </div>
    </div>
  </section>;

// ---------- QUIZ INK SELECTOR ----------
const QUIZ_STEPS = [
  {
    key: 'Материал',
    q: 'На чём печатаете?',
    opts: ['BOPP / OPP', 'ПЭ (LDPE/HDPE)', 'ПЭТ', 'Металлизир. плёнка / фольга', 'Несколько материалов']
  },
  {
    key: 'Способ печати',
    q: 'Способ печати?',
    opts: ['Флексография', 'Ротогравюра', 'И то, и другое']
  },
  {
    key: 'Задача',
    q: 'Тип печати / задача?',
    opts: ['Поверхностная печать', 'Межслойная (под ламинацию)', 'Под стерилизацию / пастеризацию', 'Лак / финиш-секция', 'Не уверен — нужен совет']
  }
];

// crude series suggestion from answers (final word stays with the technologist)
function suggestSeries(a) {
  const task = a['Задача'] || '';
  if (task.indexOf('Лак') === 0) return 'LAQUER';
  if (task.indexOf('Поверхностная') === 0) return 'SURF';
  if (task.indexOf('стерилизац') !== -1 || task.indexOf('Под стерил') === 0) return 'TOP';
  if (task.indexOf('Межслойная') === 0) return 'LAM / UNI';
  return 'UNI';
}

const QuizSelector = () => {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [status, setStatus] = React.useState('idle');
  const total = QUIZ_STEPS.length;

  const pick = (key, val) => {
    setAnswers((p) => ({ ...p, [key]: val }));
    setStep((s) => s + 1);
  };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const restart = () => { setAnswers({}); setStep(0); setStatus('idle'); };

  const submit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setStatus('sending');
    const fd = new FormData(form);
    fd.append('_subject', 'Квиз-подбор краски — сайт Shtark INK');
    fd.append('Тип заявки', 'Квиз-подбор краски');
    QUIZ_STEPS.forEach((st) => fd.append(st.key, answers[st.key] || '—'));
    fd.append('Рекомендация (предварительно)', suggestSeries(answers));
    try {
      const res = await fetch(SI_WORKER, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      setStatus(res.ok ? 'ok' : 'error');
    } catch (err) { setStatus('error'); }
  };

  const onForm = step >= total;
  const progress = Math.round((Math.min(step, total) / total) * 100);

  return (
    <section className="section section--tint" id="quiz" data-screen-label="04c Quiz">
      <div className="wrap">
        <div className="section__head">
          <div className="section__head-text">
            <div className="section__tag">Подбор за 1 минуту</div>
            <h2 className="section__title">Какая краска Shtark&nbsp;INK подойдёт именно вам?</h2>
          </div>
          <p className="section__sub">Ответьте на&nbsp;3 вопроса&nbsp;— технолог подберёт серию под&nbsp;ваш материал и&nbsp;задачу и&nbsp;пришлёт рекомендацию с&nbsp;образцом.</p>
        </div>

        <div className="quiz">
          <div className="quiz__bar"><div className="quiz__bar-fill" style={{ width: progress + '%' }} /></div>

          {status === 'ok' ? (
            <div className="quiz__done">
              <div className="quiz__done-ic">✓</div>
              <h3 className="quiz__done-h">Готово! Заявка принята</h3>
              <p className="quiz__done-p">По вашим ответам предварительно подходит серия <b>{suggestSeries(answers)}</b>. Технолог Shtark&nbsp;INK подтвердит выбор, учтёт детали и&nbsp;пришлёт образец.</p>
              <button type="button" className="btn btn--dark" onClick={restart}>Пройти заново</button>
            </div>
          ) : !onForm ? (
            <div className="quiz__step">
              <div className="quiz__count">Шаг {step + 1} из {total}</div>
              <h3 className="quiz__q">{QUIZ_STEPS[step].q}</h3>
              <div className="quiz__opts">
                {QUIZ_STEPS[step].opts.map((o) => (
                  <button type="button" key={o} className={'quiz__opt' + (answers[QUIZ_STEPS[step].key] === o ? ' is-active' : '')} onClick={() => pick(QUIZ_STEPS[step].key, o)}>
                    <span>{o}</span><span className="quiz__opt-arrow">→</span>
                  </button>
                ))}
              </div>
              {step > 0 && <button type="button" className="quiz__back" onClick={back}>← Назад</button>}
            </div>
          ) : (
            <form className="quiz__form" onSubmit={submit}>
              <div className="quiz__recap">
                <div className="quiz__count">Ваши ответы</div>
                <div className="quiz__recap-grid">
                  {QUIZ_STEPS.map((st) => (
                    <div className="quiz__recap-item" key={st.key}>
                      <span className="quiz__recap-k">{st.key}</span>
                      <span className="quiz__recap-v">{answers[st.key] || '—'}</span>
                    </div>
                  ))}
                </div>
                <button type="button" className="quiz__back" onClick={() => setStep(0)}>← Изменить ответы</button>
              </div>

              <div className="quiz__contact">
                <h3 className="quiz__q">Куда прислать рекомендацию и&nbsp;образец?</h3>
                <div className="quiz__fields">
                  <input className="modal__input" name="Имя" placeholder="Имя *" required />
                  <input className="modal__input" name="Телефон" type="tel" placeholder="Телефон *" required />
                  <input className="modal__input" name="E-mail" type="email" placeholder="E-mail *" required />
                </div>
                <label className="modal__check">
                  <input type="checkbox" required defaultChecked />
                  <span>Согласен на обработку персональных данных согласно <a href="policy.html" target="_blank" rel="noopener">политике конфиденциальности</a>.</span>
                </label>
                {status === 'error' && <p className="modal__error">Не удалось отправить. Попробуйте ещё раз или напишите на info@shtarkink.com.</p>}
                <button type="submit" className="btn btn--primary btn--lg" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Отправляем…' : <>Получить подбор и&nbsp;образец <span className="btn__arrow">→</span></>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

// ---------- CALLBACK REQUEST (floating, 30-min promise) ----------
const CallbackFab = () => {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState('idle');

  const submit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setStatus('sending');
    const fd = new FormData(form);
    fd.append('_subject', 'Заказ обратного звонка — сайт Shtark INK');
    fd.append('Тип заявки', 'Обратный звонок');
    try {
      const res = await fetch(SI_WORKER, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      setStatus(res.ok ? 'ok' : 'error');
    } catch (err) { setStatus('error'); }
  };

  return (
    <>
      <button type="button" className="callback-fab" onClick={() => { setOpen(true); setStatus('idle'); }} aria-label="Заказать обратный звонок">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <span className="callback-fab__txt">Заказать<br />звонок</span>
      </button>

      {open && (
        <div className="modal" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="modal__box" role="dialog" aria-modal="true" aria-label="Обратный звонок">
            <button className="modal__close" aria-label="Закрыть" onClick={() => setOpen(false)}>×</button>
            <div className="modal__tag">Обратный звонок</div>
            <h3 className="modal__title">Перезвоним за&nbsp;30&nbsp;минут</h3>
            <p className="modal__sub">В рабочее время (Пн–Пт, 9:00–18:00 МСК) технолог перезвонит в&nbsp;течение 30&nbsp;минут. Вне графика&nbsp;— в&nbsp;начале следующего рабочего дня.</p>

            {status === 'ok' ? (
              <div className="modal__ok">
                <div className="modal__ok-ic">✓</div>
                <div className="modal__ok-h">Заявка принята!</div>
                <p className="modal__ok-p">Технолог Shtark&nbsp;INK перезвонит вам в&nbsp;течение 30&nbsp;минут в&nbsp;рабочее время.</p>
                <button type="button" className="btn btn--dark" onClick={() => setOpen(false)}>Закрыть</button>
              </div>
            ) : (
              <form className="modal__form" onSubmit={submit}>
                <div className="modal__field">
                  <label className="modal__label">Имя *</label>
                  <input className="modal__input" name="Имя" placeholder="Иван Петров" required />
                </div>
                <div className="modal__field">
                  <label className="modal__label">Телефон *</label>
                  <input className="modal__input" name="Телефон" type="tel" placeholder="+7 (___) ___-__-__" required />
                </div>
                <div className="modal__field modal__field--wide">
                  <label className="modal__label">Когда удобно?</label>
                  <select className="modal__input" name="Удобное время" defaultValue="Сейчас (в течение 30 минут)">
                    <option>Сейчас (в течение 30 минут)</option>
                    <option>В течение часа</option>
                    <option>Сегодня после обеда</option>
                    <option>Завтра утром</option>
                    <option>Договоримся по переписке</option>
                  </select>
                </div>
                <label className="modal__check">
                  <input type="checkbox" required defaultChecked />
                  <span>Согласен на обработку персональных данных согласно <a href="policy.html" target="_blank" rel="noopener">политике конфиденциальности</a>.</span>
                </label>
                {status === 'error' && <p className="modal__error">Не удалось отправить. Попробуйте ещё раз или напишите на info@shtarkink.com.</p>}
                <button type="submit" className="btn btn--primary btn--lg modal__submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Отправляем…' : <>Жду звонка <span className="btn__arrow">→</span></>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

window.SI_CompareBand = CompareBand;
window.SI_QuizSelector = QuizSelector;
window.SI_CallbackFab = CallbackFab;

// ---------- NEWSLETTER POPUP (entry + re-show after dismiss) ----------
const NewsletterPopup = () => {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState('idle');
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    let done = false;
    try { done = sessionStorage.getItem('si-news-done') === '1'; } catch (e) {}
    if (done) return;
    // Показываем ТОЛЬКО ОДИН раз — через 45 секунд на сайте.
    const first = setTimeout(() => {
      setOpen(true);
      try { sessionStorage.setItem('si-news-done', '1'); } catch (e) {}
    }, 45000);
    return () => clearTimeout(first);
  }, []);

  const markDone = () => { try { sessionStorage.setItem('si-news-done', '1'); } catch (e) {} };

  const dismiss = () => {
    setOpen(false); // больше не показываем в этой сессии
  };

  const submit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setStatus('sending');
    const fd = new FormData(form);
    fd.append('_subject', 'Подписка на рассылку — сайт Shtark INK');
    fd.append('Тип заявки', 'Подписка на рассылку (бонус-скидка + лояльность)');
    try {
      const res = await fetch(SI_WORKER, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      if (res.ok) { setStatus('ok'); markDone(); if (timerRef.current) clearTimeout(timerRef.current); }
      else setStatus('error');
    } catch (err) { setStatus('error'); }
  };

  if (!open) return null;

  return (
    <div className="news-pop" onMouseDown={(e) => { if (e.target === e.currentTarget) dismiss(); }}>
      <div className="news-pop__box" role="dialog" aria-modal="true" aria-label="Подписка на рассылку">
        <div className="news-pop__media" aria-hidden="true">
          <div className="news-pop__cmyk"><span></span><span></span><span></span><span></span></div>
          <div className="news-pop__badge">−10%</div>
          <div className="news-pop__media-h">На первую<br />поставку</div>
          <div className="news-pop__media-sub">+ приоритетное обслуживание<br />у менеджера + программа<br />лояльности Shtark&nbsp;INK</div>
        </div>

        <div className="news-pop__body">
          {status === 'ok' ? (
            <div className="news-pop__ok">
              <div className="news-pop__ok-ic">✓</div>
              <h3 className="news-pop__ok-h">Вы подписаны!</h3>
              <p className="news-pop__ok-p">Скидка −10% на&nbsp;первую поставку закреплена за&nbsp;вами. Менеджер свяжется и&nbsp;подключит к&nbsp;программе лояльности. Спасибо!</p>
              <button type="button" className="btn btn--primary" onClick={() => setOpen(false)}>Отлично</button>
            </div>
          ) : (
            <>
              <div className="news-pop__tag">Новости и спецпредложения</div>
              <h3 className="news-pop__h">Подпишитесь и&nbsp;получите <em>−10%</em> на&nbsp;первую поставку</h3>
              <p className="news-pop__sub">Раз в&nbsp;месяц&nbsp;— новинки серий, акции и&nbsp;технические решения. Бонусом&nbsp;— скидка на&nbsp;первый заказ и&nbsp;участие в&nbsp;программе лояльности.</p>
              <form className="news-pop__form" onSubmit={submit}>
                <input className="news-pop__input" name="Имя" placeholder="Имя *" required />
                <input className="news-pop__input" name="Телефон" type="tel" placeholder="Телефон (необязательно)" />
                <input className="news-pop__input" name="E-mail" type="email" placeholder="E-mail *" required />
                <input className="news-pop__input" name="ИНН" placeholder="ИНН организации (необязательно)" />
                <label className="news-pop__check">
                  <input type="checkbox" required defaultChecked />
                  <span>Согласен на обработку персональных данных согласно <a href="policy.html" target="_blank" rel="noopener">политике конфиденциальности</a> и&nbsp;на&nbsp;получение рассылки.</span>
                </label>
                {status === 'error' && <p className="news-pop__err">Не удалось отправить. Попробуйте ещё раз или напишите на info@shtarkink.com.</p>}
                <button type="submit" className="btn btn--primary btn--lg news-pop__submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Отправляем…' : <>Получить скидку −10% <span className="btn__arrow">→</span></>}
                </button>
                <button type="button" className="news-pop__decline" onClick={dismiss}>Нет, спасибо</button>
              </form>
            </>
          )}
        </div>

        <button className="news-pop__x" aria-label="Закрыть" onClick={dismiss}>×</button>
      </div>
    </div>
  );
};

window.SI_NewsletterPopup = NewsletterPopup;
