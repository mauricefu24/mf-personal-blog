"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

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

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setError(null);

    const body = new FormData();
    body.append("file", file);

    const response = await fetch("/api/upload", { method: "POST", body });
    const data = await response.json();

    setUploadingAvatar(false);

    if (!response.ok) {
      setError(data?.message || "图片上传失败。");
      return;
    }

    setForm((current) => ({ ...current, avatar: data.url as string }));
    if (avatarInputRef.current) avatarInputRef.current.value = "";
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
      <div className="premium-panel flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--foreground)]">关于我设置</h1>
          <p className="mt-2 text-[var(--muted)]">在这里编辑首页的关于我模块内容、技能标签和跳转按钮。</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] px-5 text-sm font-medium text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.22)] hover:text-[var(--gold)]"
          >
            返回文章管理
          </Link>
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--gold)] px-5 text-sm font-medium text-black transition hover:brightness-105"
          >
            查看首页
          </Link>
        </div>
      </div>

      {error ? <div className="rounded-3xl border border-[rgba(214,179,106,0.18)] bg-[rgba(214,179,106,0.08)] p-4 text-[var(--gold)]">{error}</div> : null}
      {success ? <div className="rounded-3xl border border-[rgba(214,179,106,0.18)] bg-[rgba(255,255,255,0.03)] p-4 text-[var(--foreground)]">{success}</div> : null}

      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="premium-panel rounded-3xl p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">模块内容</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">这些内容会直接展示在首页“关于我”模块中。</p>
          </div>

          {loading ? (
            <p className="text-[var(--muted)]">加载中...</p>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-[var(--muted)]">姓名</span>
                  <input
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    className="mt-2 w-full rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-base text-[var(--foreground)] outline-none focus:border-[rgba(214,179,106,0.38)] focus:ring-2 focus:ring-[rgba(214,179,106,0.12)]"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-[var(--muted)]">身份标题</span>
                  <input
                    value={form.title}
                    onChange={(event) => setForm({ ...form, title: event.target.value })}
                    className="mt-2 w-full rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-base text-[var(--foreground)] outline-none focus:border-[rgba(214,179,106,0.38)] focus:ring-2 focus:ring-[rgba(214,179,106,0.12)]"
                    required
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm text-[var(--muted)]">首页头部简介</span>
                <textarea
                  value={form.heroIntro}
                  onChange={(event) => setForm({ ...form, heroIntro: event.target.value })}
                  className="mt-2 w-full rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-base text-[var(--foreground)] outline-none focus:border-[rgba(214,179,106,0.38)] focus:ring-2 focus:ring-[rgba(214,179,106,0.12)]"
                  rows={4}
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm text-[var(--muted)]">个人介绍</span>
                <textarea
                  value={form.bio}
                  onChange={(event) => setForm({ ...form, bio: event.target.value })}
                  className="mt-2 w-full rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-base text-[var(--foreground)] outline-none focus:border-[rgba(214,179,106,0.38)] focus:ring-2 focus:ring-[rgba(214,179,106,0.12)]"
                  rows={6}
                  required
                />
              </label>

              <div>
                <span className="text-sm text-[var(--muted)]">头像</span>
                <div className="mt-2 flex items-start gap-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]">
                    {form.avatar ? (
                      <Image
                        src={form.avatar}
                        alt="头像预览"
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[rgba(245,245,242,0.22)]">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-2">
                    <input
                      value={form.avatar}
                      onChange={(event) => setForm({ ...form, avatar: event.target.value })}
                      className="w-full rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-base text-[var(--foreground)] outline-none focus:border-[rgba(214,179,106,0.38)] focus:ring-2 focus:ring-[rgba(214,179,106,0.12)]"
                      placeholder="https://..."
                      title="头像链接"
                    />
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      aria-label="上传头像图片"
                      onChange={(event) => void handleAvatarUpload(event)}
                    />
                    <button
                      type="button"
                      disabled={uploadingAvatar}
                      onClick={() => avatarInputRef.current?.click()}
                      className="inline-flex h-9 w-fit items-center gap-2 rounded-2xl border border-[rgba(255,255,255,0.08)] px-4 text-sm text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.24)] hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      {uploadingAvatar ? "上传中..." : "上传图片"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-[var(--muted)]">按钮文案</span>
                  <input
                    value={form.ctaText}
                    onChange={(event) => setForm({ ...form, ctaText: event.target.value })}
                    className="mt-2 w-full rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-base text-[var(--foreground)] outline-none focus:border-[rgba(214,179,106,0.38)] focus:ring-2 focus:ring-[rgba(214,179,106,0.12)]"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-[var(--muted)]">按钮链接</span>
                  <input
                    value={form.ctaLink}
                    onChange={(event) => setForm({ ...form, ctaLink: event.target.value })}
                    className="mt-2 w-full rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-base text-[var(--foreground)] outline-none focus:border-[rgba(214,179,106,0.38)] focus:ring-2 focus:ring-[rgba(214,179,106,0.12)]"
                    required
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--gold)] px-6 text-sm font-semibold text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "保存中..." : "保存关于我模块"}
              </button>
            </div>
          )}
        </form>

        <div className="premium-panel rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">技能标签</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">支持新增、删除和排序，前台会按这里的顺序展示。</p>
            </div>
            <button
              type="button"
              onClick={addSkill}
              className="rounded-2xl border border-[rgba(255,255,255,0.08)] px-4 py-2 text-sm text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.24)] hover:text-[var(--gold)]"
            >
              新增标签
            </button>
          </div>

          {loading ? (
            <p className="text-[var(--muted)]">加载中...</p>
          ) : (
            <div className="space-y-4">
              {form.skills.length > 0 ? (
                form.skills.map((skill, index) => (
                  <div key={skill.id} className="rounded-3xl border border-[rgba(255,255,255,0.08)] p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <input
                        value={skill.label}
                        onChange={(event) => updateSkill(index, event.target.value)}
                        className="flex-1 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-base text-[var(--foreground)] outline-none focus:border-[rgba(214,179,106,0.38)] focus:ring-2 focus:ring-[rgba(214,179,106,0.12)]"
                        placeholder="输入技能标签"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => moveSkill(index, -1)}
                          disabled={index === 0}
                          className="rounded-2xl border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.24)] hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          上移
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSkill(index, 1)}
                          disabled={index === form.skills.length - 1}
                          className="rounded-2xl border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.24)] hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          下移
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="rounded-2xl border border-[rgba(214,179,106,0.16)] px-3 py-2 text-sm text-[var(--gold)] transition hover:bg-[rgba(214,179,106,0.08)]"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-[rgba(255,255,255,0.12)] p-6 text-sm text-[var(--muted)]">
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
