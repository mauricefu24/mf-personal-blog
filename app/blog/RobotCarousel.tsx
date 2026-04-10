"use client";

import { useEffect, useState } from "react";

type RobotSlide = {
  id: string;
  name: string;
  type: string;
  description: string;
  accent: string;
  glow: string;
  eye: string;
  badge: string;
  antenna: "single" | "double" | "dish";
  arms: "claw" | "orb" | "wing";
  mobility: "tracks" | "legs" | "hover";
};

const slides: RobotSlide[] = [
  {
    id: "atlas",
    name: "Atlas",
    type: "Archive Bot",
    description: "负责归档长文、提炼主题与维护技术资料的秩序感。",
    accent: "#d6b36a",
    glow: "rgba(214,179,106,0.24)",
    eye: "#f8f1d7",
    badge: "知识编目",
    antenna: "single",
    arms: "claw",
    mobility: "tracks",
  },
  {
    id: "nova",
    name: "Nova",
    type: "Signal Bot",
    description: "擅长捕捉灵感碎片，把想法整理成可继续扩展的线索。",
    accent: "#7dd3fc",
    glow: "rgba(125,211,252,0.22)",
    eye: "#dff7ff",
    badge: "灵感采样",
    antenna: "double",
    arms: "wing",
    mobility: "hover",
  },
  {
    id: "forge",
    name: "Forge",
    type: "Builder Bot",
    description: "偏向工程执行，适合把概念落地成结构稳定的作品与系统。",
    accent: "#f59e0b",
    glow: "rgba(245,158,11,0.22)",
    eye: "#fff4d8",
    badge: "系统构建",
    antenna: "dish",
    arms: "orb",
    mobility: "legs",
  },
  {
    id: "mist",
    name: "Mist",
    type: "Scout Bot",
    description: "轻盈灵活，负责探索阅读、生活与兴趣内容之间的连接点。",
    accent: "#86efac",
    glow: "rgba(134,239,172,0.2)",
    eye: "#ebfff2",
    badge: "内容侦察",
    antenna: "double",
    arms: "wing",
    mobility: "hover",
  },
];

function RobotIllustration({ slide }: { slide: RobotSlide }) {
  const { accent, glow, eye, antenna, arms, mobility } = slide;

  return (
    <svg viewBox="0 0 320 240" className="h-[118px] w-full sm:h-[132px]" role="img" aria-label={slide.name}>
      <defs>
        <radialGradient id={`glow-${slide.id}`} cx="50%" cy="38%" r="58%">
          <stop offset="0%" stopColor={glow} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id={`body-${slide.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
        </linearGradient>
      </defs>

      <ellipse cx="160" cy="198" rx="92" ry="22" fill={glow} opacity="0.35" />
      <circle cx="160" cy="95" r="74" fill={`url(#glow-${slide.id})`} />

      {antenna === "single" ? (
        <g stroke={accent} strokeWidth="4" strokeLinecap="round">
          <path d="M160 42V20" />
          <circle cx="160" cy="15" r="6" fill={accent} stroke="none" />
        </g>
      ) : null}

      {antenna === "double" ? (
        <g stroke={accent} strokeWidth="4" strokeLinecap="round">
          <path d="M144 46 136 22" />
          <path d="M176 46 184 22" />
          <circle cx="134" cy="18" r="5" fill={accent} stroke="none" />
          <circle cx="186" cy="18" r="5" fill={accent} stroke="none" />
        </g>
      ) : null}

      {antenna === "dish" ? (
        <g>
          <path d="M160 46V28" stroke={accent} strokeWidth="4" strokeLinecap="round" />
          <path d="M142 26C149 16 171 16 178 26" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        </g>
      ) : null}

      <rect x="104" y="54" width="112" height="76" rx="28" fill={`url(#body-${slide.id})`} stroke={accent} strokeOpacity="0.55" />
      <rect x="118" y="72" width="84" height="30" rx="15" fill="rgba(5,5,5,0.35)" stroke={accent} strokeOpacity="0.3" />
      <circle cx="142" cy="87" r="8" fill={eye} />
      <circle cx="178" cy="87" r="8" fill={eye} />
      <path d="M144 112C152 117 168 117 176 112" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />

      <rect x="122" y="134" width="76" height="40" rx="18" fill="rgba(255,255,255,0.06)" stroke={accent} strokeOpacity="0.5" />
      <rect x="146" y="144" width="28" height="8" rx="4" fill={accent} opacity="0.9" />
      <rect x="138" y="158" width="44" height="6" rx="3" fill="rgba(255,255,255,0.28)" />

      {arms === "claw" ? (
        <g stroke={accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M104 142H76l-12 20" />
          <path d="M216 142h28l12 20" />
          <path d="M52 162l12 6-10 10" />
          <path d="M268 162l-12 6 10 10" />
        </g>
      ) : null}

      {arms === "orb" ? (
        <g stroke={accent} strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M104 142H70" />
          <path d="M216 142h34" />
          <circle cx="58" cy="142" r="12" fill="rgba(255,255,255,0.06)" />
          <circle cx="262" cy="142" r="12" fill="rgba(255,255,255,0.06)" />
        </g>
      ) : null}

      {arms === "wing" ? (
        <g fill="rgba(255,255,255,0.05)" stroke={accent} strokeOpacity="0.55">
          <path d="M102 136 58 116 70 160 102 150Z" />
          <path d="M218 136 262 116 250 160 218 150Z" />
        </g>
      ) : null}

      {mobility === "tracks" ? (
        <g>
          <rect x="116" y="180" width="88" height="22" rx="11" fill="rgba(255,255,255,0.05)" stroke={accent} strokeOpacity="0.45" />
          <circle cx="132" cy="191" r="5" fill={accent} opacity="0.8" />
          <circle cx="160" cy="191" r="5" fill={accent} opacity="0.8" />
          <circle cx="188" cy="191" r="5" fill={accent} opacity="0.8" />
        </g>
      ) : null}

      {mobility === "legs" ? (
        <g stroke={accent} strokeWidth="5" strokeLinecap="round">
          <path d="M138 174 128 204" />
          <path d="M182 174 192 204" />
          <path d="M124 204h22" />
          <path d="M174 204h22" />
        </g>
      ) : null}

      {mobility === "hover" ? (
        <g>
          <ellipse cx="160" cy="186" rx="52" ry="12" fill={glow} opacity="0.55" />
          <path d="M122 176C136 184 184 184 198 176" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        </g>
      ) : null}
    </svg>
  );
}

export default function RobotCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, []);

  const activeSlide = slides[index];

  return (
    <section className="mt-8 max-w-[44rem] overflow-hidden rounded-[26px] border border-[rgba(214,179,106,0.16)] bg-[linear-gradient(180deg,_rgba(255,255,255,0.04)_0%,_rgba(255,255,255,0.02)_100%)] shadow-[0_18px_42px_rgba(0,0,0,0.22)]">
      <div className="grid gap-3 px-3 py-3 sm:px-4 sm:py-4 lg:grid-cols-[0.9fr_0.82fr] lg:items-end">
        <div className="relative overflow-hidden rounded-[22px] border border-[rgba(255,255,255,0.06)] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_rgba(255,255,255,0.02)_45%,_rgba(0,0,0,0.12)_100%)] p-2">
          <RobotIllustration slide={activeSlide} />
        </div>

        <div className="flex items-center">
          <div className="w-full rounded-[20px] border border-[rgba(214,179,106,0.14)] bg-[rgba(255,255,255,0.03)] p-3.5 sm:p-4">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
              {activeSlide.type}
            </p>
            <h3 className="mt-2.5 text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
              {activeSlide.name}
            </h3>
            <p className="mt-2.5 text-sm leading-6 text-[rgba(245,245,242,0.7)]">
              {activeSlide.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
