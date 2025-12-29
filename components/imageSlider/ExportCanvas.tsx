"use client";

import { useStore } from "@/store/useStore";
import { skins } from "@/data/skins";

export default function ExportCanvas() {
  const {
    profileImage,
    selectedSkins,
    columns,

    collectionImage,
    weeklyImage,

    doubleDiamondImage,
    fullSetImages = [],
    mainHeroImages = [],

    tagImages = {},
    miscImages = [],
  } = useStore();

  return (
    <div className="bg-black w-full inline-block">
      {/* ================= PROFILE BASE ================= */}
      {profileImage && (
        <div className="relative">
          {/* PROFILE */}
          <img
            src={profileImage}
            className="w-full max-h-60 object-cover rounded-md"
          />

          {/* ========== LEFT STACK ========== */}
          {(collectionImage || weeklyImage) && (
            <div className="absolute left-1 top-1 flex flex-col gap-1">
              {collectionImage && (
                <img
                  src={collectionImage}
                  className="w-14 h-36 object-cover rounded-sm border border-black"
                />
              )}

              {weeklyImage && (
                <img
                  src={weeklyImage}
                  className="w-14 h-24 object-cover rounded-sm border border-black"
                />
              )}
            </div>
          )}

          {/* ========== RIGHT STACK ========== */}
          {(doubleDiamondImage ||
            fullSetImages.length > 0 ||
            mainHeroImages.length > 0) && (
            <div className="absolute right-1 top-1 flex flex-col gap-1">
              {/* DOUBLE DIAMOND (ONE ROW ONLY) */}
              {doubleDiamondImage && (
                <img
                  src={doubleDiamondImage}
                  className="w-28 h-10 object-cover rounded-sm border border-black"
                />
              )}

              {/* FULL SET (MAX 2) */}
              {fullSetImages.slice(0, 2).map((img, i) => (
                <img
                  key={`fs-${i}`}
                  src={img}
                  className="w-28 h-10 object-cover rounded-sm border border-black"
                />
              ))}

              {/* MAIN HERO STACK */}
              {mainHeroImages.map((hero, i) => (
                <img
                  key={i}
                  src={hero.src}
                  className={
                    hero.shape === "square"
                      ? "w-14 h-14 object-cover rounded-sm border border-black"
                      : "w-14 h-24 object-cover rounded-sm border border-black"
                  }
                />
              ))}
            </div>
          )}

          {/* ========== TAGS (CENTER) ========== */}
          {(tagImages.diamond ||
            tagImages.coa ||
            tagImages.core) && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 flex gap-1">
              {tagImages.diamond && (
                <img
                  src={tagImages.diamond}
                  className="h-6 w-20 object-cover rounded-sm border border-black"
                />
              )}
              {tagImages.coa && (
                <img
                  src={tagImages.coa}
                  className="h-6 w-20 object-cover rounded-sm border border-black"
                />
              )}
              {tagImages.core && (
                <img
                  src={tagImages.core}
                  className="h-6 w-20 object-cover rounded-sm border border-black"
                />
              )}
            </div>
          )}

          {/* ========== MISC (BOTTOM) ========== */}
          {miscImages.length > 0 && (
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 flex gap-1">
              {miscImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-11 h-11 object-cover rounded-sm border border-black"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* SPACER */}
      {profileImage && miscImages.length > 0 && (
        <div className="h-5" />
      )}

      {/* ================= SKIN GRID ================= */}
      <div
        className="grid gap-[2px]"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {selectedSkins.map((id) => {
          const skin = skins.find((s) => s.id === id);
          if (!skin) return null;

          return (
            <img
              key={id}
              src={skin.image}
              className="w-full h-auto object-cover"
            />
          );
        })}
      </div>
    </div>
  );
}
