import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client.js";
import { fmtDate } from "../lib/fmtDate.js";
import { fmtToken } from "../lib/fmtToken.js";
import { fmtUSD } from "../lib/fmtUSD.js";
import { relTime } from "../lib/relTime.js";
import { Countdown } from "./Countdown.jsx";
import { IconChevron } from "./icons/IconChevron.jsx";
import { IconDownload } from "./icons/IconDownload.jsx";
import { IconFilter } from "./icons/IconFilter.jsx";
import { IconPlus } from "./icons/IconPlus.jsx";
import { LoadingRows } from "./LoadingRows.jsx";
import { StatusPill } from "./StatusPill.jsx";
import { TokenLogo } from "./TokenLogo.jsx";

export function PaymentLinksList({ onCreate, onOpenLink }) {
  const [filter, setFilter] = useState("all");
  const [tokFilter, setTokFilter] = useState("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["payment-links", { status: filter, token: tokFilter }],
    queryFn: () => api.getLinks({ status: filter, token: tokFilter }),
  });

  const links = data?.links || [];
  const counts = data?.counts || [];
  const total = data?.total || 0;

  const countFor = (status) => Number(counts.find((c) => c.status === status)?.count || 0);

  const exportUrl = api.exportLinksUrl();

  return (
    <>
      <div className="page-h">
        <div>
          <h1>Payment links</h1>
          <p>Manage all your generated payment links and their status.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <a href={exportUrl} download className="btn">
            <IconDownload width="14" height="14" /> Export CSV
          </a>
          <button className="btn btn-primary" onClick={onCreate}>
            <IconPlus width="14" height="14" /> Create link
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <button className={"fchip" + (filter === "all" ? " active" : "")} onClick={() => setFilter("all")}>
          All <span className="muted">{total}</span>
        </button>
        {["pending", "paid", "expired"].map((s) => (
          <button key={s} className={"fchip" + (filter === s ? " active" : "")} onClick={() => setFilter(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)} <span className="muted">{countFor(s)}</span>
          </button>
        ))}
        <div style={{ width: 1, height: 22, background: "var(--line)", margin: "0 4px" }} />
        <button className={"fchip" + (tokFilter === "all" ? " active" : "")} onClick={() => setTokFilter("all")}>
          All tokens
        </button>
        {["USDC", "USDT", "SOL"].map((t) => (
          <button key={t} className={"fchip" + (tokFilter === t ? " active" : "")} onClick={() => setTokFilter(t)}>
            <TokenLogo sym={t} /> {t}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="fchip">
          <IconFilter width="12" height="12" /> More filters
        </button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Status</th>
              <th>Description</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Created</th>
              <th>Deadline</th>
              <th className="right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <LoadingRows cols={7} />}
            {isError && (
              <tr>
                <td colSpan="7">
                  <div className="empty">
                    <h4>Failed to load</h4>Please try again.
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && !isError && links.length === 0 && (
              <tr>
                <td colSpan="7">
                  <div className="empty">
                    <h4>No links match these filters</h4>Try clearing some filters or create a new payment link.
                  </div>
                </td>
              </tr>
            )}
            {links.map((l) => (
              <tr key={l.id} onClick={() => onOpenLink(l.id)} style={{ cursor: "pointer" }}>
                <td>
                  <StatusPill status={l.status} />
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{l.description}</div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    {l.id}
                  </div>
                </td>
                <td className="muted">{l.customer}</td>
                <td>
                  <div className="amt">{fmtUSD(l.amount)}</div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    {fmtToken(l.tokenAmount, l.token)}
                  </div>
                </td>
                <td className="muted">{fmtDate(l.created)}</td>
                <td className="muted">
                  {l.status === "pending" && l.deadline ? (
                    <Countdown to={l.deadline} compact />
                  ) : l.status === "expired" ? (
                    "Expired " + relTime(l.deadline)
                  ) : l.paid ? (
                    "Paid " + relTime(l.paid)
                  ) : l.deadline ? (
                    fmtDate(l.deadline)
                  ) : (
                    "—"
                  )}
                </td>
                <td className="right">
                  <button
                    className="btn btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLink(l.id);
                    }}
                  >
                    Open <IconChevron width="12" height="12" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
