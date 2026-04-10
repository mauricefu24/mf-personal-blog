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

function normalizePerson(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ message: "请提供要搜索的书名、作者或关键词。" }, { status: 400 });
  }

  const searchUrl = new URL(OPAC_BASE_URL);
  searchUrl.searchParams.set("func", "find-b");
  searchUrl.searchParams.set("find_code", "WRD");
  searchUrl.searchParams.set("request", query);
  searchUrl.searchParams.set("local_base", "NLC01");

  const response = await fetch(searchUrl, {
    cache: "no-store",
    headers: {
      Accept: "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) {
    return NextResponse.json({ message: "国家图书馆书目接口暂时不可用，请稍后再试。" }, { status: 502 });
  }

  const html = await response.text();

  const entryPattern =
    /id="NLC01(\d+)"[\s\S]*?<div class=itemtitle><a href=[^>]+>([\s\S]*?)<\/a>[\s\S]*?<td align="left" bgcolor="#f4fcff" class=label1>作者：\s*<td align="left" valign=top bgcolor="#f4fcff" class=content>([\s\S]*?)\s*<td align="left" bgcolor="#f4fcff" class=label1>出版社：\s*<td align="left" valign=top bgcolor="#f4fcff" class=content>([\s\S]*?)\s*<tr>[\s\S]*?<td align="left" bgcolor="#FFFFFF" class=label>年份：\s*<td align="left" bgcolor="#FFFFFF" valign=top class=content>([\s\S]*?)\s*<td align="left" bgcolor="#FFFFFF" class=label>格式：[\s\S]*?<td align="left" valign=top bgcolor="#FFFFFF" class=content>([\s\S]*?)\s*<tr>[\s\S]*?馆藏复本:\s*(\d+)，已出借复本:\s*(\d+)/g;

  const books = Array.from(html.matchAll(entryPattern))
    .slice(0, 8)
    .map((match) => {
      const [
        ,
        docNumber,
        titleHtml,
        authorHtml,
        publisherHtml,
        yearHtml,
        formatHtml,
        holdingCountText,
        loanedCountText,
      ] = match;

      if (!docNumber) {
        return null;
      }

      const title = normalizeTitle(stripTags(titleHtml));
      const author = normalizePerson(stripTags(authorHtml));
      const publisher = stripTags(publisherHtml);
      const yearText = stripTags(yearHtml);
      const format = stripTags(formatHtml);
      const holdingCount = Number(holdingCountText);
      const loanedCount = Number(loanedCountText);

      return {
        key: docNumber,
        title: title || "未命名图书",
        author: author || "作者信息暂缺",
        firstPublishYear: /^\d{4}$/.test(yearText) ? Number(yearText) : null,
        coverUrl: null,
        summary: [publisher ? `出版社：${publisher}` : "", yearText ? `出版年：${yearText}` : "", format ? `资料类型：${format}` : "", Number.isFinite(holdingCount) ? `馆藏复本：${holdingCount}` : "", Number.isFinite(loanedCount) ? `已出借：${loanedCount}` : ""]
          .filter(Boolean)
          .join("，"),
        subjects: format ? [format, "国家图书馆馆藏"] : ["国家图书馆馆藏"],
        rating: null,
        editionCount: Number.isFinite(holdingCount) ? holdingCount : null,
        readers: Number.isFinite(loanedCount) ? loanedCount : null,
        sourceUrl: `${OPAC_BASE_URL}?func=direct&local_base=NLC01&doc_number=${docNumber}`,
      };
    })
    .filter(Boolean);

  return NextResponse.json({
    query,
    books,
  });
}
