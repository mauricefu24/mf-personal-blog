import Link from "next/link";
import GameHub from "./GameHub";

export default function GamePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(214,179,106,0.11),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_22%),linear-gradient(180deg,#050505_0%,#09090b_100%)]">
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 sm:px-6 sm:py-10">
        <div className="premium-panel rounded-[32px] p-8">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--gold)]">Game Module</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
              游戏模块现在改成了卡片切换式游戏大厅
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              现在这里既可以玩贪吃蛇，也可以玩投篮小游戏，而且已经切成适合继续扩展的大厅结构。后面新增更多游戏时，只需要继续往卡片列表里接入即可。
            </p>
          </div>

          <div className="mt-8">
            <GameHub />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--gold)] px-6 text-sm font-semibold text-black transition hover:brightness-105"
            >
              返回首页
            </Link>
            <Link
              href="/blog"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-6 text-sm font-semibold text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.26)] hover:text-[var(--gold)]"
            >
              去看个人博客
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
