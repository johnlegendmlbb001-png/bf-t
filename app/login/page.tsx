"use client";

import { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiLock,
  FiUser,
  FiKey,
} from "react-icons/fi";

type Tab = "login" | "register";
type ForgotStep = 0 | 1 | 2;

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("login");
  const [forgotStep, setForgotStep] = useState<ForgotStep>(0);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState("");

  const [loginData, setLoginData] = useState({
    user: "",
    password: "",
  });

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

  /* ---------- HELPERS ---------- */
  const isGmail = (email: string) =>
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const isPhone = (phone: string) => /^[0-9]{10}$/.test(phone);
  const minLen = (txt: string, min: number) => txt.length >= min;

  const clearMessages = () => {
    setErrors({});
    setSuccess("");
  };

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    const errs: any = {};
    if (!loginData.user) errs.user = "Email or phone required";
    if (!loginData.password) errs.password = "Password required";
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    clearMessages();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();

      if (!data.success) return setErrors({ user: data.message });

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("userName", data.user.name);
      sessionStorage.setItem("email", data.user.email);
      sessionStorage.setItem("phone", data.user.phone);
      sessionStorage.setItem("userId", data.user.userId);

      setSuccess("Login successful. Redirecting...");
      setTimeout(() => (window.location.href = "/"), 800);
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER ================= */
  const handleRegister = async () => {
    const errs: any = {};
    if (!minLen(regData.name, 3)) errs.name = "Min 3 characters";
    if (!isGmail(regData.email)) errs.email = "Valid Gmail required";
    if (!isPhone(regData.phone)) errs.phone = "10 digit phone required";
    if (!minLen(regData.password, 6))
      errs.password = "Min 6 characters";

    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    clearMessages();

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regData),
      });
      const data = await res.json();

      if (!data.success) return setErrors({ email: data.message });

      setSuccess("Account created successfully. Please login.");
      setTab("login");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORGOT PASSWORD ================= */
  const sendOtp = async () => {
    if (!isGmail(forgotData.email))
      return setErrors({ email: "Valid Gmail required" });

    setLoading(true);
    clearMessages();

    try {
      const res = await fetch("/api/auth/forgot-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotData.email }),
      });
      const data = await res.json();

      if (!data.success) return setErrors({ email: data.message });

      setSuccess("OTP sent to your email");
      setForgotStep(2);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    const errs: any = {};
    if (!forgotData.otp) errs.otp = "OTP required";
    if (!minLen(forgotData.newPassword, 6))
      errs.newPassword = "Min 6 characters";

    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    clearMessages();

    try {
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(forgotData),
      });
      const data = await res.json();

      if (!data.success) return setErrors({ otp: data.message });

      setSuccess("Password reset successful. Please login.");
      setForgotStep(0);
      setForgotData({ email: "", otp: "", newPassword: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[var(--background)] to-black/20">
      <div className="w-full max-w-md rounded-3xl border bg-[var(--card)] shadow-2xl">

        {/* Tabs */}
        <div className="grid grid-cols-2 text-sm font-semibold relative">
          {["login", "register"].map((t) => (
            <button
              key={t}
              onClick={() => {
                clearMessages();
                setForgotStep(0);
                setTab(t as Tab);
              }}
              className={`py-4 transition-all duration-300 relative
                ${
                  tab === t
                    ? "text-[var(--accent)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
            >
              {t === "login" ? "Login" : "Register"}
              {tab === t && (
                <span className="absolute left-6 right-6 bottom-0 h-[2px] bg-[var(--accent)] rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">

          {/* Title */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold">
              {tab === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-sm text-[var(--muted)]">
              {tab === "login"
                ? "Login to continue"
                : "Register in less than a minute"}
            </p>
          </div>

          {/* Success */}
          {success && (
            <div className="rounded-lg bg-green-500/10 border border-green-500/30 px-4 py-2 text-sm text-green-500 text-center">
              {success}
            </div>
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

              <div className="flex justify-end">
                <button
                  className="text-xs text-[var(--accent)] hover:underline"
                  onClick={() => setForgotStep(1)}
                >
                  Forgot password?
                </button>
              </div>

              <PrimaryButton
                loading={loading}
                onClick={handleLogin}
                text="Login"
              />

              {forgotStep > 0 && (
                <div className="text-xs text-center text-[var(--muted)]">
                  Step {forgotStep === 1 ? "1 of 2" : "2 of 2"} – Reset Password
                </div>
              )}

              {forgotStep === 1 && (
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

              {forgotStep === 2 && (
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
                      setForgotData({
                        ...forgotData,
                        newPassword: v,
                      })
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

          {/* REGISTER */}
          {tab === "register" && (
            <>
              <Input
                icon={<FiUser />}
                placeholder="Full Name"
                value={regData.name}
                onChange={(v: string) =>
                  setRegData({ ...regData, name: v })
                }
                error={errors.name}
              />

              <Input
                icon={<FiMail />}
                placeholder="Gmail"
                value={regData.email}
                onChange={(v: string) =>
                  setRegData({ ...regData, email: v })
                }
                error={errors.email}
              />

              <Input
                icon={<FiPhone />}
                placeholder="Phone"
                value={regData.phone}
                onChange={(v: string) =>
                  setRegData({ ...regData, phone: v })
                }
                error={errors.phone}
              />

              <Input
                icon={<FiLock />}
                type="password"
                placeholder="Password"
                value={regData.password}
                onChange={(v: string) =>
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
    <div className="space-y-1">
      <div
        className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition
        ${
          error
            ? "border-red-500"
            : "border-[var(--border)] focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/20"
        }`}
      >
        <span className="text-[var(--muted)] group-focus-within:text-[var(--accent)] transition">
          {icon}
        </span>
        <input
          {...props}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none text-sm placeholder:text-[var(--muted)]"
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 pl-1">{error}</p>
      )}
    </div>
  );
}

function PrimaryButton({ text, loading, ...props }: any) {
  return (
    <button
      {...props}
      disabled={loading}
      className="w-full mt-4 rounded-xl bg-[var(--accent)] py-3 font-semibold text-white
      transition active:scale-[0.98] hover:brightness-110 disabled:opacity-60"
    >
      {loading ? (
        <span className="flex justify-center items-center gap-2">
          <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          Processing
        </span>
      ) : (
        text
      )}
    </button>
  );
}
