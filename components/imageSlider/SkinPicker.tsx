"use client";

import { skins } from "@/data/skins";
import { useStore } from "@/store/useStore";
import { Check } from "lucide-react";

export default function SkinPicker() {
  const { selectedSkins, toggleSkin, activeCategory } = useStore();

  const visibleSkins =
    activeCategory === "all"
      ? skins
      : skins.filter((s) => s.category === activeCategory);

  return (
    /* SCROLL CONTAINER */
    <div
      className="
        max-h-[40vh]
        overflow-y-auto
        pr-1
        scrollbar-thin
        scrollbar-thumb-white/20
        scrollbar-track-transparent
      "
    >
      {/* GRID */}
      <div
        className="
          grid grid-cols-3
          sm:grid-cols-4
          md:grid-cols-6
          gap-3
        "
      >
        {visibleSkins.map((skin) => {
          const active = selectedSkins.includes(skin.id);

          return (
            <button
              key={skin.id}
              onClick={() => toggleSkin(skin.id)}
              className={`
                relative overflow-hidden
                rounded-xl
                bg-[var(--card)]
                border border-white/10
                transition-all duration-200
                active:scale-95
                ${
                  active
                    ? "ring-2 ring-[var(--accent)] shadow-lg"
                    : "hover:border-[var(--accent)]/60"
                }
              `}
            >
              {/* IMAGE */}
              <img
                src={skin.image}
                alt=""
                className={`
                  w-full aspect-square object-cover
                  transition
                  ${active ? "brightness-110" : "opacity-80"}
                `}
              />

              {/* SELECTED OVERLAY */}
              {active && (
                <div
                  className="
                    absolute inset-0
                    bg-black/40
                    flex items-center justify-center
                  "
                >
                  <div
                    className="
                      bg-[var(--accent)]
                      text-black
                      rounded-full
                      p-2
                      shadow-lg
                    "
                  >
                    <Check size={18} strokeWidth={3} />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
