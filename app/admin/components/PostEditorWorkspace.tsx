"use client";

import type { FormState } from "../types";

type Props = {
  form: FormState;
  mode: "create" | "edit";
  saving: boolean;
  onChange: (field: keyof FormState, value: string) => void;
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
    <section className="rounded-[28px] border border-zinc-200/80 bg-[linear-gradient(180deg,_#ffffff_0%,_#fafafa_100%)] p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">{eyebrow}</p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
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
    <label className="block">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputClassName =
  "w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

export default function PostEditorWorkspace({
  form,
  mode,
  saving,
  onChange,
  onSubmit,
}: Props) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-zinc-200/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
      <div className="border-b border-zinc-200/80 px-6 py-5">
        <p className="text-sm uppercase tracking-[0.22em] text-zinc-500">Editor Workspace</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
              {mode === "edit" ? "编辑文章" : "新建文章"}
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              按模块填写文章信息，保存后即可继续编辑或发布。
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700">
            当前模式: {mode === "edit" ? "编辑现有文章" : "创建新文章"}
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
              <textarea
                value={form.content}
                onChange={(event) => onChange("content", event.target.value)}
                className={`${inputClassName} min-h-[360px] rounded-3xl font-mono text-[15px] leading-7`}
                rows={14}
                required
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
                <input
                  value={form.coverImage}
                  onChange={(event) => onChange("coverImage", event.target.value)}
                  className={inputClassName}
                  placeholder="https://..."
                />
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

        <div className="sticky bottom-4 flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-zinc-200 bg-white/95 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur">
          <div>
            <p className="text-sm font-medium text-zinc-800">
              {mode === "edit" ? "正在编辑当前文章" : "准备创建新文章"}
            </p>
            <p className="text-sm text-zinc-500">
              保存后会自动同步左侧列表，并保留当前后台数据逻辑。
            </p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-sky-600 px-6 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "保存中..." : mode === "edit" ? "更新文章" : "保存文章"}
          </button>
        </div>
      </form>
    </section>
  );
}
