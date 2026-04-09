import Link from "next/link";
import GameHub from "./GameHub";

export default function GamePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.2),_transparent_30%),linear-gradient(180deg,_#fff7ed_0%,_#ffffff_100%)]">
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 sm:px-6 sm:py-10">
        <div className="rounded-[32px] border border-orange-200/70 bg-white/85 p-8 shadow-[0_30px_80px_rgba(120,53,15,0.1)] backdrop-blur">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-600">Game Module</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              游戏模块现在改成了卡片切换式游戏大厅
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg">
              现在这里既可以玩贪吃蛇，也可以玩投篮小游戏，而且已经切成适合继续扩展的大厅结构。后面新增更多游戏时，只需要继续往卡片列表里接入即可。
            </p>
          </div>

          <div className="mt-8">
            <GameHub />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              返回首页
            </Link>
            <Link
              href="/blog"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              去看个人博客
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
