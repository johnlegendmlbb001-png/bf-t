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
  });

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  /* ================= ADD BANNER ================= */
  const addBanner = async () => {
    if (!form.bannerImage || !form.bannerTitle || !form.bannerSlug) {
      alert("Image URL, Title & Slug required");
      return;
    }

    const res = await fetch("/api/admin/banners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        gameId: form.gameId
          ? form.gameId.split(",").map((g) => g.trim())
          : [],
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message || "Failed");
      return;
    }

    setForm({
      bannerImage: "",
      bannerTitle: "",
      bannerSlug: "",
      bannerLink: "",
      bannerSummary: "",
      gameId: "",
    });

    onRefresh();
  };

  /* ================= TOGGLE SHOW ================= */
  const toggleShow = async (id, isShow) => {
    await fetch(`/api/admin/banners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isShow: !isShow }),
    });

    onRefresh();
  };

  return (
    <div className="space-y-8">

      {/* ADD FORM */}
      <div className="border border-[var(--border)] rounded-xl p-5 space-y-4">
        <h3 className="font-bold text-lg">Add New Banner</h3>

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
          placeholder="Game IDs (comma separated, optional)"
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

        <button
          onClick={addBanner}
          className="px-4 py-2 rounded-lg bg-[var(--accent)] text-black font-semibold"
        >
          Add Banner
        </button>
      </div>

      {/* BANNERS LIST */}
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
        ))}
      </div>
    </div>
  );
}
