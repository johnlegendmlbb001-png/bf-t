"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import {
  FaShoppingCart,
  FaIdCard,
  FaWallet,
  FaMoneyBillWave,
  FaGem,
} from "react-icons/fa";

const steps = [
  {
    title: "Select Diamond Package",
    icon: FaShoppingCart,
    content: "Choose the diamond pack you want to purchase.",
  },
  {
    title: "Enter User ID and Zone ID",
    icon: FaIdCard,
    content:
      "Fill in your MLBB Player ID, Zone ID, and In-Game Name correctly.",
  },
  {
    title: "Payment Method",
    icon: FaWallet,
    content:
      "Select your preferred payment method such as UPI or Wallet.",
  },
  {
    title: "Pay with Selected Method",
    icon: FaMoneyBillWave,
    content:
      "Complete the payment securely using the selected method.",
  },
  {
    title: "Receive Diamonds",
    icon: FaGem,
    content:
      "Diamonds will be credited to your account instantly.",
  },
];

export default function MLBBPurchaseGuide() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5">

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--accent)/15]">
          <FaShoppingCart className="text-[var(--accent)]" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">MLBB Purchase Guide</h3>
          <p className="text-xs text-[var(--muted)]">
            Follow these steps to complete your purchase
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={`rounded-xl border transition ${
                isOpen
                  ? "border-[var(--accent)]/40 bg-[var(--muted-bg)]/40"
                  : "border-[var(--border)]"
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center gap-4 p-4 text-left"
              >
                {/* Step Number */}
                <div className="w-7 h-7 rounded-full bg-[var(--accent)] text-black text-sm font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--accent)/15] shrink-0">
                  <Icon className="text-[var(--accent)] text-sm" />
                </div>

                {/* Title */}
                <div className="flex-1">
                  <p className="font-medium leading-tight">
                    {step.title}
                  </p>
                </div>

                {/* Chevron */}
                <FiChevronDown
                  className={`text-lg transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Content */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden px-16 pb-4 text-sm text-[var(--muted)]">
                  {step.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
