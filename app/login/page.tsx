"use client";

import { useState } from "react";
import { FiMail, FiPhone, FiLock, FiUser } from "react-icons/fi";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ user: "", password: "" });
  const [regData, setRegData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState("");

  /* ---------- VALIDATION HELPERS ---------- */
  const isGmail = (email: string) =>
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  const isPhone = (phone: string) => /^[0-9]{10}$/.test(phone);
  const minLen = (txt: string, min: number) => txt.length >= min;
  const maxLen = (txt: string, max: number) => txt.length <= max;

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    let errs: any = {};
    if (!loginData.user.trim()) errs.user = "Email or phone required";
    if (!loginData.password.trim()) errs.password = "Password required";
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });
    const data = await res.json();
    setLoading(false);

    if (!data.success) return setErrors({ user: data.message });

    localStorage.setItem("token", data.token);
    localStorage.setItem("userName", data.user.name);
    localStorage.setItem("email", data.user.email);
    localStorage.setItem("phone", data.user.phone);
    localStorage.setItem("userId", data.user.userId);

    setSuccess("Login successful! Redirecting...");
    setTimeout(() => (window.location.href = "/"), 900);
  };

  /* ================= REGISTER ================= */
  const handleRegister = async () => {
    let errs: any = {};

    if (!regData.name.trim()) errs.name = "Name required";
    else if (!minLen(regData.name, 3)) errs.name = "Min 3 characters";
    else if (!maxLen(regData.name, 15)) errs.name = "Max 15 characters";

    if (!regData.email.trim()) errs.email = "Email required";
    else if (!isGmail(regData.email)) errs.email = "Only Gmail allowed";

    if (!regData.phone.trim()) errs.phone = "Phone required";
    else if (!isPhone(regData.phone)) errs.phone = "10 digits required";

    if (!regData.password.trim()) errs.password = "Password required";
    else if (!minLen(regData.password, 6))
      errs.password = "Min 6 characters";

    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(regData),
    });
    const data = await res.json();
    setLoading(false);

    if (!data.success) return setErrors({ email: data.message });

    setSuccess("Account created! Please login.");
    setTab("login");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl overflow-hidden">

        {/* Accent Glow */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--accent)]/10 to-transparent blur-2xl" />

        {/* Tabs */}
        <div className="grid grid-cols-2 text-sm font-semibold">
          {["login", "register"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setErrors({});
                setSuccess("");
                setTab(t as any);
              }}
              className={`py-4 transition-all ${
                tab === t
                  ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-white"
              }`}
            >
              {t === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {success && (
            <div className="text-center text-green-500 text-sm font-medium">
              {success}
            </div>
          )}

          {/* INPUT WRAPPER */}
          {tab === "login" && (
            <>
              <Input
                icon={<FiMail />}
                placeholder="Email or Phone"
                value={loginData.user}
                onChange={(v: any) =>
                  setLoginData({ ...loginData, user: v })
                }
                error={errors.user}
              />

              <Input
                icon={<FiLock />}
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(v: any) =>
                  setLoginData({ ...loginData, password: v })
                }
                error={errors.password}
              />

              <PrimaryButton
                loading={loading}
                onClick={handleLogin}
                text="Login"
              />
            </>
          )}

          {tab === "register" && (
            <>
              <Input
                icon={<FiUser />}
                placeholder="Full Name"
                value={regData.name}
                onChange={(v: any) => setRegData({ ...regData, name: v })}
                error={errors.name}
              />

              <Input
                icon={<FiMail />}
                placeholder="Gmail Address"
                value={regData.email}
                onChange={(v: any) =>
                  setRegData({ ...regData, email: v })
                }
                error={errors.email}
              />

              <Input
                icon={<FiPhone />}
                placeholder="Phone Number"
                value={regData.phone}
                onChange={(v: any) =>
                  setRegData({ ...regData, phone: v })
                }
                error={errors.phone}
              />

              <Input
                icon={<FiLock />}
                type="password"
                placeholder="Password"
                value={regData.password}
                onChange={(v: any) =>
                  setRegData({ ...regData, password: v })
                }
                error={errors.password}
              />

              <PrimaryButton
                loading={loading}
                onClick={handleRegister}
                text="Create Account"
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ================= REUSABLE UI ================= */

function Input({ icon, error, onChange, ...props }: any) {
  return (
    <div>
      <div
        className={`flex items-center gap-3 rounded-lg border px-3 py-3 bg-[var(--background)]
        ${error ? "border-red-500" : "border-[var(--border)] focus-within:border-[var(--accent)]"}`}
      >
        <span className="text-[var(--muted)]">{icon}</span>
        <input
          {...props}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function PrimaryButton({ text, loading, ...props }: any) {
  return (
    <button
      {...props}
      disabled={loading}
      className="w-full mt-2 rounded-lg bg-[var(--accent)] py-3 font-semibold text-white
      hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60"
    >
      {loading ? "Please wait..." : text}
    </button>
  );
}
