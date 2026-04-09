"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Cell = {
  x: number;
  y: number;
};

type Direction = "up" | "down" | "left" | "right";
type Phase = "idle" | "running" | "game-over";

const GRID_SIZE = 14;
const INITIAL_SNAKE: Cell[] = [
  { x: 6, y: 7 },
  { x: 5, y: 7 },
  { x: 4, y: 7 },
];
const INITIAL_DIRECTION: Direction = "right";

function isSameCell(a: Cell, b: Cell) {
  return a.x === b.x && a.y === b.y;
}

function getNextHead(head: Cell, direction: Direction): Cell {
  switch (direction) {
    case "up":
      return { x: head.x, y: head.y - 1 };
    case "down":
      return { x: head.x, y: head.y + 1 };
    case "left":
      return { x: head.x - 1, y: head.y };
    case "right":
      return { x: head.x + 1, y: head.y };
  }
}

function isOppositeDirection(current: Direction, next: Direction) {
  return (
    (current === "up" && next === "down") ||
    (current === "down" && next === "up") ||
    (current === "left" && next === "right") ||
    (current === "right" && next === "left")
  );
}

function createRandomFood(snake: Cell[]): Cell {
  const availableCells: Cell[] = [];

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const occupied = snake.some((segment) => segment.x === x && segment.y === y);
      if (!occupied) {
        availableCells.push({ x, y });
      }
    }
  }

  if (availableCells.length === 0) {
    return { x: 0, y: 0 };
  }

  const index = Math.floor(Math.random() * availableCells.length);
  return availableCells[index];
}

function getSpeed(score: number) {
  return Math.max(95, 220 - score * 8);
}

export default function SnakeGame() {
  const [snake, setSnake] = useState<Cell[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Cell>(() => createRandomFood(INITIAL_SNAKE));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const pendingDirectionRef = useRef<Direction>(INITIAL_DIRECTION);
  const bestScoreRef = useRef(0);

  const resetGame = useCallback(() => {
    pendingDirectionRef.current = INITIAL_DIRECTION;
    setSnake(INITIAL_SNAKE);
    setFood(createRandomFood(INITIAL_SNAKE));
    setScore(0);
    setPhase("idle");
  }, []);

  const startGame = useCallback(() => {
    pendingDirectionRef.current = INITIAL_DIRECTION;
    setSnake(INITIAL_SNAKE);
    setFood(createRandomFood(INITIAL_SNAKE));
    setScore(0);
    setPhase("running");
  }, []);

  const queueDirection = useCallback((nextDirection: Direction) => {
    if (phase === "game-over") {
      return;
    }

    const currentDirection = pendingDirectionRef.current;
    if (isOppositeDirection(currentDirection, nextDirection)) {
      return;
    }

    pendingDirectionRef.current = nextDirection;
  }, [phase]);

  useEffect(() => {
    const savedBest = window.localStorage.getItem("snake-best-score");
    if (savedBest) {
      const value = Number(savedBest);
      if (!Number.isNaN(value)) {
        bestScoreRef.current = value;
        queueMicrotask(() => {
          setBestScore(value);
        });
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && phase !== "running") {
        startGame();
        return;
      }

      const keyDirectionMap: Record<string, Direction> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
        W: "up",
        S: "down",
        A: "left",
        D: "right",
      };

      const nextDirection = keyDirectionMap[event.key];
      if (!nextDirection) {
        return;
      }

      event.preventDefault();

      if (phase === "idle") {
        startGame();
      }

      queueDirection(nextDirection);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [phase, queueDirection, startGame]);

  useEffect(() => {
    if (phase !== "running") {
      return;
    }

    const timer = window.setInterval(() => {
      setSnake((currentSnake) => {
        const currentDirection = pendingDirectionRef.current;
        const currentHead = currentSnake[0];
        const nextHead = getNextHead(currentHead, currentDirection);

        const hitWall =
          nextHead.x < 0 ||
          nextHead.x >= GRID_SIZE ||
          nextHead.y < 0 ||
          nextHead.y >= GRID_SIZE;

        const willEat = isSameCell(nextHead, food);
        const collisionBody = (willEat ? currentSnake : currentSnake.slice(0, -1)).some((segment) =>
          isSameCell(segment, nextHead)
        );

        if (hitWall || collisionBody) {
          setPhase("game-over");
          return currentSnake;
        }

        const nextSnake = [nextHead, ...currentSnake];

        if (willEat) {
          const nextScore = currentSnake.length - INITIAL_SNAKE.length + 1;
          setScore(nextScore);

          if (nextScore > bestScoreRef.current) {
            bestScoreRef.current = nextScore;
            setBestScore(nextScore);
            window.localStorage.setItem("snake-best-score", String(nextScore));
          }

          setFood(createRandomFood(nextSnake));
          return nextSnake;
        }

        nextSnake.pop();
        return nextSnake;
      });
    }, getSpeed(score));

    return () => {
      window.clearInterval(timer);
    };
  }, [food, phase, score]);

  const boardCells = [];
  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const isHead = isSameCell(snake[0], { x, y });
      const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
      const isFoodCell = food.x === x && food.y === y;

      let cellClassName =
        "rounded-[8px] border border-white/60 bg-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]";

      if (isSnake) {
        cellClassName = isHead
          ? "rounded-[10px] border border-emerald-700/60 bg-[linear-gradient(180deg,_#166534_0%,_#22c55e_100%)] shadow-[0_6px_14px_rgba(22,101,52,0.28)]"
          : "rounded-[10px] border border-emerald-500/60 bg-[linear-gradient(180deg,_#34d399_0%,_#16a34a_100%)] shadow-[0_6px_14px_rgba(22,163,74,0.18)]";
      }

      if (isFoodCell) {
        cellClassName =
          "rounded-full border border-orange-300 bg-[radial-gradient(circle_at_35%_35%,_#fde68a_0%,_#fb7185_45%,_#ea580c_100%)] shadow-[0_8px_18px_rgba(234,88,12,0.28)]";
      }

      boardCells.push(<div key={`${x}-${y}`} className={cellClassName} />);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[28px] border border-orange-200/70 bg-white/90 p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-orange-600">Snake</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">贪吃蛇小游戏</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-zinc-600">
              使用方向键或 WASD 控制移动。吃到果实会加分并变长，撞墙或撞到自己则结束。
            </p>
          </div>

          <button
            type="button"
            onClick={phase === "running" ? resetGame : startGame}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            {phase === "running" ? "重新开始" : phase === "game-over" ? "再来一局" : "开始游戏"}
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[20px] border border-zinc-200 bg-orange-50 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.24em] text-orange-700">当前分数</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">{score}</p>
          </div>
          <div className="rounded-[20px] border border-zinc-200 bg-white px-4 py-4">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">最高分</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">{bestScore}</p>
          </div>
          <div className="rounded-[20px] border border-zinc-200 bg-white px-4 py-4">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">状态</p>
            <p className="mt-3 text-lg font-semibold tracking-tight text-zinc-950">
              {phase === "idle" ? "等待开始" : phase === "running" ? "进行中" : "游戏结束"}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-orange-100 bg-[linear-gradient(180deg,_#fff7ed_0%,_#ffffff_100%)] p-5">
          <p className="text-sm font-semibold text-zinc-900">操作说明</p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
            <p>方向键或 `W A S D` 控制方向。</p>
            <p>`Enter` 可以在待开始或结束时快速开局。</p>
            <p>分数越高，移动速度会逐渐变快。</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 self-start sm:hidden">
          <div />
          <button
            type="button"
            onClick={() => {
              if (phase === "idle") {
                startGame();
              }
              queueDirection("up");
            }}
            className="inline-flex h-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-lg font-semibold text-zinc-700"
          >
            ↑
          </button>
          <div />
          <button
            type="button"
            onClick={() => {
              if (phase === "idle") {
                startGame();
              }
              queueDirection("left");
            }}
            className="inline-flex h-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-lg font-semibold text-zinc-700"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => {
              if (phase === "idle") {
                startGame();
              }
              queueDirection("down");
            }}
            className="inline-flex h-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-lg font-semibold text-zinc-700"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => {
              if (phase === "idle") {
                startGame();
              }
              queueDirection("right");
            }}
            className="inline-flex h-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-lg font-semibold text-zinc-700"
          >
            →
          </button>
        </div>
      </div>

      <div className="rounded-[28px] border border-zinc-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.88)_0%,_rgba(255,247,237,0.92)_100%)] p-4 shadow-[0_24px_60px_rgba(120,53,15,0.08)] sm:p-5">
        <div
          className="grid aspect-square w-full gap-1 rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,_rgba(255,251,235,0.95)_0%,_rgba(255,255,255,0.95)_100%)] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          }}
        >
          {boardCells}
        </div>

        <div className="mt-4 rounded-[20px] border border-zinc-200 bg-white/90 px-4 py-4 text-sm text-zinc-600">
          {phase === "idle" ? "按开始游戏，或直接按方向键开始移动。" : null}
          {phase === "running" ? "吃掉红色果实，不要撞墙，也别咬到自己。" : null}
          {phase === "game-over" ? "这一局结束了，点击“再来一局”继续挑战更高分。" : null}
        </div>
      </div>
    </div>
  );
}
