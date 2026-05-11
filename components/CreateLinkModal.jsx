import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TOKENS } from "../constants/tokens.js";
import { api } from "../api/client.js";
import { fmtDate } from "../lib/fmtDate.js";
import { fmtDateTime } from "../lib/fmtDateTime.js";
import { fmtToken } from "../lib/fmtToken.js";
import { fmtUSD } from "../lib/fmtUSD.js";
import { IconChevron } from "./icons/IconChevron.jsx";
import { IconClose } from "./icons/IconClose.jsx";
import { TokenChip } from "./TokenChip.jsx";
import { TokenLogo } from "./TokenLogo.jsx";

export function CreateLinkModal({ onClose, onCreate, toast }) {
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: api.getSettings });
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState("199.00");
  const [token, setToken] = useState("USDC");
  const [deadlineDays, setDeadlineDays] = useState(7);
  const [description, setDescription] = useState("");
  const [customerNote, setCustomerNote] = useState("");

  const businessName = settings?.businessName || "S1lk Merchant";
  const amt = parseFloat(amount) || 0;
  const tokAmt = token === "SOL" ? amt / TOKENS.SOL.rate : amt;
  const deadline = new Date(Date.now() + deadlineDays * 86400_000).toISOString();

  const mutation = useMutation({
    mutationFn: api.createLink,
    onSuccess: (link) => onCreate(link),
    onError: (err) => toast && toast("Error: " + err.message),
  });

  const submit = () => {
    mutation.mutate({
      description: description || "Payment request",
      amount: amt,
      token,
      deadline,
      businessName,
      ...(customerNote ? { customerNote } : {}),
    });
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-h">
          <div>
            <h2>{step === 0 ? "New payment link" : "Review and create"}</h2>
            <p>
              {step === 0 ? "Configure what you'd like to receive." : "Confirm the details before generating the link."}
            </p>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <IconClose width="16" height="16" />
          </button>
        </div>
        <div className="steps">
          <div className={"step " + (step >= 0 ? (step === 0 ? "cur" : "done") : "")} />
          <div className={"step " + (step >= 1 ? (step === 1 ? "cur" : "done") : "")} />
        </div>
        <div className="modal-body" style={{ paddingTop: 18 }}>
          {step === 0 ? (
            <>
              <div className="field">
                <label>
                  Amount <small>USD-pegged</small>
                </label>
                <div className="amount-input">
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                    inputMode="decimal"
                    placeholder="0.00"
                  />
                  <div className="tok-pick">
                    <TokenLogo sym={token} />
                    {token}
                  </div>
                </div>
                <div className="tok-options">
                  {["USDC", "USDT", "SOL"].map((t) => (
                    <button key={t} type="button" className={"tok-opt" + (token === t ? " active" : "")} onClick={() => setToken(t)}>
                      <TokenLogo sym={t} /> {t}
                    </button>
                  ))}
                </div>
                {token === "SOL" && amt > 0 && (
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                    ≈ {fmtToken(tokAmt, "SOL")} at current rate (${TOKENS.SOL.rate.toFixed(2)}/SOL)
                  </div>
                )}
              </div>
              <div className="field">
                <label>Payment deadline</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[1, 3, 7, 14, 30].map((d) => (
                    <button
                      key={d}
                      type="button"
                      className={"tok-opt" + (deadlineDays === d ? " active" : "")}
                      onClick={() => setDeadlineDays(d)}
                    >
                      {d} day{d > 1 ? "s" : ""}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>Link expires on {fmtDateTime(deadline)}</div>
              </div>
              <div className="field">
                <label>
                  Description <small>optional</small>
                </label>
                <input
                  className="input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Pro plan — June"
                />
              </div>
              <div className="field">
                <label>
                  Customer note <small>optional</small>
                </label>
                <textarea
                  className="textarea"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="Any extra info to show on the payment page"
                />
              </div>
            </>
          ) : (
            <div>
              <div style={{ textAlign: "center", padding: "12px 0 20px" }}>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>You'll receive</div>
                <div style={{ fontSize: 40, fontWeight: 600, fontFamily: "Geist Mono", letterSpacing: "-0.02em" }}>{fmtUSD(amt)}</div>
                <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>≈ {fmtToken(tokAmt, token)} on Solana</div>
              </div>
              <div className="summary-grid">
                <div>
                  <div className="k">Token</div>
                  <div className="v">
                    <TokenChip sym={token} />
                  </div>
                </div>
                <div>
                  <div className="k">Network</div>
                  <div className="v">Solana · Mainnet</div>
                </div>
                <div>
                  <div className="k">Business</div>
                  <div className="v">{businessName}</div>
                </div>
                <div>
                  <div className="k">Deadline</div>
                  <div className="v mono">{fmtDate(deadline, { month: "short", day: "numeric", year: "numeric" })}</div>
                </div>
                {description && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div className="k">Description</div>
                    <div className="v">{description}</div>
                  </div>
                )}
                {customerNote && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div className="k">Customer note</div>
                    <div className="v" style={{ color: "var(--muted)" }}>
                      {customerNote}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="modal-foot">
          {step === 0 ? (
            <>
              <button className="btn" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" disabled={!(amt > 0)} onClick={() => setStep(1)}>
                Continue <IconChevron width="14" height="14" />
              </button>
            </>
          ) : (
            <>
              <button className="btn" onClick={() => setStep(0)}>
                Back
              </button>
              <button className="btn btn-accent" onClick={submit} disabled={mutation.isPending}>
                {mutation.isPending ? "Creating…" : "Generate payment link"} <IconChevron width="14" height="14" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
