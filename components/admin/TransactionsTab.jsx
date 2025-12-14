"use client";

export default function TransactionsTab({ transactions }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-[var(--border)]">
          <tr>
            <th className="py-3 px-2">Date</th>
            <th className="py-3 px-2">Order ID</th>
            <th className="py-3 px-2">User</th>
            <th className="py-3 px-2">Game</th>
            <th className="py-3 px-2">Amount</th>
            <th className="py-3 px-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr
              key={t._id}
              className="border-b border-[var(--border)]"
            >
              <td className="py-3 px-2 text-xs text-[var(--muted)]">
                {new Date(t.createdAt).toLocaleString()}
              </td>
              <td className="py-3 px-2 font-mono text-xs">
                {t.orderId}
              </td>
              <td className="py-3 px-2">
                {t.email || t.userId || "—"}
              </td>
              <td className="py-3 px-2">
                {t.gameSlug}
              </td>
              <td className="py-3 px-2 font-semibold text-green-400">
                ₹{t.price}
              </td>
              <td className="py-3 px-2 capitalize text-green-400">
                {t.status}
              </td>
            </tr>
          ))}

          {!transactions.length && (
            <tr>
              <td
                colSpan={6}
                className="py-6 text-center text-[var(--muted)]"
              >
                No successful transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
