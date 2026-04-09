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
    <section className="overflow-hidden rounded-[32px] border border-zinc-200/70 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="grid gap-8 px-8 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-sky-600">CMS Dashboard</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950">
            文章管理
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-zinc-600">
            在一个更清晰的工作台中管理文章内容、发布状态、分类标签与展示设置。左侧快速浏览内容，
            右侧专注编辑当前文章。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onCreateNew}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-sky-600 px-6 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              {isEditing ? "切换到新建模式" : "新建文章"}
            </button>
            <Link
              href="/admin/profile"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              关于我设置
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              返回首页
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 px-6 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
            >
              登出
            </button>
          </div>
        </div>

        <div className="grid gap-4 self-start rounded-[28px] border border-zinc-200 bg-[linear-gradient(180deg,_#fafafa_0%,_#f8fafc_100%)] p-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.key} className="rounded-2xl border border-white bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
                {statMap[stat.key]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
