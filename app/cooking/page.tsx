import Link from "next/link";
import CookingLibrary from "./CookingLibrary";

export default function CookingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(244,63,94,0.16),_transparent_30%),linear-gradient(180deg,_#fff7ed_0%,_#ffffff_100%)]">
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 sm:px-6 sm:py-10">
        <div className="rounded-[32px] border border-orange-200/70 bg-white/85 p-8 shadow-[0_30px_80px_rgba(154,52,18,0.08)] backdrop-blur">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-700">Cooking Module</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              爱做菜模块现在可以直接搜索菜谱
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg">
              现在你可以按菜名搜索免费菜谱，页面会返回菜品图片、食材清单、做法步骤和外部参考链接，适合作为后续完整菜谱功能的入口。
            </p>
          </div>

          <div className="mt-8">
            <CookingLibrary />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              返回首页
            </Link>
            <Link
              href="/reading"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              去看名著阅读
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
