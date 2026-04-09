"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SkillItem = {
  id: string | number;
  label: string;
  sortOrder: number;
};

type FormState = {
  name: string;
  title: string;
  heroIntro: string;
  bio: string;
  avatar: string;
  ctaText: string;
  ctaLink: string;
  skills: SkillItem[];
};

const initialForm: FormState = {
  name: "",
  title: "",
  heroIntro: "",
  bio: "",
  avatar: "",
  ctaText: "",
  ctaLink: "",
  skills: [],
};

export default function ProfileEditor() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function fetchProfile() {
    setLoading(true);
    setError(null);

    const response = await fetch("/api/profile");
    const data = await response.json();

    setLoading(false);

    if (!response.ok) {
      setError(data?.message || "无法加载关于我内容。");
      return;
    }

    setForm({
      name: data.name ?? "",
      title: data.title ?? "",
      heroIntro: data.heroIntro ?? "",
      bio: data.bio ?? "",
      avatar: data.avatar ?? "",
      ctaText: data.ctaText ?? "",
      ctaLink: data.ctaLink ?? "",
      skills: Array.isArray(data.skills)
        ? data.skills.map((skill: SkillItem, index: number) => ({
            id: skill.id ?? `skill-${index}`,
            label: skill.label ?? "",
            sortOrder: index,
          }))
        : [],
    });
  }

  useEffect(() => {
    queueMicrotask(() => {
      void fetchProfile();
    });
  }, []);

  function updateSkill(index: number, label: string) {
    setForm((current) => ({
      ...current,
      skills: current.skills.map((skill, skillIndex) =>
        skillIndex === index ? { ...skill, label } : skill
      ),
    }));
  }

  function addSkill() {
    setForm((current) => ({
      ...current,
      skills: [
        ...current.skills,
        {
          id: `new-${Date.now()}-${current.skills.length}`,
          label: "",
          sortOrder: current.skills.length,
        },
      ],
    }));
  }

  function removeSkill(index: number) {
    setForm((current) => ({
      ...current,
      skills: current.skills
        .filter((_, skillIndex) => skillIndex !== index)
        .map((skill, skillIndex) => ({ ...skill, sortOrder: skillIndex })),
    }));
  }

  function moveSkill(index: number, direction: -1 | 1) {
    setForm((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.skills.length) {
        return current;
      }

      const skills = [...current.skills];
      const [item] = skills.splice(index, 1);
      skills.splice(nextIndex, 0, item);

      return {
        ...current,
        skills: skills.map((skill, skillIndex) => ({ ...skill, sortOrder: skillIndex })),
      };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        skills: form.skills.map((skill) => skill.label.trim()).filter(Boolean),
      }),
    });

    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      setError(data?.message || "保存失败，请检查输入。");
      return;
    }

    setSuccess("关于我模块已更新。");
    setForm({
      name: data.name ?? "",
      title: data.title ?? "",
      heroIntro: data.heroIntro ?? "",
      bio: data.bio ?? "",
      avatar: data.avatar ?? "",
      ctaText: data.ctaText ?? "",
      ctaLink: data.ctaLink ?? "",
      skills: Array.isArray(data.skills)
        ? data.skills.map((skill: SkillItem, index: number) => ({
            id: skill.id ?? `skill-${index}`,
            label: skill.label ?? "",
            sortOrder: index,
          }))
        : [],
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-950">关于我设置</h1>
          <p className="mt-2 text-zinc-600">在这里编辑首页的关于我模块内容、技能标签和跳转按钮。</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-200 px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            返回文章管理
          </Link>
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-sky-600 px-5 text-sm font-medium text-white transition hover:bg-sky-700"
          >
            查看首页
          </Link>
        </div>
      </div>

      {error ? <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div> : null}
      {success ? <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">{success}</div> : null}

      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-zinc-950">模块内容</h2>
            <p className="mt-2 text-sm text-zinc-600">这些内容会直接展示在首页“关于我”模块中。</p>
          </div>

          {loading ? (
            <p className="text-zinc-600">加载中...</p>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-zinc-600">姓名</span>
                  <input
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-zinc-600">身份标题</span>
                  <input
                    value={form.title}
                    onChange={(event) => setForm({ ...form, title: event.target.value })}
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    required
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm text-zinc-600">首页头部简介</span>
                <textarea
                  value={form.heroIntro}
                  onChange={(event) => setForm({ ...form, heroIntro: event.target.value })}
                  className="mt-2 w-full rounded-3xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  rows={4}
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm text-zinc-600">个人介绍</span>
                <textarea
                  value={form.bio}
                  onChange={(event) => setForm({ ...form, bio: event.target.value })}
                  className="mt-2 w-full rounded-3xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  rows={6}
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm text-zinc-600">头像链接</span>
                <input
                  value={form.avatar}
                  onChange={(event) => setForm({ ...form, avatar: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  placeholder="https://..."
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-zinc-600">按钮文案</span>
                  <input
                    value={form.ctaText}
                    onChange={(event) => setForm({ ...form, ctaText: event.target.value })}
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-zinc-600">按钮链接</span>
                  <input
                    value={form.ctaLink}
                    onChange={(event) => setForm({ ...form, ctaLink: event.target.value })}
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    required
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-sky-600 px-6 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "保存中..." : "保存关于我模块"}
              </button>
            </div>
          )}
        </form>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-zinc-950">技能标签</h2>
              <p className="mt-2 text-sm text-zinc-600">支持新增、删除和排序，前台会按这里的顺序展示。</p>
            </div>
            <button
              type="button"
              onClick={addSkill}
              className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm text-zinc-700 transition hover:bg-zinc-50"
            >
              新增标签
            </button>
          </div>

          {loading ? (
            <p className="text-zinc-600">加载中...</p>
          ) : (
            <div className="space-y-4">
              {form.skills.length > 0 ? (
                form.skills.map((skill, index) => (
                  <div key={skill.id} className="rounded-3xl border border-zinc-200 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <input
                        value={skill.label}
                        onChange={(event) => updateSkill(index, event.target.value)}
                        className="flex-1 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                        placeholder="输入技能标签"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => moveSkill(index, -1)}
                          disabled={index === 0}
                          className="rounded-2xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          上移
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSkill(index, 1)}
                          disabled={index === form.skills.length - 1}
                          className="rounded-2xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          下移
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="rounded-2xl border border-rose-200 px-3 py-2 text-sm text-rose-700 transition hover:bg-rose-50"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-zinc-200 p-6 text-sm text-zinc-500">
                  还没有技能标签，点击“新增标签”开始配置。
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
