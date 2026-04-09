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
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#ffffff_30%,_#f8fafc_100%)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10 sm:py-14">
        <Link href="/" className="text-sm font-medium text-sky-700 hover:underline">
          ← 返回文章列表
        </Link>

        <article className="overflow-hidden rounded-[32px] border border-zinc-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <header className="border-b border-zinc-200/80 px-8 py-8 sm:px-12 sm:py-10">
            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
              <span>发布于 {formatDisplayDate(post.updatedAt)}</span>
              <span className="text-zinc-300">/</span>
              <span className="rounded-full bg-sky-50 px-3 py-1 font-medium text-sky-700">
                {post.category?.name ?? "未分类"}
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
              {post.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">{post.excerpt}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((item: { tag: { name: string } }) => (
                <span
                  key={item.tag.name}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-700"
                >
                  {item.tag.name}
                </span>
              ))}
            </div>

            {post.coverImage ? (
              <div className="mt-8 overflow-hidden rounded-[28px] border border-zinc-200 bg-zinc-100">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-72 w-full object-cover sm:h-96"
                />
              </div>
            ) : null}
          </header>

          <div className="px-8 py-8 sm:px-12 sm:py-10">
            <ArticleContent content={post.content} />

            <div className="mx-auto mt-12 flex max-w-3xl justify-between gap-4 border-t border-zinc-200 pt-6">
              <Link
                href="/"
                className="inline-flex items-center rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                返回首页
              </Link>
              <Link
                href="/"
                className="inline-flex items-center rounded-2xl bg-sky-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-sky-700"
              >
                返回文章列表
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
