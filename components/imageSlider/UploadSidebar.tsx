"use client";

import { useStore } from "@/store/useStore";
import {
  ImagePlus,
  User,
  Images,
  X,
  Check,
  Layers,
  Crown,
  Calendar,
  Gem,
  BadgeCheck,
  Cpu,
} from "lucide-react";
import { useState } from "react";

export default function UploadSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    profileImage,
    collectionImage,
    weeklyImage,
    doubleDiamondImage,
    fullSetImages,
    tagImages,
    miscImages,
    mainHeroImages,

    setProfileImage,
    setCollectionImage,
    setWeeklyImage,
    setDoubleDiamondImage,
    addFullSetImage,
    removeFullSetImage,
    setTagImage,

    addMiscImage,
    removeMiscImage,

    addMainHeroImage,
    removeMainHeroImage,
  } = useStore();

  const [heroShape, setHeroShape] =
    useState<"square" | "rect">("rect");

  const readFile = (file: File, cb: (s: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => cb(reader.result as string);
    reader.readAsDataURL(file);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* OVERLAY */}
      <div
        className="flex-1 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* PANEL */}
      <div className="w-80 h-full bg-[var(--card)] border-l border-white/10 p-4 space-y-6 overflow-y-auto">
        {/* HEADER */}
        <Header onClose={onClose} />

        {/* PROFILE */}
        <UploadBlock icon={<User size={16} />} title="Profile Image">
          <UploadInput
            preview={profileImage}
            onSelect={(f: File) => readFile(f, setProfileImage)}
            placeholder="Upload profile"
          />
        </UploadBlock>

        {/* COLLECTION */}
        <UploadBlock icon={<Layers size={16} />} title="Collection">
          <UploadInput
            preview={collectionImage}
            onSelect={(f: File) => readFile(f, setCollectionImage)}
            placeholder="Upload collection"
          />
        </UploadBlock>

        {/* WEEKLY */}
        <UploadBlock icon={<Calendar size={16} />} title="Weekly">
          <UploadInput
            preview={weeklyImage}
            onSelect={(f: File) => readFile(f, setWeeklyImage)}
            placeholder="Upload weekly"
          />
        </UploadBlock>

        {/* DOUBLE DIAMOND */}
        <UploadBlock icon={<Gem size={16} />} title="Double Diamond">
          <UploadInput
            preview={doubleDiamondImage}
            onSelect={(f: File) => readFile(f, setDoubleDiamondImage)}
            placeholder="Upload double diamond"
          />
        </UploadBlock>

        {/* FULL SET */}
        <UploadBlock icon={<BadgeCheck size={16} />} title="Full Set (max 2)">
          <UploadInput
            disabled={fullSetImages.length >= 2}
            onSelect={(f: File) => readFile(f, addFullSetImage)}
            placeholder="Add full set"
          />

          <RowPreview
            images={fullSetImages}
            onRemove={removeFullSetImage}
          />
        </UploadBlock>

        {/* MAIN HERO */}
        <UploadBlock icon={<Crown size={16} />} title="Main Hero">
          <ShapeToggle value={heroShape} onChange={setHeroShape} />

          <UploadInput
            onSelect={(f: File) =>
              readFile(f, (src) =>
                addMainHeroImage(src, heroShape)
              )
            }
            placeholder="Add hero image"
          />

          <ColumnPreview
            items={mainHeroImages}
            onRemove={removeMainHeroImage}
          />
        </UploadBlock>

        {/* TAG IMAGES */}
        <UploadBlock icon={<Cpu size={16} />} title="Tags (Diamond / COA / Core)">
          <TagUpload
            label="Diamond"
            icon={<Gem size={14} />}
            value={tagImages.diamond}
            onSelect={(f: File) =>
              readFile(f, (img) => setTagImage("diamond", img))
            }
          />
          <TagUpload
            label="COA"
            icon={<BadgeCheck size={14} />}
            value={tagImages.coa}
            onSelect={(f: File) =>
              readFile(f, (img) => setTagImage("coa", img))
            }
          />
          <TagUpload
            label="Core"
            icon={<Cpu size={14} />}
            value={tagImages.core}
            onSelect={(f: File) =>
              readFile(f, (img) => setTagImage("core", img))
            }
          />
        </UploadBlock>

        {/* MISC */}
        <UploadBlock icon={<Images size={16} />} title="Misc (max 5)">
          <UploadInput
            disabled={miscImages.length >= 5}
            onSelect={(f: File) => readFile(f, addMiscImage)}
            placeholder="Add misc"
          />
          <GridPreview images={miscImages} onRemove={removeMiscImage} />
        </UploadBlock>

        <DoneButton onClose={onClose} />
      </div>
    </div>
  );
}

/* ================= UI HELPERS ================= */

const Header = ({ onClose }: any) => (
  <div className="flex justify-between items-center">
    <h2 className="font-semibold text-lg flex items-center gap-2">
      <ImagePlus size={18} /> Upload Assets
    </h2>
    <button onClick={onClose}><X size={18} /></button>
  </div>
);

const UploadBlock = ({ icon, title, children }: any) => (
  <div className="space-y-2">
    <div className="flex gap-2 text-sm text-[var(--muted)]">
      {icon}
      {title}
    </div>
    {children}
  </div>
);

const UploadInput = ({ onSelect, preview, placeholder, disabled }: any) => (
  <label className={`block border border-dashed rounded-xl p-3 text-center ${disabled ? "opacity-50" : "hover:border-[var(--accent)]"}`}>
    <input type="file" hidden disabled={disabled} onChange={(e) => e.target.files && onSelect(e.target.files[0])} />
    {preview ? <img src={preview} className="h-24 w-full object-cover rounded-lg" /> : <span className="text-xs text-[var(--muted)]">{placeholder}</span>}
  </label>
);

const ShapeToggle = ({ value, onChange }: any) => (
  <div className="flex gap-2">
    {["rect", "square"].map((s) => (
      <button key={s} onClick={() => onChange(s)} className={`flex-1 py-1 text-xs rounded ${value === s ? "bg-[var(--accent)] text-black" : "bg-black/40"}`}>
        {s.toUpperCase()}
      </button>
    ))}
  </div>
);

const GridPreview = ({ images, onRemove }: any) => (
  <div className="flex gap-2 flex-wrap">
    {images.map((img: string, i: number) => (
      <Preview key={i} src={img} onRemove={() => onRemove(i)} />
    ))}
  </div>
);

const RowPreview = GridPreview;

const ColumnPreview = ({ items, onRemove }: any) => (
  <div className="space-y-2">
    {items.map((h: any, i: number) => (
      <Preview key={i} src={h.src} tall={h.shape === "rect"} onRemove={() => onRemove(i)} />
    ))}
  </div>
);

const Preview = ({ src, onRemove, tall }: any) => (
  <div className="relative inline-block">
    <img src={src} className={`${tall ? "h-20 w-12" : "h-12 w-12"} object-cover rounded-md`} />
    <button onClick={onRemove} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
      <X size={12} />
    </button>
  </div>
);

const TagUpload = ({ label, icon, value, onSelect }: any) => (
  <UploadInput
    preview={value}
    onSelect={onSelect}
    placeholder={label}
  />
);

const DoneButton = ({ onClose }: any) => (
  <button onClick={onClose} className="w-full bg-[var(--accent)] text-black font-semibold py-2 rounded-xl">
    <Check size={16} className="inline mr-1" /> Done
  </button>
);
