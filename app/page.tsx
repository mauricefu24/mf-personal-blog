import Link from "next/link";

function BlogIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M7 4.75h7.5L19 9.25V19a1.25 1.25 0 0 1-1.25 1.25h-10.5A1.25 1.25 0 0 1 6 19V6A1.25 1.25 0 0 1 7.25 4.75Z" />
      <path d="M14 4.75V9h4.25" />
      <path d="M9 12h6" />
      <path d="M9 15.5h6" />
    </svg>
  );
}

function ReadingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M4.75 6.5A2.75 2.75 0 0 1 7.5 3.75H19.25V18.5H7.5A2.75 2.75 0 0 0 4.75 21.25Z" />
      <path d="M7.5 3.75A2.75 2.75 0 0 0 4.75 6.5v14.75A2.75 2.75 0 0 1 7.5 18.5h11.75" />
      <path d="M9 7.75h6.5" />
      <path d="M9 11h6.5" />
    </svg>
  );
}

function WorkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M4.75 8.5A1.75 1.75 0 0 1 6.5 6.75h11A1.75 1.75 0 0 1 19.25 8.5v8.75A1.75 1.75 0 0 1 17.5 19h-11a1.75 1.75 0 0 1-1.75-1.75Z" />
      <path d="M9 6.75v-1A1.75 1.75 0 0 1 10.75 4h2.5A1.75 1.75 0 0 1 15 5.75v1" />
      <path d="M4.75 11.5h14.5" />
      <path d="M11 14.25h2" />
    </svg>
  );
}

function GameIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M8.25 8.75h7.5a3.25 3.25 0 0 1 3.2 2.71l.53 3.18a3.25 3.25 0 0 1-5.08 3.18L12 16l-2.4 1.82a3.25 3.25 0 0 1-5.08-3.18l.53-3.18a3.25 3.25 0 0 1 3.2-2.71Z" />
      <path d="M8.5 11.5v3" />
      <path d="M7 13h3" />
      <path d="M15.75 12.25h.01" />
      <path d="M17.75 14.25h.01" />
    </svg>
  );
}

function CookingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M4.75 10.75h10.5a2 2 0 0 1 2 2V14a5.25 5.25 0 0 1-5.25 5.25H8A5.25 5.25 0 0 1 2.75 14v-1.25a2 2 0 0 1 2-2Z" />
      <path d="M17.25 11.75h1a3 3 0 1 1 0 6h-1" />
      <path d="M6.5 8.25V6.5" />
      <path d="M10 8.25v-2.5" />
      <path d="M13.5 8.25V7" />
    </svg>
  );
}

function TravelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M10.5 13.5 4.75 15.25l-1-2 5.25-2.75L10.5 4.75h2.25l-.5 5 5.25-1.75a1.5 1.5 0 0 1 1.9.94l.35 1a1.5 1.5 0 0 1-.94 1.9l-6.1 2.06-.96 5.35H9.5l1-4.75Z" />
    </svg>
  );
}

const featuredModules = [
  {
    title: "个人博客",
    eyebrow: "BLOG",
    href: "/blog",
    description: "进入 Maurice 的技术博客，阅读关于 Next.js、Prisma、自动化流程与真实项目构建的实践内容。",
    tags: ["长期更新", "核心入口"],
    cta: "进入博客",
    icon: BlogIcon,
    tone: {
      border: "border-sky-200/80",
      panel: "bg-sky-50/70",
      icon: "bg-sky-100 text-sky-700 border-sky-200/80",
      glow: "from-sky-300/30 via-cyan-200/20 to-transparent",
    },
  },
  {
    title: "名著阅读",
    eyebrow: "READING",
    href: "/reading",
    description: "沉淀经典文学阅读记录、摘录与思考，把阅读体验整理成可以持续更新的长期栏目。",
    tags: ["长期专题", "持续沉淀"],
    cta: "进入阅读",
    icon: ReadingIcon,
    tone: {
      border: "border-emerald-200/80",
      panel: "bg-emerald-50/70",
      icon: "bg-emerald-100 text-emerald-700 border-emerald-200/80",
      glow: "from-emerald-300/30 via-teal-200/20 to-transparent",
    },
  },
  {
    title: "爱工作",
    eyebrow: "WORK",
    href: "/work",
    description: "沉淀工作方法、项目复盘、效率系统与职业思考，把经验整理成可复用的个人工作手册。",
    tags: ["方法沉淀", "长期更新"],
    cta: "进入工作",
    icon: WorkIcon,
    tone: {
      border: "border-slate-200/80",
      panel: "bg-slate-50/70",
      icon: "bg-slate-100 text-slate-700 border-slate-200/80",
      glow: "from-slate-300/30 via-zinc-200/20 to-transparent",
    },
  },
] as const;

const exploreModules = [
  {
    title: "游戏",
    eyebrow: "GAME",
    href: "/game",
    description: "预留给互动玩法、轻量实验和个人作品展示，用更轻松的方式扩展首页的趣味体验。",
    tags: ["灵感实验", "互动内容"],
    cta: "进入游戏",
    icon: GameIcon,
    tone: {
      border: "border-amber-200/80",
      panel: "bg-amber-50/70",
      icon: "bg-amber-100 text-amber-700 border-amber-200/80",
    },
  },
  {
    title: "爱做菜",
    eyebrow: "COOKING",
    href: "/cooking",
    description: "整理家常菜、烘焙、饮品与个人拿手菜谱，把做饭这件事也记录成长期可回看的生活模块。",
    tags: ["生活记录", "长期收藏"],
    cta: "进入做菜",
    icon: CookingIcon,
    tone: {
      border: "border-rose-200/80",
      panel: "bg-rose-50/70",
      icon: "bg-rose-100 text-rose-700 border-rose-200/80",
    },
  },
  {
    title: "爱旅游",
    eyebrow: "TRAVEL",
    href: "/travel",
    description: "记录旅行见闻、城市漫游与路线规划，整理沿途照片与每次出发的内容专题。",
    tags: ["生活专题", "持续更新"],
    cta: "进入旅行",
    icon: TravelIcon,
    tone: {
      border: "border-cyan-200/80",
      panel: "bg-cyan-50/70",
      icon: "bg-cyan-100 text-cyan-700 border-cyan-200/80",
    },
  },
] as const;

const overviewStats = [
  { value: "6", label: "模块入口" },
  { value: "3", label: "长期主线" },
  { value: "3", label: "生活兴趣" },
] as const;

const moduleLabels = ["个人博客", "名著阅读", "爱工作", "游戏", "爱做菜", "爱旅游"] as const;

type Module = (typeof featuredModules)[number] | (typeof exploreModules)[number];

function HeroIllustration() {
  return (
    <div className="premium-panel relative mx-auto w-full max-w-[31rem] overflow-hidden rounded-[30px] p-4 sm:p-5">
      <svg
        viewBox="0 0 560 420"
        className="relative h-[280px] w-full sm:h-[310px] lg:h-[340px]"
        role="img"
        aria-label="一个正在缓慢旋转的月球动画"
      >
        <defs>
          <radialGradient id="phaseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#dbeafe" stopOpacity="0.3" />
            <stop offset="75%" stopColor="#bfdbfe" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="moonSurface" cx="36%" cy="30%" r="72%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="42%" stopColor="#f8fafc" />
            <stop offset="78%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#c8d5e4" />
          </radialGradient>
          <radialGradient id="specularHL" cx="33%" cy="27%" r="42%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="orbitStroke" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.28" />
            <stop offset="0.5" stopColor="#c4b5fd" stopOpacity="0.38" />
            <stop offset="1" stopColor="#bae6fd" stopOpacity="0.18" />
          </linearGradient>
          <radialGradient id="umbra" cx="72%" cy="50%" r="58%">
            <stop offset="0%" stopColor="#020617" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#0f172a" stopOpacity="0.58" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
          </radialGradient>
          <filter id="softBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="moonGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="18" floodColor="#e2e8f0" floodOpacity="0.42" />
            <feDropShadow dx="0" dy="14" stdDeviation="20" floodColor="#94a3b8" floodOpacity="0.13" />
          </filter>
          <clipPath id="moonClip">
            <circle cx="280" cy="210" r="88" />
          </clipPath>
        </defs>

        {/* Outer halo */}
        <circle cx="280" cy="210" r="150" fill="url(#phaseGlow)" opacity="0.88" />

        {/* Orbital rings */}
        <g opacity="0.78">
          <circle cx="280" cy="210" r="126" fill="none" stroke="url(#orbitStroke)" strokeWidth="1.25" />
          <circle cx="280" cy="210" r="108" fill="none" stroke="#cbd5e1" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="2 10">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 280 210"
              to="360 280 210"
              dur="34s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Stars */}
        <g fill="#cbd5e1">
          <circle cx="132" cy="118" r="2.1" opacity="0.82">
            <animate attributeName="opacity" values="0.2;0.85;0.2" dur="4.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="178" cy="76" r="1.7" opacity="0.64">
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="5.6s" begin="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="426" cy="94" r="2" opacity="0.78">
            <animate attributeName="opacity" values="0.25;0.9;0.25" dur="5.1s" begin="0.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="450" cy="304" r="1.9" opacity="0.72">
            <animate attributeName="opacity" values="0.15;0.72;0.15" dur="6.2s" begin="1.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="114" cy="296" r="1.6" opacity="0.58">
            <animate attributeName="opacity" values="0.15;0.76;0.15" dur="5.4s" begin="0.9s" repeatCount="indefinite" />
          </circle>
          <circle cx="362" cy="58" r="1.4" opacity="0.5">
            <animate attributeName="opacity" values="0.1;0.62;0.1" dur="7.1s" begin="2.2s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Stand lines */}
        <path d="M174 338C208 324 240 318 280 318C320 318 352 324 386 338" fill="none" stroke="#cbd5e1" strokeOpacity="0.5" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M206 352C230 346 252 344 280 344C308 344 330 346 354 352" fill="none" stroke="#e2e8f0" strokeWidth="1.4" strokeLinecap="round" />

        {/* Moon sphere */}
        <g filter="url(#moonGlow)">
          <circle cx="280" cy="210" r="88" fill="url(#moonSurface)" />
        </g>

        {/* Clipped surface details */}
        <g clipPath="url(#moonClip)">

          {/* ── Rotating surface (mare + craters) ── */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 280 210"
              to="360 280 210"
              dur="44s"
              repeatCount="indefinite"
            />
            {/* Mare (dark region blobs) */}
            <g opacity="0.34">
              <ellipse cx="256" cy="190" rx="20" ry="16" fill="#c2cedf" />
              <ellipse cx="312" cy="230" rx="17" ry="13" fill="#c6d2e0" />
              <ellipse cx="294" cy="170" rx="11" ry="9" fill="#c2cedf" />
              <ellipse cx="242" cy="228" rx="14" ry="10" fill="#cad6e4" />
              <ellipse cx="338" cy="196" rx="15" ry="11" fill="#c2cedf" />
              <ellipse cx="216" cy="198" rx="9" ry="7" fill="#c6d2de" />
              <ellipse cx="270" cy="248" rx="10" ry="8" fill="#c4d0de" />
            </g>
            {/* Crater rings */}
            <g opacity="0.22" fill="none" stroke="#a4b4c8" strokeLinecap="round">
              <circle cx="262" cy="184" r="8.5" strokeWidth="1.6" />
              <circle cx="310" cy="226" r="11" strokeWidth="1.5" />
              <circle cx="294" cy="166" r="5.5" strokeWidth="1.2" />
              <circle cx="340" cy="192" r="8.5" strokeWidth="1.2" />
              <circle cx="244" cy="224" r="6.5" strokeWidth="1" />
              <circle cx="228" cy="204" r="4" strokeWidth="1" />
              <circle cx="272" cy="250" r="5" strokeWidth="1" />
            </g>
            {/* Subtle surface ridge lines */}
            <g opacity="0.1" fill="none" stroke="#94a3b8" strokeLinecap="round">
              <path d="M172 174C222 146 338 148 388 184" strokeWidth="13" />
              <path d="M188 252C236 232 320 230 382 262" strokeWidth="9" />
            </g>
          </g>

          {/* Fixed specular highlight — does NOT rotate */}
          <ellipse cx="260" cy="188" rx="55" ry="46" fill="url(#specularHL)" />

          {/* Fixed terminator shadow — does NOT rotate */}
          <g filter="url(#softBlur)">
            <ellipse cx="354" cy="210" rx="97" ry="93" fill="url(#umbra)" opacity="0.3" />
          </g>

          {/* Pulse shimmer */}
          <ellipse cx="278" cy="210" rx="91" ry="89" fill="#ffffff" fillOpacity="0.05">
            <animate attributeName="opacity" values="0.02;0.07;0.02" dur="9s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* Moon border */}
        <circle cx="280" cy="210" r="88" fill="none" stroke="#f8fafc" strokeOpacity="0.82" strokeWidth="1.4" />

        {/* Rotating cardinal tick marks */}
        <g opacity="0.52">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 280 210"
            to="360 280 210"
            dur="48s"
            repeatCount="indefinite"
          />
          <path d="M280 72v-14" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M280 362v-14" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M142 210h-14" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M432 210h-14" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M191 99l-9-9" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" opacity="0.55" />
          <path d="M369 99l9-9" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" opacity="0.55" />
          <path d="M191 321l-9 9" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" opacity="0.55" />
          <path d="M369 321l9 9" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" opacity="0.55" />
        </g>
      </svg>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--gold)]">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">{description}</p>
    </div>
  );
}

function ModuleCard({ module, featured = false }: { module: Module; featured?: boolean }) {
  return (
    <Link
      href={module.href}
      className={`group premium-panel relative overflow-hidden rounded-[30px] p-6 transition duration-300 hover:-translate-y-1 hover:border-[rgba(214,179,106,0.28)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.45)] sm:p-7 ${
        featured ? "min-h-[22rem]" : ""
      }`}
    >
      {"glow" in module.tone ? (
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,_rgba(214,179,106,0.18),_transparent_68%)] blur-3xl"
          aria-hidden="true"
        />
      ) : null}

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--muted)]">{module.eyebrow}</p>
            <h3 className={`mt-4 font-semibold tracking-tight text-[var(--foreground)] ${featured ? "text-3xl" : "text-2xl"}`}>
              {module.title}
            </h3>
          </div>
          <span
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[rgba(214,179,106,0.18)] bg-[rgba(214,179,106,0.08)] text-[var(--gold)]"
            aria-hidden="true"
          >
            <module.icon />
          </span>
        </div>

        <p className={`mt-4 text-[rgba(245,245,242,0.74)] ${featured ? "max-w-xl text-base leading-8" : "text-[15px] leading-7"}`}>
          {module.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {module.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-sm text-[var(--muted)]">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-8 flex justify-end border-t border-[rgba(255,255,255,0.08)] pt-5">
          <span className="inline-flex items-center rounded-full border border-[rgba(214,179,106,0.2)] bg-[rgba(255,255,255,0.02)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition group-hover:border-[rgba(214,179,106,0.34)] group-hover:text-[var(--gold)]">
            {module.cta}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden premium-shell">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(214,179,106,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_24%),radial-gradient(circle_at_center,rgba(214,179,106,0.05),transparent_36%)]" />

      <section className="relative mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="premium-panel rounded-[36px] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] lg:items-center">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[var(--gold)]">MODULE GATEWAY</p>
              <h1 className="mt-5 whitespace-nowrap text-[2rem] font-semibold italic tracking-[-0.04em] text-[var(--foreground)] sm:text-[2.75rem] lg:text-[3.35rem]">
                Maurice Content Portal
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                这里是 Maurice 的内容首页。你可以从这里进入个人博客、名著阅读、工作方法、游戏实验、做菜记录和旅行内容，让不同主题拥有清晰归属，也让每一次浏览都有独立节奏。
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/blog"
                  className="inline-flex items-center rounded-full bg-[var(--gold)] px-5 py-3 text-sm font-medium text-black transition hover:brightness-105"
                >
                  先看个人博客
                </Link>
                <a
                  href="#all-modules"
                  className="inline-flex items-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-5 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.26)] hover:text-[var(--gold)]"
                >
                  浏览全部模块
                </a>
              </div>

              <div className="mt-12">
                <div className="flex items-end justify-between gap-6 border-b border-[rgba(255,255,255,0.08)] pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--gold)]">OVERVIEW</p>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">首页概览</h2>
                  </div>
                  <p className="max-w-md text-right text-sm leading-6 text-[var(--muted)]">
                    六个模块被拆分为三条核心内容线与三类生活兴趣线。
                  </p>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {overviewStats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[24px] border border-[rgba(214,179,106,0.16)] bg-[linear-gradient(180deg,_rgba(255,255,255,0.04)_0%,_rgba(255,255,255,0.02)_100%)] px-5 py-5"
                    >
                      <p className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">{item.value}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {moduleLabels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-sm text-[var(--muted)]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <HeroIllustration />
          </div>

          <div id="all-modules" className="mt-20">
            <SectionHeading
              eyebrow="FEATURED MODULES"
              title="核心内容模块"
              description="围绕技术、阅读与工作展开的长期内容主线。"
            />

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {featuredModules.map((module) => (
                <ModuleCard key={module.href} module={module} featured />
              ))}
            </div>
          </div>

          <div className="mt-16">
            <SectionHeading
              eyebrow="MORE MODULES"
              title="兴趣与生活模块"
              description="保留趣味感，同时延展持续更新的生活内容。"
            />

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {exploreModules.map((module) => (
                <ModuleCard key={module.href} module={module} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
