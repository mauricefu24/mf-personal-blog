"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "./components/AdminHeader";
import PostEditorWorkspace from "./components/PostEditorWorkspace";
import PostListPanel from "./components/PostListPanel";
import type { FormState, PostItem } from "./types";
import { initialForm } from "./types";

export default function AdminView() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    void fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);

    const response = await fetch("/api/posts");
    const data = await response.json();

    setLoading(false);

    if (!response.ok) {
      setError(data?.message || "无法加载文章列表。");
      return;
    }

    setPosts(data);
  }

  function fillForm(post: PostItem) {
    setSelectedPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      category: post.category?.name ?? "",
      tags: post.tags.map((item) => item.tag.name).join(", "),
      excerpt: post.excerpt ?? "",
      content: post.content,
      status: post.status,
      seoTitle: post.seoTitle ?? "",
      seoDescription: post.seoDescription ?? "",
      coverImage: post.coverImage ?? "",
    });
    setError(null);
  }

  function resetForm() {
    setSelectedPost(null);
    setForm(initialForm);
    setError(null);
  }

  function updateForm(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    };

    const requestOptions: RequestInit = {
      method: selectedPost ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    const url = selectedPost ? `/api/posts/${selectedPost.id}` : "/api/posts";
    const response = await fetch(url, requestOptions);
    const data = await response.json();

    setSaving(false);

    if (!response.ok) {
      setError(data?.message || "保存失败，请检查输入。");
      return;
    }

    await fetchPosts();
    resetForm();
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    setError(null);

    const response = await fetch(`/api/posts/${id}`, { method: "DELETE" });

    setDeletingId(null);

    if (!response.ok) {
      const body = await response.json();
      setError(body?.message || "删除失败。");
      return;
    }

    await fetchPosts();
    if (selectedPost?.id === id) {
      resetForm();
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const publishedPosts = posts.filter((post) => post.status === "PUBLISHED").length;
  const draftPosts = posts.filter((post) => post.status === "DRAFT").length;

  return (
    <div className="space-y-8">
      <AdminHeader
        totalPosts={posts.length}
        publishedPosts={publishedPosts}
        draftPosts={draftPosts}
        isEditing={Boolean(selectedPost)}
        onCreateNew={resetForm}
        onLogout={handleLogout}
      />

      {error ? (
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 shadow-sm">
          {error}
        </div>
      ) : null}

      <section className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
        <PostListPanel
          posts={posts}
          selectedPostId={selectedPost?.id ?? null}
          loading={loading}
          deletingId={deletingId}
          onCreateNew={resetForm}
          onEdit={fillForm}
          onDelete={(id) => void handleDelete(id)}
        />

        <PostEditorWorkspace
          form={form}
          mode={selectedPost ? "edit" : "create"}
          saving={saving}
          onChange={updateForm}
          onSubmit={(event) => void handleSubmit(event)}
        />
      </section>
    </div>
  );
}
