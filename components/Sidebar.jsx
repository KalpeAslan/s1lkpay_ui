import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { useAuthCtx } from "../hooks/useAuthCtx.jsx";
import { IconCog } from "./icons/IconCog.jsx";
import { IconHome } from "./icons/IconHome.jsx";
import { IconLink } from "./icons/IconLink.jsx";
import { IconReceipt } from "./icons/IconReceipt.jsx";
import { IconSend } from "./icons/IconSend.jsx";
import { IconWallet } from "./icons/IconWallet.jsx";
import { UserInfo } from "./UserInfo.jsx";

export function Sidebar() {
  const { logout } = useAuthCtx();
  const location = useLocation();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["payment-links"],
    queryFn: () => api.getLinks(),
    select: (d) => Number(d.counts?.find((c) => c.status === "pending")?.count || 0),
  });
  const pending = data || 0;

  const items = [
    { path: "/dashboard", label: "Dashboard", icon: <IconHome className="sb-icon" /> },
    {
      path: "/links",
      label: "Payment Links",
      icon: <IconLink className="sb-icon" />,
      badge: pending || null,
    },
    { path: "/payments", label: "Payments", icon: <IconReceipt className="sb-icon" /> },
    { path: "/wallet", label: "Wallet", icon: <IconWallet className="sb-icon" /> },
    { path: "/withdraw", label: "Withdraw", icon: <IconSend className="sb-icon" /> },
    { path: "/settings", label: "Settings", icon: <IconCog className="sb-icon" /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-logo">
          <span>S</span>
        </div>
        <div className="sb-name">
          S1lk <b>PAY</b>
        </div>
      </div>
      <div className="sb-section sb-label">Menu</div>
      <nav className="sb-nav">
        {items.map((it) => (
          <button
            key={it.path}
            className={"sb-item" + (location.pathname.startsWith(it.path) ? " active" : "")}
            onClick={() => navigate(it.path)}
            title={it.label}
          >
            {it.icon}
            <span className="sb-label">{it.label}</span>
            {it.badge ? <span className="sb-badge">{it.badge}</span> : null}
          </button>
        ))}
      </nav>
      <div className="sb-foot">
        <div className="sb-mode sb-foot-text">
          <span className="sb-mode-dot"></span> Solana · Mainnet
        </div>
        <UserInfo onLogout={logout} />
      </div>
    </aside>
  );
}
