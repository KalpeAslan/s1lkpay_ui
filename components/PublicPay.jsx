import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client.js";
import { fmtDate } from "../lib/fmtDate.js";
import { fmtToken } from "../lib/fmtToken.js";
import { fmtUSD } from "../lib/fmtUSD.js";
import { shortAddr } from "../lib/shortAddr.js";
import { usePhantomPay } from "../hooks/usePhantomPay.jsx";
import { IconCheck } from "./icons/IconCheck.jsx";
import { IconChevron } from "./icons/IconChevron.jsx";
import { IconExternal } from "./icons/IconExternal.jsx";
import { IconEye } from "./icons/IconEye.jsx";
import { IconShield } from "./icons/IconShield.jsx";
import { IconWarn } from "./icons/IconWarn.jsx";
import { PhantomIcon } from "./PhantomIcon.jsx";
import { QR } from "./QR.jsx";
import { TokenChip } from "./TokenChip.jsx";

export function PublicPay({ slug, onExit, onPaid }) {
  const { data: link, isLoading, isError } = useQuery({
    queryKey: ["public-link", slug],
    queryFn: () => api.publicLink(slug),
  });

  const { stage, connectedAddr, txSignature, errMsg, phantom, pay, reset } = usePhantomPay({ slug, onPaid });

  if (isLoading)
    return (
      <div className="public-wrap">
        <div className="view-banner">
          <IconEye width="14" height="14" /> Viewing public payment page
          <button onClick={onExit}>← Back to dashboard</button>
        </div>
        <div style={{ display: "grid", placeItems: "center", height: 400, color: "var(--muted)" }}>Loading…</div>
      </div>
    );

  if (isError || !link)
    return (
      <div className="public-wrap">
        <div className="view-banner">
          <button onClick={onExit}>← Back to dashboard</button>
        </div>
        <div style={{ display: "grid", placeItems: "center", height: 400, color: "var(--muted)" }}>Link not found or expired.</div>
      </div>
    );

  const url = link.payUrl || `https://pay.s1lk.app/${link.slug}`;

  return (
    <div className="public-wrap">
      <div className="view-banner">
        <IconEye width="14" height="14" /> Viewing public payment page
        <button onClick={onExit}>← Back to dashboard</button>
      </div>
      <div className="public-top">
        <div className="brand">
          <div className="sb-logo">
            <span>S</span>
          </div>{" "}
          S1lk <b style={{ color: "var(--accent)" }}>PAY</b>
        </div>
        <div style={{ color: "var(--muted)", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <IconShield width="14" height="14" /> Secure checkout on Solana
        </div>
      </div>

      <div className="public-card">
        {(stage === "ready" || stage === "connecting") && (
          <>
            <div className="top">
              <div className="merchant-logo">{(link.businessName || "S")[0]}</div>
              <div className="biz">
                <b>{link.businessName || "S1lk Merchant"}</b>
                <small>Payment request · {link.id}</small>
              </div>
            </div>
            <div className="amt-block">
              <div className="lbl">Amount due</div>
              <div className="amt">{fmtUSD(link.amount)}</div>
              <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
                ≈ {fmtToken(link.tokenAmount, link.token)} · <TokenChip sym={link.token} />
              </div>
            </div>
            <div className="desc">{link.description}</div>
            {link.deadline && (
              <div className="deadline">
                <span>Pay before</span>
                <b>{fmtDate(link.deadline, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</b>
              </div>
            )}
            <div className="pay-actions">
              <button
                className="btn btn-accent"
                onClick={() => pay(link)}
                disabled={stage === "connecting"}
                style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}
              >
                <PhantomIcon size={16} />
                {stage === "connecting" ? "Connecting…" : phantom ? "Pay with Phantom" : "Install Phantom"}
                {stage !== "connecting" && <IconChevron width="14" height="14" />}
              </button>
              {connectedAddr && (
                <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 6 }}>Wallet: {shortAddr(connectedAddr)}</div>
              )}
              <div className="pay-divider">or scan to pay</div>
            </div>
            <div className="public-qr">
              {link.qrCode ? <img src={link.qrCode} width={160} height={160} alt="QR" /> : <QR value={url} size={160} />}
              <small>Scan with Phantom, Solflare, or Backpack</small>
            </div>
            <div className="public-foot">
              <div className="secure-row">
                <IconShield width="12" height="12" /> Powered by S1lk PAY
              </div>
              <div>Need help?</div>
            </div>
          </>
        )}

        {(stage === "paying" || stage === "confirming") && (
          <>
            <div className="paying-stage">
              <div className="paying-orb">
                {stage === "confirming" ? (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <PhantomIcon size={40} />
                )}
              </div>
              {stage === "paying" ? (
                <>
                  <h3>Approve in Phantom</h3>
                  <p>Check the Phantom popup and approve the transaction to send {fmtToken(link.tokenAmount, link.token)}.</p>
                </>
              ) : (
                <>
                  <h3>Confirming on Solana…</h3>
                  <p>Transaction broadcast — waiting for network confirmation (~2 seconds).</p>
                  {txSignature && (
                    <div className="mono" style={{ fontSize: 11, wordBreak: "break-all", maxWidth: 320, textAlign: "center", color: "var(--muted)", marginTop: 8 }}>
                      {txSignature}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="public-foot">
              <div className="secure-row">
                <IconShield width="12" height="12" /> Securing on Solana
              </div>
              {stage === "paying" && (
                <button className="btn btn-ghost btn-sm" onClick={reset}>
                  Cancel
                </button>
              )}
            </div>
          </>
        )}

        {stage === "success" && (
          <>
            <div className="success-stage">
              <div className="check-orb">
                <IconCheck width="36" height="36" />
              </div>
              <h2>Payment complete</h2>
              <p>
                {fmtToken(link.tokenAmount, link.token)} sent to {link.businessName || "S1lk Merchant"}.
              </p>
              <div className="receipt">
                <div className="rrow">
                  <span>Amount</span>
                  <b className="mono">
                    {fmtUSD(link.amount)} ({fmtToken(link.tokenAmount, link.token)})
                  </b>
                </div>
                <div className="rrow">
                  <span>To</span>
                  <b className="mono">{shortAddr(link.walletAddr || "—")}</b>
                </div>
                <div className="rrow">
                  <span>Network</span>
                  <b>Solana · Mainnet</b>
                </div>
                <div className="rrow">
                  <span>Tx</span>
                  <b className="mono">{txSignature ? txSignature.slice(0, 18) + "…" : "confirmed"}</b>
                </div>
              </div>
              {txSignature && (
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <a className="btn btn-sm" href={`https://solscan.io/tx/${txSignature}`} target="_blank" rel="noreferrer">
                    <IconExternal width="14" height="14" /> View on Solscan
                  </a>
                </div>
              )}
            </div>
            <div className="public-foot">
              <div className="secure-row">
                <IconShield width="12" height="12" /> Powered by S1lk PAY
              </div>
              <button className="btn btn-ghost btn-sm" onClick={onExit}>
                Back to merchant view
              </button>
            </div>
          </>
        )}

        {stage === "error" && (
          <>
            <div className="paying-stage">
              <div className="paying-orb" style={{ background: "oklch(0.95 0.04 25)" }}>
                <IconWarn width="32" height="32" style={{ color: "oklch(0.55 0.18 25)" }} />
              </div>
              <h3>Payment failed</h3>
              <p style={{ color: "var(--muted)", fontSize: 13, textAlign: "center", maxWidth: 320 }}>{errMsg}</p>
            </div>
            <div className="public-foot" style={{ borderTop: "1px solid var(--line)", padding: "14px 22px", display: "flex", gap: 8, justifyContent: "center" }}>
              <button className="btn" onClick={reset}>
                Try again
              </button>
              <button className="btn btn-ghost" onClick={onExit}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
