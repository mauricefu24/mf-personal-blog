"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type DetailLink = {
  title?: string;
  url?: string;
};

type DetailExcerpt = {
  text: string;
  comment: string;
};

type Edition = {
  key: string;
  title: string;
  publishDate: string;
  publishers: string[];
  pages: number | null;
  description: string;
  coverUrl: string | null;
  archiveUrl: string | null;
};

type BookDetail = {
  key: string;
  workId: string;
  title: string;
  authors: string[];
  firstPublishDate: string | null;
  coverUrl: string | null;
  description: string;
  excerpts: DetailExcerpt[];
  subjects: string[];
  people: string[];
  places: string[];
  times: string[];
  links: DetailLink[];
  editions: Edition[];
  editionCount: number;
  sourceUrl: string;
  gutenberg: {
    id: number;
    title: string;
    author: string;
    sourceUrl: string;
    textUrl: string;
    coverUrl: string | null;
    downloadCount: number | null;
    fullText: string;
  } | null;
};

type Props = {
  workId: string;
};

export default function ReadingDetail({ workId }: Props) {
  const [detail, setDetail] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDetail() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/reading/${workId}`);
        const data = (await response.json()) as BookDetail & { message?: string };

        if (!response.ok) {
          if (!cancelled) {
            setError(data.message ?? "无法加载图书详情。");
            setDetail(null);
          }
          return;
        }

        if (!cancelled) {
          setDetail(data);
        }
      } catch {
        if (!cancelled) {
          setError("图书详情加载失败，请稍后重试。");
          setDetail(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDetail();

    return () => {
      cancelled = true;
    };
  }, [workId]);

  if (loading) {
    return (
      <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-8 text-[var(--muted)] shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
        正在加载图书完整内容...
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="rounded-[28px] border border-[rgba(214,179,106,0.18)] bg-[rgba(214,179,106,0.08)] p-8 text-[var(--gold)] shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
        {error ?? "未找到图书内容。"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Link
          href="/reading"
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 text-sm font-medium text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.24)] hover:text-[var(--gold)]"
        >
          返回书籍搜索
        </Link>
        <a
          href={detail.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-[var(--gold)] px-5 text-sm font-medium text-black transition hover:brightness-105"
        >
          打开 Open Library 来源
        </a>
      </div>

      <section className="grid gap-6 rounded-[30px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.28)] lg:grid-cols-[260px_1fr]">
        <div className="overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]">
          {detail.coverUrl ? (
            <Image
              src={detail.coverUrl}
              alt={detail.title}
              width={520}
              height={780}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[360px] items-center justify-center bg-[linear-gradient(180deg,rgba(214,179,106,0.12)_0%,rgba(255,255,255,0.03)_100%)] px-6 text-center text-sm font-medium leading-7 text-[var(--gold)]">
              暂无封面
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm uppercase tracking-[0.26em] text-[var(--gold)]">Full Reading Detail</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
            {detail.title}
          </h1>
          <p className="mt-4 text-lg text-[var(--muted)]">
            {detail.authors.length > 0 ? detail.authors.join(" / ") : "作者信息暂缺"}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-[var(--muted)]">
              首次出版：{detail.firstPublishDate ?? "未知"}
            </span>
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-zinc-700">
              收录版本：{detail.editionCount}
            </span>
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-zinc-700">
              作品编号：{detail.workId}
            </span>
          </div>

          <div className="mt-8 rounded-[24px] border border-[rgba(214,179,106,0.14)] bg-[rgba(214,179,106,0.06)] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">完整简介</p>
            <div className="mt-4 space-y-4 text-[15px] leading-8 text-[rgba(245,245,242,0.82)]">
              {detail.description ? (
                detail.description
                  .split(/\n{2,}/)
                  .filter(Boolean)
                  .map((paragraph, index) => <p key={`${detail.workId}-description-${index}`}>{paragraph}</p>)
              ) : (
                <p>当前来源没有提供更完整的正文简介。</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {detail.gutenberg ? (
        <section className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">Public Domain Full Text</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                可直接打开的官方记录
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
                这里现在保留给可直接打开的官方来源记录。当前阅读模块已经切换到国家图书馆中文书目数据，不再依赖英文公版全文源。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={detail.gutenberg.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-[var(--gold)] px-5 text-sm font-medium text-black transition hover:brightness-105"
              >
                打开官方记录
              </a>
              <a
                href={detail.gutenberg.textUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 text-sm font-medium text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.24)] hover:text-[var(--gold)]"
              >
                打开馆藏页面
              </a>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-[var(--muted)]">
              记录编号：{detail.gutenberg.id}
            </span>
            <span className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-zinc-700">
              来源统计：{detail.gutenberg.downloadCount ?? "未知"}
            </span>
          </div>

          <div className="mt-6 max-h-[70vh] overflow-y-auto rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-6">
            <div className="space-y-5 text-[15px] leading-8 text-[rgba(245,245,242,0.82)]">
              {detail.gutenberg.fullText
                .split(/\n{2,}/)
                .filter((paragraph) => paragraph.trim().length > 0)
                .map((paragraph, index) => (
                  <p key={`${detail.workId}-fulltext-${index}`} className="whitespace-pre-wrap">
                    {paragraph.trim()}
                  </p>
                ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-6 text-[var(--muted)] shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
          当前阅读模块已经切换到国家图书馆中文书目与馆藏数据，所以这里主要展示书目信息、主题标签和馆藏位置，不再默认展示英文公版全文。
        </section>
      )}

      {detail.excerpts.length > 0 ? (
        <section className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">摘录片段</p>
          <div className="mt-5 grid gap-4">
            {detail.excerpts.map((excerpt, index) => (
              <blockquote
                key={`${detail.workId}-excerpt-${index}`}
                className="rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5 text-[15px] leading-8 text-[rgba(245,245,242,0.82)]"
              >
                <p>{excerpt.text}</p>
                {excerpt.comment ? <footer className="mt-3 text-sm text-[var(--muted)]">{excerpt.comment}</footer> : null}
              </blockquote>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">主题标签</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {detail.subjects.length > 0 ? (
              detail.subjects.map((subject) => (
                <span
                  key={`${detail.workId}-subject-${subject}`}
                  className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1 text-sm text-[var(--muted)]"
                >
                  {subject}
                </span>
              ))
            ) : (
              <p className="text-[var(--muted)]">暂无主题标签。</p>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">相关人物 / 地点 / 时间</p>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[rgba(245,245,242,0.82)]">
            <p>人物：{detail.people.length > 0 ? detail.people.join("、") : "暂无"}</p>
            <p>地点：{detail.places.length > 0 ? detail.places.join("、") : "暂无"}</p>
            <p>时间：{detail.times.length > 0 ? detail.times.join("、") : "暂无"}</p>
          </div>
        </div>
      </section>

      {detail.editions.length > 0 ? (
        <section className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">版本信息</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">馆藏位置与借阅状态</h2>
            </div>
            <p className="text-sm text-[var(--muted)]">这里展示的是国家图书馆返回的单册馆藏位置、流通状态与索书号信息。</p>
          </div>

          <div className="mt-6 grid gap-4">
            {detail.editions.map((edition) => (
              <article
                key={edition.key}
                className="rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">{edition.title}</h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      出版时间：{edition.publishDate} {edition.publishers.length > 0 ? `· 出版社：${edition.publishers.join(" / ")}` : ""}
                    </p>
                    {edition.pages ? <p className="mt-2 text-sm text-[var(--muted)]">页数：{edition.pages}</p> : null}
                  </div>
                  {edition.archiveUrl ? (
                    <a
                      href={edition.archiveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 text-sm font-medium text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.24)] hover:text-[var(--gold)]"
                    >
                      查看版本
                    </a>
                  ) : null}
                </div>
                {edition.description ? (
                  <p className="mt-4 text-sm leading-7 text-[rgba(245,245,242,0.82)]">{edition.description}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {detail.links.length > 0 ? (
        <section className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">相关链接</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {detail.links.map((link) => (
              <a
                key={`${detail.workId}-${link.url}`}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 text-sm font-medium text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.24)] hover:text-[var(--gold)]"
              >
                {link.title}
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
