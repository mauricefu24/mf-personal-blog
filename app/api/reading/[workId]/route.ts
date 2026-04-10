import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const OPAC_BASE_URL = "http://opac.nlc.cn/F/";

function decodeHtml(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/&lsquo;|&rsquo;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripTags(value: string) {
  return decodeHtml(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTitle(value: string) {
  return value
    .split("/")
    .at(0)
    ?.replace(/\s*\[[^\]]+\]\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim() ?? value;
}

function pickFirst(values: string[]) {
  return values.find(Boolean) ?? "";
}

function getFieldValues(html: string, label: string) {
  const pattern = new RegExp(
    `<tr>[\\s\\S]*?<td[^>]*nowrap>\\s*${label}\\s*<\\/td>[\\s\\S]*?<td[^>]*align=left[^>]*>\\s*([\\s\\S]*?)\\s*<\\/td>[\\s\\S]*?<\\/tr>`,
    "g",
  );

  return Array.from(html.matchAll(pattern)).map((match) => stripTags(match[1] ?? ""));
}

function getSectionLinks(html: string, fromLabel: string, toLabel: string) {
  const blockPattern = new RegExp(`${fromLabel}[\\s\\S]*?${toLabel}`, "i");
  const block = html.match(blockPattern)?.[0] ?? "";
  return Array.from(block.matchAll(/<A [^>]*>([\s\S]*?)<\/A>/gi))
    .map((match) => stripTags(match[1] ?? ""))
    .filter(Boolean);
}

function parseHoldingRows(html: string) {
  const rows = Array.from(html.matchAll(/<tr bgcolor="#ffffff">([\s\S]*?)<\/tr>/g));

  return rows
    .map((row) => {
      const cells = Array.from(row[1].matchAll(/<td[^>]*class="td1"[^>]*>([\s\S]*?)<\/td>/g)).map((cell) =>
        stripTags(cell[1] ?? ""),
      );

      if (cells.length < 9) {
        return null;
      }

      const loanStatus = cells[1];
      const callNumber = cells[2];
      const shelfStatus = cells[3];
      const subLibrary = cells[5];
      const barcode = cells[7];
      const note = cells[8];

      if (!subLibrary) {
        return null;
      }

      return {
        key: `${subLibrary}-${barcode || callNumber}`,
        title: subLibrary,
        publishDate: shelfStatus || "馆藏状态",
        publishers: [],
        pages: null,
        description: [`流通状态：${loanStatus || "未知"}`, callNumber ? `索书号：${callNumber}` : "", note ? `备注：${note}` : ""]
          .filter(Boolean)
          .join("；"),
        coverUrl: null,
        archiveUrl: null,
      };
    })
    .filter(Boolean);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ workId: string }> },
) {
  const { workId } = await context.params;
  const normalizedWorkId = workId.trim();

  if (!/^\d+$/.test(normalizedWorkId)) {
    return NextResponse.json({ message: "无效的国家图书馆书目编号。" }, { status: 400 });
  }

  const detailUrl = `${OPAC_BASE_URL}?func=direct&local_base=NLC01&doc_number=${normalizedWorkId}`;
  const holdingUrl = `${OPAC_BASE_URL}?func=item-global&doc_library=NLC01&doc_number=${normalizedWorkId}`;

  const [detailResponse, holdingResponse] = await Promise.all([
    fetch(detailUrl, {
      cache: "no-store",
      headers: { Accept: "text/html,application/xhtml+xml" },
    }),
    fetch(holdingUrl, {
      cache: "no-store",
      headers: { Accept: "text/html,application/xhtml+xml" },
    }),
  ]);

  if (!detailResponse.ok) {
    return NextResponse.json({ message: "未找到对应书籍详情。" }, { status: 404 });
  }

  const [detailHtml, holdingHtml] = await Promise.all([
    detailResponse.text(),
    holdingResponse.ok ? holdingResponse.text() : Promise.resolve(""),
  ]);

  const titleResponsibility = pickFirst(getFieldValues(detailHtml, "题名与责任"));
  const title = normalizeTitle(titleResponsibility);
  const publication = pickFirst(getFieldValues(detailHtml, "出版项"));
  const carrier = pickFirst(getFieldValues(detailHtml, "载体形态项"));
  const series = pickFirst(getFieldValues(detailHtml, "丛编项"));
  const note = pickFirst(getFieldValues(detailHtml, "一般附注"));
  const author = pickFirst(getFieldValues(detailHtml, "著者"));
  const additionalEntry = pickFirst(getFieldValues(detailHtml, "附加款目"));
  const classification = pickFirst(getFieldValues(detailHtml, "中图分类号"));
  const subjects = getSectionLinks(detailHtml, "主题", "中图分类号").slice(0, 16);
  const holdings = getFieldValues(detailHtml, "馆藏").slice(0, 12);
  const descriptionParts = [publication, carrier, series, note, classification ? `中图分类号：${classification}` : ""].filter(Boolean);
  const yearMatch = publication.match(/(\d{4})/);
  const holdingItems = holdingHtml ? parseHoldingRows(holdingHtml) : [];

  return NextResponse.json({
    key: normalizedWorkId,
    workId: normalizedWorkId,
    title: title || "未命名图书",
    authors: [author, additionalEntry].filter(Boolean),
    firstPublishDate: yearMatch?.[1] ?? null,
    coverUrl: null,
    description: descriptionParts.join("\n\n") || "当前记录以国家图书馆书目与馆藏信息为主。",
    excerpts: [],
    subjects,
    people: [],
    places: [],
    times: [],
    links: [
      {
        title: "国家图书馆 OPAC 记录",
        url: detailUrl,
      },
      {
        title: "查看馆藏单册信息",
        url: holdingUrl,
      },
    ],
    editions: holdingItems,
    editionCount: holdingItems.length || holdings.length,
    sourceUrl: detailUrl,
    gutenberg: null,
  });
}
