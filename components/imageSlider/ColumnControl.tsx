// src/components/ColumnControl.tsx
"use client";

import { useStore } from "@/store/useStore";
import { Grid3X3 } from "lucide-react";

export default function ColumnControl() {
  const columns = useStore((s) => s.columns);
  const setColumns = useStore((s) => s.setColumns);

  return (
    <div
      className="
        bg-[var(--card)]
        border border-white/10
        rounded-2xl
        p-4
        space-y-3
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <Grid3X3 size={16} />
          Grid Columns
        </div>

        <div
          className="
            px-2 py-0.5
            rounded-md
            bg-black/40
            text-xs
            font-semibold
            text-[var(--accent)]
          "
        >
          {columns}
        </div>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={1}
        max={15}
        value={columns}
        onChange={(e) => setColumns(Number(e.target.value))}
        className="
          w-full
          accent-[var(--accent)]
        "
      />

      {/* Helper text (mobile friendly) */}
      <p className="text-xs text-[var(--muted)]">
        Adjust how many skins appear in each row
      </p>
    </div>
  );
}
