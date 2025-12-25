"use client";

import { useState } from "react";
import { FiMail, FiPhone, FiLock, FiUser, FiKey } from "react-icons/fi";

type Tab = "login" | "register" | "forgot";

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("login");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const [loginData, setLoginData] = useState({ user: "", password: "" });
  const [regData, setRegData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [forgotData, setForgotData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState("");

  /* ---------- VALIDATION ---------- */
  const isGmail = (email: string) =>
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  const isPhone = (phone: string) => /^[0-9]{10}$/.test(phone);
  const minLen = (txt: string, min: number) => txt.length >= min;

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    let errs: any = {};
    if (!loginData.user) errs.user = "Email or phone required";
    if (!loginData.password) errs.password = "Password required";
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

    if (!regData.name || !minLen(regData.name, 3))
      errs.name = "Min 3 characters";
    if (!isGmail(regData.email)) errs.email = "Valid Gmail required";
    if (!isPhone(regData.phone)) errs.phone = "10 digit phone required";
    if (!minLen(regData.password, 6))
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

  /* ================= FORGOT PASSWORD ================= */
  const sendOtp = async () => {
    if (!isGmail(forgotData.email))
      return setErrors({ email: "Valid Gmail required" });

    setLoading(true);
    const res = await fetch("/api/auth/forgot-password/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotData.email }),
    });
    const data = await res.json();
    setLoading(false);

    if (!data.success) return setErrors({ email: data.message });

    setSuccess("OTP sent to your email");
    setStep(2);
  };

  const resetPassword = async () => {
    let errs: any = {};
    if (!forgotData.otp) errs.otp = "OTP required";
    if (!minLen(forgotData.newPassword, 6))
      errs.newPassword = "Min 6 characters";

    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    const res = await fetch("/api/auth/forgot-password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(forgotData),
    });
    const data = await res.json();
    setLoading(false);

    if (!data.success) return setErrors({ otp: data.message });

    setSuccess("Password reset successful. Please login.");
    setTab("login");
    setStep(1);
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-[var(--card)] shadow-xl">
        {/* Tabs */}
        <div className="grid grid-cols-2 text-sm font-semibold">
          {tab !== "forgot" &&
            ["login", "register"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setErrors({});
                  setSuccess("");
                  setTab(t as Tab);
                }}
                className={`py-4 ${
                  tab === t
                    ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                    : "text-[var(--muted)]"
                }`}
              >
                {t === "login" ? "Login" : "Register"}
              </button>
            ))}
        </div>

        <div className="p-6 space-y-4">
          {success && (
            <div className="text-green-500 text-center text-sm">{success}</div>
          )}

          {/* LOGIN */}
          {tab === "login" && (
            <>
              <Input
                icon={<FiMail />}
                placeholder="Email or Phone"
                value={loginData.user}
                onChange={(v: string) =>
                  setLoginData({ ...loginData, user: v })
                }
                error={errors.user}
              />

              <Input
                icon={<FiLock />}
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(v: string) =>
                  setLoginData({ ...loginData, password: v })
                }
                error={errors.password}
              />

              <button
                className="text-xs text-[var(--accent)] text-right"
                onClick={() => {
                  setTab("forgot");
                  setErrors({});
                }}
              >
                Forgot password?
              </button>

              <PrimaryButton
                loading={loading}
                onClick={handleLogin}
                text="Login"
              />
            </>
          )}

          {/* REGISTER */}
          {tab === "register" && (
            <>
              <Input icon={<FiUser />} placeholder="Full Name"
                value={regData.name}
                onChange={(v: string) => setRegData({ ...regData, name: v })}
                error={errors.name}
              />
              <Input icon={<FiMail />} placeholder="Gmail"
                value={regData.email}
                onChange={(v: string) => setRegData({ ...regData, email: v })}
                error={errors.email}
              />
              <Input icon={<FiPhone />} placeholder="Phone"
                value={regData.phone}
                onChange={(v: string) => setRegData({ ...regData, phone: v })}
                error={errors.phone}
              />
              <Input icon={<FiLock />} type="password" placeholder="Password"
                value={regData.password}
                onChange={(v: string) => setRegData({ ...regData, password: v })}
                error={errors.password}
              />

              <PrimaryButton
                loading={loading}
                onClick={handleRegister}
                text="Create Account"
              />
            </>
          )}

          {/* FORGOT PASSWORD */}
          {tab === "forgot" && (
            <>
              {step === 1 && (
                <>
                  <Input
                    icon={<FiMail />}
                    placeholder="Registered Gmail"
                    value={forgotData.email}
                    onChange={(v: string) =>
                      setForgotData({ ...forgotData, email: v })
                    }
                    error={errors.email}
                  />
                  <PrimaryButton
                    loading={loading}
                    onClick={sendOtp}
                    text="Send OTP"
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <Input
                    icon={<FiKey />}
                    placeholder="OTP"
                    value={forgotData.otp}
                    onChange={(v: string) =>
                      setForgotData({ ...forgotData, otp: v })
                    }
                    error={errors.otp}
                  />
                  <Input
                    icon={<FiLock />}
                    type="password"
                    placeholder="New Password"
                    value={forgotData.newPassword}
                    onChange={(v: string) =>
                      setForgotData({ ...forgotData, newPassword: v })
                    }
                    error={errors.newPassword}
                  />
                  <PrimaryButton
                    loading={loading}
                    onClick={resetPassword}
                    text="Reset Password"
                  />
                </>
              )}
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
      <div className={`flex items-center gap-3 rounded-lg border px-3 py-3
        ${error ? "border-red-500" : "border-[var(--border)] focus-within:border-[var(--accent)]"}`}>
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
      disabled:opacity-60"
    >
      {loading ? "Please wait..." : text}
    </button>
  );
}
