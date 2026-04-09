"use client";

import { formatDisplayDate } from "@/lib/format";
import type { PostItem } from "../types";

type Props = {
  posts: PostItem[];
  selectedPostId: number | null;
  loading: boolean;
  deletingId: number | null;
  onCreateNew: () => void;
  onEdit: (post: PostItem) => void;
  onDelete: (id: number) => void;
};

function StatusBadge({ status }: { status: PostItem["status"] }) {
  const styles =
    status === "PUBLISHED"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${styles}`}>
      {status === "PUBLISHED" ? "已发布" : "草稿"}
    </span>
  );
}

export default function PostListPanel({
  posts,
  selectedPostId,
  loading,
  deletingId,
  onCreateNew,
  onEdit,
  onDelete,
}: Props) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-zinc-200/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
      <div className="border-b border-zinc-200/80 px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-zinc-500">Content Library</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
              文章列表
            </h2>
            <p className="mt-2 text-sm text-zinc-600">选择文章继续编辑，或快速切换到新建模式。</p>
          </div>
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            新建文章
          </button>
        </div>
      </div>

      <div className="max-h-[920px] space-y-4 overflow-y-auto px-5 py-5">
        {loading ? (
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600">
            正在加载文章列表...
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => {
            const isSelected = selectedPostId === post.id;

            return (
              <article
                key={post.id}
                className={`rounded-[28px] border p-5 transition ${
                  isSelected
                    ? "border-sky-200 bg-sky-50/60 shadow-[0_16px_40px_rgba(14,165,233,0.12)]"
                    : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={post.status} />
                      <span className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                        {post.category?.name ?? "未分类"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onEdit(post)}
                      className={`text-left text-lg font-semibold leading-7 tracking-tight ${
                        isSelected ? "text-sky-900" : "text-zinc-950"
                      }`}
                    >
                      {post.title}
                    </button>
                    <p className="line-clamp-2 text-sm leading-6 text-zinc-600">
                      {post.excerpt ?? "这篇文章暂未设置摘要。"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.length > 0 ? (
                    post.tags.map((item) => (
                      <span
                        key={`${post.id}-${item.tag.name}`}
                        className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700"
                      >
                        {item.tag.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-400">暂无标签</span>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                    更新于 {formatDisplayDate(post.updatedAt)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(post)}
                      className="inline-flex h-10 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                    >
                      编辑
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(post.id)}
                      disabled={deletingId === post.id}
                      className="inline-flex h-10 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-4 text-sm font-medium text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === post.id ? "删除中..." : "删除"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-[28px] border border-dashed border-zinc-200 bg-zinc-50 p-8 text-sm text-zinc-500">
            还没有文章，点击“新建文章”开始创建第一篇内容。
          </div>
        )}
      </div>
    </section>
  );
}
