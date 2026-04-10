"use client";

import { useMemo, useState } from "react";
import BasketballGame from "./BasketballGame";
import SnakeGame from "./SnakeGame";

const games = [
  {
    id: "basketball",
    name: "投篮游戏",
    eyebrow: "Arcade Shot",
    badge: "双人气",
    description: "调节角度和力度，把球投进左右移动的篮筐，适合快速来一局。",
    accent: "from-[rgba(214,179,106,0.9)] via-[rgba(214,179,106,0.55)] to-transparent",
    render: () => <BasketballGame />,
  },
  {
    id: "snake",
    name: "贪吃蛇",
    eyebrow: "Classic Snake",
    badge: "经典",
    description: "方向控制、逐渐提速、追高分的经典玩法，适合持续挑战手感。",
    accent: "from-[rgba(214,179,106,0.9)] via-[rgba(214,179,106,0.55)] to-transparent",
    render: () => <SnakeGame />,
  },
] as const;

export default function GameHub() {
  const [activeGameId, setActiveGameId] = useState<(typeof games)[number]["id"]>("basketball");

  const activeGame = useMemo(
    () => games.find((game) => game.id === activeGameId) ?? games[0],
    [activeGameId]
  );

  return (
    <div className="space-y-6">
      <section className="premium-panel rounded-[28px] p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-[var(--gold)]">Game Lobby</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">选择一个小游戏开始</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
              这里现在是卡片切换式游戏大厅。后面继续新增小游戏时，可以保持同样的入口结构，不需要把所有游戏都堆在一个长页面里。
            </p>
          </div>
          <div className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-sm font-medium text-[var(--muted)]">
            当前共 {games.length} 个游戏
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {games.map((game) => {
            const isActive = game.id === activeGame.id;

            return (
              <button
                key={game.id}
                type="button"
                onClick={() => setActiveGameId(game.id)}
                className={`group relative overflow-hidden rounded-[26px] border p-5 text-left transition duration-300 ${
                  isActive
                    ? "border-[rgba(214,179,106,0.24)] bg-[linear-gradient(180deg,rgba(214,179,106,0.12)_0%,rgba(255,255,255,0.03)_100%)] text-[var(--foreground)] shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
                    : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[var(--foreground)] shadow-[0_18px_40px_rgba(0,0,0,0.22)] hover:-translate-y-1 hover:border-[rgba(214,179,106,0.24)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.3)]"
                }`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${game.accent}`}
                  aria-hidden="true"
                />
                <div className="flex items-center justify-between gap-4">
                  <p
                    className={`text-xs font-semibold uppercase tracking-[0.28em] ${
                      isActive ? "text-[var(--gold)]" : "text-[var(--muted)]"
                    }`}
                  >
                    {game.eyebrow}
                  </p>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      isActive
                        ? "border-[rgba(214,179,106,0.2)] bg-[rgba(214,179,106,0.08)] text-[var(--gold)]"
                        : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[var(--muted)]"
                    }`}
                  >
                    {game.badge}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-semibold tracking-tight">{game.name}</h3>
                <p className={`mt-3 text-sm leading-7 ${isActive ? "text-[rgba(245,245,242,0.82)]" : "text-[var(--muted)]"}`}>
                  {game.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-current/10 pt-4">
                  <span className={`text-sm ${isActive ? "text-[rgba(245,245,242,0.72)]" : "text-[var(--muted)]"}`}>
                    {isActive ? "当前已选中" : "点击切换到这个游戏"}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "border-[rgba(214,179,106,0.22)] bg-[rgba(214,179,106,0.08)] text-[var(--gold)]"
                        : "border-[rgba(255,255,255,0.08)] text-[var(--foreground)] group-hover:border-[rgba(214,179,106,0.24)] group-hover:text-[var(--gold)]"
                    }`}
                  >
                    {isActive ? "游玩中" : "切换"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="premium-panel rounded-[28px] p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--gold)]">Now Playing</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">{activeGame.name}</h3>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[var(--muted)]">{activeGame.description}</p>
        </div>

        {activeGame.render()}
      </section>
    </div>
  );
}
