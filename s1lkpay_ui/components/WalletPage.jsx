import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { TOKENS } from "../constants/tokens.js";
import { api } from "../api/client.js";
import { fmtAmt } from "../lib/fmtAmt.js";
import { fmtUSD } from "../lib/fmtUSD.js";
import { relTime } from "../lib/relTime.js";
import { tokenUSD } from "../lib/tokenUSD.js";
import { CopyBtn } from "./CopyBtn.jsx";
import { ExportWalletModal } from "./ExportWalletModal.jsx";
import { IconArrowDown } from "./icons/IconArrowDown.jsx";
import { IconExternal } from "./icons/IconExternal.jsx";
import { IconLock } from "./icons/IconLock.jsx";
import { IconQr } from "./icons/IconQr.jsx";
import { IconSend } from "./icons/IconSend.jsx";
import { IconShield } from "./icons/IconShield.jsx";
import { IconWallet } from "./icons/IconWallet.jsx";
import { QR } from "./QR.jsx";
import { ReceiveModal } from "./ReceiveModal.jsx";
import { TokenChip } from "./TokenChip.jsx";
import { TokenLogo } from "./TokenLogo.jsx";

export function WalletPage() {
  const navigate = useNavigate();
  const onWithdraw = () => navigate("/withdraw");
  const [exportOpen, setExportOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["wallet"],
    queryFn: api.wallet,
  });

  if (isLoading) return <div style={{ padding: 48, textAlign: "center", color: "var(--muted)" }}>Loading wallet…</div>;
  if (isError) return <div style={{ padding: 48, textAlign: "center", color: "var(--muted)" }}>Failed to load wallet.</div>;

  const { walletAddress = "", balances = [], transactions = [] } = data;

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
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={() => setReceiveOpen(true)}>
            <IconQr width="14" height="14" /> Receive
          </button>
          <button className="btn btn-primary" onClick={onWithdraw}>
            <IconSend width="14" height="14" /> Withdraw
          </button>
        </div>
      </div>

      <div className="wallet-grid" style={{ marginBottom: 14 }}>
        <div className="card wallet-hero">
          <div className="lbl">
            <IconWallet width="14" height="14" /> Total balance · USD equivalent
          </div>
          <div className="total">{fmtUSD(total)}</div>
          <div className="sub">
            <span>
              Across {balances.length} token{balances.length !== 1 ? "s" : ""} · Solana network
            </span>
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
            <button className="btn btn-accent" onClick={onWithdraw}>
              <IconSend width="14" height="14" /> Withdraw funds
            </button>
            <button className="btn" onClick={() => setReceiveOpen(true)}>
              <IconQr width="14" height="14" /> Receive
            </button>
            <button className="btn" onClick={() => setExportOpen(true)}>
              <IconLock width="14" height="14" /> Export wallet
            </button>
          </div>
        </div>

        {walletAddress ? (
          <div className="card address-card">
            <div>
              <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 6 }}>Wallet address · Solana</div>
              <div className="addr-row">
                <div className="a">{walletAddress}</div>
                <CopyBtn value={walletAddress} label="Copy" className="" />
              </div>
            </div>
            <div className="qr-mini">
              <QR value={"solana:" + walletAddress} size={160} />
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>Send only Solana-network tokens to this address.</div>
          </div>
        ) : (
          <div className="card address-card" style={{ display: "grid", placeItems: "center", padding: 24 }}>
            <div style={{ textAlign: "center", color: "var(--muted)" }}>
              <IconWallet width="28" height="28" style={{ opacity: 0.4, marginBottom: 8 }} />
              <div style={{ fontSize: 13 }}>No payout wallet set.</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Add one in Settings → Payout wallet.</div>
            </div>
          </div>
        )}
      </div>

      {balances.length > 0 && (
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="card-h">
            <div>
              <h3>Balances by token</h3>
              <div className="sub">From received payments · Solana mainnet</div>
            </div>
            <button className="btn btn-sm" onClick={onWithdraw}>
              Withdraw
            </button>
          </div>
          <div className="token-list">
            {balances.map((b) => {
              const usd = tokenUSD(b.sym, b.amount);
              const pendingUsd = tokenUSD(b.sym, b.pending);
              return (
                <div className="token-row" key={b.sym}>
                  <TokenLogo sym={b.sym} size={32} />
                  <div className="nm">
                    {TOKENS[b.sym]?.name || b.sym}
                    <small>{b.sym}</small>
                  </div>
                  <div className="qty">
                    {fmtAmt(b.amount, b.sym === "SOL" ? 3 : 2)} {b.sym}
                    <small>
                      {fmtUSD(usd)}
                      {b.pending > 0 ? " · +" + fmtUSD(pendingUsd) + " pending" : ""}
                    </small>
                  </div>
                  <button className="btn btn-sm" onClick={onWithdraw}>
                    Withdraw
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {balances.length === 0 && (
        <div className="card" style={{ marginBottom: 14, padding: 32, textAlign: "center", color: "var(--muted)" }}>
          <IconWallet width="32" height="32" style={{ opacity: 0.3, marginBottom: 8 }} />
          <h4 style={{ margin: "0 0 4px" }}>No balances yet</h4>
          <p style={{ margin: 0, fontSize: 13 }}>Receive your first crypto payment to see balances here.</p>
        </div>
      )}

      <div className="security-block" style={{ marginBottom: 14 }}>
        <div className="ico">
          <IconShield width="20" height="20" />
        </div>
        <div style={{ flex: 1 }}>
          <h4>Your wallet is custodied by S1lk PAY</h4>
          <p>
            You can export the private key at any time for full self-custody. Funds are insured up to $250,000 and never co-mingled with operating capital.
          </p>
        </div>
        <div style={{ alignSelf: "center" }}>
          <button className="btn btn-sm" onClick={() => setExportOpen(true)}>
            Export wallet →
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <div>
            <h3>Recent transactions</h3>
            <div className="sub">
              {transactions.length} incoming payment{transactions.length !== 1 ? "s" : ""}
            </div>
          </div>
          <button className="btn btn-sm">View all</button>
        </div>
        {transactions.length === 0 ? (
          <div className="empty">
            <h4>No transactions yet</h4>Completed payments will appear here.
          </div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th></th>
                <th>Description</th>
                <th>Counterparty</th>
                <th>Amount</th>
                <th>Token</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td style={{ width: 44 }}>
                    <div className="tx-direction tx-in">
                      <IconArrowDown width="14" height="14" />
                    </div>
                  </td>
                  <td>{t.desc}</td>
                  <td className="muted">{t.from || "—"}</td>
                  <td className="amt">
                    <span style={{ color: "var(--success)" }}>
                      +{fmtAmt(t.amount, t.sym === "SOL" ? 3 : 2)} {t.sym}
                    </span>
                  </td>
                  <td>
                    <TokenChip sym={t.sym} />
                  </td>
                  <td className="muted">{t.t ? relTime(t.t) : "—"}</td>
                  <td className="right muted">{t.txHash && <IconExternal width="13" height="13" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {exportOpen && <ExportWalletModal onClose={() => setExportOpen(false)} />}
      {receiveOpen && walletAddress && <ReceiveModal address={walletAddress} onClose={() => setReceiveOpen(false)} />}
    </>
  );
}
