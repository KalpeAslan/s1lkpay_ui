import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { fmtDate } from "../lib/fmtDate.js";
import { fmtDateTime } from "../lib/fmtDateTime.js";
import { fmtToken } from "../lib/fmtToken.js";
import { fmtUSD } from "../lib/fmtUSD.js";
import { CopyBtn } from "./CopyBtn.jsx";
import { Countdown } from "./Countdown.jsx";
import { IconExternal } from "./icons/IconExternal.jsx";
import { IconPlay } from "./icons/IconPlay.jsx";
import { PageError } from "./PageError.jsx";
import { PageLoader } from "./PageLoader.jsx";
import { QR } from "./QR.jsx";
import { StatusPill } from "./StatusPill.jsx";
import { TokenChip } from "./TokenChip.jsx";

export function LinkDetail({ linkId, onBack, onSimulated, toast }) {
  const navigate = useNavigate();
  const { data: link, isLoading, isError } = useQuery({
    queryKey: ["payment-link", linkId],
    queryFn: () => api.getLink(linkId),
  });

  const simulateMutation = useMutation({
    mutationFn: () => api.simulateLink(linkId),
    onSuccess: () => onSimulated(linkId),
    onError: (err) => toast && toast("Error: " + err.message),
  });

  if (isLoading) return <PageLoader />;
  if (isError || !link) return <PageError message="Payment link not found." />;

  const url = link.payUrl || `https://pay.s1lk.app/${link.slug}`;
  const isPending = link.status === "pending";
  const isPaid = link.status === "paid";

  return (
    <>
      <div className="page-h">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn" onClick={onBack}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
            All links
          </button>
          <div>
            <h1 style={{ fontSize: 22 }}>{link.description}</h1>
            <p className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>
              {link.id}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <StatusPill status={link.status} />
          {isPending && (
            <button className="btn btn-accent" onClick={() => simulateMutation.mutate()} disabled={simulateMutation.isPending}>
              <IconPlay width="12" height="12" /> {simulateMutation.isPending ? "Simulating…" : "Simulate payment"}
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="link-stage">
          <div className="qr-wrap">
            {link.qrCode ? <img src={link.qrCode} width={240} height={240} alt="QR code" /> : <QR value={url} size={240} />}
            <div className="qr-cap">Scan with any Solana wallet</div>
          </div>
          <div>
            <div className="summary-grid" style={{ marginBottom: 16 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <div className="k">Amount</div>
                <div className="v amount mono">{fmtUSD(link.amount)}</div>
                <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>≈ {fmtToken(link.tokenAmount, link.token)} on Solana</div>
              </div>
              <div>
                <div className="k">Status</div>
                <div className="v">
                  <StatusPill status={link.status} />
                </div>
              </div>
              <div>
                <div className="k">{isPaid ? "Paid on" : "Deadline"}</div>
                <div className="v mono">
                  {isPaid
                    ? fmtDateTime(link.paid)
                    : link.deadline
                      ? fmtDate(link.deadline, { month: "short", day: "numeric", year: "numeric" })
                      : "No deadline"}
                </div>
              </div>
              <div>
                <div className="k">Created</div>
                <div className="v mono">{fmtDateTime(link.created)}</div>
              </div>
              <div>
                <div className="k">Token</div>
                <div className="v">
                  <TokenChip sym={link.token} />
                </div>
              </div>
            </div>

            <div className="field">
              <label>Payment link</label>
              <div className="link-row">
                <div className="url">{url}</div>
                <CopyBtn value={url} label="Copy link" className="" />
                <button onClick={() => navigate("/pay/" + link.slug)}>
                  <IconExternal width="14" height="14" /> Open
                </button>
              </div>
            </div>

            {isPending && link.deadline && (
              <div className="field" style={{ marginTop: 4 }}>
                <label>Expires in</label>
                <Countdown to={link.deadline} />
              </div>
            )}

            {isPaid && link.txHash && (
              <div className="field">
                <label>Transaction hash</label>
                <div className="link-row">
                  <div className="url mono">{link.txHash}</div>
                  <CopyBtn value={link.txHash} label="Copy" />
                  <button>
                    <IconExternal width="14" height="14" /> Solscan
                  </button>
                </div>
              </div>
            )}

            {link.customerNote && (
              <div className="field">
                <label>Customer note</label>
                <div style={{ padding: 12, background: "var(--surface-2)", borderRadius: 10, color: "var(--muted)", fontSize: 13 }}>
                  {link.customerNote}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
