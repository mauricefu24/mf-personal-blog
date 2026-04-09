import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type AuthorRef = {
  author?: {
    key?: string;
  };
};

type LinkItem = {
  title?: string;
  url?: string;
};

type GutendexBook = {
  id: number;
  title?: string;
  authors?: Array<{
    name?: string;
  }>;
  copyright?: boolean;
  media_type?: string;
  formats?: Record<string, string>;
  download_count?: number;
};

type OpenLibraryWorkDetail = {
  key?: string;
  title?: string;
  description?: string | { value?: string };
  excerpts?: Array<{
    excerpt?: string | { value?: string };
    comment?: string;
  }>;
  covers?: number[];
  subjects?: string[];
  subject_people?: string[];
  subject_places?: string[];
  subject_times?: string[];
  links?: LinkItem[];
  first_publish_date?: string;
  authors?: AuthorRef[];
};

type OpenLibraryEdition = {
  key?: string;
  title?: string;
  publish_date?: string;
  publishers?: string[];
  number_of_pages?: number;
  description?: string | { value?: string };
  covers?: number[];
  ocaid?: string;
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

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, " ").trim();
}

function hasAuthorTokenOverlap(left: string, right: string) {
  if (!left || !right) {
    return true;
  }

  const leftTokens = new Set(left.split(/\s+/).filter((token) => token.length > 1));
  const rightTokens = right.split(/\s+/).filter((token) => token.length > 1);

  return rightTokens.some((token) => leftTokens.has(token));
}

function stripGutenbergBoilerplate(text: string) {
  const startPattern = /\*\*\*\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[\s\S]*?\*\*\*/i;
  const endPattern = /\*\*\*\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[\s\S]*?\*\*\*/i;

  const startMatch = text.match(startPattern);
  const startIndex = startMatch ? startMatch.index! + startMatch[0].length : 0;
  const endMatch = text.match(endPattern);
  const endIndex = endMatch ? endMatch.index! : text.length;

  return text
    .slice(startIndex, endIndex)
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function pickPlainTextFormat(formats: Record<string, string> = {}) {
  return (
    formats["text/plain; charset=utf-8"] ??
    formats["text/plain; charset=us-ascii"] ??
    formats["text/plain"]
  );
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ workId: string }> }
) {
  const { workId } = await context.params;

  const normalizedWorkId = workId.startsWith("OL") ? workId : workId.toUpperCase();
  const workKey = `/works/${normalizedWorkId}`;

  const workResponse = await fetch(`https://openlibrary.org${workKey}.json`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!workResponse.ok) {
    return NextResponse.json({ message: "未找到对应书籍详情。" }, { status: 404 });
  }

  const work = (await workResponse.json()) as OpenLibraryWorkDetail;

  const authorKeys = work.authors?.map((item) => item.author?.key).filter(Boolean) as string[] | undefined;
  const authorNames = authorKeys
    ? await Promise.all(
        authorKeys.map(async (authorKey) => {
          try {
            const response = await fetch(`https://openlibrary.org${authorKey}.json`, {
              cache: "no-store",
              headers: {
                Accept: "application/json",
              },
            });

            if (!response.ok) {
              return null;
            }

            const data = (await response.json()) as { name?: string };
            return data.name ?? null;
          } catch {
            return null;
          }
        })
      )
    : [];

  let gutenberg:
    | {
        id: number;
        title: string;
        author: string;
        sourceUrl: string;
        textUrl: string;
        coverUrl: string | null;
        downloadCount: number | null;
        fullText: string;
      }
    | null = null;

  try {
    const searchTerm = [work.title, authorNames[0]].filter(Boolean).join(" ");
    const gutendexResponse = await fetch(
      `https://gutendex.com/books/?search=${encodeURIComponent(searchTerm)}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (gutendexResponse.ok) {
      const gutendexData = (await gutendexResponse.json()) as { results?: GutendexBook[] };
      const normalizedTitle = normalizeText(work.title ?? "");
      const normalizedAuthor = normalizeText(authorNames[0] ?? "");

      const match =
        gutendexData.results?.find((item) => {
          const title = normalizeText(item.title ?? "");
          const author = normalizeText(item.authors?.[0]?.name ?? "");

          const titleMatches = normalizedTitle && title.includes(normalizedTitle);
          const authorMatches = hasAuthorTokenOverlap(normalizedAuthor, author);
          const isText = item.media_type === "Text";
          const isPublicDomain = item.copyright === false;
          const textUrl = pickPlainTextFormat(item.formats);

          return titleMatches && authorMatches && isText && isPublicDomain && Boolean(textUrl);
        }) ?? null;

      if (match) {
        const textUrl = pickPlainTextFormat(match.formats);

        if (textUrl) {
          const textResponse = await fetch(textUrl, {
            cache: "no-store",
            headers: {
              Accept: "text/plain",
            },
          });

          if (textResponse.ok) {
            const rawText = await textResponse.text();
            const fullText = stripGutenbergBoilerplate(rawText);

            if (fullText) {
              gutenberg = {
                id: match.id,
                title: match.title ?? work.title ?? "未知标题",
                author: match.authors?.[0]?.name ?? authorNames[0] ?? "未知作者",
                sourceUrl: `https://www.gutenberg.org/ebooks/${match.id}`,
                textUrl,
                coverUrl: match.formats?.["image/jpeg"] ?? null,
                downloadCount: match.download_count ?? null,
                fullText,
              };
            }
          }
        }
      }
    }
  } catch {
    gutenberg = null;
  }

  const editionsResponse = await fetch(`https://openlibrary.org${workKey}/editions.json?limit=8`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  const editionsData = editionsResponse.ok
    ? ((await editionsResponse.json()) as { entries?: OpenLibraryEdition[]; size?: number })
    : { entries: [], size: 0 };

  const coverId = work.covers?.find((item) => typeof item === "number" && item > 0) ?? null;
  const description = parseTextField(work.description);
  const excerpts = (work.excerpts ?? [])
    .map((item) => ({
      text: parseTextField(item.excerpt),
      comment: item.comment?.trim() ?? "",
    }))
    .filter((item) => item.text);

  const editions = (editionsData.entries ?? []).map((edition) => {
    const editionCoverId = edition.covers?.find((item) => typeof item === "number" && item > 0) ?? null;

    return {
      key: edition.key ?? "",
      title: edition.title ?? work.title ?? "未命名版本",
      publishDate: edition.publish_date ?? "未知",
      publishers: edition.publishers ?? [],
      pages: edition.number_of_pages ?? null,
      description: parseTextField(edition.description),
      coverUrl: editionCoverId ? `https://covers.openlibrary.org/b/id/${editionCoverId}-M.jpg` : null,
      archiveUrl: edition.ocaid ? `https://archive.org/details/${edition.ocaid}` : null,
    };
  });

  return NextResponse.json({
    key: workKey,
    workId: normalizedWorkId,
    title: work.title ?? "未命名书籍",
    authors: authorNames.filter(Boolean),
    firstPublishDate: work.first_publish_date ?? null,
    coverUrl: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null,
    description,
    excerpts,
    subjects: (work.subjects ?? []).slice(0, 16),
    people: (work.subject_people ?? []).slice(0, 12),
    places: (work.subject_places ?? []).slice(0, 12),
    times: (work.subject_times ?? []).slice(0, 12),
    links: (work.links ?? []).filter((item) => item.title && item.url).slice(0, 8),
    editions,
    editionCount: editionsData.size ?? editions.length,
    sourceUrl: `https://openlibrary.org${workKey}`,
    gutenberg,
  });
}
