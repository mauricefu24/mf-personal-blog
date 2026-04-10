import { parseArticleContent } from "@/lib/format";

type Props = {
  content: string;
};

function looksLikeRichText(content: string) {
  return /<\/?(p|h2|h3|ul|ol|li|blockquote|pre|code|strong|em|br|img|figure|figcaption)\b/i.test(content);
}

export default function ArticleContent({ content }: Props) {
  if (looksLikeRichText(content)) {
    return (
      <div
        className="article-prose mx-auto max-w-3xl [&_blockquote]:mt-7 [&_blockquote]:rounded-[24px] [&_blockquote]:px-6 [&_blockquote]:py-5 [&_blockquote]:italic [&_code]:font-mono [&_em]:italic [&_figcaption]:mt-3 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-[var(--muted)] [&_figure]:mt-10 [&_figure]:space-y-0 [&_h2]:mt-14 [&_h2]:border-t [&_h2]:border-[rgba(255,255,255,0.08)] [&_h2]:pt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-9 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_img]:w-full [&_img]:rounded-[28px] [&_img]:border [&_img]:border-[rgba(214,179,106,0.14)] [&_img]:bg-[rgba(255,255,255,0.03)] [&_img]:object-cover [&_img]:shadow-[0_18px_50px_rgba(0,0,0,0.28)] [&_li]:mt-2 [&_ol]:mt-7 [&_ol]:space-y-2 [&_ol]:pl-6 [&_ol]:text-[rgba(245,245,242,0.84)] [&_p]:mt-6 [&_p]:text-[17px] [&_p]:leading-9 [&_pre]:mt-7 [&_pre]:overflow-x-auto [&_pre]:rounded-[26px] [&_pre]:p-5 [&_strong]:font-semibold [&_ul]:mt-7 [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:text-[rgba(245,245,242,0.84)] [&_ul]:marker:text-[var(--gold)]"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  const blocks = parseArticleContent(content);

  return (
    <div className="article-prose mx-auto max-w-3xl">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          if (block.level === 2) {
            return (
              <h2
                key={`${block.type}-${index}`}
                className="mt-14 border-t border-[rgba(255,255,255,0.08)] pt-8 text-2xl font-semibold tracking-tight text-[var(--foreground)] first:mt-0 first:border-t-0 first:pt-0"
              >
                {block.text}
              </h2>
            );
          }

          return (
            <h3
              key={`${block.type}-${index}`}
              className="mt-9 text-xl font-semibold tracking-tight text-[rgba(245,245,242,0.96)]"
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p
              key={`${block.type}-${index}`}
              className="mt-6 whitespace-pre-line text-[17px] leading-9 text-[rgba(245,245,242,0.84)] first:mt-0"
            >
              {block.text}
            </p>
          );
        }

        if (block.type === "list") {
          return (
            <ul
              key={`${block.type}-${index}`}
              className="mt-7 space-y-3 rounded-[26px] border border-[rgba(214,179,106,0.16)] bg-[rgba(255,255,255,0.03)] p-6 text-[16px] leading-8 text-[rgba(245,245,242,0.84)]"
            >
              {block.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2.5 h-2 w-2 rounded-full bg-[var(--gold)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <pre
            key={`${block.type}-${index}`}
            className="mt-7 overflow-x-auto rounded-[26px] border border-[rgba(214,179,106,0.18)] bg-[linear-gradient(180deg,_rgba(9,9,11,0.98)_0%,_rgba(16,16,18,0.98)_100%)] p-5 text-[14px] leading-7 text-[rgba(245,245,242,0.94)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
          >
            <code>{block.code}</code>
          </pre>
        );
      })}
    </div>
  );
}
