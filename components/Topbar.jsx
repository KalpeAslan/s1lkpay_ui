import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { useAppCtx } from "../hooks/useAppCtx.jsx";
import { IconBell } from "./icons/IconBell.jsx";
import { IconEye } from "./icons/IconEye.jsx";
import { IconHelp } from "./icons/IconHelp.jsx";
import { IconPlus } from "./icons/IconPlus.jsx";
import { IconSearch } from "./icons/IconSearch.jsx";

export function Topbar({ sidebarStyle, setSidebarStyle }) {
  const { onCreate } = useAppCtx();
  const navigate = useNavigate();
  const location = useLocation();

  const crumbs = (() => {
    const p = location.pathname;
    if (p.startsWith("/links/")) return ["Payment links", "Link detail"];
    if (p === "/links") return ["Payment links"];
    if (p === "/payments") return ["Payments"];
    if (p === "/settings") return ["Settings"];
    if (p === "/wallet") return ["Wallet"];
    if (p === "/withdraw") return ["Wallet", "Withdraw"];
    return ["Home"];
  })();

  const onViewClient = async () => {
    try {
      const { links } = await api.getLinks({ status: "pending" });
      if (links.length > 0) navigate("/pay/" + links[0].slug);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="topbar">
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <span key={i}>
            {i === crumbs.length - 1 ? (
              <b>{c}</b>
            ) : (
              <>
                {c} <span style={{ opacity: 0.5 }}>/</span>
              </>
            )}
          </span>
        ))}
      </div>
      <div className="topbar-spacer" />
      <div className="search">
        <IconSearch width="14" height="14" />
        <input placeholder="Search links, customers, hashes…" />
        <span className="kbd">⌘K</span>
      </div>
      <button
        className="icon-btn"
        title="Toggle sidebar"
        onClick={() => setSidebarStyle(sidebarStyle === "expanded" ? "rail" : "expanded")}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M9 4v16" />
        </svg>
      </button>
      <button className="icon-btn" title="Notifications">
        <IconBell width="16" height="16" />
      </button>
      <button className="icon-btn" title="Help">
        <IconHelp width="16" height="16" />
      </button>
      <button className="btn" onClick={onViewClient} title="Preview the public payment page">
        <IconEye width="14" height="14" /> View as client
      </button>
      <button className="btn btn-primary" onClick={onCreate}>
        <IconPlus width="14" height="14" /> Create link
      </button>
    </div>
  );
}
