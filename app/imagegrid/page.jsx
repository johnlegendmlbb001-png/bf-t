"use client";

import { useRef, useState } from "react";
import ColumnControl from "@/components/imageSlider/ColumnControl";
import SkinPicker from "@/components/imageSlider/SkinPicker";
import ExportCanvas from "@/components/imageSlider/ExportCanvas";
import UploadSidebar from "@/components/imageSlider/UploadSidebar";
import SkinFilter from "@/components/imageSlider/SkinFilter";
import Templates from "@/components/imageSlider/Templates";
import { downloadGrid } from "@/utils/download";
import { saveTemplate } from "@/utils/templates";
import { ImagePlus, Download, Save } from "lucide-react";

export default function Page() {
  const exportRef = useRef(null);
  const [open, setOpen] = useState(false);

  return (
    <main className="p-6 space-y-6 relative">
      {/* TOP RIGHT – UPLOAD ONLY */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setOpen(true)}
          className="
            flex items-center gap-2 px-4 py-2
            bg-[var(--card)] border border-white/10
            text-[var(--foreground)] rounded-xl
          "
        >
          <ImagePlus size={16} />
          Upload
        </button>
      </div>

      <h1 className="text-xl font-semibold">Skin Grid Generator</h1>

      <ColumnControl />
      <SkinFilter />
      <SkinPicker />

      {/* EXPORT TARGET */}
      <div ref={exportRef}>
        <ExportCanvas />
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            try {
              saveTemplate();
              alert("Template saved");
            } catch (e) {
              alert(e.message);
            }
          }}
          className="
            flex items-center gap-2
            px-4 py-2 rounded-xl
            bg-[var(--card)]
            border border-white/10
          "
        >
          <Save size={16} />
          Save Template
        </button>

        <button
          onClick={() =>
            exportRef.current &&
            downloadGrid(exportRef.current)
          }
          className="
            flex items-center gap-2
            px-4 py-2 rounded-xl
            bg-[var(--accent)]
            text-black font-semibold
          "
        >
          <Download size={16} />
          Download
        </button>
      </div>

      {/* SAVED TEMPLATES */}
      <Templates />

      <UploadSidebar open={open} onClose={() => setOpen(false)} />
    </main>
  );
}
