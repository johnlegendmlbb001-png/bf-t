import React, { useState, useEffect, useRef } from "react";

interface BlueBuffLoaderProps {
  progress?: number;
  duration?: number;
  onComplete?: () => void;
  showText?: boolean;
  text?: string;
}

export default function BlueBuffLoader({
  progress = 0,
  duration = 900,
  onComplete,
  showText = true,
  text = "Summoning Blue Buff",
}: BlueBuffLoaderProps) {
  const [internalProgress, setInternalProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  /* ================= PROGRESS ENGINE ================= */
  useEffect(() => {
    if (progress > 0) {
      setInternalProgress(progress);
      if (progress >= 100) finish();
      return;
    }

    const animate = (time: number) => {
      if (!startRef.current) startRef.current = time;
      const elapsed = time - startRef.current;

      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);

      setInternalProgress(eased * 100);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        finish();
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [progress, duration]);

  const finish = () => {
    setInternalProgress(100);
    setIsComplete(true);
    setTimeout(() => {
      setIsAnimating(false);
      onComplete?.();
    }, 700);
  };

  /* ================= COLOR LOGIC ================= */
  const getProgressColor = (pct: number) => {
    if (pct < 25) return "#3b82f6";
    if (pct < 50) return "#22d3ee";
    if (pct < 75) return "#8b5cf6";
    return "#10b981";
  };

  const pulseIntensity = 0.3 + internalProgress / 220;
  const activeParticles = Math.floor(internalProgress / 20);

  if (!isAnimating) return null;

  return (
    <div
      className="
        fixed inset-0 z-50 flex flex-col items-center justify-center
        bg-[radial-gradient(circle_at_center,#0b1220,#020617)]
      "
    >
      {/* ================= CORE ================= */}
      <div className="relative w-48 h-48">

        {/* GLASS DEPTH RING */}
        <div className="absolute inset-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10" />

        {/* ================= HEX RING ================= */}
        <div
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: `${4 - internalProgress / 60}s` }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={getProgressColor(internalProgress)} />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>

            <polygon
              points="50,6 88,28 88,72 50,94 12,72 12,28"
              fill="none"
              stroke="url(#hexGrad)"
              strokeWidth={2.5 + internalProgress / 50}
              strokeDasharray="18 10"
              opacity={isComplete ? 1 : 0.7}
            />
          </svg>
        </div>

        {/* ================= ORBIT PARTICLES ================= */}
        {[0, 72, 144, 216, 288].map((deg, i) => {
          const active = i < activeParticles;
          return (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                animation: active
                  ? `spin ${2.2 + i * 0.25}s linear infinite`
                  : "none",
              }}
            >
              <div
                className="absolute w-3 h-3 rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `
                    rotate(${deg}deg)
                    translateX(${36 + internalProgress / 18}px)
                    translateY(-50%)
                  `,
                  background: getProgressColor(internalProgress),
                  opacity: active ? 1 : 0.15,
                  boxShadow: active
                    ? `0 0 14px ${getProgressColor(internalProgress)}`
                    : "none",
                }}
              />
            </div>
          );
        })}

        {/* ================= CENTER CORE ================= */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-24 h-24">

            {/* ENERGY SWIRL */}
            <div
              className="absolute inset-1 rounded-full animate-spin blur-sm"
              style={{
                background: `conic-gradient(
                  from 0deg,
                  transparent,
                  ${getProgressColor(internalProgress)},
                  transparent
                )`,
                animationDuration: "3s",
                opacity: 0.6,
              }}
            />

            {/* AURA */}
            <div
              className="absolute inset-0 rounded-full blur-xl"
              style={{
                background: getProgressColor(internalProgress),
                opacity: pulseIntensity,
                transform: `scale(${1 + internalProgress / 480})`,
              }}
            />

            {/* SHIELD */}
            <svg viewBox="0 0 64 64" className="relative w-full h-full">
              <path
                d="M32 4 L8 14 L8 30 Q8 45 32 60 Q56 45 56 30 L56 14 Z"
                fill={getProgressColor(internalProgress)}
                opacity="0.95"
              />
            </svg>

            {/* TEXT / CHECK */}
            <div className="absolute inset-0 flex items-center justify-center">
              {!isComplete ? (
                <span
                  className="font-extrabold text-xl"
                  style={{
                    color: "#e5e7eb",
                    textShadow: `0 0 12px ${getProgressColor(internalProgress)}`,
                  }}
                >
                  {Math.round(internalProgress)}%
                </span>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24">
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* COMPLETION SHOCKWAVE */}
        {isComplete && (
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping" />
        )}
      </div>

      {/* ================= TEXT ================= */}
      {showText && (
        <div className="mt-10 text-center">
          <p
            className="text-sm font-semibold tracking-[0.25em] uppercase"
            style={{
              color: getProgressColor(internalProgress),
              textShadow: `0 0 14px ${getProgressColor(internalProgress)}`,
            }}
          >
            {text}
            {!isComplete && <span className="ml-1 animate-pulse">…</span>}
          </p>

          <p className="text-xs opacity-70 mt-2">
            {internalProgress < 30 && "Initializing mana core"}
            {internalProgress >= 30 && internalProgress < 60 && "Empowering buff"}
            {internalProgress >= 60 && internalProgress < 90 && "Almost ready"}
            {internalProgress >= 90 && !isComplete && "Finalizing"}
            {isComplete && "Blue Buff Ready"}
          </p>
        </div>
      )}
    </div>
  );
}
