/* ============================================================
   Shtark INK — Part 1: Header, Hero, Catalog, Calculator
============================================================ */

const { useState, useMemo } = React;

// ---------- HEADER ----------
const Header = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="hdr" data-screen-label="01 Header">
      <div className="wrap hdr__row">
        <a href="#top" className="hdr__logo" onClick={close}>
          <img src="shtark-ink/img/logo.png" alt="Shtark INK" style={{ height: 51, width: 'auto', display: 'block' }} />
          <span className="tag" style={{ fontWeight: "900" }}></span>
        </a>
        <nav className={'hdr__nav' + (open ? ' is-open' : '')} onClick={close}>
          <a href="#production" className="hdr__prod">
            Производство
            <span className="hdr__slogan" aria-hidden="true"></span>
          </a>
          <div className="hdr__drop">
            <button type="button" className="hdr__drop-trigger" onClick={(e) => e.stopPropagation()} aria-haspopup="true">
              Продукция <span className="hdr__drop-caret" aria-hidden="true">▾</span>
            </button>
            <div className="hdr__drop-menu">
              <a href="#catalog">Каталог красок Shtark&nbsp;INK</a>
              <a href="syrye.html">Каталог сырья</a>
            </div>
          </div>
          <a href="#clients">Клиентам</a>
          <a href="#dealers">Дилерам</a>
          <a href="#lab">Лаборатория</a>
          <a href="#team">Команда</a>
          <a href="#suppliers">Поставщикам</a>
          <a href="#careers">Вакансии</a>
          <a href="news.html">Новости</a>
          <a href="#contact">Контакты</a>
        </nav>
        <div className="hdr__lang" role="group" aria-label="Language">
          <select className="hdr__lang-select" aria-label="Language" defaultValue="ru" onChange={(e) => window.__switchLang ? window.__switchLang(e.target.value) : (window.__setLang && window.__setLang(e.target.value))}>
            <option value="ru">Russian</option>
            <option value="en">English</option>
            <option value="kk">Kazakh</option>
            <option value="zh">Chinese</option>
          </select>
        </div>
        <button
          type="button"
          className={'hdr__burger' + (open ? ' is-open' : '')}
          aria-label="Меню"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
};

// ---------- HERO ----------
const Hero = () =>
<section className="hero" id="top" data-screen-label="02 Hero">
    <div className="wrap">
      <div className="hero__grid">
        <div>
          <span className="chip chip--accent">ЗАВОД-ПРОИЗВОДИТЕЛЬ · СОБСТВЕННАЯ КОЛОРИСТИКА</span>
          <h1 className="hero__title">
            Спиртовые флексокраски&nbsp;
            <em>Shtark INK</em>
            &nbsp;для высокоскоростной печати упаковки.
          </h1>
          <p className="hero__sub">
            Стабильный цвет от партии к&nbsp;партии. Низкое удержание растворителя без&nbsp;запаха.
            Подача от&nbsp;1&nbsp;дня. Бесплатные образцы и&nbsp;выезд технолога на ваше производство.
          </p>
          <div className="hero__cta">
            <a href="#request" className="btn btn--primary btn--lg">Получить бесплатные образцы <span className="btn__arrow">→</span></a>
            <a href="#catalog" className="btn btn--ghost btn--lg">Каталог красок</a>
          </div>

          <div className="hero__strip">
            <div className="hero__strip-item">
              <div className="hero__strip-label">Доставка</div>
              <div className="hero__strip-text">По всей РФ от&nbsp;1 дня, складские запасы&nbsp;200&nbsp;т</div>
            </div>
            <div className="hero__strip-item">
              <div className="hero__strip-label">Импортозамещение</div>
              <div className="hero__strip-text">Российское сырьё, не&nbsp;зависим от&nbsp;санкций</div>
            </div>
            <div className="hero__strip-item">
              <div className="hero__strip-label">Колористика</div>
              <div className="hero__strip-text">Pantone color-matching под&nbsp;ваш&nbsp;анилокс</div>
            </div>
          </div>
        </div>

        <div className="hero__visual">
          <image-slot
          id="hero-flexo"
          src="shtark-ink/img/hero.png"
          style={{ width: '100%', aspectRatio: '4/5', height: 'auto', display: 'block' }}
          shape="rounded"
          radius="14"
          placeholder="ИИ-фото: флексомашина в работе · фокус на ракельной камере. Перетащите файл, чтобы заменить заглушку.">
        </image-slot>
          <div className="hero__visual-badge">
            <div className="hero__visual-badge-dot" />
            <div className="hero__visual-badge-text">
              Работаем со скоростями печати<br />
              от&nbsp;400&nbsp;м/мин на&nbsp;ПП·ПЭ·ПЭТ
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>;


// ---------- INTRO BAND (full-bleed photo) ----------
const IntroBand = () =>
<section className="introband" data-screen-label="01b Intro band" aria-label="Производство Shtark INK">
    <div className="introband__media">
      <image-slot
      id="introband-photo"
      src="shtark-ink/img/banner-2.jpg"
      class="introband__img"
      style={{ width: '100%', height: '100%', display: 'block' }}
      shape="rect"
      placeholder="ИИ-фото: цех или лаборатория Shtark INK во всю ширину (без наложенного текста). Перетащите файл, чтобы заменить.">
      </image-slot>
    </div>
  </section>;
window.SI_IntroBand = IntroBand;


// ---------- CATALOG ----------
const CATALOG = [
{
  num: '01',
  title: 'Серия SURF',
  sub: 'Поверхностная печать',
  desc: 'Органорастворимая серия красок на&nbsp;нитроцеллюлозно-полиуретановой основе. Рекомендована для&nbsp;поверхностной печати по&nbsp;широкому спектру материалов гибкой упаковки.',
  chips: ['NC / PU основа', 'Поверхностная печать', 'Гибкая упаковка', 'Высокий глянец'],
  slotId: 'cat-laquer',
  img: 'shtark-ink/img/cat-laquer-real.webp',
  tech: 'surf-tech.html',
  ph: 'ИИ-фото: евроведро 20 кг с этикеткой Shtark INK SURF на белом фоне склада'
},
{
  num: '02',
  title: 'Серия UNI',
  sub: 'Универсальная',
  desc: 'Универсальная органорастворимая серия на&nbsp;нитроцеллюлозно-полиуретановой основе. Для&nbsp;межслойной и&nbsp;поверхностной печати по&nbsp;широкому спектру материалов гибкой упаковки.',
  chips: ['NC / PU основа', 'Межслойная + поверхн.', 'Универсальная', 'Гибкая упаковка'],
  slotId: 'cat-lamfit',
  img: 'shtark-ink/img/cat-lamfit-real.webp',
  tech: 'uni-tech.html',
  ph: 'ИИ-фото: металлическая бочка 200 кг с этикеткой Shtark INK UNI · технический бокэ-фон'
},
{
  num: '03',
  title: 'Серия LAM',
  sub: 'Под ламинацию',
  desc: 'Органорастворимая высокопигментированная серия на&nbsp;основе NC&nbsp;/&nbsp;PU связующего. Предназначена для&nbsp;межслойной печати по&nbsp;широкому спектру запечатываемых материалов.',
  chips: ['NC / PU связующее', 'Высокопигментир.', 'Межслойная печать', 'Под ламинацию'],
  slotId: 'cat-surface',
  img: 'shtark-ink/img/cat-surface-real.webp',
  tech: 'lam-tech.html',
  ph: 'ИИ-фото: ряд канистр 11,6 кг Shtark INK LAM на стеллаже склада'
},
{
  num: '04',
  title: 'Серия TOP',
  sub: 'Премиальная межслойная',
  desc: 'Органорастворимая высокопигментированная серия на&nbsp;основе модифицированного полиуретанового связующего. Для&nbsp;межслойной печати по&nbsp;широкому спектру запечатываемых материалов.',
  chips: ['Модифиц. PU', 'Высокопигментир.', 'Межслойная печать', 'Премиум-сегмент'],
  slotId: 'cat-top',
  img: 'shtark-ink/img/cat-top.jpg',
  tech: 'top-tech.html',
  ph: 'ИИ-фото: ведро высокопигментированной краски Shtark INK TOP, насыщенный цвет'
},
{
  num: '05',
  title: 'Серия PC BASE',
  sub: 'Монопигментные концентраты',
  desc: 'Серия органорастворимых монопигментных концентратов на&nbsp;основе нитроцеллюлозы и&nbsp;комплекса органических растворителей. Для&nbsp;составления и&nbsp;коррекции рецептур.',
  chips: ['NC основа', 'Монопигментные', 'CMYK + база', 'Для колеровки'],
  slotId: 'cat-pcbase',
  img: 'shtark-ink/img/cat-pcbase.jpg',
  tech: 'pcbase-tech.html',
  ph: 'ИИ-фото: набор бутылей монопигментных концентратов Shtark INK PC BASE по цветам CMYK'
},
{
  num: '06',
  title: 'Серия LAQUER',
  sub: 'Технологические лаки',
  desc: 'Матовые и&nbsp;глянцевые органорастворимые лаки для&nbsp;финиш-секций. Защищают оттиск, формируют тактильную поверхность, сохраняют печатные свойства.',
  chips: ['Матовый · Глянец', 'Защита оттиска', 'Прозрачные', 'Финиш-секция'],
  slotId: 'cat-laquer6',
  img: 'shtark-ink/img/cat-laquer6.jpg',
  tech: 'laquer-tech.html',
  ph: 'ИИ-фото: канистры матового и глянцевого лака Shtark INK LAQUER на складе'
}];


const Catalog = () =>
<section className="section section--tight" id="catalog" data-screen-label="03 Catalog">
    <div className="wrap">
      <div className="cat__intro">
        <div className="cat__intro-head">
          <div className="section__tag">Каталог продукции</div>
          <h2 className="section__title">Спиртовые краски и&nbsp;лаки для&nbsp;высокоскоростной флексо- и&nbsp;ротогравюрной&nbsp;печати</h2>
        </div>
        <div className="cat__intro-body">
          <p>Компания «ШТАРК ИНК» производит спирторастворимые краски и&nbsp;лаки для&nbsp;флексографической и&nbsp;ротогравюрной печати. Купить краску для&nbsp;печати на&nbsp;гибкой упаковке можно напрямую у&nbsp;производителя&nbsp;— оптом и&nbsp;со&nbsp;склада в&nbsp;Углово.</p>
          <p>Производство осуществляется на&nbsp;высокопроизводительном оборудовании в&nbsp;полуавтоматическом режиме, что обеспечивает высокое и&nbsp;стабильное качество от&nbsp;партии к&nbsp;партии. Рецептуры красок дают превосходные технико-печатные свойства на&nbsp;длинных тиражах, отличную колористику, высокий блеск и&nbsp;прозрачность оттиска.</p>
          <p>Краски совместимы с&nbsp;бессольвентными и&nbsp;сольвентными клеевыми системами и&nbsp;обеспечивают высокую прочность ламинационных структур.</p>
          <p>В&nbsp;собственной научно-исследовательской лаборатории специалисты тестируют сырьё и&nbsp;разрабатывают новые продукты и&nbsp;решения для&nbsp;наших клиентов.</p>
          <p className="cat__intro-article"><b>Научный подход к&nbsp;производству.</b> Как мы&nbsp;улучшали пигментацию, «чистую» печать растра и&nbsp;ламинационные свойства&nbsp;— читайте в&nbsp;статье о&nbsp;разработке серии&nbsp;UNI. <a href="news-uni.html">Спирторастворимые краски серии UNI: тривиальное название, оригинальные свойства&nbsp;→</a></p>
        </div>
      </div>

      <div className="cat__grid">
        {CATALOG.map((c) => <article className="cat__card" key={c.num}>
            <image-slot id={c.slotId}
          src={c.img || `shtark-ink/img/${c.slotId}.png`}
          class="cat__card-img"
          style={{ width: '100%', aspectRatio: '4/3', height: 'auto', display: 'block' }}
          shape="rect"
          placeholder={c.ph}>
        </image-slot>
            <div className="cat__card-body">
              <div className="cat__card-num">{c.num} · {c.sub}</div>
              <h3 className="cat__card-title">{c.tech ? <a href={c.tech} className="cat__card-title-link">{c.title}</a> : c.title}</h3>
              <p className="cat__card-desc" dangerouslySetInnerHTML={{ __html: c.desc }} />
              <div className="cat__chips">
                {c.chips.map((ch) => <span className="chip" key={ch}>{ch}</span>)}
              </div>
              <div className="cat__card-foot">
                {c.tech ?
                <a href={c.tech} className="btn btn--primary">Техническая информация</a> :
                <a href="#request" className="btn btn--primary">Паспорт качества</a>}
                <button type="button" className="cat__sample" onClick={() => window.dispatchEvent(new CustomEvent('open-form-modal', { detail: {
                  tag: 'Образец продукции',
                  kind: 'Заявка на образец · ' + c.title,
                  subject: 'Заявка на образец (' + c.title + ') — сайт Shtark INK',
                  title: 'Заказать образец',
                  subtitle: 'Бесплатный тестовый образец ' + c.title + ' под ваш материал. Технолог свяжется в рабочее время.',
                  cta: 'Заказать образец',
                  successText: 'Заявка на образец принята. Технолог Shtark INK свяжется с вами в рабочее время.',
                  fields: [
                    { name: 'Продукт', label: 'Продукт', value: c.title, required: true },
                    { name: 'Имя', label: 'Имя', placeholder: 'Иван Петров', required: true },
                    { name: 'Телефон', label: 'Телефон', type: 'tel', placeholder: '+7 (___) ___-__-__', required: true },
                    { name: 'E-mail', label: 'E-mail', type: 'email', placeholder: 'you@company.ru', required: true },
                    { name: 'Материал · задача', label: 'Материал · задача (необязательно)', placeholder: 'ПЭТ 30 мкм, ламинация', textarea: true }
                  ]
                } }))}>Образец</button>
                <button type="button" className="cat__price" onClick={() => window.dispatchEvent(new CustomEvent('open-form-modal', { detail: {
                  tag: 'Прайс-лист',
                  kind: 'Запрос прайса · ' + c.title,
                  subject: 'Запрос прайс-листа (' + c.title + ') — сайт Shtark INK',
                  title: 'Получить прайс-лист',
                  subtitle: 'Пришлём актуальный прайс на ' + c.title + ' и условия. Технолог свяжется в рабочее время.',
                  cta: 'Получить прайс',
                  successText: 'Запрос принят. Менеджер Shtark INK пришлёт актуальный прайс и свяжется с вами.',
                  fields: [
                    { name: 'Серия', label: 'Серия', value: c.title, required: true },
                    { name: 'Имя', label: 'Имя', placeholder: 'Иван Петров', required: true },
                    { name: 'Телефон', label: 'Телефон', type: 'tel', placeholder: '+7 (___) ___-__-__', required: true },
                    { name: 'E-mail', label: 'E-mail', type: 'email', placeholder: 'you@company.ru', required: true }
                  ]
                } }))}>Прайс →</button>
              </div>
            </div>
          </article>
      )}
      </div>
    </div>
  </section>;


// ---------- DEALERS (regional partnership) ----------
const DEALER_DOCS = `
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
  `;
const DEALER_FAQ = [
  ['Какие требования к дилеру?', 'Дилером может стать компания (юрлицо или ИП), уже работающая с производителями гибкой упаковки и поставляющая расходные материалы для печати, либо готовая развивать это направление. Важны активная клиентская база в регионе и собственный склад/логистика.'],
  ['Какой минимальный объём закупки для дилерства?', 'Объём для получения дилерского статуса и шкала скидок зависят от региона и направления. Конкретные пороги менеджер согласует индивидуально при обсуждении договора.'],
  ['Закрепляете ли территорию эксклюзивно?', 'Да. За официальным дилером закрепляется регион — вы становитесь единственным авторизованным поставщиком Shtark INK на своей территории при выполнении согласованного плана отгрузок.'],
  ['Какая отсрочка платежа?', 'Отсрочка платежа — до 45 дней по договору. Оплата — только безналичная.'],
  ['Какие документы нужны для дилерского договора?', DEALER_DOCS],
];

const Dealers = () => {
  const benefits = [
    ['%', 'Дилерская цена', 'Прямые отгрузки с завода по специальной дилерской цене и прогрессивной шкале скидок от объёма.'],
    ['◎', 'Эксклюзив по региону', 'Закрепляем за вами территорию — вы единственный официальный поставщик Shtark INK в регионе.'],
    ['↗', 'Маркетинг и образцы', 'Бесплатные тестовые образцы, POS-материалы, обучение и совместное продвижение у ваших клиентов.'],
    ['⚙', 'Техническая поддержка', 'Наш технолог выезжает к вашим клиентам, подбирает рецептуры и настраивает краску на станке.'],
  ];
  const dealerForm = {
    tag: 'Дилерам',
    kind: 'Заявка дилера',
    subject: 'Заявка дилера — сайт Shtark INK',
    title: 'Стать дилером Shtark INK',
    subtitle: 'Закрепим за вами регион и пришлём дилерские условия. Менеджер свяжется в рабочее время.',
    cta: 'Запросить дилерские условия',
    successText: 'Заявка принята. Менеджер Shtark INK свяжется с вами и пришлёт дилерские условия.',
    fields: [
      { name: 'Компания', label: 'Компания', placeholder: 'ООО «Ваша компания»', required: true },
      { name: 'Регион', label: 'Регион / город', placeholder: 'напр. Москва', required: true },
      { name: 'Имя', label: 'Контактное лицо', placeholder: 'Иван Петров', required: true },
      { name: 'Телефон', label: 'Телефон', type: 'tel', placeholder: '+7 (___) ___-__-__', required: true },
      { name: 'E-mail', label: 'E-mail', type: 'email', placeholder: 'you@company.ru', required: true },
      { name: 'Комментарий', label: 'Комментарий (направление, объёмы)', placeholder: 'Поставляем расходники типографиям, объём…', textarea: true }
    ]
  };
  const openDealer = () => window.dispatchEvent(new CustomEvent('open-form-modal', { detail: dealerForm }));
  return (
    <section className="section" id="dealers" data-screen-label="04 Dealers">
      <div className="wrap">
        <div className="dealers">
          <div className="dealers__grid">
            <div className="dealers__lead">
              <div className="dealers__tag">Региональным дилерам</div>
              <h2 className="dealers__title">Станьте официальным дилером <em>Shtark INK</em> в&nbsp;своём регионе.</h2>
              <p className="dealers__text">
                Приглашаем к&nbsp;долгосрочному и&nbsp;выгодному сотрудничеству компании, поставляющие расходные материалы производителям гибкой упаковки. Растущий российский продукт без&nbsp;зависимости от&nbsp;импорта&nbsp;— стабильные поставки и&nbsp;высокая маржинальность. Поставляете сырьё и&nbsp;тару? Смотрите условия <a href="#suppliers">для&nbsp;поставщиков</a>.
              </p>
              <div className="dealers__stats">
                <div className="dealers__stat">
                  <div className="dealers__stat-num">45 дней</div>
                  <div className="dealers__stat-lbl">отсрочка платежа</div>
                </div>
                <div className="dealers__stat">
                  <div className="dealers__stat-num">200 т</div>
                  <div className="dealers__stat-lbl">складской запас</div>
                </div>
              </div>
              <div className="dealers__cta">
                <button type="button" className="btn btn--primary btn--lg" onClick={openDealer}>Стать дилером <span className="btn__arrow">→</span></button>
                <button type="button" className="btn btn--ghost-on-dark btn--lg" onClick={openDealer}>Запросить условия</button>
              </div>
            </div>
            <div className="dealers__cards">
              {benefits.map((b, i) => (
                <div className="dealers__card" key={i}>
                  <div className="dealers__card-ico">{b[0]}</div>
                  <h3 className="dealers__card-title">{b[1]}</h3>
                  <p className="dealers__card-desc">{b[2]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button type="button" className="dealers__banner" onClick={openDealer} aria-label="Стать дилером — оставить заявку">
          <img src="shtark-ink/img/dealer-banner.jpg" alt="Стать дилером Shtark INK — прямые отгрузки, региональный эксклюзив, поддержка продаж" />
        </button>

        <div className="dealers__deck-wrap">
          <a className="sup__deck" href="dealers-presentation.html" target="_blank" rel="noopener">
            <span className="sup__deck-ic">↓</span>
            <span className="sup__deck-txt">Скачать презентацию для дилеров<span className="sup__deck-sub">Условия, маржа, научный подход, скорость и поддержка продаж</span></span>
            <span className="sup__deck-arrow">→</span>
          </a>
        </div>

        <div className="cli__faq" style={{ marginTop: 56 }}>
          <h3 className="cli__faq-h">Частые вопросы дилеров</h3>
          {DEALER_FAQ.map(([q, a], i) => (
            <details className="cli__faq-item" key={i} open={i === 0}>
              <summary>{q}</summary>
              <div className="cli__faq-body" dangerouslySetInnerHTML={{ __html: a }} />
            </details>
          ))}
          <div className="cli__legal">
            <a href="policy.html" target="_blank" rel="noopener">Договор оферты →</a>
            <a href="policy.html" target="_blank" rel="noopener">Политика конфиденциальности →</a>
            <a href="policy.html#consent" target="_blank" rel="noopener">Согласие на обработку данных →</a>
          </div>
        </div>
      </div>
    </section>
  );
};

// ---------- CAROUSEL ----------
const BANNERS = [
{ src: 'shtark-ink/img/banner-1.jpg', alt: 'Краска серии UNI White' },
{ src: 'shtark-ink/img/banner-5.jpg', alt: 'Shtark INK · Flexographic Inks · Precision · Performance' },
{ src: 'shtark-ink/img/banner-2.jpg', alt: 'Высококачественные краски для гибкой упаковки' },
{ src: 'shtark-ink/img/banner-3.jpg', alt: 'Матовый полиграфический лак серии TOP-MATT' },
{ src: 'shtark-ink/img/banner-6.jpg', alt: 'Высококачественные краски Shtark INK для гибкой упаковки' }];


const Carousel = () => {
  const [idx, setIdx] = React.useState(0);
  const [prevIdx, setPrevIdx] = React.useState(-1);
  const [paused, setPaused] = React.useState(false);
  const [visTick, setVisTick] = React.useState(0);
  const total = BANNERS.length;
  const SLIDE_MS = 5500;

  const go = React.useCallback((n) => {
    setIdx((cur) => {
      const next = (n % total + total) % total;
      if (next === cur) return cur;
      setPrevIdx(cur);
      return next;
    });
  }, [total]);

  // Autoplay via setTimeout — resilient to background-tab throttling.
  // (The old requestAnimationFrame loop froze on hidden tabs, so the
  //  carousel stopped advancing when the tab lost focus.)
  React.useEffect(() => {
    if (paused) return undefined;
    const t = setTimeout(() => go(idx + 1), SLIDE_MS);
    return () => clearTimeout(t);
  }, [idx, paused, go, visTick]);

  // Restart the timer cleanly when the tab becomes visible again.
  React.useEffect(() => {
    const onVis = () => { if (!document.hidden) setVisTick((v) => v + 1); };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return (
    <section
      className="carousel"
      id="top"
      data-screen-label="01 Carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      
      <div className="carousel__track">
        {BANNERS.map((b, i) => {
          const cls = 'carousel__slide' + (
          i === idx ? ' is-active' : '') + (
          i === prevIdx ? ' is-prev' : '');
          return (
            <div key={i} className={cls}>
              <img className="carousel__img" src={b.src} alt={b.alt} loading="eager" decoding="async" />
            </div>);

        })}
      </div>

      <button className="carousel__arrow carousel__arrow--prev" aria-label="Предыдущий слайд" onClick={() => go(idx - 1)}>‹</button>
      <button className="carousel__arrow carousel__arrow--next" aria-label="Следующий слайд" onClick={() => go(idx + 1)}>›</button>

      <div className="carousel__dots" role="tablist" aria-label="Слайды">
        {BANNERS.map((_, i) =>
        <button
          key={i}
          className={'carousel__dot' + (i === idx ? ' is-active' : '')}
          aria-label={`Слайд ${i + 1}`}
          aria-selected={i === idx}
          onClick={() => go(i)} />

        )}
      </div>

      <div className="carousel__progress">
        <div
          className="carousel__progress-bar"
          key={idx + '-' + visTick}
          style={{ animationDuration: SLIDE_MS + 'ms', animationPlayState: paused ? 'paused' : 'running' }} />
      </div>
    </section>);

};

// ---------- PRODUCTION ----------
const PRODUCTION_STEPS = [
  {
    n: '01',
    slot: 'prod-1',
    img: 'shtark-ink/img/prod-svetlana.jpg',
    title: 'Входной контроль сырья',
    ph: 'Фото: приёмка сырья на складе, лаборант проверяет партию пигментов и смол',
    text: 'Каждая партия сырья — пигменты, нитроцеллюлоза, полиуретановые смолы, растворители — проходит входной контроль в лаборатории. Вязкость, сухой остаток и цветовые характеристики проверяются до запуска в производство: начальник лаборатории Светлана лично следит за тем, чтобы в работу шло только проверенное сырьё.',
  },
  {
    n: '02',
    slot: 'prod-2',
    img: 'shtark-ink/img/prod-disp.jpg',
    title: 'Диспергирование и синтез',
    ph: 'Фото: бисерная мельница / диспергатор в производственном цехе',
    text: 'Тщательное измельчение пигмента ведётся на высококлассном оборудовании европейского и азиатского производства в полуавтоматическом режиме. На этапе диспергирования и синтеза действует постоянный лабораторный контроль, а распределение частиц по размеру проверяется лазерным дифрактометром — это даёт высокую насыщенность и прозрачность готовой краски. Операторы регулярно проходят обучение работе с оборудованием.',
  },
  {
    n: '03',
    slot: 'prod-3',
    img: 'shtark-ink/img/prod-color.jpg',
    title: 'Колеровка и контроль цвета',
    ph: 'Фото: колорист сверяет оттиск со спектрофотометром X-Rite',
    text: 'Качество краски закладывается на каждом шаге: продукция проходит многоступенчатый лабораторный контроль на всех этапах — от сырья до готового продукта. Колористика проверяется на спектрофотометре X-Rite, и по нашим нормам цветовое отличие от эталона не превышает 1,5 единицы — цвет стабилен от партии к партии. Перед отгрузкой каждая партия проходит выходной контроль и сопровождается паспортом качества: мы отгружаем только то, в чём уверены сами.',
  },
  {
    n: '04',
    slot: 'prod-4',
    img: 'shtark-ink/img/prod-ship.jpg',
    title: 'Фасовка и отгрузка',
    ph: 'Фото: фасовка краски в вёдра и бочки, маркировка партии на складе',
    text: 'Пока одни выдумывают идеальную краску, другие уже зарабатывают на нашей. Фасуем под любой объём: вёдра 20 и 25 кг, бочки 180 и 200 кг — с маркировкой партии и паспортом качества. Организуем доставку «от двери до двери» по всей РФ и СНГ в кратчайшие сроки: складские запасы и собственная логистика позволяют отгружать быстро. Меньше разговоров — больше отгрузок.',
  },
];

const Production = () =>
<section className="section section--tint" id="production" data-screen-label="03 Production">
    <div className="wrap">
      <div className="cat__intro">
        <div className="cat__intro-head">
          <div className="section__tag">Производство</div>
          <h2 className="section__title">Полный цикл&nbsp;— от&nbsp;входного контроля сырья до&nbsp;отгрузки готовой краски</h2>
        </div>
        <div className="cat__intro-body">
          <p>Производство «ШТАРК&nbsp;ИНК» построено как непрерывный технологический цикл на&nbsp;высокопроизводительном оборудовании в&nbsp;полуавтоматическом режиме.</p>
          <p>Такой подход обеспечивает высокое и&nbsp;стабильное качество от&nbsp;партии к&nbsp;партии, минимизирует человеческий фактор и&nbsp;позволяет точно воспроизводить рецептуры на&nbsp;длинных тиражах.</p>
          <p>На&nbsp;каждом этапе&nbsp;— от&nbsp;приёмки сырья до&nbsp;фасовки&nbsp;— действует лабораторный контроль ключевых параметров: вязкости, сухого остатка и&nbsp;колористики. Подробнее о&nbsp;контроле качества&nbsp;— в&nbsp;разделе <a href="#lab">«Лаборатория»</a>.</p>
        </div>
      </div>
    </div>

    <div className="wrap">
      <div className="prod-rows">
        {PRODUCTION_STEPS.map((s, i) =>
        <article className={'prod-row' + (i % 2 === 1 ? ' prod-row--rev' : '')} key={s.n}>
          <image-slot id={s.slot}
            src={s.img || undefined}
            class="prod-row__img"
            style={{ width: '100%', aspectRatio: '16/10', height: 'auto', display: 'block' }}
            shape="rounded"
            radius="12"
            placeholder={s.ph}>
          </image-slot>
          <div className="prod-row__body">
            <div className="prod-row__num">Этап {s.n}</div>
            <h3 className="prod-row__title">{s.title}</h3>
            <p className="prod-row__text">{s.text}</p>
          </div>
        </article>
        )}
      </div>
    </div>
  </section>;


// ---------- INK CONSUMPTION CALCULATOR (CMYK themed) ----------
const CALC_WORKER = 'https://shtark-form.minionslaba.workers.dev/';

const InkCalc = () => {
  const [run, setRun] = React.useState('');
  const [width, setWidth] = React.useState('');
  const [coverage, setCoverage] = React.useState(40);
  const [anilox, setAnilox] = React.useState('4.0');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState('idle');

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const fd = new FormData();
    fd.append('_subject', 'Расчёт расхода краски — сайт Shtark INK');
    fd.append('Тип заявки', 'Калькулятор расхода краски');
    fd.append('Имя', name);
    fd.append('Телефон', phone);
    fd.append('E-mail', email);
    fd.append('Тираж, м.п.', run || '—');
    fd.append('Ширина запечатки, мм', width || '—');
    fd.append('Запечатка, %', coverage + '%');
    fd.append('Краскоперенос анилокса, см³/м²', anilox || '—');
    try {
      const res = await fetch(CALC_WORKER, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      if (res.ok) { setStatus('ok'); } else setStatus('error');
    } catch (err) { setStatus('error'); }
  };

  return (
    <section className="section" id="calc" data-screen-label="04 Calculator">
      <div className="wrap">
        <div className="section__head">
          <div className="section__head-text">
            <div className="section__tag">Онлайн-калькулятор</div>
            <h2 className="section__title">Online расчёт расхода краски Shtark&nbsp;INK</h2>
          </div>
          <p className="section__sub">Заполните параметры тиража и&nbsp;контакты&nbsp;— технолог рассчитает точный расход под&nbsp;ваш материал, анилокс и&nbsp;дизайн. Серию краски поможет выбрать <a href="#catalog">каталог продукции</a>.</p>
        </div>

        <div className="calc">
          <div className="calc__cmyk">
            <span className="calc__chip calc__chip--c">C</span>
            <span className="calc__chip calc__chip--m">M</span>
            <span className="calc__chip calc__chip--y">Y</span>
            <span className="calc__chip calc__chip--k">K</span>
          </div>

          {status === 'ok' ? (
            <div className="calc__done">
              <div className="calc__done-ic">✓</div>
              <h3 className="calc__done-h">Заявка на&nbsp;расчёт принята</h3>
              <p className="calc__done-p">Для&nbsp;уточнения расчёта с&nbsp;вами свяжется технолог компании Shtark&nbsp;INK. Мы&nbsp;учтём тип материала, дизайн и&nbsp;параметры вашего оборудования, чтобы расход был&nbsp;точным.</p>
              <button type="button" className="btn btn--dark" onClick={() => setStatus('idle')}>Новый расчёт</button>
            </div>
          ) : (
            <form className="calc__form" onSubmit={submit}>
              <div className="calc__grid">
                <div className="calc__field calc__field--c">
                  <label className="calc__label">Тираж, м.п.</label>
                  <input className="calc__input" type="number" min="0" inputMode="numeric" placeholder="например, 10000" value={run} onChange={(e) => setRun(e.target.value)} required />
                </div>
                <div className="calc__field calc__field--m">
                  <label className="calc__label">Ширина запечатки, мм</label>
                  <input className="calc__input" type="number" min="0" inputMode="numeric" placeholder="например, 330" value={width} onChange={(e) => setWidth(e.target.value)} required />
                </div>
                <div className="calc__field calc__field--y">
                  <label className="calc__label">Площадь запечатки: <b>{coverage}%</b></label>
                  <input className="calc__range" type="range" min="5" max="100" step="5" value={coverage} onChange={(e) => setCoverage(+e.target.value)} />
                </div>
                <div className="calc__field calc__field--k">
                  <label className="calc__label">Краскоперенос анилокса, см³/м²</label>
                  <input className="calc__input" type="number" min="0" step="0.1" inputMode="decimal" placeholder="например, 4.0" value={anilox} onChange={(e) => setAnilox(e.target.value)} required />
                </div>
              </div>

              <div className="calc__contact">
                <div className="calc__contact-h">Куда отправить расчёт</div>
                <div className="calc__grid calc__grid--3">
                  <div className="calc__field">
                    <label className="calc__label">Имя *</label>
                    <input className="calc__input" type="text" placeholder="Иван Петров" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="calc__field">
                    <label className="calc__label">Телефон *</label>
                    <input className="calc__input" type="tel" placeholder="+7 (___) ___-__-__" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                  <div className="calc__field">
                    <label className="calc__label">E-mail *</label>
                    <input className="calc__input" type="email" placeholder="you@company.ru" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>
              </div>

              <label className="calc__check">
                <input type="checkbox" required defaultChecked />
                <span>Согласен на&nbsp;обработку персональных данных согласно <a href="policy.html" target="_blank" rel="noopener">политике конфиденциальности</a>.</span>
              </label>

              {status === 'error' && <p className="calc__err">Не&nbsp;удалось отправить. Попробуйте ещё&nbsp;раз или напишите на&nbsp;info@shtarkink.com.</p>}

              <button type="submit" className="btn btn--primary btn--lg calc__submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Отправляем…' : <>Рассчитать расход <span className="btn__arrow">→</span></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

window.SI_Header = Header;
window.SI_Hero = Hero;
window.SI_Catalog = Catalog;
window.SI_InkCalc = InkCalc;
window.SI_Production = Production;
window.SI_Calculator = Dealers;
window.SI_TopBanner = Carousel;