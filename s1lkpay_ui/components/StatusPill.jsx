export function StatusPill({ status }) {
  const map = {
    paid: { cls: "paid", label: "Paid" },
    pending: { cls: "pending", label: "Awaiting payment" },
    expired: { cls: "expired", label: "Expired" },
    failed: { cls: "failed", label: "Failed" },
  };
  const s = map[status] || map.pending;
  return <span className={"pill " + s.cls}>{s.label}</span>;
}
