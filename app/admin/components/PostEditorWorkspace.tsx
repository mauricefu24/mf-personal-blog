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

const editorButtonClassName =
  "inline-flex h-10 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.24)] hover:text-[var(--gold)]";

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
  const lastSyncedValueRef = useRef("");
  const [draft, setDraft] = useState(() => getEditorInitialValue(value));

  function emitChange(nextValue: string) {
    setDraft(nextValue);
    lastSyncedValueRef.current = nextValue;
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
    if (!textarea) {
      return;
    }

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

      return {
        nextValue,
        selectionStart,
        selectionEnd,
      };
    });
  }

  function insertList() {
    updateSelection((selectedText) => {
      const textarea = textareaRef.current;
      const start = textarea?.selectionStart ?? 0;
      const end = textarea?.selectionEnd ?? 0;
      const lines = selectedText
        ? selectedText.split("\n").map((line) => line.trim()).filter(Boolean)
        : ["项目一", "项目二"];
      const listMarkup = `<ul>\n${lines.map((line) => `  <li>${line}</li>`).join("\n")}\n</ul>`;
      const nextValue = `${draft.slice(0, start)}${listMarkup}${draft.slice(end)}`;

      return {
        nextValue,
        selectionStart: start,
        selectionEnd: start + listMarkup.length,
      };
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

      return {
        nextValue,
        selectionStart: start,
        selectionEnd: start + markup.length,
      };
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

      return {
        nextValue,
        selectionStart: captionStart,
        selectionEnd: captionStart + "图片说明".length,
      };
    });
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
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
        insertImageMarkup(reader.result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => wrapSelection("<p>", "</p>", "正文内容")} className={editorButtonClassName}>
          正文
        </button>
        <button type="button" onClick={() => wrapSelection("<h2>", "</h2>", "标题 2")} className={editorButtonClassName}>
          标题 2
        </button>
        <button type="button" onClick={() => wrapSelection("<h3>", "</h3>", "标题 3")} className={editorButtonClassName}>
          标题 3
        </button>
        <button type="button" onClick={() => wrapSelection("<strong>", "</strong>", "加粗内容")} className={editorButtonClassName}>
          加粗
        </button>
        <button type="button" onClick={() => wrapSelection("<em>", "</em>", "斜体内容")} className={editorButtonClassName}>
          斜体
        </button>
        <button type="button" onClick={insertList} className={editorButtonClassName}>
          列表
        </button>
        <button type="button" onClick={() => wrapSelection("<blockquote><p>", "</p></blockquote>", "引用内容")} className={editorButtonClassName}>
          引用
        </button>
        <button type="button" onClick={insertCodeBlock} className={editorButtonClassName}>
          代码块
        </button>
        <input
          ref={imageUploadRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <button
          type="button"
          onClick={() => imageUploadRef.current?.click()}
          className={editorButtonClassName}
        >
          图片
        </button>
      </div>

      <textarea
        ref={textareaRef}
        value={draft}
        onChange={(event) => emitChange(event.target.value)}
        className="min-h-[360px] w-full rounded-[26px] border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.18)] px-5 py-4 font-mono text-[15px] leading-8 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[rgba(214,179,106,0.4)] focus:ring-4 focus:ring-[rgba(214,179,106,0.12)]"
        placeholder="在这里输入正文内容，或使用上方按钮插入标题、列表、引用和代码块 HTML。"
      />

      <div className="overflow-hidden rounded-[26px] border border-[rgba(214,179,106,0.14)] bg-[rgba(255,255,255,0.03)]">
        <div className="border-b border-[rgba(255,255,255,0.08)] px-5 py-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold)]">Preview</p>
          <h4 className="mt-2 text-base font-semibold text-[var(--foreground)]">当前内容预览</h4>
          <p className="mt-1 text-sm text-[var(--muted)]">这里会按前台文章页的排版方式实时展示当前正文。</p>
        </div>
        <div className="px-5 py-6 sm:px-6">
          {draft.trim() ? (
            <ArticleContent content={draft} />
          ) : (
            <div className="rounded-[22px] border border-dashed border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.16)] px-5 py-8 text-sm text-[var(--muted)]">
              还没有正文内容。输入文字或插入图片后，这里会显示实时预览。
            </div>
          )}
        </div>
      </div>

      <p className="text-sm leading-6 text-[var(--muted)]">
        支持标题、加粗、斜体、列表、引用、代码块和图片。内容会以 HTML 保存，并兼容前台文章页展示。
      </p>
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
                />
              </Field>
              <Field label="SEO 描述">
                <input
                  value={form.seoDescription}
                  onChange={(event) => onChange("seoDescription", event.target.value)}
                  className={inputClassName}
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
