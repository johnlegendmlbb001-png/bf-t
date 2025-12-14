"use client";

export default function PricingTab({
  pricingType,
  setPricingType,
  slabs,
  setSlabs,
  savingPricing,
  onSave,
}) {
  const canSave = slabs.length > 0 && !savingPricing;

  const updateSlab = (index, key, value) => {
    const next = [...slabs];
    next[index][key] = Number(value);
    setSlabs(next);
  };

  const deleteSlab = (index) => {
    const next = slabs.filter((_, i) => i !== index);
    setSlabs(next.length ? next : [{ min: 0, max: 0, percent: 0 }]);
  };

  return (
    <div className="max-w-3xl space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold">Pricing Rules</h2>
        <p className="text-sm text-[var(--muted)]">
          Control markup percentage based on base price ranges
        </p>
      </div>

      {/* PRICING TYPE */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold">Pricing For</label>
        <select
          value={pricingType}
          onChange={(e) => setPricingType(e.target.value)}
          className="
            bg-[var(--background)]
            border border-[var(--border)]
            rounded-lg px-3 py-2 text-sm
            focus:outline-none focus:border-[var(--accent)]
          "
        >
          <option value="admin">Admin Users</option>
          <option value="user">Normal Users</option>
        </select>
      </div>

      {/* SLABS TABLE */}
      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/20">
            <tr>
              <th className="px-4 py-3 text-left">Min Price</th>
              <th className="px-4 py-3 text-left">Max Price</th>
              <th className="px-4 py-3 text-left">Markup %</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {slabs.map((s, i) => (
              <tr
                key={i}
                className="border-t border-[var(--border)] hover:bg-black/10"
              >
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={s.min}
                    onChange={(e) =>
                      updateSlab(i, "min", e.target.value)
                    }
                    className="
                      w-full bg-transparent
                      border border-[var(--border)]
                      rounded-md px-2 py-1
                      focus:outline-none focus:border-[var(--accent)]
                    "
                  />
                </td>

                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={s.max}
                    onChange={(e) =>
                      updateSlab(i, "max", e.target.value)
                    }
                    className="
                      w-full bg-transparent
                      border border-[var(--border)]
                      rounded-md px-2 py-1
                      focus:outline-none focus:border-[var(--accent)]
                    "
                  />
                </td>

                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={s.percent}
                    onChange={(e) =>
                      updateSlab(i, "percent", e.target.value)
                    }
                    className="
                      w-full bg-transparent
                      border border-[var(--border)]
                      rounded-md px-2 py-1
                      focus:outline-none focus:border-[var(--accent)]
                    "
                  />
                </td>

                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => deleteSlab(i)}
                    className="
                      text-xs text-red-400
                      hover:text-red-500
                      hover:underline
                    "
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-between">
        <button
          onClick={() =>
            setSlabs([...slabs, { min: 0, max: 0, percent: 0 }])
          }
          className="
            text-sm font-semibold
            text-[var(--accent)]
            hover:underline
          "
        >
          + Add Price Slab
        </button>

        <button
          onClick={onSave}
          disabled={!canSave}
          className={`
            px-5 py-2 rounded-lg font-semibold transition
            ${
              canSave
                ? "bg-[var(--accent)] text-black hover:opacity-90"
                : "bg-gray-500/40 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {savingPricing ? "Saving..." : "Save Pricing"}
        </button>
      </div>
    </div>
  );
}
