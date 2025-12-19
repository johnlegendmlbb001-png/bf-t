"use client";

import { useState } from "react";

export default function BannersTab({ banners, onRefresh }) {
  const [form, setForm] = useState({
    bannerImage: "",
    bannerTitle: "",
    bannerSlug: "",
    bannerLink: "",
    bannerSummary: "",
    gameId: "",
    isShow: true, // 👈 visibility
  });

  const [editingId, setEditingId] = useState(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  /* ================= ADD BANNER ================= */
  const addBanner = async () => {
    if (!form.bannerImage || !form.bannerTitle || !form.bannerSlug) {
      alert("Image URL, Title & Slug are required");
      return;
    }

    const res = await fetch("/api/admin/banners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bannerImage: form.bannerImage,
        bannerTitle: form.bannerTitle,
        bannerSlug: form.bannerSlug,
        bannerLink: form.bannerLink,
        bannerSummary: form.bannerSummary,
        gameId: form.gameId
          ? form.gameId.split(",").map((g) => g.trim())
          : [],
        isShow: form.isShow,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message || "Failed to add banner");
      return;
    }

    resetForm();
    onRefresh();
  };

  /* ================= START EDIT ================= */
  const startEdit = (banner) => {
    setEditingId(banner._id);
    setForm({
      bannerImage: banner.bannerImage || "",
      bannerTitle: banner.bannerTitle || "",
      bannerSlug: banner.bannerSlug || "",
      bannerLink: banner.bannerLink || "",
      bannerSummary: banner.bannerSummary || "",
      gameId: banner.gameId?.join(", ") || "",
      isShow: banner.isShow ?? true, // 👈 preload visibility
    });
  };

  /* ================= UPDATE BANNER ================= */
const updateBanner = async () => {
  // we now update by SLUG, not by ID
  if (!form.bannerSlug) {
    alert("Banner slug is required");
    return;
  }

  const res = await fetch("/api/admin/banners/editbanner", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      bannerSlug: form.bannerSlug, // 👈 REQUIRED (used by backend)

      bannerImage: form.bannerImage,
      bannerTitle: form.bannerTitle,
      bannerLink: form.bannerLink,
      bannerSummary: form.bannerSummary,
      gameId: form.gameId
        ? form.gameId.split(",").map((g) => g.trim())
        : [],
      isShow: form.isShow, // 👈 VISIBILITY TOGGLE
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Failed to update banner");
    return;
  }

  resetForm();
  onRefresh();
};

  /* ================= TOGGLE SHOW (LIST) ================= */
  const toggleShow = async (id, isShow) => {
    await fetch(`/api/admin/banners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        isShow: !isShow,
      }),
    });

    onRefresh();
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setEditingId(null);
    setForm({
      bannerImage: "",
      bannerTitle: "",
      bannerSlug: "",
      bannerLink: "",
      bannerSummary: "",
      gameId: "",
      isShow: true,
    });
  };

  return (
    <div className="space-y-8">

      {/* ================= FORM ================= */}
      <div className="border border-[var(--border)] rounded-xl p-5 space-y-4">
        <h3 className="font-bold text-lg">
          {editingId ? "Edit Banner" : "Add New Banner"}
        </h3>

        <input
          placeholder="Banner Image URL"
          value={form.bannerImage}
          onChange={(e) =>
            setForm({ ...form, bannerImage: e.target.value })
          }
          className="w-full input"
        />

        <input
          placeholder="Banner Title"
          value={form.bannerTitle}
          onChange={(e) =>
            setForm({ ...form, bannerTitle: e.target.value })
          }
          className="w-full input"
        />

        <input
          placeholder="Banner Slug (unique)"
          value={form.bannerSlug}
          onChange={(e) =>
            setForm({ ...form, bannerSlug: e.target.value })
          }
          className="w-full input"
          disabled={!!editingId}
        />

        <input
          placeholder="Banner Link"
          value={form.bannerLink}
          onChange={(e) =>
            setForm({ ...form, bannerLink: e.target.value })
          }
          className="w-full input"
        />

        <input
          placeholder="Game IDs (comma separated)"
          value={form.gameId}
          onChange={(e) =>
            setForm({ ...form, gameId: e.target.value })
          }
          className="w-full input"
        />

        <textarea
          placeholder="Banner Summary"
          value={form.bannerSummary}
          onChange={(e) =>
            setForm({ ...form, bannerSummary: e.target.value })
          }
          className="w-full input"
        />

        {/* ================= VISIBILITY ================= */}
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium">Visible</span>

          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="isShow"
              checked={form.isShow === true}
              onChange={() =>
                setForm({ ...form, isShow: true })
              }
            />
            <span className="text-sm">Yes</span>
          </label>

          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="isShow"
              checked={form.isShow === false}
              onChange={() =>
                setForm({ ...form, isShow: false })
              }
            />
            <span className="text-sm">No</span>
          </label>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex gap-3">
          <button
            onClick={editingId ? updateBanner : addBanner}
            className="px-4 py-2 rounded-lg bg-[var(--accent)] text-black font-semibold"
          >
            {editingId ? "Update Banner" : "Add Banner"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ================= LIST ================= */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg">All Banners</h3>

        {banners.map((b) => (
          <div
            key={b._id}
            className="flex justify-between items-center border border-[var(--border)] rounded-lg p-4"
          >
            <div>
              <p className="font-semibold">{b.bannerTitle}</p>
              <p className="text-xs text-[var(--muted)]">
                {b.bannerSlug}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => startEdit(b)}
                className="px-3 py-1 rounded-lg text-sm border"
              >
                Edit
              </button>

              <button
                onClick={() => toggleShow(b._id, b.isShow)}
                className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                  b.isShow
                    ? "bg-green-500/20 text-green-500"
                    : "bg-red-500/20 text-red-500"
                }`}
              >
                {b.isShow ? "Visible" : "Hidden"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
