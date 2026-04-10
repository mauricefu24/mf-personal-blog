"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type BallState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  scored: boolean;
};

const COURT_WIDTH = 100;
const COURT_HEIGHT = 100;
const BALL_START_X = 14;
const BALL_START_Y = 86;
const RIM_Y = 30;
const RIM_WIDTH = 14;
const RIM_HEIGHT = 2.5;
const BACKBOARD_X_OFFSET = 11;
const GRAVITY = 0.5;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function BasketballGame() {
  const [angle, setAngle] = useState(52);
  const [power, setPower] = useState(15);
  const [ball, setBall] = useState<BallState | null>(null);
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [status, setStatus] = useState("调整角度和力度后投篮。");
  const [rimX, setRimX] = useState(70);

  const rimDirectionRef = useRef(1);
  const bestScoreRef = useRef(0);

  const resetRound = useCallback(() => {
    setBall(null);
    setScore(0);
    setShots(0);
    setStreak(0);
    setStatus("已重置，准备开始新的投篮挑战。");
  }, []);

  const shoot = useCallback(() => {
    setBall((currentBall) => {
      if (currentBall) {
        return currentBall;
      }

      const radians = (angle * Math.PI) / 180;
      const speed = power / 2.2;

      setShots((current) => current + 1);
      setStatus("球已出手，看看这次能不能空心入网。");

      return {
        x: BALL_START_X,
        y: BALL_START_Y,
        vx: Math.cos(radians) * speed,
        vy: -Math.sin(radians) * speed,
        scored: false,
      };
    });
  }, [angle, power]);

  useEffect(() => {
    const savedBest = window.localStorage.getItem("basketball-best-score");
    if (!savedBest) {
      return;
    }

    const value = Number(savedBest);
    if (Number.isNaN(value)) {
      return;
    }

    bestScoreRef.current = value;
    queueMicrotask(() => {
      setBestScore(value);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setAngle((current) => clamp(current + 2, 25, 80));
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setAngle((current) => clamp(current - 2, 25, 80));
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setPower((current) => clamp(current + 1, 8, 22));
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setPower((current) => clamp(current - 1, 8, 22));
      }

      if (event.key === " ") {
        event.preventDefault();
        shoot();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shoot]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRimX((current) => {
        const next = current + rimDirectionRef.current * 1.2;
        if (next <= 62) {
          rimDirectionRef.current = 1;
          return 62;
        }
        if (next >= 82) {
          rimDirectionRef.current = -1;
          return 82;
        }
        return next;
      });
    }, 60);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!ball) {
      return;
    }

    const timer = window.setInterval(() => {
      setBall((currentBall) => {
        if (!currentBall) {
          return currentBall;
        }

        const nextBall = {
          ...currentBall,
          x: currentBall.x + currentBall.vx,
          y: currentBall.y + currentBall.vy,
          vy: currentBall.vy + GRAVITY,
        };

        const rimLeft = rimX;
        const rimRight = rimX + RIM_WIDTH;
        const passedThroughRim =
          !currentBall.scored &&
          currentBall.y < RIM_Y &&
          nextBall.y >= RIM_Y &&
          nextBall.x >= rimLeft + 1 &&
          nextBall.x <= rimRight - 1 &&
          nextBall.vy > 0;

        if (passedThroughRim) {
          nextBall.scored = true;
          setScore((current) => {
            const nextScore = current + 1;
            if (nextScore > bestScoreRef.current) {
              bestScoreRef.current = nextScore;
              setBestScore(nextScore);
              window.localStorage.setItem("basketball-best-score", String(nextScore));
            }
            return nextScore;
          });
          setStreak((current) => current + 1);
          setStatus("空心入网，漂亮。");
        }

        const hitBackboard =
          nextBall.x >= rimRight + BACKBOARD_X_OFFSET &&
          nextBall.x <= rimRight + BACKBOARD_X_OFFSET + 1.5 &&
          nextBall.y >= RIM_Y - 16 &&
          nextBall.y <= RIM_Y + 10;

        if (hitBackboard) {
          nextBall.vx = -Math.abs(nextBall.vx) * 0.72;
        }

        const hitRim =
          nextBall.y >= RIM_Y - 1 &&
          nextBall.y <= RIM_Y + RIM_HEIGHT + 1 &&
          ((nextBall.x >= rimLeft - 1 && nextBall.x <= rimLeft + 1) ||
            (nextBall.x >= rimRight - 1 && nextBall.x <= rimRight + 1));

        if (hitRim) {
          nextBall.vy = -Math.abs(nextBall.vy) * 0.7;
          nextBall.vx *= 0.88;
        }

        const outOfBounds =
          nextBall.x < -10 ||
          nextBall.x > COURT_WIDTH + 10 ||
          nextBall.y > COURT_HEIGHT + 12;

        if (outOfBounds) {
          if (!currentBall.scored) {
            setStreak(0);
            setStatus("这球偏了，再调一下角度和力度。");
          }
          return null;
        }

        return nextBall;
      });
    }, 24);

    return () => {
      window.clearInterval(timer);
    };
  }, [ball, rimX]);

  const accuracy = shots > 0 ? Math.round((score / shots) * 100) : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.28)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-[var(--gold)]">Basketball</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">投篮小游戏</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-[var(--muted)]">
              调整角度和力度，把球投进会左右移动的篮筐。方向键可以微调，空格键也能直接出手。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={shoot}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--gold)] px-5 text-sm font-semibold text-black transition hover:brightness-105"
            >
              出手投篮
            </button>
            <button
              type="button"
              onClick={resetRound}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.24)] hover:text-[var(--gold)]"
            >
              重置数据
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <div className="rounded-[20px] border border-[rgba(214,179,106,0.16)] bg-[rgba(214,179,106,0.08)] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold)]">命中</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{score}</p>
          </div>
          <div className="rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">出手</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{shots}</p>
          </div>
          <div className="rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">命中率</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{accuracy}%</p>
          </div>
          <div className="rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">连中</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{streak}</p>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
          <div className="grid gap-5">
            <label className="block">
              <div className="flex items-center justify-between text-sm font-medium text-[rgba(245,245,242,0.84)]">
                <span>投篮角度</span>
                <span>{angle}°</span>
              </div>
              <input
                type="range"
                min="25"
                max="80"
                value={angle}
                onChange={(event) => setAngle(Number(event.target.value))}
                className="mt-3 w-full accent-[var(--gold)]"
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between text-sm font-medium text-[rgba(245,245,242,0.84)]">
                <span>投篮力度</span>
                <span>{power}</span>
              </div>
              <input
                type="range"
                min="8"
                max="22"
                value={power}
                onChange={(event) => setPower(Number(event.target.value))}
                className="mt-3 w-full accent-[var(--gold)]"
              />
            </label>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
          <p className="text-sm font-semibold text-[var(--foreground)]">玩法提示</p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
            <p>角度高一点更稳，力度大一点更容易穿过移动篮筐。</p>
            <p>上/下方向键调角度，左/右方向键调力度，空格直接投篮。</p>
            <p>最高命中会保存在本地，刷新页面后还在。</p>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.28)] sm:p-5">
        <div className="relative aspect-[10/8] overflow-hidden rounded-[24px] border border-white/80 bg-[linear-gradient(180deg,_#e0f2fe_0%,_#f8fafc_35%,_#fde68a_36%,_#fdba74_100%)]">
          <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[linear-gradient(180deg,_#fb923c_0%,_#ea580c_100%)]" />
          <div className="absolute bottom-[18%] left-[8%] h-[12%] w-[5%] rounded-t-full bg-zinc-900" />
          <div className="absolute bottom-[26%] left-[6%] h-[3%] w-[12%] rounded-full bg-zinc-900" />
          <div
            className="absolute h-[2.5%] rounded-full bg-orange-500 shadow-[0_4px_14px_rgba(249,115,22,0.35)]"
            style={{
              left: `${rimX}%`,
              top: `${RIM_Y}%`,
              width: `${RIM_WIDTH}%`,
            }}
          />
          <div
            className="absolute w-[1.4%] rounded-full bg-zinc-700"
            style={{
              left: `${rimX + RIM_WIDTH + BACKBOARD_X_OFFSET}%`,
              top: `${RIM_Y - 16}%`,
              height: "20%",
            }}
          />
          <div
            className="absolute rounded-b-[18px] border-x-2 border-b-2 border-white/70"
            style={{
              left: `${rimX + 1.6}%`,
              top: `${RIM_Y + 2.2}%`,
              width: `${RIM_WIDTH - 3.2}%`,
              height: "10%",
            }}
          />

          {ball ? (
            <div
              className="absolute h-[5.5%] w-[5.5%] rounded-full border-2 border-orange-200 bg-[radial-gradient(circle_at_35%_35%,_#fed7aa_0%,_#fb923c_45%,_#ea580c_100%)] shadow-[0_8px_18px_rgba(234,88,12,0.28)]"
              style={{
                left: `${ball.x}%`,
                top: `${ball.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          ) : (
            <div
              className="absolute h-[5.5%] w-[5.5%] rounded-full border-2 border-orange-200 bg-[radial-gradient(circle_at_35%_35%,_#fed7aa_0%,_#fb923c_45%,_#ea580c_100%)] shadow-[0_8px_18px_rgba(234,88,12,0.28)]"
              style={{
                left: `${BALL_START_X}%`,
                top: `${BALL_START_Y}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          )}

          <div
            className="absolute border-t-2 border-dashed border-sky-300/80"
            style={{
              left: `${BALL_START_X}%`,
              top: `${BALL_START_Y}%`,
              width: `${power * 2.3}%`,
              transform: `rotate(-${angle}deg)`,
              transformOrigin: "left center",
            }}
          />
        </div>

        <div className="mt-4 rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-4 text-sm text-[var(--muted)]">
          {status}
          <span className="ml-2 text-[rgba(245,245,242,0.48)]">最高命中 {bestScore}</span>
        </div>
      </div>
    </div>
  );
}
