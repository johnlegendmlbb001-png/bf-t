"use client";

export default function UsersTab({
  users,
  updatingUserId,
  onChangeRole,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-[var(--border)]">
          <tr>
            <th className="py-3 px-2">SL</th>
            <th className="py-3 px-2">Name</th>
            <th className="py-3 px-2">Email</th>
            <th className="py-3 px-2">Orders</th>
            <th className="py-3 px-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr
              key={u._id}
              className="border-b border-[var(--border)]"
            >
              <td className="py-3 px-2">{i + 1}</td>
              <td className="py-3 px-2">{u.name}</td>
              <td className="py-3 px-2">{u.email}</td>
              <td className="py-3 px-2">{u.order}</td>
              <td className="py-3 px-2">
              <select
  value={u.userType}
  disabled={u.userType === "owner"}
  onChange={(e) => onChangeRole(u.userId, e.target.value)}
  className="
    bg-[var(--background)]
    border border-[var(--border)]
    rounded-lg px-2 py-1
  "
>
  <option value="user">User</option>
  <option value="admin">Admin</option>

  {u.userType === "owner" && (
    <option value="owner">Owner</option>
  )}
</select>

                {updatingUserId === u.userId && (
                  <span className="ml-2 text-xs text-[var(--muted)]">
                    Updating…
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
