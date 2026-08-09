import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Menu, X, Star, ChevronDown, ArrowRight, Check, Minus,
  Car, Clock, Users, Award, ShieldCheck, Smartphone,
  Send, MessageCircle, Phone, MapPin, Loader2,
} from "lucide-react";
// lucide-react 1.x removed brand/logo icons (Instagram, etc.) — see src/icons/Instagram.jsx
import Instagram from "./icons/Instagram.jsx";

/* ---------------------------------------------------------------
   KANSAM — автошкола, Алматы
   Design direction: "Дорожная разметка" — глубокий дорожный синий
   переходящий в янтарный свет фар. Пунктирная линия разметки —
   сквозной сигнатурный элемент (навбар-прогресс, коннекторы шагов,
   рамки карточек).
--------------------------------------------------------------- */

const ACCENT_FROM = "#1D4ED8";
const ACCENT_TO = "#F59E0B";

const HERO_IMG = "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1920&q=90";
const DASH_IMG = "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=90";
const ROAD_IMG = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1920&q=90";

const AVATARS = [
  "1494790108755-2616b612b786",
  "1507003211169-0a1dd7228f2d",
  "1438761681033-6461ffad8d80",
  "1500648767791-00dcc994a43e",
  "1534528741775-53994a69daeb",
];
const av = (id, w = 200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=90`;

const TYPE_WORDS = ["уверенно", "спокойно", "без нервов", "с удовольствием"];

/* ---------------- Reveal-on-scroll hook (global observer) ---------------- */
function useRevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ---------------- Count-up stat ---------------- */
function StatNumber({ value, suffix = "", duration = 2200 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
            const tick = (now) => {
              const t = Math.min(1, (now - start) / duration);
              setDisplay(Math.round(easeOutExpo(t) * value));
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className="stat-number">
      {display}
      {suffix}
    </span>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [typeIndex, setTypeIndex] = useState(0);
  const [parallax, setParallax] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [installment, setInstallment] = useState(true); // true = рассрочка, false = сразу
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  useRevealObserver();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      setParallax(window.scrollY * 0.3);
      const h = document.documentElement;
      const pct = (window.scrollY / (h.scrollHeight - h.clientHeight)) * 100;
      setScrollPct(isFinite(pct) ? pct : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setTypeIndex((i) => (i + 1) % TYPE_WORDS.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const handleEmailSubmit = useCallback((e) => {
    e.preventDefault();
    setEmailSubmitting(true);
    setTimeout(() => {
      setEmailSubmitting(false);
      setEmailSent(true);
    }, 1400);
  }, []);

  const navLinks = [
    { label: "Курсы", href: "#features" },
    { label: "Как это работает", href: "#how" },
    { label: "Отзывы", href: "#testimonials" },
    { label: "Тарифы", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  const features = [
    {
      icon: Users,
      title: "Личный инструктор на весь курс",
      desc: "Один инструктор от первого занятия до экзамена. Он подстраивается под ваш темп, помнит ваши слабые места и не тратит время на повторное знакомство.",
    },
    {
      icon: Car,
      title: "Автопарк 2023–2025 года",
      desc: "Hyundai Accent и Kia Rio с МКПП и АКПП, дублирующие педали и кондиционер в каждой машине.",
    },
    {
      icon: Clock,
      title: "Гибкое расписание",
      desc: "Утро, день, вечер и выходные. Перенос занятия бесплатно при отмене за 2 часа.",
    },
    {
      icon: ShieldCheck,
      title: "Бесплатная пересдача теории",
      desc: "Не сдали экзамен в ГАИ с первого раза — вторая попытка и дополнительное занятие с инструктором за счёт школы.",
    },
    {
      icon: Smartphone,
      title: "Теория в мобильном приложении",
      desc: "Лекции, билеты и разбор ошибок доступны 24/7 — готовьтесь в дороге или перед сном.",
    },
  ];

  const stats = [
    { value: 4200, suffix: "+", label: "выпускников за 12 лет" },
    { value: 96, suffix: "%", label: "сдают экзамен с первого раза" },
    { value: 45, suffix: "", label: "инструкторов в штате" },
    { value: 18, suffix: "", label: "учебных автомобилей" },
  ];

  const steps = [
    {
      title: "Записываетесь и проходите тест",
      desc: "Короткий тест на определение уровня — подбираем инструктора, машину и удобное расписание.",
    },
    {
      title: "Проходите теорию и практику",
      desc: "30 часов теории в приложении и 32 часа практики на новых автомобилях с инструктором рядом.",
    },
    {
      title: "Сдаёте экзамен в ГАИ",
      desc: "Сопровождаем на экзамене. Если не получилось — бесплатная пересдача теории и дополнительный час практики.",
    },
  ];

  const testimonials = [
    {
      featured: true,
      name: "Айгерим Сатова",
      role: "Маркетолог, Kaspi.kz",
      date: "март 2026",
      avatar: av(AVATARS[0]),
      text: "Боялась руля 10 лет. Инструктор Ерлан ни разу не повысил голос — просто спокойно объяснял, пока не стало получаться. Сдала теорию и практику с первого раза.",
    },
    {
      name: "Данияр Ахметов",
      role: "Инженер, Air Astana",
      date: "январь 2026",
      avatar: av(AVATARS[1]),
      text: "Брал интенсив перед отпуском — за три недели с нуля до прав. Расписание подстраивали под мои смены, ни одного переноса не потерял.",
    },
    {
      name: "Мадина Ержанова",
      role: "Студентка, КазНУ",
      date: "декабрь 2025",
      avatar: av(AVATARS[2]),
      text: "Понравилось приложение с теорией — готовилась в метро между парами. На площадке отрабатывали именно то, что давалось сложнее всего.",
    },
  ];

  const pricing = [
    {
      name: "Базовый",
      icon: Car,
      priceInst: "47 000 ₸ × 4",
      priceFull: "153 000 ₸",
      features: [
        "Групповые занятия",
        "30 часов теории",
        "30 часов практики",
        "Автомобиль с АКПП",
        { text: "Личный инструктор", off: true },
        { text: "Пересдача бесплатно", off: true },
      ],
    },
    {
      name: "Популярный",
      icon: Award,
      popular: true,
      priceInst: "68 000 ₸ × 4",
      priceFull: "221 000 ₸",
      features: [
        "Индивидуальные занятия",
        "30 часов теории",
        "32 часа практики",
        "МКПП и АКПП на выбор",
        "Личный инструктор",
        "Пересдача бесплатно",
      ],
    },
    {
      name: "Корпоративный",
      icon: Users,
      dark: true,
      priceInst: "по запросу",
      priceFull: "по запросу",
      features: [
        "Группа от 5 сотрудников",
        "Выделенный менеджер",
        "Гибкий график под смены",
        "Обучение на территории компании",
        "Сертификат для отдела кадров",
        "Отчётность по прогрессу",
      ],
    },
  ];

  const faqs = [
    {
      q: "Сколько длится курс обучения?",
      a: "В среднем 6–8 недель при занятиях 2–3 раза в неделю. Интенсив можно пройти за 3 недели, если заниматься чаще.",
    },
    {
      q: "Можно ли учиться на автомате (АКПП)?",
      a: "Да, весь автопарк представлен и в МКПП, и в АКПП — версию можно выбрать при записи или поменять в процессе.",
    },
    {
      q: "Что делать, если я боюсь водить?",
      a: "Первые занятия проходят на закрытой площадке в спокойном темпе. Инструкторы школы проходят отдельную подготовку по работе с тревожностью.",
    },
    {
      q: "Что входит в стоимость обучения?",
      a: "Теория в приложении, все часы практики, топливо, аренда автомобиля на экзамен и сопровождение инструктора в ГАИ.",
    },
    {
      q: "Как проходит пересдача экзамена?",
      a: "Если экзамен не сдан с первого раза, школа бесплатно предоставляет одно дополнительное занятие и повторную запись на пересдачу теории.",
    },
    {
      q: "Можно ли перенести или отменить занятие?",
      a: "Да, бесплатно при отмене не позже чем за 2 часа до начала. Перенос можно сделать прямо в приложении.",
    },
  ];

  return (
    <div className="ks-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');

        .ks-root {
          --bg-base: #FAFAF9;
          --bg-surface: #FFFFFF;
          --bg-muted: #F1F3F6;
          --text-primary: #0F0F0F;
          --text-secondary: #4B5563;
          --border: rgba(0,0,0,0.08);
          --shadow-lg: 0 20px 60px rgba(0,0,0,0.12);
          --accent-from: ${ACCENT_FROM};
          --accent-to: ${ACCENT_TO};
          --accent-grad: linear-gradient(135deg, var(--accent-from), var(--accent-to));
          background: var(--bg-base);
          color: var(--text-primary);
          font-family: 'Manrope', sans-serif;
          overflow-x: hidden;
        }
        .ks-root h1, .ks-root h2, .ks-root h3, .ks-root .font-display {
          font-family: 'Unbounded', sans-serif;
        }
        .ks-root ::selection { background: var(--accent-to); color: #0F0F0F; }
        .ks-root { scrollbar-width: thin; scrollbar-color: var(--accent-from) transparent; }
        .ks-root ::-webkit-scrollbar { width: 8px; }
        .ks-root ::-webkit-scrollbar-thumb { background: var(--accent-from); border-radius: 8px; }

        .ks-container { max-width: 1200px; margin: 0 auto; padding: 0 clamp(16px, 4vw, 80px); }
        .ks-section { padding: clamp(60px, 10vw, 140px) 0; }

        .gradient-text {
          background: var(--accent-grad);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .reveal { opacity: 0; transform: translateY(40px); transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
        .reveal.in-view { opacity: 1; transform: translateY(0); }

        @keyframes fadeInUp { from { opacity:0; transform: translateY(32px);} to {opacity:1; transform: translateY(0);} }
        @keyframes fadeInRight { from { opacity:0; transform: translateX(40px);} to {opacity:1; transform: translateX(0);} }
        @keyframes floaty { 0%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-16px) rotate(3deg);} 75%{transform:translateY(-8px) rotate(-2deg);} 100%{transform:translateY(0) rotate(0deg);} }
        @keyframes shimmer { 0%{background-position: -200% 0;} 100%{background-position: 200% 0;} }
        @keyframes marquee { 0%{transform:translateX(0);} 100%{transform:translateX(-50%);} }
        @keyframes blobMorph { 0%,100%{border-radius:42% 58% 65% 35% / 45% 40% 60% 55%;} 50%{border-radius:60% 40% 35% 65% / 55% 65% 35% 45%;} }
        @keyframes badgePulse { 0%,100%{ transform: scale(1);} 50%{ transform: scale(1.05);} }
        @keyframes dotPulse { 0%{ box-shadow: 0 0 0 0 rgba(29,78,216,0.45);} 70%{ box-shadow: 0 0 0 10px rgba(29,78,216,0);} 100%{ box-shadow: 0 0 0 0 rgba(29,78,216,0);} }
        @keyframes dashFlow { to { stroke-dashoffset: -40; } }

        .anim-fadeInUp { animation: fadeInUp .8s cubic-bezier(.16,1,.3,1) both; }
        .anim-fadeInRight { animation: fadeInRight 1s cubic-bezier(.16,1,.3,1) both; }
        .anim-float { animation: floaty 8s ease-in-out infinite; }
        .anim-blob { animation: blobMorph 8s ease-in-out infinite; }
        .anim-badge { animation: badgePulse 2s ease-in-out infinite; }

        .pulse-dot { position: relative; width: 8px; height: 8px; border-radius: 999px; background: var(--accent-from); }
        .pulse-dot::after { content:''; position:absolute; inset:0; border-radius:999px; background: var(--accent-from); animation: dotPulse 1.8s infinite; }

        .btn-primary {
          position: relative; overflow: hidden; background: var(--accent-grad);
          color: #fff; box-shadow: 0 10px 30px rgba(29,78,216,0.35);
          transition: transform .4s cubic-bezier(.16,1,.3,1), box-shadow .4s cubic-bezier(.16,1,.3,1);
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(29,78,216,0.45); }
        .btn-primary::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45) 25%, transparent 50%);
          background-size: 200% 100%;
          animation: shimmer 2.5s infinite;
        }
        .btn-secondary {
          border: 1.5px solid var(--border); color: var(--text-primary); background: transparent;
          transition: all .4s cubic-bezier(.16,1,.3,1);
        }
        .btn-secondary:hover { background: var(--text-primary); color: #fff; border-color: var(--text-primary); }

        .navbar { transition: all .4s cubic-bezier(.16,1,.3,1); }
        .navbar.scrolled { background: rgba(255,255,255,0.85); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); box-shadow: var(--shadow-lg); }
        .nav-progress { position: absolute; bottom: 0; left: 0; height: 2px; background: var(--accent-grad); transition: width .1s linear; }

        .drawer { transition: transform .35s cubic-bezier(.16,1,.3,1); }

        .marquee-track { animation: marquee 22s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
        .logo-item { opacity: .4; transition: all .3s ease; white-space: nowrap; }
        .logo-item:hover { opacity: 1; transform: scale(1.05); }

        .feature-card {
          transition: transform .5s cubic-bezier(.34,1.56,.64,1), box-shadow .5s cubic-bezier(.34,1.56,.64,1), border-color .4s ease;
          border: 1px solid var(--border);
        }
        .feature-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 20px 50px rgba(29,78,216,0.18); border-color: var(--accent-from); }
        .feature-link { position: relative; }
        .feature-link::after { content:''; position:absolute; left:0; bottom:-2px; width:0; height:1.5px; background: var(--accent-grad); transition: width .3s ease; }
        .feature-card:hover .feature-link::after { width: 100%; }

        .stats-band { background: linear-gradient(135deg, var(--accent-from), var(--accent-to)); position: relative; overflow: hidden; }
        .stats-band::before {
          content:''; position:absolute; inset:0; opacity:.15;
          background-image: radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px);
          background-size: 18px 18px;
        }
        .stat-number { font-family: 'Unbounded', sans-serif; font-size: clamp(40px, 6vw, 72px); font-weight: 700; color:#fff; }

        .step-line { stroke-dasharray: 8 10; animation: dashFlow 1.5s linear infinite; }

        .testi-card { border: 1px solid var(--border); transition: transform .4s cubic-bezier(.16,1,.3,1); }
        .testi-card:hover { transform: translateY(-4px); }
        .testi-avatar { border: 3px solid var(--accent-from); }
        .quote-mark { font-family: 'Unbounded', sans-serif; color: var(--accent-to); line-height: 1; }

        .pricing-toggle { background: var(--bg-muted); border-radius: 999px; position: relative; }
        .pricing-toggle .knob {
          position:absolute; top:4px; bottom:4px; width: calc(50% - 4px);
          background: #fff; border-radius: 999px; box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          transition: transform .35s cubic-bezier(.16,1,.3,1);
        }

        .price-card { border: 1.5px dashed var(--border); transition: all .4s cubic-bezier(.16,1,.3,1); }
        .price-card.popular {
          transform: scale(1.05) translateY(-12px);
          border: 1.5px solid transparent;
          background: linear-gradient(#fff,#fff) padding-box, var(--accent-grad) border-box;
          box-shadow: 0 24px 60px rgba(29,78,216,0.25);
        }
        .price-card.dark { background: #0F0F0F; color: #fff; border-color: rgba(255,255,255,0.15); }

        .faq-item { border-bottom: 1px solid var(--border); transition: background .4s ease, border-radius .4s ease; }
        .faq-item.open { background: var(--bg-muted); border-radius: 12px; border-bottom-color: transparent; }
        .faq-chevron { transition: transform .4s ease; }
        .faq-item.open .faq-chevron { transform: rotate(180deg); }
        .faq-answer { max-height: 0; overflow: hidden; transition: max-height .4s ease; }
        .faq-item.open .faq-answer { max-height: 300px; }

        .cta-mesh {
          background:
            radial-gradient(circle at 15% 20%, rgba(29,78,216,0.55), transparent 40%),
            radial-gradient(circle at 85% 15%, rgba(245,158,11,0.45), transparent 40%),
            radial-gradient(circle at 25% 85%, rgba(245,158,11,0.35), transparent 40%),
            radial-gradient(circle at 90% 90%, rgba(29,78,216,0.5), transparent 40%),
            #0F0F0F;
        }

        .btn-loading-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        input:focus, button:focus, a:focus { outline: 2px solid var(--accent-from); outline-offset: 2px; }

        @media (prefers-reduced-motion: reduce) {
          .anim-float, .anim-blob, .anim-badge, .marquee-track, .btn-primary::after, .pulse-dot::after, .step-line { animation: none !important; }
          .reveal { transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* ---------------- NAVBAR ---------------- */}
      <nav className={`navbar fixed top-0 left-0 right-0 z-50 ${scrolled ? "scrolled" : ""}`}>
        <div className="ks-container flex items-center justify-between h-[72px]">
          <a href="#top" className="font-display font-bold text-xl tracking-tight">
            KAN<span className="gradient-text">SAM</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="#pricing" className="btn-primary hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold">
              Записаться <ArrowRight size={16} />
            </a>
            <button
              aria-label="Открыть меню"
              className="md:hidden p-2 rounded-lg border border-[var(--border)]"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
        <div className="nav-progress" style={{ width: `${scrollPct}%` }} />
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] md:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <div
          className="absolute inset-0 bg-black/40 transition-opacity duration-300"
          style={{ opacity: menuOpen ? 1 : 0 }}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className="drawer absolute top-0 right-0 h-full w-[78%] max-w-xs bg-white p-6 flex flex-col"
          style={{ transform: menuOpen ? "translateX(0)" : "translateX(100%)" }}
        >
          <div className="flex justify-between items-center mb-10">
            <span className="font-display font-bold text-lg">KANSAM</span>
            <button aria-label="Закрыть меню" onClick={() => setMenuOpen(false)}>
              <X size={22} />
            </button>
          </div>
          <div className="flex flex-col gap-6">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="text-lg font-medium">
                {l.label}
              </a>
            ))}
          </div>
          <a href="#pricing" onClick={() => setMenuOpen(false)} className="btn-primary mt-auto text-center px-5 py-3 rounded-full text-sm font-semibold">
            Записаться
          </a>
        </div>
      </div>

      {/* ---------------- HERO ---------------- */}
      <header id="top" className="relative pt-[72px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.75)), url(${HERO_IMG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${parallax}px)`,
          }}
        />
        <div className="absolute w-72 h-72 -top-10 -left-10 bg-[var(--accent-to)]/20 anim-blob anim-float" />
        <div className="absolute w-56 h-56 top-1/3 right-0 bg-[var(--accent-from)]/15 anim-blob anim-float" style={{ animationDelay: "2s" }} />

        <div className="ks-container relative ks-section !pt-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div>
            <div className="anim-badge anim-fadeInUp inline-flex items-center gap-2 bg-white/80 border border-[var(--border)] rounded-full px-4 py-2 text-xs font-semibold" style={{ animationDelay: "0ms" }}>
              <span className="pulse-dot" />
              Приём на курсы открыт — старт групп каждую неделю
            </div>

            <h1 className="font-display font-extrabold mt-6" style={{ fontSize: "clamp(36px, 8vw, 96px)", lineHeight: 1.02 }}>
              <span className="block anim-fadeInUp" style={{ animationDelay: "100ms" }}>Учим водить</span>
              <span className="block anim-fadeInUp gradient-text" style={{ animationDelay: "200ms" }} key={typeIndex}>
                {TYPE_WORDS[typeIndex]}
              </span>
            </h1>

            <p className="anim-fadeInUp mt-6 text-lg text-[var(--text-secondary)] max-w-lg" style={{ animationDelay: "350ms" }}>
              Автошкола KANSAM в Алматы — личный инструктор, новый автопарк и подготовка к экзамену в ГАИ с гарантией бесплатной пересдачи.
            </p>

            <div className="anim-fadeInUp flex flex-wrap gap-4 mt-8" style={{ animationDelay: "500ms" }}>
              <a href="#pricing" className="btn-primary px-7 py-3.5 rounded-full text-sm font-semibold inline-flex items-center gap-2">
                Записаться на пробное занятие <ArrowRight size={16} />
              </a>
              <a href="#how" className="btn-secondary px-7 py-3.5 rounded-full text-sm font-semibold">
                Смотреть программу
              </a>
            </div>

            <div className="anim-fadeInUp flex items-center gap-4 mt-10" style={{ animationDelay: "650ms" }}>
              <div className="flex -space-x-2">
                {AVATARS.map((id, i) => (
                  <img key={i} src={av(id, 80)} alt="Выпускник автошколы KANSAM" loading="lazy" decoding="async" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <div className="text-sm">
                <div className="font-semibold">4200+ выпускников</div>
                <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} fill={ACCENT_TO} stroke="none" />)}
                  <span className="ml-1">4.9 из 5 · 860 отзывов</span>
                </div>
              </div>
            </div>
          </div>

          <div className="anim-fadeInRight relative" style={{ animationDelay: "200ms" }}>
            <div className="rounded-3xl overflow-hidden shadow-[var(--shadow-lg)] border border-[var(--border)]">
              <img src={DASH_IMG} alt="Приборная панель учебного автомобиля" loading="lazy" decoding="async" className="w-full h-[420px] object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-[var(--shadow-lg)] border border-[var(--border)] px-5 py-4 anim-float">
              <div className="text-2xl font-display font-bold gradient-text">96%</div>
              <div className="text-xs text-[var(--text-secondary)]">сдают с первого раза</div>
            </div>
          </div>
        </div>
      </header>

      {/* ---------------- LOGOS ---------------- */}
      <section className="ks-container reveal py-10 border-y border-[var(--border)]">
        <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-5">С нами сотрудничают:</p>
        <div className="overflow-hidden">
          <div className="marquee-track flex gap-16 w-max">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex gap-16 items-center">
                {["Kaspi.kz", "Halyk Bank", "Kolesa.kz", "Air Astana", "Magnum", "Chocofamily"].map((brand) => (
                  <span key={brand} className="logo-item font-display font-semibold text-lg">{brand}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FEATURES ---------------- */}
      <section id="features" className="ks-container ks-section">
        <div className="reveal max-w-xl mb-14">
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--accent-from)]">Курсы</span>
          <h2 className="font-display font-bold mt-3" style={{ fontSize: "clamp(28px, 5vw, 56px)" }}>
            Всё для уверенной сдачи с первого раза
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="feature-card reveal md:col-span-2 bg-[var(--bg-surface)] rounded-3xl p-8" style={{ transitionDelay: "0ms" }}>
            <FeatureIcon icon={features[0].icon} />
            <h3 className="font-display font-semibold text-xl mt-5">{features[0].title}</h3>
            <p className="text-[var(--text-secondary)] mt-3 leading-relaxed max-w-md">{features[0].desc}</p>
            <a href="#pricing" className="feature-link inline-flex items-center gap-1 text-sm font-semibold mt-5 text-[var(--accent-from)]">→ Подробнее</a>
          </div>
          <div className="grid gap-6">
            {[features[1], features[2]].map((f, i) => (
              <div key={f.title} className="feature-card reveal bg-[var(--bg-surface)] rounded-3xl p-7" style={{ transitionDelay: `${(i + 1) * 80}ms` }}>
                <FeatureIcon icon={f.icon} small />
                <h3 className="font-display font-semibold text-base mt-4">{f.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">{f.desc}</p>
                <a href="#pricing" className="feature-link inline-flex items-center gap-1 text-xs font-semibold mt-4 text-[var(--accent-from)]">→ Подробнее</a>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="grid gap-6 order-2 md:order-1">
            {[features[4]].map((f) => (
              <div key={f.title} className="feature-card reveal bg-[var(--bg-surface)] rounded-3xl p-7" style={{ transitionDelay: "160ms" }}>
                <FeatureIcon icon={f.icon} small />
                <h3 className="font-display font-semibold text-base mt-4">{f.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">{f.desc}</p>
                <a href="#pricing" className="feature-link inline-flex items-center gap-1 text-xs font-semibold mt-4 text-[var(--accent-from)]">→ Подробнее</a>
              </div>
            ))}
          </div>
          <div className="feature-card reveal order-1 md:order-2 md:col-span-2 rounded-3xl p-8 text-white" style={{ background: "var(--accent-grad)", transitionDelay: "240ms" }}>
            <FeatureIcon icon={features[3].icon} onDark />
            <h3 className="font-display font-semibold text-xl mt-5">{features[3].title}</h3>
            <p className="text-white/85 mt-3 leading-relaxed max-w-md">{features[3].desc}</p>
            <a href="#pricing" className="feature-link inline-flex items-center gap-1 text-sm font-semibold mt-5 text-white">→ Подробнее</a>
          </div>
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="stats-band">
        <div className="ks-container ks-section !py-16 relative grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`reveal text-center px-4 ${i !== 0 ? "md:border-l border-white/25" : ""}`} style={{ transitionDelay: `${i * 100}ms` }}>
              <StatNumber value={s.value} suffix={s.suffix} />
              <div className="text-white/85 text-xs uppercase tracking-widest mt-3">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section id="how" className="ks-container ks-section">
        <div className="reveal max-w-xl mb-16 mx-auto text-center">
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--accent-from)]">Процесс</span>
          <h2 className="font-display font-bold mt-3" style={{ fontSize: "clamp(28px, 5vw, 56px)" }}>Как проходит обучение</h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-10 md:gap-6">
          <svg className="hidden md:block absolute top-7 left-0 w-full h-4 -z-0" viewBox="0 0 900 20" preserveAspectRatio="none" aria-hidden="true">
            <line x1="150" y1="10" x2="750" y2="10" stroke="url(#lineGrad)" strokeWidth="2" className="step-line" />
            <defs>
              <linearGradient id="lineGrad" x1="0" x2="1">
                <stop offset="0" stopColor={ACCENT_FROM} />
                <stop offset="1" stopColor={ACCENT_TO} />
              </linearGradient>
            </defs>
          </svg>
          {steps.map((s, i) => (
            <div key={s.title} className="reveal relative text-center md:text-left" style={{ transitionDelay: `${i * 150}ms` }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-display font-bold text-lg mx-auto md:mx-0" style={{ background: "var(--accent-grad)" }}>
                {i + 1}
              </div>
              <h3 className="font-display font-semibold text-lg mt-5">{s.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section id="testimonials" className="ks-container ks-section">
        <div className="reveal max-w-xl mb-14">
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--accent-from)]">Отзывы</span>
          <h2 className="font-display font-bold mt-3" style={{ fontSize: "clamp(28px, 5vw, 56px)" }}>Что говорят выпускники</h2>
        </div>
        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`testi-card reveal min-w-[85%] md:min-w-0 snap-start rounded-3xl p-8 ${t.featured ? "md:col-span-3" : ""}`}
              style={{
                transitionDelay: `${i * 100}ms`,
                background: t.featured ? "var(--accent-grad)" : "var(--bg-surface)",
                color: t.featured ? "#fff" : "inherit",
              }}
            >
              <div className={`flex items-start justify-between ${t.featured ? "md:flex-row flex-col gap-6" : ""}`}>
                <div className={t.featured ? "md:max-w-lg" : ""}>
                  <span className="quote-mark text-5xl" style={{ color: t.featured ? "rgba(255,255,255,0.6)" : ACCENT_TO }}>"</span>
                  <p className={`mt-2 leading-relaxed ${t.featured ? "text-lg" : "text-sm"} ${t.featured ? "text-white/95" : "text-[var(--text-secondary)]"}`}>
                    {t.text}
                  </p>
                  <div className="flex items-center gap-3 mt-6">
                    <img src={t.avatar} alt={t.name} loading="lazy" decoding="async" className="testi-avatar w-14 h-14 rounded-full object-cover" style={{ borderColor: t.featured ? "#fff" : ACCENT_FROM }} />
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className={`text-xs ${t.featured ? "text-white/80" : "text-[var(--text-secondary)]"}`}>{t.role} · {t.date}</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  {[...Array(5)].map((_, si) => <Star key={si} size={16} fill={t.featured ? "#fff" : ACCENT_TO} stroke="none" />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- PRICING ---------------- */}
      <section id="pricing" className="ks-container ks-section">
        <div className="reveal max-w-xl mb-10 mx-auto text-center">
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--accent-from)]">Тарифы</span>
          <h2 className="font-display font-bold mt-3" style={{ fontSize: "clamp(28px, 5vw, 56px)" }}>Выберите формат обучения</h2>
        </div>

        <div className="reveal flex flex-col items-center gap-3 mb-14">
          <div className="pricing-toggle w-64 h-12 flex items-center relative cursor-pointer" onClick={() => setInstallment((v) => !v)}>
            <div className="knob" style={{ transform: installment ? "translateX(0)" : "translateX(100%)" }} />
            <div className="relative z-10 w-1/2 text-center text-xs font-semibold">Рассрочка</div>
            <div className="relative z-10 w-1/2 text-center text-xs font-semibold">Оплата сразу</div>
          </div>
          <span className="inline-block bg-[var(--accent-to)]/15 text-[var(--accent-from)] text-xs font-semibold px-3 py-1 rounded-full" style={{ opacity: installment ? 0 : 1, transition: "opacity .3s" }}>
            Выгода 15% при оплате сразу
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {pricing.map((p, i) => (
            <div key={p.name} className={`price-card reveal rounded-3xl p-8 relative ${p.popular ? "popular" : ""} ${p.dark ? "dark" : ""} bg-[var(--bg-surface)]`} style={{ transitionDelay: `${i * 100}ms` }}>
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ background: "var(--accent-grad)" }}>
                  Популярный выбор
                </span>
              )}
              <p.icon size={24} color={p.dark ? "#fff" : ACCENT_FROM} />
              <h3 className="font-display font-semibold text-lg mt-4">{p.name}</h3>
              <div className="font-display font-bold mt-3" style={{ fontSize: "44px" }}>
                {installment ? p.priceInst : p.priceFull}
              </div>
              <ul className="mt-6 space-y-3">
                {p.features.map((f, fi) => {
                  const off = typeof f === "object" && f.off;
                  const text = typeof f === "object" ? f.text : f;
                  return (
                    <li key={fi} className={`flex items-center gap-2 text-sm ${off ? "opacity-40 line-through" : ""}`}>
                      {off ? <Minus size={16} /> : <Check size={16} color={p.dark ? "#fff" : ACCENT_FROM} />}
                      {text}
                    </li>
                  );
                })}
              </ul>
              <a
                href="#faq"
                className={`mt-8 block text-center rounded-full py-3 text-sm font-semibold ${p.popular ? "btn-primary" : p.dark ? "bg-white text-[#0F0F0F]" : "btn-secondary"}`}
              >
                Выбрать тариф
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="ks-container ks-section">
        <div className="reveal max-w-xl mb-14">
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--accent-from)]">Вопросы</span>
          <h2 className="font-display font-bold mt-3" style={{ fontSize: "clamp(28px, 5vw, 56px)" }}>Частые вопросы</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-x-10">
          {faqs.map((f, i) => (
            <div key={f.q} className={`faq-item reveal px-2 ${openFaq === i ? "open" : ""}`} style={{ transitionDelay: `${(i % 3) * 60}ms` }}>
              <button
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                aria-expanded={openFaq === i}
              >
                <span className="font-semibold text-sm md:text-base">{f.q}</span>
                <ChevronDown className="faq-chevron shrink-0" size={18} />
              </button>
              <div className="faq-answer px-0">
                <p className="text-sm text-[var(--text-secondary)] pb-5 leading-relaxed">{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- CTA BANNER ---------------- */}
      <section className="relative overflow-hidden">
        <div className="cta-mesh">
          <img src={ROAD_IMG} alt="Дорога на закате" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-25" />
          <div className="ks-container relative ks-section text-center">
            <h2 className="reveal font-display font-bold text-white" style={{ fontSize: "56px" }}>Готовы сесть за руль?</h2>
            <p className="reveal text-white/75 mt-4 max-w-md mx-auto">Оставьте email — пришлём расписание ближайших групп и пригласим на бесплатное пробное занятие.</p>

            {!emailSent ? (
              <form onSubmit={handleEmailSubmit} className="reveal mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  className="flex-1 rounded-full px-5 py-3.5 text-sm bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/50"
                />
                <button type="submit" disabled={emailSubmitting} className="rounded-full px-6 py-3.5 text-sm font-semibold bg-white text-[var(--accent-from)] inline-flex items-center justify-center gap-2">
                  {emailSubmitting ? <Loader2 size={16} className="btn-loading-spin" /> : "Получить расписание"}
                </button>
              </form>
            ) : (
              <p className="reveal mt-8 text-white font-semibold">Спасибо! Расписание уже летит на почту.</p>
            )}
            <p className="reveal text-white/50 text-xs mt-4">Без спама. Отписка в 1 клик.</p>
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="ks-container ks-section !py-16">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <div className="font-display font-bold text-lg">KAN<span className="gradient-text">SAM</span></div>
            <p className="text-sm text-[var(--text-secondary)] mt-3 flex items-start gap-2">
              <MapPin size={16} className="shrink-0 mt-0.5" /> Алматы, ул. Достык, 89
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-2 flex items-center gap-2">
              <Phone size={16} /> +7 (707) 123-45-67
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center hover:border-[var(--accent-from)]"><Instagram size={16} /></a>
              <a href="#" aria-label="WhatsApp" className="w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center hover:border-[var(--accent-from)]"><MessageCircle size={16} /></a>
              <a href="#" aria-label="Telegram" className="w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center hover:border-[var(--accent-from)]"><Send size={16} /></a>
            </div>
          </div>
          <FooterCol title="Курсы" items={["АКПП", "МКПП", "Интенсив", "Корпоративное обучение"]} />
          <FooterCol title="Компания" items={["О нас", "Инструкторы", "Автопарк", "Вакансии"]} />
          <FooterCol title="Поддержка" items={["FAQ", "Контакты", "Оплата", "Политика конфиденциальности"]} />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-14 pt-8 border-t border-[var(--border)] text-xs text-[var(--text-secondary)]">
          <span>© 2026 Автошкола KANSAM. Все права защищены.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[var(--text-primary)]">Политика конфиденциальности</a>
            <a href="#" className="hover:text-[var(--text-primary)]">Публичная оферта</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureIcon({ icon: Icon, small, onDark }) {
  return (
    <div
      className={`${small ? "w-11 h-11" : "w-14 h-14"} rounded-2xl flex items-center justify-center`}
      style={{ background: onDark ? "rgba(255,255,255,0.2)" : "var(--accent-grad)" }}
    >
      <Icon size={small ? 20 : 24} color="#fff" />
    </div>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <div className="font-semibold text-sm mb-4">{title}</div>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it}>
            <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">{it}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
