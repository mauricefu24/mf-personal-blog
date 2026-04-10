"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

type Book = {
  key: string;
  title: string;
  author: string;
  firstPublishYear: number | null;
  coverUrl: string | null;
  summary: string;
  subjects: string[];
  rating: number | null;
  editionCount: number | null;
  readers: number | null;
  sourceUrl: string;
};

const quickSearches = ["红楼梦", "西游记", "水浒传", "三国演义", "边城", "骆驼祥子"];
const featuredBooks = [
  {
    workId: "014082023",
    title: "红楼梦",
    author: "(清)曹雪芹",
    summary: "国家图书馆中文馆藏中的经典文学书目，适合直接进入中文书目详情页查看馆藏与主题信息。",
  },
  {
    workId: "014222268",
    title: "三国演义",
    author: "(明)罗贯中",
    summary: "以国家图书馆中文馆藏为基础，保留中文书目、作者责任和馆藏位置的阅读入口。",
  },
  {
    workId: "014069188",
    title: "西游记",
    author: "(明)吴承恩",
    summary: "用中文书目数据替代英文开放图书源后，更适合作为名著阅读模块的长期入口。",
  },
  {
    workId: "014082110",
    title: "水浒传",
    author: "(明)施耐庵",
    summary: "保留名著阅读详情页结构，但内容来源切换为国家图书馆 OPAC 的中文书目信息。",
  },
  {
    workId: "014213152",
    title: "骆驼祥子",
    author: "老舍",
    summary: "现代文学作品也可以直接进入馆藏详情，查看出版项、附注和馆藏位置。",
  },
  {
    workId: "013811611",
    title: "边城",
    author: "沈从文",
    summary: "以中文来源为主的数据链路更适合后续继续扩展书单、摘录与中文阅读笔记。",
  },
] as const;

function trimSummary(text: string) {
  if (text.length <= 280) {
    return text;
  }

  return `${text.slice(0, 280).trim()}...`;
}

function workIdFromKey(key: string) {
  return key.split("/").filter(Boolean).pop() ?? key;
}

export default function ReadingLibrary() {
  const [query, setQuery] = useState("红楼梦");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function performSearch(nextQuery: string) {
    const normalizedQuery = nextQuery.trim();
    if (!normalizedQuery) {
      setError("请输入书名、作者或关键词。");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/reading/search?q=${encodeURIComponent(normalizedQuery)}`);
      const data = (await response.json()) as { books?: Book[]; message?: string };

      if (!response.ok) {
        setError(data.message ?? "搜索失败，请稍后再试。");
        setBooks([]);
        setLoading(false);
        return;
      }

      setBooks(data.books ?? []);
      setSearchedQuery(normalizedQuery);
    } catch {
      setError("搜索失败，请检查网络连接后重试。");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await performSearch(query);
  }

  return (
    <div className="space-y-6">
      <section className="premium-panel rounded-[28px] p-6 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-[var(--gold)]">Reading Search</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            搜索你想阅读的名著
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
            通过国家图书馆 OPAC 的中文书目数据搜索图书，结果会展示作者、出版社、出版年份与馆藏复本，适合作为中文名著阅读入口和资料索引。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索书名、作者或关键词"
            className="h-13 flex-1 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.18)] px-5 text-base text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[rgba(214,179,106,0.4)] focus:ring-4 focus:ring-[rgba(214,179,106,0.12)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-13 items-center justify-center rounded-2xl bg-[var(--gold)] px-6 text-sm font-semibold text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "搜索中..." : "搜索书籍"}
          </button>
        </form>

        <div className="mt-5 flex flex-wrap gap-3">
          {quickSearches.map((keyword) => (
            <button
              key={keyword}
              type="button"
              onClick={() => {
                setQuery(keyword);
                void performSearch(keyword);
              }}
              className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-sm font-medium text-[var(--muted)] transition hover:border-[rgba(214,179,106,0.26)] hover:text-[var(--gold)]"
            >
              {keyword}
            </button>
          ))}
        </div>
      </section>

      <section className="premium-panel rounded-[28px] p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--gold)]">Featured Collection</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              中文经典推荐书目
            </h3>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">
            这里展示的是切换到国家图书馆中文数据源后更适合作为模块入口的经典书目，可直接进入中文详情页查看书目信息和馆藏位置。
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {featuredBooks.map((book) => (
            <article
              key={book.workId}
              className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[var(--gold)]">Chinese Classics</p>
                  <h4 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">{book.title}</h4>
                  <p className="mt-2 text-sm text-[var(--muted)]">{book.author}</p>
                </div>
                <span className="rounded-full border border-[rgba(214,179,106,0.18)] bg-[rgba(214,179,106,0.08)] px-3 py-1 text-xs font-semibold text-[var(--gold)]">
                  中文来源
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{book.summary}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/reading/${book.workId}`}
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-[var(--gold)] px-5 text-sm font-medium text-black transition hover:brightness-105"
                >
                  查看详情
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setQuery(book.title);
                    void performSearch(book.title);
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 text-sm font-medium text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.24)] hover:text-[var(--gold)]"
                >
                  在馆藏结果中查看
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="premium-panel rounded-[28px] p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--gold)]">Search Result</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              {searchedQuery ? `“${searchedQuery}” 的搜索结果` : "等待搜索"}
            </h3>
          </div>
          <p className="text-sm text-[var(--muted)]">
            {loading ? "正在拉取数据..." : books.length > 0 ? `共展示 ${books.length} 本相关书籍` : "输入关键词开始搜索"}
          </p>
        </div>

        {error ? (
          <div className="mt-5 rounded-[22px] border border-[rgba(214,179,106,0.18)] bg-[rgba(214,179,106,0.08)] p-4 text-sm text-[var(--gold)]">
            {error}
          </div>
        ) : null}

        {!error && books.length === 0 ? (
          <div className="mt-5 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-8 text-[var(--muted)]">
            {loading
              ? "正在搜索书籍，请稍候..."
              : "还没有搜索结果。你可以先试试上面的快捷搜索，或者输入一本想读的书。"}
          </div>
        ) : null}

        {books.length > 0 ? (
          <div className="mt-6 grid gap-5">
            {books.map((book) => (
              <article
                key={book.key}
                className="grid gap-5 rounded-[26px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.28)] lg:grid-cols-[180px_1fr]"
              >
                <div className="overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]">
                  {book.coverUrl ? (
                    <Image
                      src={book.coverUrl}
                      alt={book.title}
                      width={360}
                      height={540}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full min-h-[260px] items-center justify-center bg-[linear-gradient(180deg,rgba(214,179,106,0.12)_0%,rgba(255,255,255,0.03)_100%)] px-6 text-center text-sm font-medium leading-7 text-[var(--gold)]">
                      暂无封面
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-[var(--gold)]">Classic Reading</p>
                      <Link
                        href={`/reading/${workIdFromKey(book.key)}`}
                        className="mt-3 inline-block text-3xl font-semibold tracking-tight text-[var(--foreground)] transition hover:text-[var(--gold)]"
                      >
                        {book.title}
                      </Link>
                      <p className="mt-3 text-base text-[var(--muted)]">{book.author}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/reading/${workIdFromKey(book.key)}`}
                        className="inline-flex h-11 items-center justify-center rounded-2xl bg-[var(--gold)] px-5 text-sm font-medium text-black transition hover:brightness-105"
                      >
                        查看完整内容
                      </Link>
                      <a
                        href={book.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 text-sm font-medium text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.24)] hover:text-[var(--gold)]"
                      >
                        查看来源
                      </a>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm">
                    <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-[var(--muted)]">
                      首次出版：{book.firstPublishYear ?? "未知"}
                    </span>
                    <span className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-zinc-700">
                      版本数：{book.editionCount ?? "未知"}
                    </span>
                    <span className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-zinc-700">
                      评分：{book.rating ?? "暂无"}
                    </span>
                    <span className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-zinc-700">
                      已读标记：{book.readers ?? "暂无"}
                    </span>
                  </div>

                  <div className="mt-6 rounded-[22px] border border-[rgba(214,179,106,0.14)] bg-[rgba(214,179,106,0.06)] p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">内容简介</p>
                    <p className="mt-3 text-[15px] leading-8 text-[rgba(245,245,242,0.82)]">{trimSummary(book.summary)}</p>
                  </div>

                  {book.subjects.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {book.subjects.map((subject) => (
                        <span
                          key={`${book.key}-${subject}`}
                          className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1 text-xs font-medium text-[var(--muted)]"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
