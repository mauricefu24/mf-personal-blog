"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (response.ok) {
      router.push("/admin");
      return;
    }

    const body = await response.json();
    setError(body?.message || "登录失败，请重试。");
  }

  return (
    <main className="premium-shell mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
      <div className="premium-panel w-full rounded-3xl p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--gold)]">Admin Access</p>
        <h1 className="mt-4 text-3xl font-semibold text-[var(--foreground)]">管理员登录</h1>
        <p className="mt-3 text-[var(--muted)]">使用管理员账号登录后台，管理文章、分类和标签。</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <label className="block">
            <span className="text-sm text-[var(--muted)]">邮箱</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-base text-[var(--foreground)] outline-none focus:border-[rgba(214,179,106,0.38)] focus:ring-2 focus:ring-[rgba(214,179,106,0.12)]"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-[var(--muted)]">密码</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-base text-[var(--foreground)] outline-none focus:border-[rgba(214,179,106,0.38)] focus:ring-2 focus:ring-[rgba(214,179,106,0.12)]"
              required
            />
          </label>

          {error ? <p className="text-sm text-[var(--gold)]">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[var(--gold)] px-5 text-base font-semibold text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </main>
  );
}
