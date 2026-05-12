import { fmtAmt } from "../lib/fmtAmt.js";
import { fmtUSD } from "../lib/fmtUSD.js";

export function SidebarSummary({ step, type, token, balances, numAmount, totalUSD, sourceUSD, card, fxFee, networkFee, serviceFee, finalUSD }) {
  if (step === 0) {
    return (
      <>
        <div className="summary-line">
          <span className="muted">Type</span>
          <span className="v">{type === "all" ? "Withdraw all" : type === "crypto" ? "Specific token" : "Convert to fiat"}</span>
        </div>
        <div className="summary-line">
          <span className="muted">Available</span>
          <span className="v">{fmtUSD(totalUSD)}</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 14, lineHeight: 1.5 }}>
          Pick how you want to move your funds. You'll choose the destination and review fees before anything is sent.
        </div>
      </>
    );
  }
  return (
    <>
      <div className="summary-line">
        <span className="muted">Source</span>
        <span className="v">{type === "all" ? `${balances.length} tokens` : `${fmtAmt(numAmount || 0, token === "SOL" ? 3 : 2)} ${token}`}</span>
      </div>
      <div className="summary-line">
        <span className="muted">≈ USD value</span>
        <span className="v">{fmtUSD(sourceUSD)}</span>
      </div>
      {type === "fiat" ? (
        <>
          <div className="summary-line">
            <span className="muted">FX fee</span>
            <span className="v">−{fmtUSD(fxFee)}</span>
          </div>
          <div className="summary-line">
            <span className="muted">Service fee</span>
            <span className="v">−{fmtUSD(serviceFee)}</span>
          </div>
          <div className="summary-line">
            <span className="muted">Currency</span>
            <span className="v">{card.currency}</span>
          </div>
        </>
      ) : (
        <>
          <div className="summary-line">
            <span className="muted">Network fee</span>
            <span className="v">−{fmtUSD(networkFee)}</span>
          </div>
          <div className="summary-line">
            <span className="muted">Network</span>
            <span className="v">Solana</span>
          </div>
        </>
      )}
      <div className="summary-total" style={{ marginTop: 14 }}>
        <div className="lbl">You receive</div>
        <div className="v">{fmtUSD(Math.max(finalUSD, 0))}</div>
        {type === "fiat" && (
          <div className="muted" style={{ fontSize: 12, marginTop: 4, fontFamily: "Geist Mono", fontVariantNumeric: "tabular-nums" }}>
            ≈{" "}
            {fmtAmt(
              Math.max(finalUSD, 0) * (card.currency === "USD" ? 1 : card.currency === "KZT" ? 458.4 : 25320),
              card.currency === "USD" ? 2 : 0,
            )}{" "}
            {card.currency}
          </div>
        )}
      </div>
    </>
  );
}
