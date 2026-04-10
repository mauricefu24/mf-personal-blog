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
      ? "border-[rgba(214,179,106,0.22)] bg-[rgba(214,179,106,0.08)] text-[var(--gold)]"
      : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[var(--muted)]";

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
    <section className="premium-panel overflow-hidden rounded-[32px]">
      <div className="border-b border-[rgba(255,255,255,0.08)] px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--gold)]">Content Library</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              文章列表
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">选择文章继续编辑，或快速切换到新建模式。</p>
          </div>
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-[rgba(214,179,106,0.22)] bg-[rgba(214,179,106,0.08)] px-4 text-sm font-medium text-[var(--gold)] transition hover:brightness-110"
          >
            + 新建文章
          </button>
        </div>
      </div>

      <div className="max-h-[920px] space-y-4 overflow-y-auto px-5 py-5">
        {loading ? (
          <div className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-6 text-sm text-[var(--muted)]">
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
                    ? "border-[rgba(214,179,106,0.24)] bg-[rgba(214,179,106,0.08)] shadow-[0_16px_40px_rgba(0,0,0,0.32)]"
                    : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(214,179,106,0.18)]"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={post.status} />
                    <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                      {post.category?.name ?? "未分类"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onEdit(post)}
                    className={`text-left text-lg font-semibold leading-7 tracking-tight ${
                      isSelected ? "text-[var(--gold)]" : "text-[var(--foreground)]"
                    }`}
                  >
                    {post.title}
                  </button>

                  <p className="line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                    {post.excerpt ?? "这篇文章暂未设置摘要。"}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.length > 0 ? (
                    post.tags.map((item) => (
                      <span
                        key={`${post.id}-${item.tag.name}`}
                        className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1 text-xs text-[var(--muted)]"
                      >
                        {item.tag.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[var(--muted)]">暂无标签</span>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(255,255,255,0.08)] pt-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    更新于 {formatDisplayDate(post.updatedAt)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(post)}
                      className="inline-flex h-10 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 text-sm font-medium text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.24)] hover:text-[var(--gold)]"
                    >
                      编辑
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(post.id)}
                      disabled={deletingId === post.id}
                      className="inline-flex h-10 items-center justify-center rounded-2xl border border-[rgba(214,179,106,0.16)] bg-[rgba(214,179,106,0.08)] px-4 text-sm font-medium text-[var(--gold)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === post.id ? "删除中..." : "删除"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-[28px] border border-dashed border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] p-8 text-sm text-[var(--muted)]">
            还没有文章，点击“新建文章”开始创建第一篇内容。
          </div>
        )}
      </div>
    </section>
  );
}
