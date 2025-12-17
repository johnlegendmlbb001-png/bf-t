"use client";

import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiX, FiArrowRight } from "react-icons/fi";

const STORAGE_KEY = "hide_whatsapp_banner";
const WHATSAPP_LINK =
  "https://whatsapp.com/channel/0029Vb87jgR17En1n5PKy129";

export default function TopNoticeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hidden = sessionStorage.getItem(STORAGE_KEY);
    if (!hidden) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={() => window.open(WHATSAPP_LINK, "_blank")}
      className="
        w-full
        cursor-pointer
        bg-gradient-to-r
        from-[var(--accent)]
        via-[var(--accent-secondary)]
        to-[var(--accent)]
        text-[var(--foreground)]
        border-b border-[var(--border)]
        shadow-md
        hover:brightness-105
        transition
      "
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="rounded-full p-2 bg-green-500 text-white shadow">
            <FaWhatsapp size={18} />
          </div>

          <div className="leading-tight">
            <p className="font-semibold text-sm md:text-base flex items-center gap-1">
              Join our WhatsApp Channel
              <FiArrowRight className="opacity-70" />
            </p>
            <p className="text-xs md:text-sm text-[var(--muted)]">
              Instant offers, updates & priority support
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs font-medium bg-white/20 px-3 py-1 rounded-full">
            Tap to Join
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent redirect
              sessionStorage.setItem(STORAGE_KEY, "true");
              setVisible(false);
            }}
            className="
              rounded-full p-1
              hover:bg-black/20
              transition
            "
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
