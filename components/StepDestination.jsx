import { IconArrowLeft } from "./icons/IconArrowLeft.jsx";
import { IconPlus } from "./icons/IconPlus.jsx";
import { TokenLogo } from "./TokenLogo.jsx";

export function StepDestination({ type, destAddr, setDestAddr, card, setCard, addCard, setAddCard }) {
  if (type === "fiat") {
    return (
      <>
        <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600 }}>Payout destination</h3>
        <p style={{ margin: "0 0 18px", color: "var(--muted)", fontSize: 13.5 }}>Choose a bank card to receive the converted fiat.</p>
        {!addCard ? (
          <>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
              <div className="bank-card">
                <div className="top">
                  <div className="chip"></div>
                  <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: "0.1em" }}>VISA</div>
                </div>
                <div className="num">{card.number}</div>
                <div className="row">
                  <div>
                    <small>Card holder</small>
                    <br />
                    <b>{card.holder}</b>
                  </div>
                  <div>
                    <small>Country</small>
                    <br />
                    <b>{card.country}</b>
                  </div>
                </div>
              </div>
              <button className="btn btn-sm" onClick={() => setAddCard(true)}>
                <IconPlus width="14" height="14" /> Add another
              </button>
            </div>
            <div className="field">
              <label>Receive currency</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["USD", "KZT", "VND"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={"tok-opt" + (card.currency === c ? " active" : "")}
                    onClick={() => setCard({ ...card, currency: c })}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="field">
              <label>Card holder name</label>
              <input className="input" value={card.holder} onChange={(e) => setCard({ ...card, holder: e.target.value })} />
            </div>
            <div className="field">
              <label>Card number</label>
              <input className="input" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 2841" />
            </div>
            <div className="row-2">
              <div className="field">
                <label>Country</label>
                <select className="select" value={card.country} onChange={(e) => setCard({ ...card, country: e.target.value })}>
                  <option>United States</option>
                  <option>Kazakhstan</option>
                  <option>Vietnam</option>
                </select>
              </div>
              <div className="field">
                <label>Receive currency</label>
                <select className="select" value={card.currency} onChange={(e) => setCard({ ...card, currency: e.target.value })}>
                  <option value="USD">USD — US Dollar</option>
                  <option value="KZT">KZT — Kazakhstani Tenge</option>
                  <option value="VND">VND — Vietnamese Dong</option>
                </select>
              </div>
            </div>
            <button className="btn btn-sm" onClick={() => setAddCard(false)}>
              <IconArrowLeft width="13" height="13" /> Use saved card
            </button>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600 }}>Destination wallet</h3>
      <p style={{ margin: "0 0 18px", color: "var(--muted)", fontSize: 13.5 }}>Send to any Solana wallet address.</p>
      <div className="field">
        <label>
          Recipient address <small>Solana</small>
        </label>
        <input className="input mono" placeholder="Solana wallet address" value={destAddr} onChange={(e) => setDestAddr(e.target.value)} />
        <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
          Double-check the address. Crypto transactions are irreversible.
        </div>
      </div>
      <div className="field">
        <label>Network</label>
        <div className="fx-row">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TokenLogo sym="SOL" />
            <div>
              <div style={{ fontWeight: 500 }}>Solana · Mainnet</div>
              <div className="muted" style={{ fontSize: 12 }}>
                Fastest network for this token
              </div>
            </div>
          </div>
          <div className="muted" style={{ fontSize: 12 }}>
            ~2s · negligible fee
          </div>
        </div>
      </div>
    </>
  );
}
