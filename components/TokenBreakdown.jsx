import { TOKENS } from "../constants/tokens.js";
import { fmtUSD } from "../lib/fmtUSD.js";
import { TokenLogo } from "./TokenLogo.jsx";

export function TokenBreakdown({ incomeByToken = [] }) {
  const map = {};
  for (const { token, amount } of incomeByToken) map[token] = amount;
  const syms = ["USDC", "USDT", "SOL"];

  if (incomeByToken.length === 0) {
    return (
      <div className="empty" style={{ padding: "24px 0" }}>
        <h4>No paid links yet</h4>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          display: "flex",
          height: 10,
          borderRadius: 999,
          overflow: "hidden",
          background: "var(--surface-2)",
        }}
      >
        {syms.map((sym) => (
          <div
            key={sym}
            style={{
              flex: map[sym] || 0,
              background:
                sym === "USDC" ? "oklch(0.58 0.16 250)" : sym === "USDT" ? "oklch(0.55 0.12 165)" : "oklch(0.65 0.22 320)",
            }}
          />
        ))}
      </div>
      {incomeByToken.map(({ token, amount, percent }) => (
        <div key={token} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <TokenLogo sym={token} />
            <div>
              <div style={{ fontWeight: 500, fontSize: 13.5 }}>{token}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{TOKENS[token]?.name || token}</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="mono" style={{ fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
              {fmtUSD(amount)}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{percent}%</div>
          </div>
        </div>
      ))}
    </div>
  );
}
