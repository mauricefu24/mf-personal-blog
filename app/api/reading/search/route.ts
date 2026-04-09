import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type OpenLibrarySearchDoc = {
  key: string;
  title?: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  subject?: string[];
  ratings_average?: number;
  edition_count?: number;
  already_read_count?: number;
};

type OpenLibraryWorkDetail = {
  description?: string | { value?: string };
  excerpts?: Array<{
    excerpt?: string | { value?: string };
  }>;
  covers?: number[];
  subjects?: string[];
};

function parseTextField(value: string | { value?: string } | undefined) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return value.value?.trim() ?? "";
}

function normalizeSummary(detail: OpenLibraryWorkDetail, fallbackSubjects: string[] = []) {
  const description = parseTextField(detail.description);
  if (description) {
    return description;
  }

  const excerpt = detail.excerpts?.map((item) => parseTextField(item.excerpt)).find(Boolean);
  if (excerpt) {
    return excerpt;
  }

  if (detail.subjects?.length) {
    return `主题关键词：${detail.subjects.slice(0, 8).join("、")}`;
  }

  if (fallbackSubjects.length) {
    return `主题关键词：${fallbackSubjects.slice(0, 8).join("、")}`;
  }

  return "当前未检索到简介，可以继续搜索其他书名或作者。";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ message: "请提供要搜索的书名或作者。" }, { status: 400 });
  }

  const searchUrl = new URL("https://openlibrary.org/search.json");
  searchUrl.searchParams.set("q", query);
  searchUrl.searchParams.set("limit", "8");
  searchUrl.searchParams.set(
    "fields",
    "key,title,author_name,cover_i,first_publish_year,subject,ratings_average,already_read_count,edition_count"
  );

  const searchResponse = await fetch(searchUrl, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!searchResponse.ok) {
    return NextResponse.json({ message: "书籍搜索接口暂时不可用，请稍后再试。" }, { status: 502 });
  }

  const searchData = (await searchResponse.json()) as { docs?: OpenLibrarySearchDoc[] };
  const docs = searchData.docs ?? [];

  const books = await Promise.all(
    docs.map(async (doc) => {
      const workKey = doc.key;
      const workUrl = `https://openlibrary.org${workKey}.json`;

      let detail: OpenLibraryWorkDetail | null = null;

      try {
        const detailResponse = await fetch(workUrl, {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        if (detailResponse.ok) {
          detail = (await detailResponse.json()) as OpenLibraryWorkDetail;
        }
      } catch {
        detail = null;
      }

      const rawCoverId = detail?.covers?.[0] ?? doc.cover_i;
      const coverId = typeof rawCoverId === "number" && rawCoverId > 0 ? rawCoverId : null;
      const subjects = doc.subject ?? [];

      return {
        key: workKey,
        title: doc.title ?? "未命名书籍",
        author: doc.author_name?.join(" / ") ?? "作者信息暂缺",
        firstPublishYear: doc.first_publish_year ?? null,
        coverUrl: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null,
        summary: normalizeSummary(detail ?? {}, subjects),
        subjects: subjects.slice(0, 6),
        rating: typeof doc.ratings_average === "number" ? Number(doc.ratings_average.toFixed(1)) : null,
        editionCount: doc.edition_count ?? null,
        readers: doc.already_read_count ?? null,
        sourceUrl: `https://openlibrary.org${workKey}`,
      };
    })
  );

  return NextResponse.json({
    query,
    books,
  });
}
