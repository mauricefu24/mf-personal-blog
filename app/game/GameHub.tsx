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
    accent: "from-sky-500 via-cyan-400 to-blue-500",
    render: () => <BasketballGame />,
  },
  {
    id: "snake",
    name: "贪吃蛇",
    eyebrow: "Classic Snake",
    badge: "经典",
    description: "方向控制、逐渐提速、追高分的经典玩法，适合持续挑战手感。",
    accent: "from-emerald-500 via-lime-400 to-green-500",
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
      <section className="rounded-[28px] border border-zinc-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96)_0%,_rgba(255,247,237,0.88)_100%)] p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-orange-600">Game Lobby</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">选择一个小游戏开始</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
              这里现在是卡片切换式游戏大厅。后面继续新增小游戏时，可以保持同样的入口结构，不需要把所有游戏都堆在一个长页面里。
            </p>
          </div>
          <div className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600">
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
                    ? "border-zinc-900 bg-zinc-950 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
                    : "border-zinc-200 bg-white text-zinc-950 shadow-sm hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)]"
                }`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${game.accent}`}
                  aria-hidden="true"
                />
                <div className="flex items-center justify-between gap-4">
                  <p
                    className={`text-xs font-semibold uppercase tracking-[0.28em] ${
                      isActive ? "text-white/70" : "text-zinc-500"
                    }`}
                  >
                    {game.eyebrow}
                  </p>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      isActive
                        ? "border-white/15 bg-white/10 text-white/80"
                        : "border-zinc-200 bg-zinc-50 text-zinc-600"
                    }`}
                  >
                    {game.badge}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-semibold tracking-tight">{game.name}</h3>
                <p className={`mt-3 text-sm leading-7 ${isActive ? "text-white/78" : "text-zinc-600"}`}>
                  {game.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-current/10 pt-4">
                  <span className={`text-sm ${isActive ? "text-white/70" : "text-zinc-500"}`}>
                    {isActive ? "当前已选中" : "点击切换到这个游戏"}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-zinc-200 text-zinc-700 group-hover:border-orange-200 group-hover:bg-orange-50 group-hover:text-orange-700"
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

      <section className="rounded-[28px] border border-zinc-200 bg-white/90 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-zinc-200 bg-zinc-50 px-4 py-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">Now Playing</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">{activeGame.name}</h3>
          </div>
          <p className="max-w-xl text-sm leading-7 text-zinc-600">{activeGame.description}</p>
        </div>

        {activeGame.render()}
      </section>
    </div>
  );
}
