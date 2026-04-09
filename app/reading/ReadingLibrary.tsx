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

const quickSearches = ["红楼梦", "Pride and Prejudice", "War and Peace", "百年孤独"];
const fullTextBooks = [
  {
    workId: "OL66554W",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    summary: "经典爱情与社会观察小说，当前已经验证可匹配到 Project Gutenberg 全文。",
  },
  {
    workId: "OL450063W",
    title: "Frankenstein",
    author: "Mary Shelley",
    summary: "哥特与科幻文学名作，适合测试全文阅读体验和长篇正文展示。",
  },
  {
    workId: "OL85892W",
    title: "Dracula",
    author: "Bram Stoker",
    summary: "吸血鬼题材代表作，公版文本资源丰富，适合直接进入全文阅读。",
  },
  {
    workId: "OL8193416W",
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    summary: "王尔德代表作之一，适合展示文学名著的长段落阅读和摘录内容。",
  },
  {
    workId: "OL262421W",
    title: "The Adventures of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    summary: "短篇集形式很适合后续扩展目录、章节跳转和案件索引。",
  },
  {
    workId: "OL1095427W",
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    summary: "经典女性成长小说，适合作为全文阅读和人物关系梳理的示例。",
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
  const [query, setQuery] = useState("Pride and Prejudice");
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
      <section className="rounded-[28px] border border-zinc-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96)_0%,_rgba(236,253,245,0.88)_100%)] p-6 shadow-sm sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-emerald-700">Reading Search</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            搜索你想阅读的名著
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
            通过 Open Library 的公开数据搜索书籍，结果会展示封面、作者、出版时间以及作品简介，适合做名著阅读入口和资料索引。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索书名、作者或关键词"
            className="h-13 flex-1 rounded-2xl border border-emerald-200 bg-white px-5 text-base text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-13 items-center justify-center rounded-2xl bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
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
              className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              {keyword}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-zinc-200 bg-white/90 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.06)] sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">Full Text Collection</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
              可匹配全文的推荐图书列表
            </h3>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-zinc-500">
            这些书优先选择了已经进入公版领域、并且较容易匹配到 Project Gutenberg 全文的经典作品。
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {fullTextBooks.map((book) => (
            <article
              key={book.workId}
              className="rounded-[24px] border border-zinc-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-emerald-700">Public Domain</p>
                  <h4 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">{book.title}</h4>
                  <p className="mt-2 text-sm text-zinc-600">{book.author}</p>
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  全文候选
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-zinc-600">{book.summary}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/reading/${book.workId}`}
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-medium text-white transition hover:bg-emerald-700"
                >
                  直接阅读
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setQuery(book.title);
                    void performSearch(book.title);
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                >
                  在搜索结果中查看
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-zinc-200 bg-white/90 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.06)] sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">Search Result</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
              {searchedQuery ? `“${searchedQuery}” 的搜索结果` : "等待搜索"}
            </h3>
          </div>
          <p className="text-sm text-zinc-500">
            {loading ? "正在拉取数据..." : books.length > 0 ? `共展示 ${books.length} 本相关书籍` : "输入关键词开始搜索"}
          </p>
        </div>

        {error ? (
          <div className="mt-5 rounded-[22px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {!error && books.length === 0 ? (
          <div className="mt-5 rounded-[24px] border border-zinc-200 bg-zinc-50 p-8 text-zinc-600">
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
                className="grid gap-5 rounded-[26px] border border-zinc-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] p-5 shadow-sm lg:grid-cols-[180px_1fr]"
              >
                <div className="overflow-hidden rounded-[20px] border border-zinc-200 bg-zinc-100">
                  {book.coverUrl ? (
                    <Image
                      src={book.coverUrl}
                      alt={book.title}
                      width={360}
                      height={540}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full min-h-[260px] items-center justify-center bg-[linear-gradient(180deg,_#ecfdf5_0%,_#d1fae5_100%)] px-6 text-center text-sm font-medium leading-7 text-emerald-800">
                      暂无封面
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">Classic Reading</p>
                      <Link
                        href={`/reading/${workIdFromKey(book.key)}`}
                        className="mt-3 inline-block text-3xl font-semibold tracking-tight text-zinc-950 transition hover:text-emerald-700"
                      >
                        {book.title}
                      </Link>
                      <p className="mt-3 text-base text-zinc-600">{book.author}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/reading/${workIdFromKey(book.key)}`}
                        className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-medium text-white transition hover:bg-emerald-700"
                      >
                        查看完整内容
                      </Link>
                      <a
                        href={book.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                      >
                        查看来源
                      </a>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm">
                    <span className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-zinc-700">
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

                  <div className="mt-6 rounded-[22px] border border-emerald-100 bg-emerald-50 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">内容简介</p>
                    <p className="mt-3 text-[15px] leading-8 text-zinc-700">{trimSummary(book.summary)}</p>
                  </div>

                  {book.subjects.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {book.subjects.map((subject) => (
                        <span
                          key={`${book.key}-${subject}`}
                          className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700"
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
