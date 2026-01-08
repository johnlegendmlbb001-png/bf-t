"use client";

import { useState } from "react";
import {
  FiChevronDown,
  FiCalendar,
  FiDollarSign,

  FiUser,
  FiGrid,
  FiCreditCard,
  FiPackage,
  FiHash,
} from "react-icons/fi";

type OrderType = {
  orderId: string;
  gameSlug: string;
  itemName: string;
  playerId: string;
  zoneId: string;
  paymentMethod: string;
  price: number;
  status: string;
  topupStatus?: string;
  createdAt: string;
};

interface OrderItemProps {
  order: OrderType;
}

export default function OrderItem({ order }: OrderItemProps) {
  const [open, setOpen] = useState(false);

  const finalStatus = order.topupStatus || order.status;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/10 text-green-400 border border-green-500/30";
      case "failed":
        return "bg-red-500/10 text-red-400 border border-red-500/30";
      default:
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30";
    }
  };

  const getGameName = (slug: string) => {
    if (slug.toLowerCase().includes("mlbb")) return "Mobile Legends";
    return slug;
  };

  return (
    <div className="rounded-2xl border border-[var(--border)]
                    bg-[var(--card)] shadow-sm
                    transition hover:shadow-md">

      {/* ================= HEADER ================= */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-4 flex justify-between items-start
                   text-left focus:outline-none"
      >
        <div className="min-w-0 space-y-1">
          {/* Order ID */}
          <div className="flex items-center gap-2 text-xs font-mono font-semibold truncate">
            <FiHash className="text-[var(--muted)]" />
            <span className="break-all truncate max-w-[220px]">
              {order.orderId}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <FiCalendar />
            {new Date(order.createdAt).toLocaleDateString()}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 text-lg font-semibold">
            ₹{order.price}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusStyle(
              finalStatus
            )}`}
          >
            {finalStatus.toUpperCase()}
          </span>

          <FiChevronDown
            size={18}
            className={`transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </button>

      {/* ================= EXPANDED CONTENT ================= */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden px-4 pb-4">
          <div className="pt-4 border-t border-[var(--border)]
                          space-y-3 text-sm">

            <Info icon={<FiUser />} label="Game" value={getGameName(order.gameSlug)} />
            <Info icon={<FiUser />} label="Player ID" value={order.playerId} mono />
            <Info icon={<FiGrid />} label="Zone ID" value={order.zoneId} mono />
            <Info
              icon={<FiCreditCard />}
              label="Payment"
              value={order.paymentMethod.toUpperCase()}
            />

            {/* Item box */}
            <div className="rounded-xl bg-[var(--background)]/50
                            border border-[var(--border)] p-3">
              <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-1">
                <FiPackage />
                Item
              </div>
              <p className="font-medium break-words">
                {order.itemName}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPER ================= */

function Info({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 min-w-0 items-center">
      <div className="flex items-center gap-2 text-[var(--muted)]">
        {icon}
        <span>{label}</span>
      </div>

      <span
        className={`${
          mono ? "font-mono text-xs" : "font-medium"
        } break-words text-right max-w-[60%]`}
      >
        {value}
      </span>
    </div>
  );
}
