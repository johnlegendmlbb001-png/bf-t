// src/components/SkinGrid.tsx
"use client";

import { useStore } from "@/store/useStore";
import { skins } from "@/data/skins";
import { ImageOff } from "lucide-react";

export default function SkinGrid() {
  const { selectedSkins, columns } = useStore();

  /* EMPTY STATE */
  if (selectedSkins.length === 0) {
    return (
      <div
        className="
          flex flex-col items-center justify-center
          gap-3
          py-12
          rounded-2xl
          bg-[var(--card)]
          border border-white/10
          text-[var(--muted)]
        "
      >
        <ImageOff size={28} />
        <p className="text-sm">Select skins to preview grid</p>
      </div>
    );
  }

  return (
    <div
      className="
        bg-[var(--card)]
        border border-white/10
        rounded-2xl
        p-3 sm:p-4
      "
    >
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {selectedSkins.map((id) => {
          const skin = skins.find((s) => s.id === id);
          if (!skin) return null;

          return (
            <div
              key={id}
              className="
                overflow-hidden
                rounded-xl
                bg-black/40
              "
            >
              <img
                src={skin.image}
                alt=""
                className="
                  w-full h-auto
                  object-cover
                  transition
                "
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
