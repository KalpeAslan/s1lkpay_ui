import { useState } from "react";
import { shortAddr } from "../lib/shortAddr.js";

export function WalletTab({ settings, onSave, saving }) {
  const [editing, setEditing] = useState(false);
  const [addr, setAddr] = useState(settings.walletAddress || "");

  const save = () => {
    onSave({ walletAddress: addr });
    setEditing(false);
  };

  return (
    <div className="kv-list">
      <div className="kv-row">
        <div className="k">
          Payout wallet<small>Funds settle directly to this Solana address.</small>
        </div>
        <div className="v mono" style={{ fontSize: 12 }}>
          {editing ? (
            <input
              className="input mono"
              value={addr}
              onChange={(e) => setAddr(e.target.value)}
              placeholder="Solana wallet address"
            />
          ) : settings.walletAddress ? (
            shortAddr(settings.walletAddress)
          ) : (
            <span className="muted">Not set</span>
          )}
        </div>
        {editing ? (
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn btn-sm" onClick={() => setEditing(false)}>
              Cancel
            </button>
            <button className="btn btn-sm btn-primary" onClick={save} disabled={saving}>
              {saving ? "…" : "Save"}
            </button>
          </div>
        ) : (
          <button
            className="btn btn-sm"
            onClick={() => {
              setAddr(settings.walletAddress || "");
              setEditing(true);
            }}
          >
            Change
          </button>
        )}
      </div>
      <div className="kv-row">
        <div className="k">
          Network<small>Mainnet — Solana</small>
        </div>
        <div className="v">{settings.network || "Solana · Mainnet"}</div>
        <div></div>
      </div>
    </div>
  );
}
