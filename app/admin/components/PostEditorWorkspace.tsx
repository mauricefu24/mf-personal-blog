"use client";

import ArticleContent from "@/app/components/ArticleContent";
import { useRef, useState } from "react";
import type { FormState } from "../types";

type Props = {
  form: FormState;
  editorInstanceKey: string;
  mode: "create" | "edit";
  saving: boolean;
  onChange: (field: keyof FormState, value: string) => void;
  onCreateNew: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

function FormSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5 sm:p-6">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold)]">{eyebrow}</p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      <span className="text-sm font-medium text-[rgba(245,245,242,0.88)]">{label}</span>
      <div className="mt-2">{children}</div>
    </div>
  );
}

const inputClassName =
  "w-full rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.18)] px-4 py-3 text-base text-[var(--foreground)] outline-none transition focus:border-[rgba(214,179,106,0.4)] focus:ring-4 focus:ring-[rgba(214,179,106,0.12)]";

function ToolbarBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-lg text-[rgba(245,245,242,0.58)] transition hover:bg-[rgba(255,255,255,0.07)] hover:text-[rgba(245,245,242,0.92)]"
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-4 w-px bg-[rgba(255,255,255,0.1)]" aria-hidden="true" />;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function plainTextToHtml(value: string) {
  const blocks = value.replace(/\r\n/g, "\n").split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  if (blocks.length === 0) {
    return "<p></p>";
  }

  return blocks
    .map((block) => {
      if (block.startsWith("### ")) {
        return `<h3>${escapeHtml(block.slice(4).trim())}</h3>`;
      }

      if (block.startsWith("## ")) {
        return `<h2>${escapeHtml(block.slice(3).trim())}</h2>`;
      }

      if (block.startsWith("- ")) {
        const items = block
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.startsWith("- "))
          .map((line) => `<li>${escapeHtml(line.slice(2).trim())}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      if (block.startsWith("```") && block.endsWith("```")) {
        const code = block.replace(/^```/, "").replace(/```$/, "").trim();
        return `<pre><code>${escapeHtml(code)}</code></pre>`;
      }

      return `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}

function normalizeRichTextHtml(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "<p></p>";
  }

  if (/<\/?(p|h2|h3|ul|ol|li|blockquote|pre|code|strong|em|br|img|figure|figcaption)\b/i.test(trimmed)) {
    return trimmed;
  }

  return plainTextToHtml(trimmed);
}

function getEditorInitialValue(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "<p></p>") {
    return "";
  }

  return normalizeRichTextHtml(value);
}

function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const imageUploadRef = useRef<HTMLInputElement | null>(null);
  const [draft, setDraft] = useState(() => getEditorInitialValue(value));
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  function emitChange(nextValue: string) {
    setDraft(nextValue);
    onChange(nextValue);
  }

  function updateSelection(
    transform: (selectedText: string) => {
      nextValue: string;
      selectionStart: number;
      selectionEnd: number;
    },
  ) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = draft.slice(start, end);
    const result = transform(selectedText);
    emitChange(result.nextValue);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  }

  function wrapSelection(before: string, after: string, fallback: string) {
    updateSelection((selectedText) => {
      const textarea = textareaRef.current;
      const start = textarea?.selectionStart ?? 0;
      const end = textarea?.selectionEnd ?? 0;
      const activeText = selectedText || fallback;
      const nextValue = `${draft.slice(0, start)}${before}${activeText}${after}${draft.slice(end)}`;
      const selectionStart = start + before.length;
      const selectionEnd = selectionStart + activeText.length;
      return { nextValue, selectionStart, selectionEnd };
    });
  }

  function insertList() {
    updateSelection((selectedText) => {
      const textarea = textareaRef.current;
      const start = textarea?.selectionStart ?? 0;
      const end = textarea?.selectionEnd ?? 0;
      const lines = selectedText
        ? selectedText.split("\n").map((l) => l.trim()).filter(Boolean)
        : ["项目一", "项目二"];
      const listMarkup = `<ul>\n${lines.map((l) => `  <li>${l}</li>`).join("\n")}\n</ul>`;
      const nextValue = `${draft.slice(0, start)}${listMarkup}${draft.slice(end)}`;
      return { nextValue, selectionStart: start, selectionEnd: start + listMarkup.length };
    });
  }

  function insertCodeBlock() {
    updateSelection((selectedText) => {
      const textarea = textareaRef.current;
      const start = textarea?.selectionStart ?? 0;
      const end = textarea?.selectionEnd ?? 0;
      const code = escapeHtml(selectedText || "const message = 'Hello Maurice';");
      const markup = `<pre><code>${code}</code></pre>`;
      const nextValue = `${draft.slice(0, start)}${markup}${draft.slice(end)}`;
      return { nextValue, selectionStart: start, selectionEnd: start + markup.length };
    });
  }

  function insertImageMarkup(imageUrl: string) {
    updateSelection(() => {
      const textarea = textareaRef.current;
      const start = textarea?.selectionStart ?? 0;
      const end = textarea?.selectionEnd ?? 0;
      const markup = [
        "<figure>",
        `  <img src="${imageUrl}" alt="文章配图" />`,
        "  <figcaption>图片说明</figcaption>",
        "</figure>",
      ].join("\n");
      const prefix = start > 0 ? "\n\n" : "";
      const suffix = end < draft.length ? "\n\n" : "";
      const nextValue = `${draft.slice(0, start)}${prefix}${markup}${suffix}${draft.slice(end)}`;
      const captionStart = start + prefix.length + markup.indexOf("图片说明");
      return { nextValue, selectionStart: captionStart, selectionEnd: captionStart + "图片说明".length };
    });
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { event.target.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") insertImageMarkup(reader.result);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!(event.ctrlKey || event.metaKey)) return;
    if (event.key === "b") {
      event.preventDefault();
      wrapSelection("<strong>", "</strong>", "加粗内容");
    }
    if (event.key === "i") {
      event.preventDefault();
      wrapSelection("<em>", "</em>", "斜体内容");
    }
  }

  const charCount = draft.replace(/<[^>]*>/g, "").replace(/\s+/g, "").length;

  return (
    <div className="overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.22)]">

      {/* ── Tab bar ── */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] px-3 py-2">
        <div className="flex gap-0.5">
          {(["edit", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                tab === t
                  ? "bg-[rgba(214,179,106,0.12)] text-[var(--gold)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {t === "edit" ? "编辑" : "预览"}
            </button>
          ))}
        </div>
        <span className="pr-1 text-[11px] text-[rgba(245,245,242,0.26)]">{charCount} 字</span>
      </div>

      {/* ── Toolbar (edit only) ── */}
      {tab === "edit" && (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.018)] px-3 py-1.5">
          {/* Block type */}
          <ToolbarBtn onClick={() => wrapSelection("<p>", "</p>", "正文内容")} title="段落">
            <span className="font-serif text-[13px]">¶</span>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => wrapSelection("<h2>", "</h2>", "标题 2")} title="标题 2">
            <span className="text-[11px] font-bold leading-none">H<span className="text-[8px] align-sub">2</span></span>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => wrapSelection("<h3>", "</h3>", "标题 3")} title="标题 3">
            <span className="text-[11px] font-bold leading-none">H<span className="text-[8px] align-sub">3</span></span>
          </ToolbarBtn>

          <ToolbarDivider />

          {/* Inline */}
          <ToolbarBtn onClick={() => wrapSelection("<strong>", "</strong>", "加粗内容")} title="加粗 (⌘B)">
            <span className="text-[13px] font-extrabold">B</span>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => wrapSelection("<em>", "</em>", "斜体内容")} title="斜体 (⌘I)">
            <span className="font-serif text-[13px] font-semibold italic">I</span>
          </ToolbarBtn>

          <ToolbarDivider />

          {/* Blocks */}
          <ToolbarBtn onClick={insertList} title="无序列表">
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
              <circle cx="2.5" cy="4.5" r="1.4" />
              <rect x="5.5" y="3.6" width="8.5" height="1.8" rx="0.9" />
              <circle cx="2.5" cy="8" r="1.4" />
              <rect x="5.5" y="7.1" width="8.5" height="1.8" rx="0.9" />
              <circle cx="2.5" cy="11.5" r="1.4" />
              <rect x="5.5" y="10.6" width="8.5" height="1.8" rx="0.9" />
            </svg>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => wrapSelection("<blockquote><p>", "</p></blockquote>", "引用内容")} title="引用块">
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M2 6.8C2 5 3.34 3.5 5 3.5h.5V5H5c-.83 0-1.5.67-1.5 1.5V7H6v4H2V6.8ZM9 6.8C9 5 10.34 3.5 12 3.5h.5V5H12c-.83 0-1.5.67-1.5 1.5V7H13v4H9V6.8Z" />
            </svg>
          </ToolbarBtn>
          <ToolbarBtn onClick={insertCodeBlock} title="代码块">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <polyline points="4.5,4 1,8 4.5,12" />
              <polyline points="11.5,4 15,8 11.5,12" />
              <line x1="9.5" y1="2" x2="6.5" y2="14" />
            </svg>
          </ToolbarBtn>

          <ToolbarDivider />

          {/* Media */}
          <input ref={imageUploadRef} type="file" accept="image/*" aria-label="上传内容图片" className="hidden" onChange={handleImageUpload} />
          <ToolbarBtn onClick={() => imageUploadRef.current?.click()} title="插入图片">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <rect x="1" y="2.5" width="14" height="11" rx="2" />
              <circle cx="5.5" cy="6.5" r="1.5" />
              <path d="M1 11l4-3.5 3 2.5 2.5-2 4.5 3.5" />
            </svg>
          </ToolbarBtn>
        </div>
      )}

      {/* ── Content area ── */}
      {tab === "edit" ? (
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(event) => emitChange(event.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[420px] w-full resize-y bg-transparent px-5 py-4 font-mono text-[14px] leading-[1.85] text-[rgba(245,245,242,0.88)] outline-none placeholder:text-[rgba(245,245,242,0.22)]"
          placeholder="在这里输入正文内容，或使用上方工具栏插入格式元素…"
          spellCheck={false}
        />
      ) : (
        <div className="min-h-[420px] px-6 py-6">
          {draft.trim() ? (
            <ArticleContent content={draft} />
          ) : (
            <div className="flex h-[180px] items-center justify-center rounded-[18px] border border-dashed border-[rgba(255,255,255,0.08)] text-sm text-[var(--muted)]">
              还没有内容，切换到编辑模式开始写作
            </div>
          )}
        </div>
      )}

      {/* ── Footer ── */}
      {tab === "edit" && (
        <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] px-5 py-2">
          <p className="text-[11px] text-[rgba(245,245,242,0.22)]">⌘B 加粗 · ⌘I 斜体</p>
          <p className="text-[11px] text-[rgba(245,245,242,0.22)]">HTML 格式保存</p>
        </div>
      )}
    </div>
  );
}

export default function PostEditorWorkspace({
  form,
  editorInstanceKey,
  mode,
  saving,
  onChange,
  onCreateNew,
  onSubmit,
}: Props) {
  const coverUploadRef = useRef<HTMLInputElement | null>(null);

  function handleCoverUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange("coverImage", reader.result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  return (
    <section className="premium-panel overflow-hidden rounded-[32px]">
      <div className="border-b border-[rgba(255,255,255,0.08)] px-6 py-5">
        <p className="text-sm uppercase tracking-[0.22em] text-[var(--gold)]">Editor Workspace</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              {mode === "edit" ? "编辑文章" : "新建文章"}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              按模块填写文章信息，保存后即可继续编辑或发布。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-sm font-medium text-[var(--muted)]">
              当前模式: {mode === "edit" ? "编辑现有文章" : "创建新文章"}
            </div>
            {mode === "edit" ? (
              <button
                type="button"
                onClick={onCreateNew}
                className="inline-flex h-10 items-center justify-center rounded-2xl border border-[rgba(214,179,106,0.22)] bg-[rgba(214,179,106,0.08)] px-4 text-sm font-medium text-[var(--gold)] transition hover:brightness-110"
              >
                + 新建文章
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 px-5 py-5 sm:px-6">
        <FormSection
          eyebrow="Basic"
          title="基本信息"
          description="设置文章标题与 URL 标识，作为内容基础识别信息。"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="标题">
              <input
                value={form.title}
                onChange={(event) => onChange("title", event.target.value)}
                className={inputClassName}
                title="文章标题"
                required
              />
            </Field>
            <Field label="Slug">
              <input
                value={form.slug}
                onChange={(event) => onChange("slug", event.target.value)}
                className={inputClassName}
                placeholder="可留空，系统会自动生成"
              />
            </Field>
          </div>
        </FormSection>

        <FormSection
          eyebrow="Content"
          title="内容信息"
          description="摘要用于列表和 SEO 展示，正文支持当前文章页的技术博客排版。"
        >
          <div className="space-y-4">
            <Field label="摘要">
              <textarea
                value={form.excerpt}
                onChange={(event) => onChange("excerpt", event.target.value)}
                className={`${inputClassName} min-h-[110px] rounded-3xl`}
                title="文章摘要"
                rows={4}
              />
            </Field>
            <Field label="内容">
              <RichTextEditor
                key={editorInstanceKey}
                value={form.content}
                onChange={(value) => onChange("content", value)}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection
          eyebrow="Taxonomy"
          title="分类与标签"
          description="使用分类组织内容，用标签补充主题与关键词。"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="分类">
              <input
                value={form.category}
                onChange={(event) => onChange("category", event.target.value)}
                className={inputClassName}
                title="文章分类"
              />
            </Field>
            <Field label="标签（逗号分隔）">
              <input
                value={form.tags}
                onChange={(event) => onChange("tags", event.target.value)}
                className={inputClassName}
                placeholder="Next.js, Prisma, CMS"
              />
            </Field>
          </div>
        </FormSection>

        <FormSection
          eyebrow="SEO & Display"
          title="SEO / 展示设置"
          description="管理搜索摘要、封面图和发布状态，方便前台展示与传播。"
        >
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="SEO 标题">
                <input
                  value={form.seoTitle}
                  onChange={(event) => onChange("seoTitle", event.target.value)}
                  className={inputClassName}
                  title="SEO 标题"
                />
              </Field>
              <Field label="SEO 描述">
                <input
                  value={form.seoDescription}
                  onChange={(event) => onChange("seoDescription", event.target.value)}
                  className={inputClassName}
                  title="SEO 描述"
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
              <Field label="封面图片 URL">
                <div className="space-y-3">
                  <input
                    value={form.coverImage}
                    onChange={(event) => onChange("coverImage", event.target.value)}
                    className={inputClassName}
                    placeholder="https://... 或上传本地图片"
                  />

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={coverUploadRef}
                      type="file"
                      accept="image/*"
                      aria-label="上传封面图片"
                      className="hidden"
                      onChange={handleCoverUpload}
                    />
                    <button
                      type="button"
                      onClick={() => coverUploadRef.current?.click()}
                      className="inline-flex h-11 items-center justify-center rounded-2xl border border-[rgba(214,179,106,0.22)] bg-[rgba(214,179,106,0.08)] px-4 text-sm font-medium text-[var(--gold)] transition hover:brightness-110"
                    >
                      上传图片
                    </button>
                    {form.coverImage ? (
                      <button
                        type="button"
                        onClick={() => onChange("coverImage", "")}
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 text-sm font-medium text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.24)] hover:text-[var(--gold)]"
                      >
                        清除封面
                      </button>
                    ) : null}
                  </div>

                  {form.coverImage ? (
                    <div className="overflow-hidden rounded-[22px] border border-[rgba(214,179,106,0.14)] bg-[rgba(255,255,255,0.03)]">
                      <img
                        src={form.coverImage}
                        alt="封面预览"
                        className="h-44 w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="rounded-[22px] border border-dashed border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] px-4 py-6 text-sm text-[var(--muted)]">
                      上传图片后，这里会显示封面预览。
                    </div>
                  )}
                </div>
              </Field>
              <Field label="状态">
                <select
                  value={form.status}
                  onChange={(event) => onChange("status", event.target.value)}
                  className={inputClassName}
                  title="发布状态"
                >
                  <option value="DRAFT">草稿</option>
                  <option value="PUBLISHED">已发布</option>
                </select>
              </Field>
            </div>
          </div>
        </FormSection>

        <div className="sticky bottom-4 flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-[rgba(214,179,106,0.16)] bg-[rgba(13,13,15,0.92)] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur">
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">
              {mode === "edit" ? "正在编辑当前文章" : "准备创建新文章"}
            </p>
            <p className="text-sm text-[var(--muted)]">
              保存后会自动同步左侧列表，并保留当前后台数据逻辑。
            </p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--gold)] px-6 text-sm font-semibold text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "保存中..." : mode === "edit" ? "更新文章" : "保存文章"}
          </button>
        </div>
      </form>
    </section>
  );
}
