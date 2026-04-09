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
      <div className="rounded-[28px] border border-zinc-200 bg-white p-8 text-zinc-600 shadow-sm">
        正在加载图书完整内容...
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-8 text-rose-700 shadow-sm">
        {error ?? "未找到图书内容。"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Link
          href="/reading"
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          返回书籍搜索
        </Link>
        <a
          href={detail.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          打开 Open Library 来源
        </a>
      </div>

      <section className="grid gap-6 rounded-[30px] border border-zinc-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] lg:grid-cols-[260px_1fr]">
        <div className="overflow-hidden rounded-[24px] border border-zinc-200 bg-zinc-100">
          {detail.coverUrl ? (
            <Image
              src={detail.coverUrl}
              alt={detail.title}
              width={520}
              height={780}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[360px] items-center justify-center bg-[linear-gradient(180deg,_#ecfdf5_0%,_#d1fae5_100%)] px-6 text-center text-sm font-medium leading-7 text-emerald-800">
              暂无封面
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm uppercase tracking-[0.26em] text-emerald-700">Full Reading Detail</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            {detail.title}
          </h1>
          <p className="mt-4 text-lg text-zinc-600">
            {detail.authors.length > 0 ? detail.authors.join(" / ") : "作者信息暂缺"}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-zinc-700">
              首次出版：{detail.firstPublishDate ?? "未知"}
            </span>
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-zinc-700">
              收录版本：{detail.editionCount}
            </span>
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-zinc-700">
              作品编号：{detail.workId}
            </span>
          </div>

          <div className="mt-8 rounded-[24px] border border-emerald-100 bg-emerald-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">完整简介</p>
            <div className="mt-4 space-y-4 text-[15px] leading-8 text-zinc-700">
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
        <section className="rounded-[28px] border border-emerald-200 bg-[linear-gradient(180deg,_#f0fdf4_0%,_#ffffff_100%)] p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Public Domain Full Text</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                可直接阅读的全文
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600">
                这部分全文来自 Project Gutenberg 公版文本，通过 Gutendex 检索匹配后接入。适用于已经进入公版领域的作品。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={detail.gutenberg.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                打开 Gutenberg 页面
              </a>
              <a
                href={detail.gutenberg.textUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                打开原始全文
              </a>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-zinc-700">
              Gutenberg ID：{detail.gutenberg.id}
            </span>
            <span className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-zinc-700">
              下载量：{detail.gutenberg.downloadCount ?? "未知"}
            </span>
          </div>

          <div className="mt-6 max-h-[70vh] overflow-y-auto rounded-[24px] border border-zinc-200 bg-white p-6">
            <div className="space-y-5 text-[15px] leading-8 text-zinc-700">
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
        <section className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-6 text-zinc-600 shadow-sm">
          当前没有匹配到可直接展示的公版全文，所以这里先展示完整资料页。如果后续接入更多公版全文来源，这里可以继续扩展。
        </section>
      )}

      {detail.excerpts.length > 0 ? (
        <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">摘录片段</p>
          <div className="mt-5 grid gap-4">
            {detail.excerpts.map((excerpt, index) => (
              <blockquote
                key={`${detail.workId}-excerpt-${index}`}
                className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-5 text-[15px] leading-8 text-zinc-700"
              >
                <p>{excerpt.text}</p>
                {excerpt.comment ? <footer className="mt-3 text-sm text-zinc-500">{excerpt.comment}</footer> : null}
              </blockquote>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">主题标签</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {detail.subjects.length > 0 ? (
              detail.subjects.map((subject) => (
                <span
                  key={`${detail.workId}-subject-${subject}`}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-700"
                >
                  {subject}
                </span>
              ))
            ) : (
              <p className="text-zinc-600">暂无主题标签。</p>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">相关人物 / 地点 / 时间</p>
          <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-700">
            <p>人物：{detail.people.length > 0 ? detail.people.join("、") : "暂无"}</p>
            <p>地点：{detail.places.length > 0 ? detail.places.join("、") : "暂无"}</p>
            <p>时间：{detail.times.length > 0 ? detail.times.join("、") : "暂无"}</p>
          </div>
        </div>
      </section>

      {detail.editions.length > 0 ? (
        <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">版本信息</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">可用版本与延伸阅读</h2>
            </div>
            <p className="text-sm text-zinc-500">优先展示前 8 个检索到的版本。</p>
          </div>

          <div className="mt-6 grid gap-4">
            {detail.editions.map((edition) => (
              <article
                key={edition.key}
                className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-950">{edition.title}</h3>
                    <p className="mt-2 text-sm text-zinc-600">
                      出版时间：{edition.publishDate} {edition.publishers.length > 0 ? `· 出版社：${edition.publishers.join(" / ")}` : ""}
                    </p>
                    {edition.pages ? <p className="mt-2 text-sm text-zinc-600">页数：{edition.pages}</p> : null}
                  </div>
                  {edition.archiveUrl ? (
                    <a
                      href={edition.archiveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                    >
                      查看版本
                    </a>
                  ) : null}
                </div>
                {edition.description ? (
                  <p className="mt-4 text-sm leading-7 text-zinc-700">{edition.description}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {detail.links.length > 0 ? (
        <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">相关链接</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {detail.links.map((link) => (
              <a
                key={`${detail.workId}-${link.url}`}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
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
