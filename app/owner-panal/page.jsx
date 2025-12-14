"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";

export default function AdminPanalPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  /* ================= FETCH BALANCE ================= */
  const fetchBalance = async () => {
    try {
      const res = await fetch("/api/game/balance");
      const data = await res.json();
      if (data.success) {
        setBalance(data?.balance?.data?.balance ?? data.balance);
      }
    } catch (err) {
      console.error("Balance fetch failed");
    }
  };

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    const res = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setUsers(data.data || []);
    setLoading(false);
  };

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    const res = await fetch("/api/admin/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setOrders(data.data || []);
    setLoading(false);
  };

  /* ================= CHANGE USER ROLE ================= */
  const changeUserRole = async (userId, newUserType) => {
    try {
      setUpdatingUserId(userId);
      const token = localStorage.getItem("token");

      const res = await fetch("/api/admin/users/change-role", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, newUserType }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update role");
        return;
      }

      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setUpdatingUserId(null);
    }
  };

  /* ================= ON LOAD ================= */
  useEffect(() => {
    fetchBalance();
  }, []);

  /* ================= TAB CHANGE ================= */
  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "orders") fetchOrders();
  }, [activeTab]);

  return (
    <AuthGuard>
      <section className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6 py-5">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-[var(--accent)]">
              Admin Panel
            </h1>
            <p className="text-[var(--muted)]">
              Manage users & orders
            </p>
          </div>

          {/* BALANCE */}
          <div className="mb-6 bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted)]">
                1GameStopUp Account Balance
              </p>
              <p className="text-2xl font-bold text-[var(--accent)]">
                {balance !== null ? `₹${balance}` : "Loading..."}
              </p>
            </div>

            <a
              href="https://1gamestopup.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              Open Dashboard →
            </a>
          </div>

          {/* TABS */}
          <div className="flex gap-4 mb-6">
            {["users", "orders"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl font-semibold border transition ${
                  activeTab === tab
                    ? "bg-[var(--accent)] text-black"
                    : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--accent)]"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* PANEL */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-lg p-6">
            {loading && (
              <p className="text-center text-[var(--muted)]">Loading...</p>
            )}

            {/* USERS */}
            {!loading && activeTab === "users" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="py-3 px-2">SL</th>
                      <th className="py-3 px-2">Name</th>
                      <th className="py-3 px-2">Email</th>
                      <th className="py-3 px-2">Phone</th>
                      <th className="py-3 px-2">Orders</th>
                      <th className="py-3 px-2">User Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u._id} className="border-b border-[var(--border)]">
                        <td className="py-3 px-2">{i + 1}</td>
                        <td className="py-3 px-2">{u.name}</td>
                        <td className="py-3 px-2">{u.email}</td>
                        <td className="py-3 px-2">{u.phone}</td>
                        <td className="py-3 px-2">{u.order}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <select
                              value={u.userType}
                              disabled={u.userType === "owner"}
                              onChange={(e) =>
                                changeUserRole(u.userId, e.target.value)
                              }
                              className="
                                bg-[var(--background)]
                                border border-[var(--border)]
                                rounded-lg px-2 py-1 text-sm capitalize
                                disabled:opacity-50
                              "
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                              <option value="owner">Owner</option>
                            </select>

                            {updatingUserId === u.userId && (
                              <span className="text-xs text-[var(--muted)]">
                                Updating...
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ORDERS */}
            {!loading && activeTab === "orders" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="py-3 px-2">Order ID</th>
                      <th className="py-3 px-2">Game</th>
                      <th className="py-3 px-2">Item</th>
                      <th className="py-3 px-2">Player ID</th>
                      <th className="py-3 px-2">Zone</th>
                      <th className="py-3 px-2">Payment</th>
                      <th className="py-3 px-2">Price</th>
                      <th className="py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id} className="border-b border-[var(--border)]">
                        <td className="py-3 px-2 font-mono text-xs">{o.orderId}</td>
                        <td className="py-3 px-2">{o.gameSlug}</td>
                        <td className="py-3 px-2">{o.itemName}</td>
                        <td className="py-3 px-2">{o.playerId}</td>
                        <td className="py-3 px-2">{o.zoneId}</td>
                        <td className="py-3 px-2 uppercase">{o.paymentMethod}</td>
                        <td className="py-3 px-2 font-semibold">₹{o.price}</td>
                        <td className="py-3 px-2">{o.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </AuthGuard>
  );
}
