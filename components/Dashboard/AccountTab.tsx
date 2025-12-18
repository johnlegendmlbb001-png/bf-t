"use client";

import { useState } from "react";

interface UserDetails {
  name: string;
  email: string;
  phone: string;
}

interface AccountTabProps {
  userDetails: UserDetails;
}

export default function AccountTab({ userDetails }: AccountTabProps) {
  const [newPass, setNewPass] = useState("");
  const [passSuccess, setPassSuccess] = useState("");
  const [passError, setPassError] = useState("");
  const [loadingPass, setLoadingPass] = useState(false);

  const handlePasswordUpdate = async () => {
    if (newPass.length < 6) {
      setPassError("Minimum 6 characters required");
      return;
    }

    setLoadingPass(true);

    try {
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: userDetails.email || userDetails.phone,
          newPassword: newPass,
        }),
      });

      const data = await res.json();
      setLoadingPass(false);

      if (!data.success) {
        setPassError(data.message);
        return;
      }

      setNewPass("");
      setPassSuccess("Password updated successfully");
      setTimeout(() => setPassSuccess(""), 2000);
    } catch {
      setLoadingPass(false);
      setPassError("Failed to update password. Please try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Account</h2>
          <p className="text-sm text-[var(--muted)]">
            View your profile and secure your account.
          </p>
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= PROFILE CARD ================= */}
        <div className="lg:col-span-1 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-[var(--accent)]/15 flex items-center justify-center text-lg font-bold text-[var(--accent)]">
              {userDetails.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="font-semibold">{userDetails.name}</p>
              <p className="text-xs text-[var(--muted)]">Account Holder</p>
            </div>
          </div>

          <ProfileItem label="Email" value={userDetails.email} />
          <ProfileItem label="Phone" value={userDetails.phone} />
        </div>

        {/* ================= SECURITY CARD ================= */}
        <div className="lg:col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h3 className="text-lg font-semibold mb-1">Security</h3>
          <p className="text-sm text-[var(--muted)] mb-5">
            Update your password to keep your account secure.
          </p>

          {/* Alerts */}
          {passSuccess && (
            <div className="mb-4 rounded-xl bg-green-500/10 text-green-500 px-4 py-2 text-sm">
              {passSuccess}
            </div>
          )}
          {passError && (
            <div className="mb-4 rounded-xl bg-red-500/10 text-red-500 px-4 py-2 text-sm">
              {passError}
            </div>
          )}

          {/* Password Input */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="password"
              placeholder="New password (min 6 chars)"
              value={newPass}
              onChange={(e) => {
                setNewPass(e.target.value);
                setPassError("");
              }}
              className="flex-1 p-3 sm:p-4 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />

            <button
              disabled={loadingPass}
              onClick={handlePasswordUpdate}
              className="sm:min-w-[200px] px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-medium transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingPass ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Updating
                </span>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs text-[var(--muted)] mb-1">{label}</p>
      <p className="font-medium break-all">{value}</p>
    </div>
  );
}
