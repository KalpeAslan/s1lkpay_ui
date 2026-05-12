import { fmtUSD } from "../lib/fmtUSD.js";
import { shortAddr } from "../lib/shortAddr.js";
import { IconArrowRight } from "./icons/IconArrowRight.jsx";
import { IconCheck } from "./icons/IconCheck.jsx";
import { IconExternal } from "./icons/IconExternal.jsx";
import { StatusPill } from "./StatusPill.jsx";

export function StepDone({ type, sourceUSD, finalUSD, destAddr, card, txId, onDone }) {
  return (
    <>
      <div className="success-wave">
        <div className="check-orb">
          <IconCheck width="36" height="36" />
        </div>
        <h2 style={{ margin: "10px 0 4px", fontSize: 22, fontWeight: 600 }}>Withdrawal initiated</h2>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 13.5 }}>
          {type === "fiat"
            ? "We're converting your crypto and routing the funds to your bank card."
            : "Your transaction is being broadcast on Solana."}
        </p>
        <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <StatusPill status="pending" />
          <span style={{ fontSize: 13, color: "var(--muted)" }}>Status: Processing</span>
        </div>
      </div>
      <div className="kv-list" style={{ padding: "0 4px" }}>
        <div className="kv-row">
          <div className="k">
            Amount<small>Source</small>
          </div>
          <div className="v mono">{fmtUSD(sourceUSD)}</div>
          <div></div>
        </div>
        <div className="kv-row">
          <div className="k">You will receive</div>
          <div className="v mono" style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>
            {fmtUSD(Math.max(finalUSD, 0))}
          </div>
          <div></div>
        </div>
        <div className="kv-row">
          <div className="k">Destination</div>
          <div className="v mono">{type === "fiat" ? card.number : destAddr ? shortAddr(destAddr) : "—"}</div>
          <div></div>
        </div>
        <div className="kv-row">
          <div className="k">{type === "fiat" ? "Payout ID" : "Transaction ID"}</div>
          <div className="v mono">{txId}</div>
          <div></div>
        </div>
        <div className="kv-row">
          <div className="k">Estimated arrival</div>
          <div className="v">{type === "fiat" ? "1–2 business days" : "~2 seconds"}</div>
          <div></div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 22, justifyContent: "center" }}>
        <button className="btn">
          View withdrawal details <IconExternal width="13" height="13" />
        </button>
        <button className="btn btn-primary" onClick={onDone}>
          Back to dashboard <IconArrowRight width="13" height="13" />
        </button>
      </div>
    </>
  );
}
