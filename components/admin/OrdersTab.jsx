"use client";

export default function OrdersTab({ orders }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-[var(--border)]">
          <tr>
            <th className="py-3 px-2">Order</th>
            <th className="py-3 px-2">Game</th>
            <th className="py-3 px-2">Item</th>
            <th className="py-3 px-2">Price</th>
            <th className="py-3 px-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr
              key={o._id}
              className="border-b border-[var(--border)]"
            >
              <td className="py-3 px-2 font-mono text-xs">
                {o.orderId}
              </td>
              <td className="py-3 px-2">{o.gameSlug}</td>
              <td className="py-3 px-2">{o.itemName}</td>
              <td className="py-3 px-2 font-semibold">
                ₹{o.price}
              </td>
              <td className="py-3 px-2">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
