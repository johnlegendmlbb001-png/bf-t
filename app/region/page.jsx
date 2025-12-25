"use client";

import { useState } from "react";
import { Loader2, User, MapPin, CheckCircle, XCircle } from "lucide-react";
import HelpImagePopup from "../../components/HelpImage/HelpImagePopup";
import { saveVerifiedPlayer } from "@/utils/storage/verifiedPlayerStorage";
import RecentVerifiedPlayers from "./RecentVerifiedPlayers";

export default function RegionPage() {
  const [id, setId] = useState("");
  const [zone, setZone] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!id || !zone) return;
    setLoading(true);

    const res = await fetch("/api/check-region", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, zone }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);

    if (data?.success === 200) {
      saveVerifiedPlayer({
        playerId: id,
        zoneId: zone,
        username: data.data.username,
        region: data.data.region,
        savedAt: Date.now(),
      });
    }
  };

  return (
    <section className="min-h-screen pt-10 px-4 bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-md mx-auto">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Check Player Region</h2>
            <p className="text-sm text-[var(--muted)]">
              Verify MLBB Player ID & Server
            </p>
          </div>
          <HelpImagePopup />
        </div>

        {/* ================= CARD ================= */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-4">

          {/* Player ID */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
            <input
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-transparent border border-[var(--border)]
                         focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Player ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>

          {/* Zone ID */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
            <input
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-transparent border border-[var(--border)]
                         focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Zone ID"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
            />
          </div>

          {/* Button */}
          <button
            onClick={handleCheck}
            disabled={loading || !id || !zone}
            className="
              w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]
              hover:opacity-90 disabled:opacity-50
              flex items-center justify-center gap-2
            "
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Checking...
              </>
            ) : (
              "Check Region"
            )}
          </button>
        </div>

        {/* ================= RECENT ================= */}
        <div className="mt-6">
          <RecentVerifiedPlayers
            limit={10}
            onSelect={(player) => {
              setId(player.playerId);
              setZone(player.zoneId);
            }}
          />
        </div>

        {/* ================= RESULT ================= */}
        {result && (
          <div
            className={`
              mt-6 rounded-2xl p-4 border
              ${
                result.success === 200
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-red-500/10 border-red-500/30"
              }
            `}
          >
            {result.success === 200 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle size={18} />
                  Player Verified
                </div>

                <p className="text-sm">
                  <span className="text-[var(--muted)]">Username:</span>{" "}
                  <span className="font-medium">{result.data?.username}</span>
                </p>

                <p className="text-sm">
                  <span className="text-[var(--muted)]">Region:</span>{" "}
                  <span className="font-medium">{result.data?.region}</span>
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-400 font-semibold">
                <XCircle size={18} />
                ID not found
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
