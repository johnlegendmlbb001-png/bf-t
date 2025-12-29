// src/utils/download.ts
import { toPng } from "html-to-image";

export async function downloadGrid(node: HTMLElement) {
  try {
    const dataUrl = await toPng(node, {
      pixelRatio: 2,
      cacheBust: true,
    });

    const link = document.createElement("a");
    link.download = "grid.png";
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Download failed:", err);
    alert("Download failed. Check console.");
  }
}
