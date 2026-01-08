"use client";

import { JSX, useState } from "react";
import {
  FaPhoneAlt,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaHeadset,
  FaPaperPlane,
} from "react-icons/fa";

/* ===================== CONFIG ===================== */

const SUPPORT_CONFIG = {
  header: {
    title: "Support Center",
    subtitle:
      "Facing an issue? Contact us instantly or submit a support query and our team will assist you.",
  },

  contacts: {
    title: "Contact Us Directly",
    items: [
      {
        id: "phone",
        title: "Call Support",
        value: "+91 6372305866",
        href: "tel:+916372305866",
        icon: "phone",
        external: false,
      },
      {
        id: "instagram",
        title: "Instagram",
        value: "@zynx.v1",
        href: "https://www.instagram.com/zynx.v1",
        icon: "instagram",
        external: true,
      },
      {
        id: "youtube",
        title: "YouTube",
        value: "Support Channel",
        href: "https://whatsapp.com/channel/0029Vb87jgR17En1n5PKy129",
        icon: "youtube",
        external: true,
      },
      {
        id: "whatsapp",
        title: "WhatsApp Group",
        value: "Join Support Group",
        href: "https://whatsapp.com/channel/0029Vb87jgR17En1n5PKy129",
        icon: "whatsapp",
        external: true,
      },
    ],
  },

  queryTypes: [
    "Order Issue",
    "Payment Issue",
    "Wallet Issue",
    "General Inquiry",
  ],
};

/* ===================== ICON MAP ===================== */

const ICON_MAP: Record<string, JSX.Element> = {
  phone: <FaPhoneAlt />,
  instagram: <FaInstagram />,
  youtube: <FaYoutube />,
  whatsapp: <FaWhatsapp />,
};

/* ===================== COMPONENT ===================== */

export default function QueryTab() {
  const [queryType, setQueryType] = useState("");
  const [queryMessage, setQueryMessage] = useState("");
  const [querySuccess, setQuerySuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!queryType || !queryMessage.trim()) return;

    setIsSubmitting(true);
    const storedEmail = localStorage.getItem("email");
    const storedPhone = localStorage.getItem("phone");

    try {
      const res = await fetch("/api/support/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: storedEmail || null,
          phone: storedPhone || null,
          type: queryType,
          message: queryMessage,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setQuerySuccess("Your query has been submitted successfully.");
      } else {
        setQuerySuccess(data.message || "Something went wrong.");
      }

      setQueryType("");
      setQueryMessage("");
    } catch {
      setQuerySuccess("Failed to submit query. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setQuerySuccess(""), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FaHeadset /> {SUPPORT_CONFIG.header.title}
        </h2>
        <p className="text-sm text-[var(--muted)] max-w-lg mt-1">
          {SUPPORT_CONFIG.header.subtitle}
        </p>
      </div>

      {/* ================= CONTACT SECTION ================= */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h3 className="text-lg font-semibold mb-4">
          {SUPPORT_CONFIG.contacts.title}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SUPPORT_CONFIG.contacts.items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="flex items-center gap-4 rounded-xl
                         border border-[var(--border)] p-4
                         hover:border-[var(--accent)]
                         hover:bg-[var(--background)]
                         transition"
            >
              <div className="p-3 rounded-xl
                              bg-[var(--accent)]/10
                              text-[var(--accent)] text-lg shrink-0">
                {ICON_MAP[item.icon]}
              </div>

              <div className="min-w-0">
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-[var(--muted)] truncate">
                  {item.value}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ================= QUERY FORM ================= */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h3 className="text-lg font-semibold mb-5">
          Submit a Query
        </h3>

        {querySuccess && (
          <div className="mb-4 rounded-xl
                          bg-green-500/10 text-green-500
                          px-4 py-2 text-sm">
            {querySuccess}
          </div>
        )}

        {/* Type */}
        <select
          value={queryType}
          onChange={(e) => setQueryType(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl
                     bg-[var(--background)]
                     border border-[var(--border)]
                     focus:border-[var(--accent)]
                     outline-none"
        >
          <option value="">Select Query Type</option>
          {SUPPORT_CONFIG.queryTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Message */}
        <textarea
          className="w-full mb-4 p-3 rounded-xl h-32
                     bg-[var(--background)]
                     border border-[var(--border)]
                     focus:border-[var(--accent)]
                     outline-none resize-none"
          placeholder="Describe your issue in detail..."
          value={queryMessage}
          onChange={(e) => setQueryMessage(e.target.value)}
        />

        {/* Submit */}
        <button
          disabled={!queryType || !queryMessage || isSubmitting}
          onClick={handleSubmit}
          className={`w-full py-3 rounded-xl
                      font-medium flex items-center
                      justify-center gap-2 transition ${
            !queryType || !queryMessage || isSubmitting
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[var(--accent)] hover:opacity-90"
          }`}
        >
          {isSubmitting ? "Submitting..." : (
            <>
              <FaPaperPlane />
              Submit Query
            </>
          )}
        </button>
      </div>
    </div>
  );
}
