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
  const latestPosts = posts.slice(1);

  return (
    <main className="min-h-screen premium-shell">
      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="premium-panel rounded-[36px] px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_360px] lg:items-end">
            <div className="max-w-4xl">
              <div className="mb-7 inline-flex items-center gap-3 rounded-[22px] border border-[rgba(214,179,106,0.18)] bg-[linear-gradient(180deg,_rgba(255,255,255,0.05)_0%,_rgba(255,255,255,0.02)_100%)] px-3 py-3 shadow-[0_14px_32px_rgba(0,0,0,0.25)]">
                <Link
                  href="/"
                  aria-label="返回模块首页"
                  className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[rgba(214,179,106,0.24)] bg-[radial-gradient(circle_at_30%_30%,_rgba(214,179,106,0.24),_rgba(214,179,106,0.06)_52%,_transparent_72%)] text-[var(--gold)] transition hover:-translate-y-0.5 hover:border-[rgba(214,179,106,0.38)] hover:text-[var(--foreground)]"
                >
                  <div className="absolute inset-[7px] rounded-[14px] border border-[rgba(214,179,106,0.18)]" />
                  <div className="absolute h-6 w-[1px] rotate-45 bg-[rgba(214,179,106,0.28)]" />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="relative h-5 w-5">
                    <path d="M15 18 9 12l6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <div className="pr-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--gold)]">Navigation</p>
                  <p className="mt-1 text-sm font-medium text-[rgba(245,245,242,0.82)]">返回模块首页</p>
                </div>
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--gold)]">Maurice Journal</p>
              <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-6xl lg:text-7xl">
                把构建、思考与长期主义，写成一座持续生长的技术档案馆。
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[rgba(245,245,242,0.76)] sm:text-lg">
                {siteProfile.heroIntro}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#featured-post"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--gold)] px-6 text-sm font-semibold text-black transition hover:brightness-105"
                >
                  精选文章
                </a>
                <a
                  href="#latest-posts"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[rgba(214,179,106,0.2)] bg-[rgba(255,255,255,0.03)] px-6 text-sm font-semibold text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.34)] hover:text-[var(--gold)]"
                >
                  最新文章
                </a>
                <Link
                  href="/admin"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[rgba(214,179,106,0.2)] bg-[rgba(214,179,106,0.08)] px-6 text-sm font-semibold text-[var(--gold)] transition hover:brightness-110"
                >
                  新建文章
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { label: "Published", value: String(posts.length), note: "已发布文章" },
                { label: "Primary Topics", value: "3", note: "工程 / 阅读 / 工作" },
                { label: "Profile", value: siteProfile.name, note: siteProfile.title },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[26px] border border-[rgba(214,179,106,0.16)] bg-[linear-gradient(180deg,_rgba(255,255,255,0.04)_0%,_rgba(255,255,255,0.02)_100%)] px-5 py-5"
                >
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-[rgba(245,245,242,0.62)]">{item.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="featured-post" className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--gold)]">精选文章</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">精选文章</h2>
              </div>
              <p className="text-sm leading-7 text-[var(--muted)]">以最新发布内容作为首页主推荐。</p>
            </div>

            <div className="mt-8">
              {featuredPost ? (
                <ArticleCard post={featuredPost} variant="featured" />
              ) : (
                <div className="premium-panel rounded-[28px] px-8 py-10 text-[var(--muted)]">
                  暂无已发布文章，先执行 `npm run db:seed` 或进入后台创建第一篇内容。
                </div>
              )}
            </div>
          </section>

          <section id="latest-posts" className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--gold)]">最新文章</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">最新文章</h2>
              </div>
              <p className="text-sm leading-7 text-[var(--muted)]">按更新时间排序的 editorial 列表。</p>
            </div>

            <div className="mt-8 grid gap-5 xl:grid-cols-2">
              {latestPosts.length > 0 ? (
                latestPosts.map((post, index) => (
                  <ArticleCard
                    key={post.id}
                    post={post}
                    variant={index < 2 ? "default" : "compact"}
                  />
                ))
              ) : (
                <div className="premium-panel rounded-[28px] px-8 py-10 text-[var(--muted)]">
                  更多文章发布后，这里会自动形成持续更新的内容列表。
                </div>
              )}
            </div>
          </section>

          <section className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--gold)]">About Me</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">作者与关注方向</h2>
              </div>
              <p className="text-sm leading-7 text-[var(--muted)]">保持内容优先，也让作者视角成为博客的一部分。</p>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="premium-panel rounded-[28px] p-7">
                <div className="flex items-start gap-4">
                  {siteProfile.avatar ? (
                    <img
                      src={siteProfile.avatar}
                      alt={siteProfile.name}
                      className="h-[4.5rem] w-[4.5rem] rounded-[22px] border border-[rgba(214,179,106,0.18)] object-cover"
                    />
                  ) : (
                    <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[22px] border border-[rgba(214,179,106,0.18)] bg-[rgba(214,179,106,0.08)] text-xl font-semibold text-[var(--gold)]">
                      {siteProfile.name.slice(0, 1)}
                    </div>
                  )}
                  <div>
                    <p className="text-2xl font-semibold text-[var(--foreground)]">{siteProfile.name}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{siteProfile.title}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-[15px] leading-8 text-[rgba(245,245,242,0.76)]">
                  {siteProfile.bio.split(/\n{2,}/).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="grid gap-5">
                <div className="premium-panel rounded-[28px] p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">Skills</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {siteProfile.skills.map((skill) => (
                      <span
                        key={String(skill.id)}
                        className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-sm text-[var(--muted)]"
                      >
                        {skill.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="premium-panel rounded-[28px] p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">Continue Reading</p>
                  <p className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-[var(--foreground)]">
                    从这里继续阅读关于架构、数据库与自动化系统的长期实践记录。
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                    如果你也在做个人产品、技术博客或内容系统，这里会持续有新的真实构建案例。
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
