import { fmtAmt } from "../lib/fmtAmt.js";
import { fmtUSD } from "../lib/fmtUSD.js";
import { shortAddr } from "../lib/shortAddr.js";
import { IconWarn } from "./icons/IconWarn.jsx";

export function StepReview({ type, token, balances, numAmount, totalUSD, sourceUSD, destAddr, card, fxFee, networkFee, serviceFee, finalUSD }) {
  return (
    <>
      <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600 }}>Review withdrawal</h3>
      <p style={{ margin: "0 0 18px", color: "var(--muted)", fontSize: 13.5 }}>Confirm the details. You can cancel before signing.</p>
      <div className="kv-list" style={{ marginBottom: 16 }}>
        <div className="kv-row">
          <div className="k">Source</div>
          <div className="v">
            {type === "all"
              ? `${balances.length} tokens · ${fmtUSD(totalUSD)}`
              : `${fmtAmt(numAmount, token === "SOL" ? 3 : 2)} ${token} · ${fmtUSD(sourceUSD)}`}
          </div>
          <div></div>
        </div>
        {type === "fiat" ? (
          <>
            <div className="kv-row">
              <div className="k">
                Destination<small>Bank card</small>
              </div>
              <div className="v mono">
                {card.number} · {card.holder}
              </div>
              <div></div>
            </div>
            <div className="kv-row">
              <div className="k">
                FX fee<small>0.95% spread</small>
              </div>
              <div className="v mono">−{fmtUSD(fxFee)}</div>
              <div></div>
            </div>
            <div className="kv-row">
              <div className="k">
                Service fee<small>1.25% payout</small>
              </div>
              <div className="v mono">−{fmtUSD(serviceFee)}</div>
              <div></div>
            </div>
            <div className="kv-row">
              <div className="k">Estimated arrival</div>
              <div className="v">1–2 business days</div>
              <div></div>
            </div>
          </>
        ) : (
          <>
            <div className="kv-row">
              <div className="k">
                Destination<small>Solana address</small>
              </div>
              <div className="v mono">{destAddr ? shortAddr(destAddr) : "—"}</div>
              <div></div>
            </div>
            <div className="kv-row">
              <div className="k">Network fee</div>
              <div className="v mono">−{fmtUSD(networkFee)}</div>
              <div></div>
            </div>
            <div className="kv-row">
              <div className="k">Estimated arrival</div>
              <div className="v">~2 seconds</div>
              <div></div>
            </div>
          </>
        )}
      </div>
      <div className="security-block">
        <div className="ico" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
          <IconWarn width="18" height="18" />
        </div>
        <div>
          <h4>Conversion rates change in real time</h4>
          <p>The final amount may shift by up to 0.3% between confirmation and settlement.</p>
        </div>
      </div>
    </>
  );
}
