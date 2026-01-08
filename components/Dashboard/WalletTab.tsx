"use client";

import { useState, useEffect } from "react";
import {
  FiPlusCircle,
  FiCreditCard,
  FiSmartphone,
  FiLoader,
  FiDollarSign,
} from "react-icons/fi";

interface WalletTabProps {
  walletBalance: number;
  setWalletBalance: (balance: number) => void;
}

export default function WalletTab({
  walletBalance,
  setWalletBalance,
}: WalletTabProps) {
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [storedPhone, setStoredPhone] = useState("");

  useEffect(() => {
    const phone = localStorage.getItem("phone");
    if (phone) setStoredPhone(phone);
  }, []);

  const presetAmounts = [50, 100, 250, 500];

  const handleProceed = async () => {
    if (!amount || Number(amount) < 1) {
      setAmountError("Minimum amount is ₹1");
      return;
    }

    if (!method) {
      alert("Please select a payment method");
      return;
    }

    if (!storedPhone) {
      alert("Phone number not found. Please log in again.");
      return;
    }

    setLoading(true);
    const userId = localStorage.getItem("userId");

    const res = await fetch("/api/wallet/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        mobile: storedPhone,
        userId,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      alert(data.message);
      return;
    }

    localStorage.setItem("pending_order", data.orderId);
    window.location.href = data.paymentUrl;
  };

  return (
    <div className="max-w-xl space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FiCreditCard /> Wallet
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Add money to your wallet securely.
        </p>
      </div>

      {/* BALANCE */}
      <div className="rounded-2xl border border-[var(--border)]
                      bg-[var(--card)] p-5 flex items-center gap-4">
        <div>
          <p className="text-xs text-[var(--muted)]">Current Balance</p>
          <p className="text-2xl font-bold">₹{walletBalance}</p>
        </div>
      </div>

      {/* ADD MONEY */}
      <div className="rounded-2xl border border-[var(--border)]
                      bg-[var(--background)] p-6 space-y-6">

        {/* Amount */}
        <div>
          <label className="text-sm font-semibold flex items-center gap-2">
            <FiPlusCircle /> Enter Amount
          </label>

          <input
            type="number"
            value={amount}
            placeholder="Minimum ₹1"
            onChange={(e) => {
              setAmount(e.target.value);
              setAmountError("");
            }}
            className="w-full mt-2 p-3 rounded-xl border
                       bg-[var(--card)] border-[var(--border)]"
          />

          {amountError && (
            <p className="text-sm text-red-500 mt-1">
              {amountError}
            </p>
          )}

          {/* Presets */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {presetAmounts.map((v) => (
              <button
                key={v}
                onClick={() => {
                  setAmount(String(v));
                  setAmountError("");
                }}
                className="px-4 py-1.5 rounded-full text-sm
                           border border-[var(--border)]
                           hover:bg-[var(--card)]"
              >
                ₹{v}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="text-sm font-semibold flex items-center gap-2 mb-2">
            <FiCreditCard /> Payment Method
          </label>

          <div className="grid grid-cols-1 gap-3">

            {/* UPI */}
            <button
              onClick={() => setMethod("upi")}
              className={`flex items-center gap-3 p-4 rounded-xl border transition
                ${
                  method === "upi"
                    ? "border-[var(--accent)] bg-[var(--accent)]/10"
                    : "border-[var(--border)] hover:bg-[var(--card)]"
                }`}
            >
              <FiSmartphone />
              <span className="font-medium">UPI</span>
            </button>

            {/* USDT */}
            <div className="flex items-center gap-3 p-4 rounded-xl border
                            border-dashed opacity-50 cursor-not-allowed">
              <FiCreditCard />
              <span className="font-medium">
                USDT (TRC20) – Coming Soon
              </span>
            </div>

          </div>
        </div>

        {/* Proceed */}
        <button
          onClick={handleProceed}
          // disabled={loading}
                    disabled={true}

          className="w-full p-4 rounded-xl bg-[var(--accent)]
                     text-white font-semibold
                     flex items-center justify-center gap-2
                     disabled:opacity-50"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin" />
              Processing...
            </>
          ) : (
            "Proceed to Pay"
          )}
        </button>
      </div>
    </div>
  );
}
