import Link from "next/link";

const modules = [
  {
    title: "个人博客",
    href: "/blog",
    eyebrow: "Blog",
    description:
      "进入 Maurice 的技术博客，阅读关于 Next.js、Prisma、自动化工作流与真实项目构建的文章。",
    accent: "from-sky-500 via-cyan-400 to-blue-500",
    badge: "已上线",
  },
  {
    title: "游戏",
    href: "/game",
    eyebrow: "Game",
    description:
      "预留给互动玩法、个人作品展示和一些更轻松的实验内容，后续可以继续扩展成独立模块。",
    accent: "from-amber-400 via-orange-400 to-rose-500",
    badge: "建设中",
  },
  {
    title: "名著阅读",
    href: "/reading",
    eyebrow: "Reading",
    description:
      "沉淀经典文学阅读记录、摘录与思考，把阅读体验整理成一个可以持续更新的长期栏目。",
    accent: "from-emerald-400 via-teal-400 to-cyan-500",
    badge: "建设中",
  },
  {
    title: "爱做菜",
    href: "/cooking",
    eyebrow: "Cooking",
    description:
      "用于整理家常菜、烘焙、饮品和个人拿手菜谱，后续可以继续扩展成完整的菜谱管理模块。",
    accent: "from-rose-400 via-orange-400 to-amber-400",
    badge: "新模块",
  },
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(186,230,253,0.45),_transparent_36%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_42%,_#ffffff_100%)]">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8 sm:px-6 sm:py-10">
        <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.34em] text-sky-700">Module Gateway</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
              选择你想进入的内容模块
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg">
              这里是站点新的首页入口。你可以从这里进入个人博客、游戏实验区、名著阅读或爱做菜模块，后续也方便继续扩展更多内容板块。
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:mt-10 md:grid-cols-2 xl:grid-cols-4">
            {modules.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className="group relative overflow-hidden rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${module.accent}`}
                  aria-hidden="true"
                />

                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                    {module.eyebrow}
                  </p>
                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600">
                    {module.badge}
                  </span>
                </div>

                <h2 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-950 transition-colors group-hover:text-sky-800">
                  {module.title}
                </h2>
                <p className="mt-4 text-[15px] leading-7 text-zinc-600">{module.description}</p>

                <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-5">
                  <span className="text-sm font-medium text-zinc-500">点击进入模块</span>
                  <span className="inline-flex items-center rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition group-hover:border-sky-200 group-hover:bg-sky-50 group-hover:text-sky-700">
                    进入
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
