"use client";

import Link from "next/link";

type Props = {
  onCreateNew?: () => void;
};

export default function AdminQuickNav({ onCreateNew }: Props) {
  return (
    <nav className="premium-panel sticky top-4 z-20 rounded-[28px] px-5 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
            Quick Actions
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            常用入口固定放在这里，直接进入写作或关于我设置。
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {onCreateNew ? (
            <button
              type="button"
              onClick={onCreateNew}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-[var(--gold)] px-5 text-sm font-semibold text-black transition hover:brightness-105"
            >
              + 新建文章
            </button>
          ) : (
            <Link
              href="/admin"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-[var(--gold)] px-5 text-sm font-semibold text-black transition hover:brightness-105"
            >
              新建文章
            </Link>
          )}

          <Link
            href="/admin/profile"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.22)] hover:text-[var(--gold)]"
          >
            关于我设置
          </Link>
        </div>
      </div>
    </nav>
  );
}
