import Link from "next/link";
import { formatDisplayDate } from "@/lib/format";

type Tag = {
  tag: {
    name: string;
  };
};

type Props = {
  post: {
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    category: { name: string } | null;
    tags: Tag[];
    updatedAt: string;
  };
  variant?: "featured" | "default" | "compact";
};

export default function ArticleCard({ post, variant = "default" }: Props) {
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group premium-panel premium-outline block rounded-[28px] transition duration-300 hover:-translate-y-1 hover:border-[rgba(214,179,106,0.32)] hover:shadow-[0_28px_70px_rgba(0,0,0,0.45)] ${
        isFeatured ? "p-7 sm:p-8" : isCompact ? "p-5" : "p-6 sm:p-7"
      }`}
    >
      {isFeatured ? (
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
              <span className="rounded-full border border-[rgba(214,179,106,0.22)] bg-[rgba(214,179,106,0.08)] px-3 py-1 font-medium text-[var(--gold)]">
                {formatDisplayDate(post.updatedAt)}
              </span>
              <span className="text-[rgba(255,255,255,0.16)]">/</span>
              <span>{post.category?.name ?? "未分类"}</span>
            </div>

            <h2 className="mt-6 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--gold)] sm:text-[2.2rem]">
              {post.title}
            </h2>
            <p className="mt-4 max-w-2xl line-clamp-4 text-[16px] leading-8 text-[rgba(245,245,242,0.78)]">
              {post.excerpt ?? "这篇文章暂未设置摘要。"}
            </p>

            {post.coverImage ? (
              <div className="mt-6 overflow-hidden rounded-[24px] border border-[rgba(214,179,106,0.14)] bg-black/30">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-64 w-full object-cover opacity-92 transition duration-500 group-hover:scale-[1.015]"
                />
              </div>
            ) : null}
          </div>

          <div className="mt-8 border-t border-[rgba(255,255,255,0.08)] pt-5">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 4).map((item) => (
                <span
                  key={item.tag.name}
                  className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1 text-xs text-[var(--muted)]"
                >
                  {item.tag.name}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
<span className="inline-flex items-center rounded-full border border-[rgba(214,179,106,0.22)] bg-[rgba(255,255,255,0.02)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition group-hover:border-[rgba(214,179,106,0.36)] group-hover:text-[var(--gold)]">
                阅读全文
              </span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
              <span className="rounded-full border border-[rgba(214,179,106,0.2)] bg-[rgba(214,179,106,0.08)] px-3 py-1 font-medium text-[var(--gold)]">
                {formatDisplayDate(post.updatedAt)}
              </span>
              <span className="text-[rgba(255,255,255,0.16)]">/</span>
              <span>{post.category?.name ?? "未分类"}</span>
            </div>
            <div className="hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--muted)] sm:block">
              {isCompact ? "Digest" : "Article"}
            </div>
          </div>

          <div className={`mt-5 flex items-start gap-4 ${isCompact ? "gap-3" : "gap-4"}`}>
            <div className={`mt-1 rounded-full bg-[linear-gradient(180deg,_#d6b36a_0%,_rgba(214,179,106,0.16)_100%)] ${isCompact ? "h-9 w-1" : "h-12 w-1.5"}`} />
            <div className="min-w-0 flex-1">
              <h2
                className={`font-semibold leading-tight tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--gold)] ${
                  isCompact ? "text-lg" : "text-2xl sm:text-[1.75rem]"
                }`}
              >
                {post.title}
              </h2>
              <p
                className={`mt-3 max-w-2xl text-[rgba(245,245,242,0.76)] ${
                  isCompact ? "line-clamp-2 text-[14px] leading-6" : "line-clamp-3 text-[15px] leading-7"
                }`}
              >
                {post.excerpt ?? "这篇文章暂未设置摘要。"}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.slice(0, isCompact ? 3 : 5).map((item) => (
              <span
                key={item.tag.name}
                className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1 text-xs text-[var(--muted)]"
              >
                {item.tag.name}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-[rgba(255,255,255,0.08)] pt-4">
            <div className="flex min-w-0 items-center gap-3">
              {post.coverImage ? (
                <div className="h-10 w-10 overflow-hidden rounded-xl border border-[rgba(214,179,106,0.14)] bg-black/30">
                  <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                  Post
                </div>
              )}
              <p className="truncate text-sm text-[var(--muted)]">
                {isCompact ? "快速阅读全文" : "继续阅读这篇文章的完整内容"}
              </p>
            </div>

            <span className="inline-flex items-center rounded-full border border-[rgba(214,179,106,0.2)] bg-[rgba(255,255,255,0.02)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition group-hover:border-[rgba(214,179,106,0.36)] group-hover:text-[var(--gold)]">
              阅读全文
            </span>
          </div>
        </>
      )}
    </Link>
  );
}
