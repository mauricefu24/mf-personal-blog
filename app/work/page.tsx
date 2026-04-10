import Link from "next/link";
import WorkBoard from "./WorkBoard";

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(214,179,106,0.1),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_22%),linear-gradient(180deg,#050505_0%,#09090b_100%)]">
      <section className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-6 sm:py-10">
        <div className="premium-panel rounded-[32px] p-8">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[rgba(255,255,255,0.08)] pb-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--gold)]">Enterprise Workspace</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
                工作执行平台
              </h1>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { value: "01", label: "新建事项" },
                { value: "02", label: "跟进中" },
                { value: "01", label: "已完成" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 py-4"
                >
                  <p className="text-2xl font-semibold text-[var(--foreground)]">{item.value}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <WorkBoard />
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
