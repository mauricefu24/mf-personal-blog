"use client";

import Link from "next/link";
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
      router.replace("/admin");
      router.refresh();
      return;
    }

    const body = await response.json();
    setError(body?.message || "登录失败，请重试。");
  }

  return (
    <main className="premium-shell min-h-screen px-6 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-[40px] border border-[rgba(214,179,106,0.16)] bg-[linear-gradient(180deg,_rgba(10,10,12,0.9)_0%,_rgba(6,6,8,0.98)_100%)] shadow-[0_30px_120px_rgba(0,0,0,0.45)] lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative overflow-hidden px-8 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,_rgba(214,179,106,0.18),_transparent_28%),radial-gradient(circle_at_78%_14%,_rgba(255,255,255,0.08),_transparent_18%),linear-gradient(180deg,_rgba(255,255,255,0.03)_0%,_transparent_46%,_rgba(214,179,106,0.05)_100%)]" />
          <div className="absolute inset-x-12 bottom-0 h-40 bg-[radial-gradient(circle_at_center,_rgba(214,179,106,0.12),_transparent_68%)]" />

          <div className="relative">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-[rgba(214,179,106,0.18)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.34)] hover:text-[var(--gold)]"
            >
              返回首页
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.42em] text-[var(--gold)]">
              Imperial Console
            </p>
            <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              辉煌宫殿已点亮，欢迎管理员入殿执掌内容。
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-[rgba(245,245,242,0.72)] sm:text-lg">
              在金色穹顶与长廊光影之间登录后台，继续管理文章、整理结构，并更新关于我页面的内容呈现。
            </p>
          </div>

          <div className="relative mt-10 flex flex-wrap gap-3">
            {["文章管理", "内容发布", "后台控制", "宫殿权限"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-[rgba(214,179,106,0.18)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-sm text-[rgba(245,245,242,0.76)]"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="relative mt-12 overflow-hidden rounded-[32px] border border-[rgba(214,179,106,0.16)] bg-[linear-gradient(180deg,_rgba(255,255,255,0.04)_0%,_rgba(255,255,255,0.015)_100%)] p-6 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(214,179,106,0.14),_transparent_46%)]" />
            <div className="relative mx-auto max-w-xl">
              <div className="flex justify-center">
                <div className="relative h-56 w-full max-w-md">
                  <div className="absolute left-1/2 top-2 h-10 w-10 -translate-x-1/2 rounded-full bg-[rgba(214,179,106,0.9)] shadow-[0_0_40px_rgba(214,179,106,0.28)]" />
                  <div className="absolute left-1/2 top-10 h-14 w-1.5 -translate-x-1/2 rounded-full bg-[rgba(214,179,106,0.9)]" />
                  <div className="absolute inset-x-16 top-16 h-24 rounded-t-[999px] border border-[rgba(214,179,106,0.42)] bg-[radial-gradient(circle_at_center,_rgba(214,179,106,0.26),_rgba(214,179,106,0.06)_58%,_transparent_75%)]" />
                  <div className="absolute inset-x-10 top-24 h-28 rounded-[28px] border border-[rgba(214,179,106,0.22)] bg-[linear-gradient(180deg,_rgba(255,255,255,0.04)_0%,_rgba(255,255,255,0.01)_100%)]" />
                  <div className="absolute inset-x-20 top-36 flex justify-between">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={`pillar-top-${index}`}
                        className="h-24 w-8 rounded-t-xl border border-[rgba(214,179,106,0.2)] bg-[linear-gradient(180deg,_rgba(214,179,106,0.22)_0%,_rgba(255,255,255,0.03)_100%)]"
                      />
                    ))}
                  </div>
                  <div className="absolute inset-x-16 bottom-10 h-5 rounded-full bg-[rgba(214,179,106,0.22)] blur-xl" />
                  <div className="absolute inset-x-8 bottom-4 h-10 rounded-[22px] border border-[rgba(214,179,106,0.18)] bg-[linear-gradient(180deg,_rgba(255,255,255,0.03)_0%,_rgba(214,179,106,0.06)_100%)]" />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { value: "24h", label: "宫殿守卫" },
                  { value: "CMS", label: "内容中枢" },
                  { value: "Gold", label: "权限殿堂" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-[rgba(214,179,106,0.14)] bg-[rgba(255,255,255,0.03)] px-4 py-4 text-center"
                  >
                    <p className="text-2xl font-semibold text-[var(--foreground)]">{item.value}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center border-t border-[rgba(214,179,106,0.12)] px-6 py-8 sm:px-8 lg:border-l lg:border-t-0 lg:px-10 xl:px-12">
          <div className="premium-panel w-full rounded-[32px] p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--gold)]">
              Admin Access
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              欢迎管理员登录
            </h2>
            <p className="mt-3 text-[var(--muted)]">
              请输入后台账号信息，进入宫殿中枢继续处理文章、设置与发布任务。
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <label className="block">
                <span className="text-sm text-[var(--muted)]">邮箱</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3.5 text-base text-[var(--foreground)] outline-none transition focus:border-[rgba(214,179,106,0.38)] focus:ring-2 focus:ring-[rgba(214,179,106,0.12)]"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm text-[var(--muted)]">密码</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3.5 text-base text-[var(--foreground)] outline-none transition focus:border-[rgba(214,179,106,0.38)] focus:ring-2 focus:ring-[rgba(214,179,106,0.12)]"
                  required
                />
              </label>

              {error ? (
                <div className="rounded-[22px] border border-[rgba(214,179,106,0.2)] bg-[rgba(214,179,106,0.08)] px-4 py-3 text-sm text-[var(--gold)]">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-13 w-full items-center justify-center rounded-[22px] bg-[var(--gold)] px-5 text-base font-semibold text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "登录中..." : "进入管理宫殿"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
