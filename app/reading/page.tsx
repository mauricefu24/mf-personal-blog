import Link from "next/link";
import ReadingLibrary from "./ReadingLibrary";

export default function ReadingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(214,179,106,0.1),transparent_22%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_20%),linear-gradient(180deg,#050505_0%,#09090b_100%)]">
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 sm:px-6 sm:py-10">
        <div className="premium-panel rounded-[32px] p-8">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--gold)]">Reading Module</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
              名著阅读模块现在可以直接搜索书籍
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              现在你可以在这里搜索书名或作者，页面会展示书籍封面、作者、出版信息和内容简介，后面继续往阅读摘录、书单和读书笔记方向扩展会很自然。
            </p>
          </div>

          <div className="mt-8">
            <ReadingLibrary />
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
