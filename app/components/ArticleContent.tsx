import { parseArticleContent } from "@/lib/format";

type Props = {
  content: string;
};

export default function ArticleContent({ content }: Props) {
  const blocks = parseArticleContent(content);

  return (
    <div className="mx-auto max-w-3xl">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          if (block.level === 2) {
            return (
              <h2
                key={`${block.type}-${index}`}
                className="mt-12 text-2xl font-semibold tracking-tight text-zinc-950 first:mt-0"
              >
                {block.text}
              </h2>
            );
          }

          return (
            <h3
              key={`${block.type}-${index}`}
              className="mt-8 text-xl font-semibold tracking-tight text-zinc-900"
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p
              key={`${block.type}-${index}`}
              className="mt-6 text-[17px] leading-8 text-zinc-700 first:mt-0"
            >
              {block.text}
            </p>
          );
        }

        if (block.type === "list") {
          return (
            <ul
              key={`${block.type}-${index}`}
              className="mt-6 space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-6 text-[16px] leading-7 text-zinc-700"
            >
              {block.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-sky-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <pre
            key={`${block.type}-${index}`}
            className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-[14px] leading-6 text-zinc-100 shadow-inner"
          >
            <code>{block.code}</code>
          </pre>
        );
      })}
    </div>
  );
}
