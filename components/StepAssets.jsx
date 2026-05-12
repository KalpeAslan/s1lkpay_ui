import { TOKENS } from "../constants/tokens.js";
import { fmtAmt } from "../lib/fmtAmt.js";
import { fmtUSD } from "../lib/fmtUSD.js";
import { tokenUSD } from "../lib/tokenUSD.js";
import { TokenLogo } from "./TokenLogo.jsx";

export function StepAssets({ type, balances, totalUSD, token, setToken, amount, setAmount }) {
  if (type === "all") {
    return (
      <>
        <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600 }}>Withdraw all funds</h3>
        <p style={{ margin: "0 0 18px", color: "var(--muted)", fontSize: 13.5 }}>We'll move every available balance out of your wallet.</p>
        {balances.length === 0 ? (
          <div className="empty">
            <h4>No balances available</h4>Receive payments first.
          </div>
        ) : (
          <>
            <div className="card" style={{ padding: 0, marginBottom: 12 }}>
              <div className="token-list">
                {balances.map((b) => (
                  <div className="token-row" key={b.sym}>
                    <TokenLogo sym={b.sym} size={32} />
                    <div className="nm">
                      {TOKENS[b.sym]?.name || b.sym}
                      <small>{b.sym}</small>
                    </div>
                    <div className="qty">
                      {fmtAmt(b.amount, b.sym === "SOL" ? 3 : 2)} {b.sym}
                      <small>{fmtUSD(tokenUSD(b.sym, b.amount))}</small>
                    </div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      Included
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="summary-total">
              <div className="lbl">Estimated total value</div>
              <div className="v">{fmtUSD(totalUSD)}</div>
            </div>
          </>
        )}
      </>
    );
  }

  const bal = balances.find((b) => b.sym === token) || { sym: token, amount: 0 };
  const usd = tokenUSD(token, parseFloat(amount) || 0);

  return (
    <>
      <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600 }}>
        {type === "fiat" ? "Choose what to convert" : "Choose token and amount"}
      </h3>
      <p style={{ margin: "0 0 18px", color: "var(--muted)", fontSize: 13.5 }}>Pick the token to withdraw and how much.</p>
      {balances.length === 0 ? (
        <div className="empty">
          <h4>No balances available</h4>Receive payments first.
        </div>
      ) : (
        <>
          <div className="token-pick-list" style={{ marginBottom: 16 }}>
            {balances.map((b) => (
              <label key={b.sym} className={"token-pick" + (token === b.sym ? " active" : "")}>
                <input type="radio" name="tok" value={b.sym} checked={token === b.sym} onChange={() => setToken(b.sym)} />
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <TokenLogo sym={b.sym} size={28} />
                  <div>
                    <div style={{ fontWeight: 500 }}>{TOKENS[b.sym]?.name || b.sym}</div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {b.sym}
                    </div>
                  </div>
                </div>
                <div className="qty">
                  {fmtAmt(b.amount, b.sym === "SOL" ? 3 : 2)} {b.sym}
                  <small>{fmtUSD(tokenUSD(b.sym, b.amount))}</small>
                </div>
                <div></div>
              </label>
            ))}
          </div>
          <div className="field">
            <label>
              Amount <small>maximum {fmtAmt(bal.amount, bal.sym === "SOL" ? 3 : 2)} {bal.sym}</small>
            </label>
            <div className="amount-input">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="0.00"
                inputMode="decimal"
              />
              <div className="tok-pick">
                <TokenLogo sym={token} />
                {token}
                <button className="btn btn-sm" style={{ marginLeft: 8 }} onClick={() => setAmount(String(bal.amount))}>
                  Max
                </button>
              </div>
            </div>
            <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
              ≈ {fmtUSD(usd)}
              {type === "fiat" ? " before conversion fees" : ""}
            </div>
          </div>
        </>
      )}
    </>
  );
}
