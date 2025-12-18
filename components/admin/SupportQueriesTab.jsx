"use client";

import { useState } from "react";

export default function SupportQueriesTab({ queries = [], onUpdateStatus }) {
  const [activeQuery, setActiveQuery] = useState(null);

  const statusColors = {
    open: "bg-yellow-500/20 text-yellow-400",
    in_progress: "bg-blue-500/20 text-blue-400",
    resolved: "bg-green-500/20 text-green-400",
    closed: "bg-gray-500/20 text-gray-400",
  };

  const getStatus = (status) => status || "open";

  return (
    <>
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--muted)] border-b border-[var(--border)]">
              <th className="py-3">Contact</th>
              <th>Type</th>
              <th>Message</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {queries.map((q) => {
              const status = getStatus(q.status);

              return (
                <tr
                  key={q._id}
                  onClick={() => setActiveQuery(q)}
                  className="border-b border-[var(--border)] hover:bg-white/5 cursor-pointer"
                >
                  <td className="py-3">
                    <div className="font-medium">{q.email || "-"}</div>
                    <div className="text-xs text-[var(--muted)]">
                      {q.phone || ""}
                    </div>
                  </td>

                  <td className="capitalize">{q.type}</td>

                  <td className="max-w-xs truncate">{q.message}</td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${
                        statusColors[status]
                      }`}
                    >
                      {status.replace("_", " ")}
                    </span>
                  </td>

                  <td className="text-xs text-[var(--muted)]">
                    {new Date(q.createdAt).toLocaleString()}
                  </td>
                </tr>
              );
            })}

            {queries.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-[var(--muted)]"
                >
                  No support queries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-3">
        {queries.map((q) => {
          const status = getStatus(q.status);

          return (
            <div
              key={q._id}
              onClick={() => setActiveQuery(q)}
              className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] cursor-pointer"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">
                  {q.email || q.phone || "User"}
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-xs ${
                    statusColors[status]
                  }`}
                >
                  {status.replace("_", " ")}
                </span>
              </div>

              <div className="text-xs text-[var(--muted)] mb-1 capitalize">
                {q.type}
              </div>

              <p className="text-sm line-clamp-2">{q.message}</p>

              <div className="mt-2 text-xs text-[var(--muted)]">
                {new Date(q.createdAt).toLocaleString()}
              </div>
            </div>
          );
        })}

        {queries.length === 0 && (
          <p className="text-center text-[var(--muted)] py-6">
            No support queries found
          </p>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {activeQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">Support Query</h3>
              <button
                onClick={() => setActiveQuery(null)}
                className="text-[var(--muted)] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-[var(--muted)]">Contact</p>
                <p className="font-medium">
                  {activeQuery.email ||
                    activeQuery.phone ||
                    "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[var(--muted)]">Type</p>
                <p className="capitalize">{activeQuery.type}</p>
              </div>

              <div>
                <p className="text-xs text-[var(--muted)]">Message</p>
                <p className="whitespace-pre-wrap">
                  {activeQuery.message}
                </p>
              </div>

              <div>
                <p className="text-xs text-[var(--muted)] mb-1">Status</p>
                <select
                  value={getStatus(activeQuery.status)}
                  onChange={(e) => {
                    onUpdateStatus(activeQuery._id, e.target.value);
                    setActiveQuery(null);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="text-xs text-[var(--muted)]">
                Created:{" "}
                {new Date(activeQuery.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
