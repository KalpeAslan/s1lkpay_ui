import { TOKENS } from "../constants/tokens.js";
import { TokenLogo } from "./TokenLogo.jsx";

export function TokensTab({ settings, onSave, saving }) {
  const accepted = settings.acceptedTokens || ["USDC", "USDT", "SOL"];
  const toggle = (sym) => {
    const next = accepted.includes(sym) ? accepted.filter((t) => t !== sym) : [...accepted, sym];
    onSave({ acceptedTokens: next });
  };
  return (
    <div className="kv-list">
      {["USDC", "USDT", "SOL"].map((sym) => (
        <div key={sym} className="kv-row">
          <div className="k" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <TokenLogo sym={sym} size={24} />
            <div>
              {TOKENS[sym].name}
              <small>{sym} on Solana</small>
            </div>
          </div>
          <div className="v">{accepted.includes(sym) ? "Accepted" : "Not accepted"}</div>
          <button
            className={"toggle" + (accepted.includes(sym) ? " on" : "")}
            onClick={() => toggle(sym)}
            disabled={saving}
          />
        </div>
      ))}
    </div>
  );
}
