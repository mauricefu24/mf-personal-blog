import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublishedPostBySlug, getPublishedPostSlugs } from "@/lib/posts";
import { formatDisplayDate } from "@/lib/format";
import ArticleContent from "@/app/components/ArticleContent";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return getPublishedPostSlugs();
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen premium-shell">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-4 py-2 text-sm font-medium text-[var(--muted)] transition hover:border-[rgba(214,179,106,0.2)] hover:text-[var(--foreground)]"
          >
            返回博客首页
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-4 py-2 text-sm font-medium text-[var(--muted)] transition hover:border-[rgba(214,179,106,0.2)] hover:text-[var(--foreground)]"
          >
            返回首页
          </Link>
        </div>

        <article className="premium-panel overflow-hidden rounded-[36px]">
          <header className="border-b border-[rgba(255,255,255,0.08)] px-7 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
              <span>{formatDisplayDate(post.updatedAt)}</span>
              <span className="text-[rgba(255,255,255,0.16)]">/</span>
              <span className="rounded-full border border-[rgba(214,179,106,0.2)] bg-[rgba(214,179,106,0.08)] px-3 py-1 font-medium text-[var(--gold)]">
                {post.category?.name ?? "未分类"}
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>

            {post.excerpt ? (
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[rgba(245,245,242,0.7)]">
                {post.excerpt}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((item: { tag: { name: string } }) => (
                <span
                  key={item.tag.name}
                  className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1 text-sm text-[var(--muted)]"
                >
                  {item.tag.name}
                </span>
              ))}
            </div>

            {post.coverImage ? (
              <div className="mt-8 overflow-hidden rounded-[30px] border border-[rgba(214,179,106,0.12)] bg-black/20">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-72 w-full object-cover opacity-95 sm:h-[28rem]"
                />
              </div>
            ) : null}
          </header>

          <div className="px-7 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
            <ArticleContent content={post.content} />
          </div>
        </article>
      </div>
    </main>
  );
}
