/* global React, I, TOKENS, QR, TokenLogo, TokenChip, CopyBtn, fmtAmt, fmtUSD, fmtToken, shortAddr, fmtDate, fmtDateTime, relTime, StatusPill */
const { useState, useMemo } = React;

const WALLET_ADDR = "FzKv9Hq2pNw3mLp7ax9LpRtX5sY8jBnQ6kVcZdEf";

function seedBalances() {
  return [
    { sym: "USDC", amount: 4823.40, pending: 199.00 },
    { sym: "USDT", amount: 1240.18, pending: 0 },
    { sym: "SOL",  amount: 12.842,  pending: 0.5 },
    { sym: "KZTE", amount: 285000,  pending: 0 },
    { sym: "PEPE", amount: 12_000_000, pending: 0 },
  ];
}

function tokenUSD(sym, amount) {
  return amount * TOKENS[sym].rate;
}

function seedWalletTxns() {
  const now = Date.now();
  const day = 86400_000;
  const customers = ["Acme Co.", "Globex", "Northwind", "Initech", "Hooli", "Stark Industries", "Wonka Labs"];
  const items = [
    { dir: "in",  sym: "USDC", amount: 199.00,    desc: "Pro plan — June",      from: customers[0], t: now - 0.2 * day },
    { dir: "in",  sym: "SOL",  amount: 2.50,      desc: "Design retainer",       from: customers[1], t: now - 0.6 * day },
    { dir: "out", sym: "USDC", amount: 1200.00,   desc: "Withdrawal to bank ····2841", from: "", t: now - 1.1 * day },
    { dir: "in",  sym: "USDT", amount: 480.00,    desc: "Q2 license renewal",   from: customers[2], t: now - 1.8 * day },
    { dir: "in",  sym: "KZTE", amount: 50000,     desc: "Onboarding workshop",   from: customers[3], t: now - 2.4 * day },
    { dir: "out", sym: "SOL",  amount: 0.85,      desc: "Sent to 7Hk2…9wPq",      from: "", t: now - 3.2 * day },
    { dir: "in",  sym: "USDC", amount: 89.00,     desc: "Hosting credit",        from: customers[4], t: now - 4.0 * day },
    { dir: "in",  sym: "PEPE", amount: 4_500_000, desc: "Logo & brand pack",     from: customers[5], t: now - 5.3 * day },
  ];
  return items.map((x, i) => ({ id: "tx_" + i + "_" + Math.random().toString(36).slice(2, 6), ...x }));
}

// =============== Wallet page ===============
function WalletPage({ onWithdraw }) {
  const [balances] = useState(() => seedBalances());
  const [txns] = useState(() => seedWalletTxns());
  const [exportOpen, setExportOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);

  const total = balances.reduce((a, b) => a + tokenUSD(b.sym, b.amount), 0);
  const pending = balances.reduce((a, b) => a + tokenUSD(b.sym, b.pending), 0);
  const available = total - pending;

  return (
    <>
      <div className="page-h">
        <div>
          <h1>Wallet</h1>
          <p>Your S1lk PAY wallet holds the crypto your customers send you.</p>
        </div>
        <div style={{display: "flex", gap: 8}}>
          <button className="btn" onClick={() => setReceiveOpen(true)}><I.qr width="14" height="14"/> Receive</button>
          <button className="btn btn-primary" onClick={onWithdraw}><I.send width="14" height="14"/> Withdraw</button>
        </div>
      </div>

      <div className="wallet-grid" style={{marginBottom: 14}}>
        <div className="card wallet-hero">
          <div className="lbl"><I.wallet width="14" height="14"/> Total balance · USD equivalent</div>
          <div className="total">{fmtUSD(total)}</div>
          <div className="sub">
            <span>Across {balances.length} tokens · Solana network</span>
          </div>
          <div className="balance-split">
            <div className="balance-pill">
              <div className="lbl">Available</div>
              <div className="v">{fmtUSD(available)}</div>
            </div>
            <div className="balance-pill">
              <div className="lbl">Pending settlement</div>
              <div className="v">{fmtUSD(pending)}</div>
            </div>
          </div>
          <div className="actions">
            <button className="btn btn-accent" onClick={onWithdraw}><I.send width="14" height="14"/> Withdraw funds</button>
            <button className="btn" onClick={() => setReceiveOpen(true)}><I.qr width="14" height="14"/> Receive</button>
            <button className="btn" onClick={() => setExportOpen(true)}><I.lock width="14" height="14"/> Export wallet</button>
          </div>
        </div>
        <div className="card address-card">
          <div>
            <div style={{fontSize: 12.5, color: "var(--muted)", marginBottom: 6}}>Wallet address · Solana</div>
            <div className="addr-row">
              <div className="a">{WALLET_ADDR}</div>
              <CopyBtn value={WALLET_ADDR} label="Copy" className=""/>
            </div>
          </div>
          <div className="qr-mini"><QR value={"solana:" + WALLET_ADDR} size={160}/></div>
          <div style={{fontSize: 12, color: "var(--muted)", textAlign: "center"}}>
            Send only Solana-network tokens to this address.
          </div>
        </div>
      </div>

      <div className="card" style={{marginBottom: 14}}>
        <div className="card-h">
          <div><h3>Balances by token</h3><div className="sub">Live values · Solana mainnet</div></div>
          <button className="btn btn-sm" onClick={onWithdraw}>Withdraw</button>
        </div>
        <div className="token-list">
          {balances.map(b => {
            const usd = tokenUSD(b.sym, b.amount);
            const pendingUsd = tokenUSD(b.sym, b.pending);
            return (
              <div className="token-row" key={b.sym}>
                <TokenLogo sym={b.sym} size={32}/>
                <div className="nm">{TOKENS[b.sym].name}<small>{b.sym}</small></div>
                <div className="qty">
                  {b.sym === "PEPE" ? fmtAmt(b.amount, 0) : fmtAmt(b.amount, b.sym === "SOL" ? 3 : 2)} {b.sym}
                  <small>{fmtUSD(usd)}{b.pending ? " · +" + fmtUSD(pendingUsd) + " pending" : ""}</small>
                </div>
                <button className="btn btn-sm" onClick={onWithdraw}>Withdraw</button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="security-block" style={{marginBottom: 14}}>
        <div className="ico"><I.shield width="20" height="20"/></div>
        <div style={{flex: 1}}>
          <h4>Your wallet is custodied by S1lk PAY</h4>
          <p>You can export the private key at any time for full self-custody. Funds are insured up to $250,000 and never co-mingled with operating capital.</p>
        </div>
        <div style={{alignSelf: "center"}}>
          <button className="btn btn-sm" onClick={() => setExportOpen(true)}>Export wallet →</button>
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <div><h3>Recent transactions</h3><div className="sub">{txns.length} wallet events</div></div>
          <button className="btn btn-sm">View all</button>
        </div>
        <table className="tbl">
          <thead><tr>
            <th></th>
            <th>Description</th>
            <th>Counterparty</th>
            <th>Amount</th>
            <th>Token</th>
            <th>Date</th>
            <th></th>
          </tr></thead>
          <tbody>
            {txns.map(t => (
              <tr key={t.id}>
                <td style={{width: 44}}>
                  <div className={"tx-direction " + (t.dir === "in" ? "tx-in" : "tx-out")}>
                    {t.dir === "in" ? <I.arrowDown width="14" height="14"/> : <I.arrowUp width="14" height="14"/>}
                  </div>
                </td>
                <td>{t.desc}</td>
                <td className="muted">{t.from || "—"}</td>
                <td className="amt">
                  <span style={{color: t.dir === "in" ? "var(--success)" : "var(--ink)"}}>
                    {t.dir === "in" ? "+" : "−"}
                    {t.sym === "PEPE" ? fmtAmt(t.amount, 0) : fmtAmt(t.amount, t.sym === "SOL" ? 3 : 2)} {t.sym}
                  </span>
                </td>
                <td><TokenChip sym={t.sym}/></td>
                <td className="muted">{relTime(t.t)}</td>
                <td className="right muted"><I.external width="13" height="13"/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {exportOpen && <ExportWalletModal onClose={() => setExportOpen(false)}/>}
      {receiveOpen && <ReceiveModal onClose={() => setReceiveOpen(false)}/>}
    </>
  );
}

// =============== Export Wallet Modal ===============
function ExportWalletModal({ onClose }) {
  const [confirmed, setConfirmed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const seed = [
    "ribbon", "candle", "anchor", "moment", "harbor", "ladder",
    "violet", "stamp", "cosmic", "echo", "feather", "noble",
  ];
  const privateKey = "5Kb8kLf9bH7q3RmZ2vKpJxN5W8tF6gY4dQc1eVnPzAxL9mUbR";

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal wide" onClick={e => e.stopPropagation()}>
        <div className="modal-h">
          <div>
            <h2 style={{display: "flex", alignItems: "center", gap: 8}}>
              <I.warn width="18" height="18" style={{color: "oklch(0.55 0.18 25)"}}/>
              Export your wallet
            </h2>
            <p>Read this carefully before continuing.</p>
          </div>
          <button className="icon-btn" onClick={onClose}><I.close width="16" height="16"/></button>
        </div>
        <div className="modal-body" style={{paddingTop: 14}}>
          <div className="danger-block">
            Exporting transfers full control of this wallet to you. <b>S1lk PAY cannot recover funds if your key is lost or stolen.</b>
            <ul>
              <li>Anyone with the recovery phrase or private key can move every token in this wallet.</li>
              <li>Store it offline, on paper or in a hardware wallet — never in email, screenshots, or cloud notes.</li>
              <li>If you continue using this wallet on S1lk PAY, you remain responsible for its security.</li>
              <li>Customer payments will continue arriving to this address until you switch wallets in Settings.</li>
            </ul>
          </div>

          <div style={{margin: "14px 0"}}>
            <div className="confirm-row" onClick={() => setConfirmed(c => !c)}>
              <input type="checkbox" checked={confirmed} readOnly/>
              <label>
                I understand that S1lk PAY cannot help me recover this wallet if I lose access to the recovery phrase or private key, and I am responsible for storing it safely.
              </label>
            </div>
          </div>

          {revealed ? (
            <>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8}}>
                <div style={{fontWeight: 600, fontSize: 13.5}}>Recovery phrase</div>
                <div style={{fontSize: 12, color: "var(--muted)"}}>12 words · BIP-39</div>
              </div>
              <div className="seed-grid">
                {seed.map((w, i) => (
                  <div className="seed-word" key={i}>
                    <span className="num">{(i + 1).toString().padStart(2, "0")}</span>{w}
                  </div>
                ))}
              </div>

              <div style={{margin: "16px 0 6px", fontWeight: 600, fontSize: 13.5}}>Private key</div>
              <div className="addr-row">
                <div className="a">{privateKey}</div>
                <CopyBtn value={privateKey} label="Copy" className=""/>
              </div>

              <div style={{display: "flex", gap: 8, marginTop: 14}}>
                <button className="btn"><I.download width="14" height="14"/> Download backup (.json)</button>
                <CopyBtn value={seed.join(" ")} label="Copy phrase" className="btn"/>
              </div>
            </>
          ) : (
            <div style={{textAlign: "center", padding: "20px 0"}}>
              <div style={{width: 56, height: 56, borderRadius: "50%", background: "var(--surface-2)", display: "grid", placeItems: "center", margin: "0 auto 10px"}}>
                <I.lock width="22" height="22"/>
              </div>
              <div style={{fontSize: 14, color: "var(--muted)", maxWidth: 360, margin: "0 auto"}}>
                Make sure you're in a private place. The next screen will show your recovery phrase and private key in plain text.
              </div>
            </div>
          )}
        </div>
        <div className="modal-foot">
          <button className="btn" onClick={onClose}>{revealed ? "Done" : "Cancel"}</button>
          {!revealed && (
            <button className="btn btn-primary" disabled={!confirmed} onClick={() => setRevealed(true)}>
              <I.eye width="14" height="14"/> Reveal recovery phrase
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// =============== Receive Modal ===============
function ReceiveModal({ onClose }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-h">
          <div>
            <h2>Receive crypto</h2>
            <p>Share your Solana address to receive any supported token.</p>
          </div>
          <button className="icon-btn" onClick={onClose}><I.close width="16" height="16"/></button>
        </div>
        <div className="modal-body" style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 16, paddingTop: 16}}>
          <QR value={"solana:" + WALLET_ADDR} size={220}/>
          <div style={{width: "100%"}}>
            <div style={{fontSize: 12.5, color: "var(--muted)", marginBottom: 6}}>Wallet address · Solana</div>
            <div className="addr-row">
              <div className="a">{WALLET_ADDR}</div>
              <CopyBtn value={WALLET_ADDR} label="Copy" className=""/>
            </div>
          </div>
          <div style={{fontSize: 12, color: "var(--muted)", textAlign: "center"}}>
            Only send USDC, USDT, SOL, KZTE, or PEPE on the Solana network. Tokens on other networks will be lost.
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WalletPage, ExportWalletModal, ReceiveModal, seedBalances, seedWalletTxns, tokenUSD, WALLET_ADDR });
