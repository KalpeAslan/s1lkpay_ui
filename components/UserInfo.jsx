import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client.js";

export function UserInfo({ onLogout }) {
  const { data: user } = useQuery({
    queryKey: ["settings"],
    queryFn: api.getSettings,
  });
  const name = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.businessName || user.email
    : "…";
  const email = user?.email || "";
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className="sb-account" style={{ cursor: "pointer" }} onClick={onLogout} title="Sign out">
      <div className="sb-avatar">{initials || "?"}</div>
      <div className="sb-account-text">
        <b>{name}</b>
        <span>{email}</span>
      </div>
    </div>
  );
}
