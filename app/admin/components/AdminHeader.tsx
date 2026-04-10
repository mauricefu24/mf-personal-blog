"use client";

import Link from "next/link";

type Props = {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  isEditing: boolean;
  onCreateNew: () => void;
  onLogout: () => void;
};

const stats = [
  { key: "total", label: "文章总数" },
  { key: "published", label: "已发布" },
  { key: "draft", label: "草稿" },
] as const;

export default function AdminHeader({
  totalPosts,
  publishedPosts,
  draftPosts,
  isEditing,
  onCreateNew,
  onLogout,
}: Props) {
  const statMap = {
    total: totalPosts,
    published: publishedPosts,
    draft: draftPosts,
  };

  return (
    <section className="premium-panel overflow-hidden rounded-[32px]">
      <div className="grid gap-8 px-8 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--gold)]">CMS Dashboard</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--foreground)]">
            文章管理
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[var(--muted)]">
            在一个更清晰的工作台中管理文章内容、发布状态、分类标签与展示设置。左侧快速浏览内容，
            右侧专注编辑当前文章。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onCreateNew}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--gold)] px-6 text-sm font-semibold text-black shadow-[0_16px_40px_rgba(214,179,106,0.22)] transition hover:-translate-y-0.5 hover:brightness-105"
            >
              + {isEditing ? "新建文章" : "新建文章"}
            </button>
            <Link
              href="/admin/profile"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-6 text-sm font-semibold text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.22)] hover:text-[var(--gold)]"
            >
              关于我设置
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-6 text-sm font-semibold text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.22)] hover:text-[var(--gold)]"
            >
              返回首页
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-6 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              登出
            </button>
          </div>
        </div>

        <div className="grid gap-4 self-start rounded-[28px] border border-[rgba(214,179,106,0.14)] bg-[rgba(255,255,255,0.03)] p-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.key} className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(5,5,5,0.32)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                {statMap[stat.key]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
