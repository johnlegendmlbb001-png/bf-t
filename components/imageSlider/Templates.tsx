"use client";

import { useEffect, useState } from "react";
import {
  getTemplates,
  loadTemplate,
  deleteTemplate,
} from "@/utils/templates";
import { Trash2, Edit3 } from "lucide-react";

export default function Templates() {
  const [templates, setTemplates] = useState<any[]>([]);

  const refresh = () => setTemplates(getTemplates());

  useEffect(() => {
    refresh();
  }, []);

  if (templates.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-[var(--muted)]">
        Saved Templates
      </h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {templates.map((t) => (
          <div
            key={t.id}
            className="
              bg-[var(--card)]
              border border-white/10
              rounded-xl
              p-3
              flex justify-between items-center
            "
          >
            <div className="text-xs text-[var(--muted)]">
              Template #{t.id.toString().slice(-4)}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  loadTemplate(t.data);
                }}
                className="
                  flex items-center gap-1
                  text-xs px-2 py-1
                  rounded-md
                  bg-[var(--accent)]
                  text-black
                "
              >
                <Edit3 size={14} />
                Edit
              </button>

              <button
                onClick={() => {
                  deleteTemplate(t.id);
                  refresh();
                }}
                className="
                  p-1 rounded-md
                  hover:bg-white/10
                "
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
