import Link from "next/link";
import ReadingLibrary from "./ReadingLibrary";

export default function ReadingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(52,211,153,0.2),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(125,211,252,0.18),_transparent_32%),linear-gradient(180deg,_#ecfeff_0%,_#ffffff_100%)]">
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 sm:px-6 sm:py-10">
        <div className="rounded-[32px] border border-emerald-200/70 bg-white/85 p-8 shadow-[0_30px_80px_rgba(15,118,110,0.08)] backdrop-blur">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-700">Reading Module</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              名著阅读模块现在可以直接搜索书籍
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg">
              现在你可以在这里搜索书名或作者，页面会展示书籍封面、作者、出版信息和内容简介，后面继续往阅读摘录、书单和读书笔记方向扩展会很自然。
            </p>
          </div>

          <div className="mt-8">
            <ReadingLibrary />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-700"
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
