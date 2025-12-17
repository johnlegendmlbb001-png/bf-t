"use client";

import { memo } from "react";
import {
  FaBolt,
  FaShieldAlt,
  FaCreditCard,
  FaHeadset,
  FaUsers,
  FaRobot,
} from "react-icons/fa";

/* ================= DATA ================= */

const HIGHLIGHTS = [
  {
    title: "24/7",
    subtitle: "Instant Delivery",
    icon: FaBolt,
    accent: "from-yellow-400/20 to-orange-400/20",
    text: "text-yellow-400",
  },
  {
    title: "100%",
    subtitle: "Safe & Legitimate",
    icon: FaShieldAlt,
    accent: "from-green-400/20 to-emerald-400/20",
    text: "text-green-400",
  },
  {
    title: "Easy",
    subtitle: "Secure Payments",
    icon: FaCreditCard,
    accent: "from-blue-400/20 to-cyan-400/20",
    text: "text-blue-400",
  },
  {
    title: "24/7",
    subtitle: "Instant Support",
    icon: FaHeadset,
    accent: "from-purple-400/20 to-pink-400/20",
    text: "text-purple-400",
  },
  {
    title: "Trusted",
    subtitle: "By Thousands",
    icon: FaUsers,
    accent: "from-yellow-300/20 to-amber-400/20",
    text: "text-yellow-300",
  },
  {
    title: "Fast",
    subtitle: "Automated Topups",
    icon: FaRobot,
    accent: "from-cyan-400/20 to-sky-400/20",
    text: "text-cyan-400",
  },
];

/* ================= CARD ================= */

const HighlightCard = memo(function HighlightCard({
  title,
  subtitle,
  icon: Icon,
  accent,
  text,
}) {
  return (
    <div
      className="
        group relative rounded-2xl p-6 text-center
        bg-[var(--card)]
        border border-[var(--border)]
        transition-all duration-300 ease-out
        hover:-translate-y-1
        hover:shadow-xl hover:shadow-black/20
        hover:border-[var(--accent)]
      "
    >
      {/* Soft glow (cheap, GPU-friendly) */}
      <div
        className={`
          pointer-events-none absolute inset-0 rounded-2xl
          opacity-0 group-hover:opacity-100
          bg-gradient-to-br ${accent}
          transition-opacity duration-300
        `}
      />

      <div className="relative z-10 flex flex-col items-center gap-3">
        {/* Icon bubble */}
        <div
          className={`
            flex items-center justify-center
            w-12 h-12 rounded-full
            bg-black/30 border border-white/10
            ${text}
          `}
        >
          <Icon className="text-xl" aria-hidden />
        </div>

        <p className={`text-xl font-extrabold ${text}`}>
          {title}
        </p>

        <p className="text-sm text-[var(--muted)]">
          {subtitle}
        </p>
      </div>
    </div>
  );
});

/* ================= SECTION ================= */

export default function TrustHighlights() {
  return (
    <section
      className="
        py-16 px-6
        bg-[var(--background)]
        text-[var(--foreground)]
      "
      aria-label="Trust highlights"
    >
      <div className="max-w-6xl mx-auto">
        <div
          className="
            grid gap-5
            grid-cols-2
            md:grid-cols-3
            lg:grid-cols-6
          "
        >
          {HIGHLIGHTS.map((item) => (
            <HighlightCard key={item.subtitle} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
