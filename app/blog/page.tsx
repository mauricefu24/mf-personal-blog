import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { getSiteProfileWithFallback } from "@/lib/site-profile";
import ArticleCard from "@/app/components/ArticleCard";

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const [postsRaw, siteProfile] = await Promise.all([
    getPublishedPosts(),
    getSiteProfileWithFallback(),
  ]);

  const posts = postsRaw.map((post) => ({
    ...post,
    updatedAt: post.updatedAt.toISOString(),
  }));
  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1, 3);

  return (
    <main className="min-h-screen bg-zinc-50">
      <section className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:gap-6">
        <div className="rounded-[28px] border border-zinc-200 bg-white shadow-sm">
          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-7">
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Maurice的个人博客</p>
                <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                  记录技术实践，也整理每一次真实的构建过程
                </h1>
                <p className="mt-4 max-w-2xl text-[16px] leading-7 text-zinc-600 sm:text-lg sm:leading-8">
                  {siteProfile.heroIntro}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/admin"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-sky-600 px-6 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  后台管理
                </Link>
                <a
                  href="#posts"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                >
                  浏览文章
                </a>
                <Link
                  href="/"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                >
                  返回模块首页
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">文章总数</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">{posts.length}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">当前已发布内容，持续更新中。</p>
              </div>
              <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">主题方向</p>
                <p className="mt-3 text-xl font-semibold tracking-tight text-zinc-950">工程实践</p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">聚焦架构、数据层与自动化效率。</p>
              </div>
              <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">技术栈</p>
                <p className="mt-3 text-xl font-semibold tracking-tight text-zinc-950">Next.js / Prisma</p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">围绕真实项目构建可维护系统。</p>
              </div>
              <div className="rounded-[22px] border border-sky-200 bg-sky-50 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-sky-700">作者</p>
                <p className="mt-3 text-xl font-semibold tracking-tight text-zinc-950">{siteProfile.name}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{siteProfile.title}</p>
              </div>
            </div>
          </div>
        </div>

        <section className="rounded-[28px] border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 px-6 py-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Latest Posts</p>
                <h2 id="posts" className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                  最新文章
                </h2>
              </div>
              <p className="text-sm text-zinc-500">按最近更新排序展示。</p>
            </div>
          </div>

          <div className="grid gap-5 px-5 py-5 lg:grid-cols-[1.25fr_0.75fr]">
            {featuredPost ? (
              <>
                <ArticleCard post={featuredPost} variant="featured" />
                <div className="grid gap-4">
                  {secondaryPosts.length > 0 ? (
                    secondaryPosts.map((post) => (
                      <ArticleCard key={post.id} post={post} variant="compact" />
                    ))
                  ) : (
                    <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-8 text-zinc-600">
                      继续在后台创建更多文章，这里会自动填充文章列表。
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="lg:col-span-2 rounded-[24px] border border-zinc-200 bg-zinc-50 p-8 text-zinc-600">
                暂无已发布文章，先执行 `npm run db:seed` 或在后台创建第一篇文章即可。
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[28px] border border-zinc-200 bg-white shadow-sm">
          <div className="grid gap-5 px-6 py-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">About</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">关于我</h2>
              <div className="mt-5 flex items-start gap-4">
                {siteProfile.avatar ? (
                  <img
                    src={siteProfile.avatar}
                    alt={siteProfile.name}
                    className="h-16 w-16 rounded-2xl border border-zinc-200 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-lg font-semibold text-zinc-700">
                    {siteProfile.name.slice(0, 1)}
                  </div>
                )}
                <div>
                  <p className="text-xl font-semibold text-zinc-950">{siteProfile.name}</p>
                  <p className="mt-1 text-sm text-zinc-500">{siteProfile.title}</p>
                </div>
              </div>
              <div className="mt-5 space-y-4 text-[15px] leading-7 text-zinc-600">
                {siteProfile.bio.split(/\n{2,}/).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Focus & Skills</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {siteProfile.skills.map((skill) => (
                    <span
                      key={String(skill.id)}
                      className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700"
                    >
                      {skill.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-sky-200 bg-sky-50 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-sky-700">继续阅读</p>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
                  这里会持续更新关于架构、数据层和自动化实践的文章。
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-600">
                  如果你也关注技术实践、产品构建与效率提升，可以继续往下读。
                </p>
                <Link
                  href={siteProfile.ctaLink}
                  className="mt-5 inline-flex h-12 items-center justify-center rounded-2xl bg-sky-600 px-6 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  {siteProfile.ctaText}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
