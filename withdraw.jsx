/* global React, I, TOKENS, TokenLogo, TokenChip, fmtAmt, fmtUSD, fmtToken, shortAddr, seedBalances, tokenUSD, WALLET_ADDR, StatusPill */
const { useState, useMemo, useEffect } = React;

// =============== Withdraw Page ===============
function WithdrawPage({ onDone }) {
  const [balances] = useState(() => seedBalances());
  const [step, setStep] = useState(0);
  // 0 type, 1 select, 2 destination, 3 review, 4 success

  const [type, setType] = useState("all"); // all | token | fiat
  const [token, setToken] = useState("USDC");
  const [amount, setAmount] = useState("");

  // crypto destination
  const [destAddr, setDestAddr] = useState("");
  // fiat destination
  const [card, setCard] = useState({
    holder: "Sandbox Merchant Ltd.",
    number: "•••• •••• •••• 2841",
    country: "United States",
    currency: "USD",
  });
  const [addCard, setAddCard] = useState(false);

  const totalUSD = balances.reduce((a, b) => a + tokenUSD(b.sym, b.amount), 0);
  const selBal = balances.find(b => b.sym === token);
  const numAmount = parseFloat(amount) || 0;
  const tokAmountToSend = type === "all"
    ? totalUSD
    : type === "token"
      ? numAmount
      : numAmount; // for fiat we accept token amount input too
  const sourceUSD = type === "all"
    ? totalUSD
    : tokenUSD(token, numAmount);

  // fiat conversion
  const fxRates = { USD: 1, KZT: 458.4, VND: 25320 };
  const fiatAmount = sourceUSD * (fxRates[card.currency] || 1);
  const fxFee = sourceUSD * 0.0095;
  const netFiat = (sourceUSD - fxFee) * (fxRates[card.currency] || 1);
  const networkFee = type === "fiat" ? 0 : (token === "SOL" ? 0.000005 * TOKENS.SOL.rate : 0.04);
  const serviceFee = type === "fiat" ? sourceUSD * 0.0125 : 0;
  const finalUSD = type === "fiat"
    ? sourceUSD - fxFee - serviceFee
    : sourceUSD - networkFee;

  const txId = useMemo(() => "wd_" + Math.random().toString(36).slice(2, 12), []);

  const next = () => setStep(s => Math.min(s + 1, 4));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const canContinue = () => {
    if (step === 0) return !!type;
    if (step === 1) return type === "all" || numAmount > 0;
    if (step === 2) {
      if (type === "fiat") return !!card.number;
      return destAddr.length > 12;
    }
    return true;
  };

  const steps = ["Type", "Assets", "Destination", "Review", "Done"];

  return (
    <>
      <div className="page-h">
        <div>
          <h1>Withdraw funds</h1>
          <p>Move funds out of your S1lk PAY wallet — to another wallet or your bank.</p>
        </div>
        <div className="mono" style={{color: "var(--muted)", fontSize: 13}}>
          Available · <b style={{color: "var(--ink)", fontWeight: 600}}>{fmtUSD(totalUSD)}</b>
        </div>
      </div>

      <div className="withdraw-stepper">
        {steps.map((s, i) => (
          <div key={i} className={"withdraw-step" + (i === step ? " cur" : i < step ? " done" : "")}>
            <div className="n">{i < step ? <I.check width="12" height="12"/> : (i + 1)}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="withdraw-card">
          <div className="withdraw-main">
            {step === 0 && <StepType type={type} setType={setType}/>}
            {step === 1 && <StepAssets type={type} balances={balances} totalUSD={totalUSD}
                                       token={token} setToken={setToken}
                                       amount={amount} setAmount={setAmount}/>}
            {step === 2 && <StepDestination type={type} destAddr={destAddr} setDestAddr={setDestAddr}
                                            card={card} setCard={setCard}
                                            addCard={addCard} setAddCard={setAddCard}/>}
            {step === 3 && <StepReview
                              type={type} token={token} balances={balances}
                              numAmount={numAmount} totalUSD={totalUSD} sourceUSD={sourceUSD}
                              destAddr={destAddr} card={card}
                              fiatAmount={fiatAmount} fxFee={fxFee} netFiat={netFiat}
                              networkFee={networkFee} serviceFee={serviceFee} finalUSD={finalUSD}/>}
            {step === 4 && <StepDone type={type} sourceUSD={sourceUSD} finalUSD={finalUSD}
                                     destAddr={destAddr} card={card} txId={txId} token={token}
                                     onDone={onDone}/>}

            {step < 4 && (
              <div style={{display: "flex", gap: 8, marginTop: 28, justifyContent: "space-between"}}>
                <button className="btn" onClick={step === 0 ? onDone : back}>
                  <I.arrowLeft width="14" height="14"/> {step === 0 ? "Cancel" : "Back"}
                </button>
                <button className="btn btn-primary" disabled={!canContinue()} onClick={next}>
                  {step === 3 ? "Confirm withdrawal" : "Continue"} <I.arrowRight width="14" height="14"/>
                </button>
              </div>
            )}
          </div>

          <div className="withdraw-side">
            <h4>Summary</h4>
            <SidebarSummary
              step={step} type={type} token={token} balances={balances}
              numAmount={numAmount} totalUSD={totalUSD} sourceUSD={sourceUSD}
              card={card} fiatAmount={fiatAmount} fxFee={fxFee}
              networkFee={networkFee} serviceFee={serviceFee} finalUSD={finalUSD}
              destAddr={destAddr}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// =============== Step 0: type ===============
function StepType({ type, setType }) {
  const options = [
    { id: "all", title: "Withdraw all funds", desc: "Cash out every token in your wallet at once.", icon: <I.wallet width="18" height="18"/>, accent: false },
    { id: "token", title: "Withdraw a specific token", desc: "Send a precise amount of one token to another wallet.", icon: <I.send width="18" height="18"/>, accent: false },
    { id: "fiat", title: "Convert to fiat & withdraw to card", desc: "Sell crypto for USD, KZT, or VND and pay out to your bank card.", icon: <I.card width="18" height="18"/>, accent: true },
  ];
  return (
    <>
      <h3 style={{margin: "0 0 4px", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em"}}>Choose withdrawal type</h3>
      <p style={{margin: "0 0 18px", color: "var(--muted)", fontSize: 13.5}}>How would you like to move funds out of your wallet?</p>
      <div className="option-grid">
        {options.map(o => (
          <button key={o.id} className={"option-card" + (type === o.id ? " active" : "")} onClick={() => setType(o.id)}>
            <div className={"ico" + (o.accent ? " accent" : "")}>{o.icon}</div>
            <h4>{o.title}</h4>
            <p>{o.desc}</p>
          </button>
        ))}
      </div>
    </>
  );
}

// =============== Step 1: assets ===============
function StepAssets({ type, balances, totalUSD, token, setToken, amount, setAmount }) {
  if (type === "all") {
    return (
      <>
        <h3 style={{margin: "0 0 4px", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em"}}>Withdraw all funds</h3>
        <p style={{margin: "0 0 18px", color: "var(--muted)", fontSize: 13.5}}>
          We'll move every available balance out of your wallet. You'll choose where to send it next.
        </p>
        <div className="card" style={{padding: 0, marginBottom: 12}}>
          <div className="token-list">
            {balances.map(b => (
              <div className="token-row" key={b.sym}>
                <TokenLogo sym={b.sym} size={32}/>
                <div className="nm">{TOKENS[b.sym].name}<small>{b.sym}</small></div>
                <div className="qty">
                  {b.sym === "PEPE" ? fmtAmt(b.amount, 0) : fmtAmt(b.amount, b.sym === "SOL" ? 3 : 2)} {b.sym}
                  <small>{fmtUSD(tokenUSD(b.sym, b.amount))}</small>
                </div>
                <div className="muted" style={{fontSize: 12}}>Included</div>
              </div>
            ))}
          </div>
        </div>
        <div className="summary-total">
          <div className="lbl">Estimated total value</div>
          <div className="v">{fmtUSD(totalUSD)}</div>
        </div>
      </>
    );
  }
  const bal = balances.find(b => b.sym === token) || balances[0];
  const usd = tokenUSD(token, parseFloat(amount) || 0);
  return (
    <>
      <h3 style={{margin: "0 0 4px", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em"}}>
        {type === "fiat" ? "Choose what to convert" : "Choose token and amount"}
      </h3>
      <p style={{margin: "0 0 18px", color: "var(--muted)", fontSize: 13.5}}>
        Pick the token to withdraw and how much.
      </p>
      <div className="token-pick-list" style={{marginBottom: 16}}>
        {balances.map(b => (
          <label key={b.sym} className={"token-pick" + (token === b.sym ? " active" : "")}>
            <input type="radio" name="tok" value={b.sym} checked={token === b.sym} onChange={() => setToken(b.sym)}/>
            <div style={{display: "flex", alignItems: "center", gap: 10}}>
              <TokenLogo sym={b.sym} size={28}/>
              <div>
                <div style={{fontWeight: 500}}>{TOKENS[b.sym].name}</div>
                <div className="muted" style={{fontSize: 12}}>{b.sym}</div>
              </div>
            </div>
            <div className="qty">
              {b.sym === "PEPE" ? fmtAmt(b.amount, 0) : fmtAmt(b.amount, b.sym === "SOL" ? 3 : 2)} {b.sym}
              <small>{fmtUSD(tokenUSD(b.sym, b.amount))}</small>
            </div>
            <div></div>
          </label>
        ))}
      </div>

      <div className="field">
        <label>Amount <small>maximum {bal.sym === "PEPE" ? fmtAmt(bal.amount, 0) : fmtAmt(bal.amount, bal.sym === "SOL" ? 3 : 2)} {bal.sym}</small></label>
        <div className="amount-input">
          <input
            value={amount}
            onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0.00"
            inputMode="decimal"
          />
          <div className="tok-pick">
            <TokenLogo sym={token}/>{token}
            <button className="btn btn-sm" style={{marginLeft: 8}} onClick={() => setAmount(String(bal.amount))}>Max</button>
          </div>
        </div>
        <div className="muted" style={{fontSize: 12, marginTop: 6}}>
          ≈ {fmtUSD(usd)}{type === "fiat" ? " before conversion fees" : ""}
        </div>
      </div>
    </>
  );
}

// =============== Step 2: destination ===============
function StepDestination({ type, destAddr, setDestAddr, card, setCard, addCard, setAddCard }) {
  if (type === "fiat") {
    return (
      <>
        <h3 style={{margin: "0 0 4px", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em"}}>Payout destination</h3>
        <p style={{margin: "0 0 18px", color: "var(--muted)", fontSize: 13.5}}>
          Choose a bank card to receive the converted fiat.
        </p>

        {!addCard ? (
          <>
            <div style={{display: "flex", gap: 14, alignItems: "center", marginBottom: 14}}>
              <div className="bank-card">
                <div className="top">
                  <div className="chip"></div>
                  <div style={{fontWeight: 600, fontSize: 12, letterSpacing: "0.1em"}}>VISA</div>
                </div>
                <div className="num">{card.number}</div>
                <div className="row">
                  <div><small>Card holder</small><br/><b>{card.holder}</b></div>
                  <div><small>Country</small><br/><b>{card.country}</b></div>
                </div>
              </div>
              <button className="btn btn-sm" onClick={() => setAddCard(true)}><I.plus width="14" height="14"/> Add another</button>
            </div>

            <div className="field">
              <label>Receive currency</label>
              <div style={{display: "flex", gap: 6, flexWrap: "wrap"}}>
                {["USD", "KZT", "VND"].map(c => (
                  <button key={c} type="button"
                    className={"tok-opt" + (card.currency === c ? " active" : "")}
                    onClick={() => setCard({...card, currency: c})}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="muted" style={{fontSize: 12, marginTop: 6}}>
                Funds are converted at the prevailing market rate at the moment of confirmation.
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="field">
              <label>Card holder name</label>
              <input className="input" value={card.holder} onChange={e => setCard({...card, holder: e.target.value})}/>
            </div>
            <div className="field">
              <label>Card number</label>
              <input className="input" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 2841"/>
            </div>
            <div className="row-2">
              <div className="field">
                <label>Country</label>
                <select className="select" value={card.country} onChange={e => setCard({...card, country: e.target.value})}>
                  <option>United States</option>
                  <option>Kazakhstan</option>
                  <option>Vietnam</option>
                </select>
              </div>
              <div className="field">
                <label>Receive currency</label>
                <select className="select" value={card.currency} onChange={e => setCard({...card, currency: e.target.value})}>
                  <option value="USD">USD — US Dollar</option>
                  <option value="KZT">KZT — Kazakhstani Tenge</option>
                  <option value="VND">VND — Vietnamese Dong</option>
                </select>
              </div>
            </div>
            <button className="btn btn-sm" onClick={() => setAddCard(false)}><I.arrowLeft width="13" height="13"/> Use saved card</button>
          </>
        )}
      </>
    );
  }
  return (
    <>
      <h3 style={{margin: "0 0 4px", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em"}}>Destination wallet</h3>
      <p style={{margin: "0 0 18px", color: "var(--muted)", fontSize: 13.5}}>
        Send to any Solana wallet address.
      </p>
      <div className="field">
        <label>Recipient address <small>Solana</small></label>
        <input className="input mono"
          placeholder="Solana wallet address"
          value={destAddr}
          onChange={e => setDestAddr(e.target.value)}/>
        <div className="muted" style={{fontSize: 12, marginTop: 6}}>
          Double-check the address. Crypto transactions are irreversible.
        </div>
      </div>
      <div className="field">
        <label>Network</label>
        <div className="fx-row">
          <div style={{display: "flex", alignItems: "center", gap: 8}}>
            <TokenLogo sym="SOL"/>
            <div>
              <div style={{fontWeight: 500}}>Solana · Mainnet</div>
              <div className="muted" style={{fontSize: 12}}>Fastest network for this token</div>
            </div>
          </div>
          <div className="muted" style={{fontSize: 12}}>~2s · negligible fee</div>
        </div>
      </div>
    </>
  );
}

// =============== Step 3: review ===============
function StepReview({ type, token, balances, numAmount, totalUSD, sourceUSD, destAddr, card, fiatAmount, fxFee, netFiat, networkFee, serviceFee, finalUSD }) {
  return (
    <>
      <h3 style={{margin: "0 0 4px", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em"}}>Review withdrawal</h3>
      <p style={{margin: "0 0 18px", color: "var(--muted)", fontSize: 13.5}}>
        Confirm the details. You can cancel before signing.
      </p>

      <div className="kv-list" style={{marginBottom: 16}}>
        <div className="kv-row"><div className="k">Source</div>
          <div className="v">
            {type === "all" ? `${balances.length} tokens · ${fmtUSD(totalUSD)}` :
             `${fmtAmt(numAmount, token === "SOL" ? 3 : 2)} ${token} · ${fmtUSD(sourceUSD)}`}
          </div><div></div></div>
        {type === "fiat" ? (
          <>
            <div className="kv-row"><div className="k">Conversion</div>
              <div className="v">
                <div className="fx-row" style={{padding: 0, background: "transparent"}}>
                  <span className="pair">1 USD ≈ {fmtAmt(card.currency === "USD" ? 1 : card.currency === "KZT" ? 458.4 : 25320, card.currency === "USD" ? 2 : 0)} {card.currency}</span>
                </div>
              </div><div></div></div>
            <div className="kv-row"><div className="k">Destination<small>Bank card</small></div>
              <div className="v mono">{card.number} · {card.holder}</div><div></div></div>
            <div className="kv-row"><div className="k">FX fee<small>0.95% spread</small></div>
              <div className="v mono">−{fmtUSD(fxFee)}</div><div></div></div>
            <div className="kv-row"><div className="k">Service fee<small>1.25% payout</small></div>
              <div className="v mono">−{fmtUSD(serviceFee)}</div><div></div></div>
            <div className="kv-row"><div className="k">Estimated arrival</div>
              <div className="v">1–2 business days</div><div></div></div>
          </>
        ) : (
          <>
            <div className="kv-row"><div className="k">Destination<small>Solana address</small></div>
              <div className="v mono">{destAddr ? shortAddr(destAddr) : "—"}</div><div></div></div>
            <div className="kv-row"><div className="k">Network fee</div>
              <div className="v mono">−{fmtUSD(networkFee)}</div><div></div></div>
            <div className="kv-row"><div className="k">Estimated arrival</div>
              <div className="v">~2 seconds</div><div></div></div>
          </>
        )}
      </div>

      <div className="security-block">
        <div className="ico" style={{background: "var(--accent-soft)", color: "var(--accent)"}}><I.warn width="18" height="18"/></div>
        <div>
          <h4>Conversion rates change in real time</h4>
          <p>The final amount may shift by up to 0.3% between confirmation and settlement. We'll lock the rate the moment you confirm.</p>
        </div>
      </div>
    </>
  );
}

// =============== Step 4: success ===============
function StepDone({ type, sourceUSD, finalUSD, destAddr, card, txId, token, onDone }) {
  return (
    <>
      <div className="success-wave">
        <div className="check-orb"><I.check width="36" height="36"/></div>
        <h2 style={{margin: "10px 0 4px", fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em"}}>Withdrawal initiated</h2>
        <p style={{margin: 0, color: "var(--muted)", fontSize: 13.5}}>
          {type === "fiat"
            ? "We're converting your crypto and routing the funds to your bank card."
            : "Your transaction is being broadcast on Solana."}
        </p>
        <div style={{marginTop: 14, display: "inline-flex", alignItems: "center", gap: 8}}>
          <StatusPill status="pending"/>
          <span style={{fontSize: 13, color: "var(--muted)"}}>Status: Processing</span>
        </div>
      </div>

      <div className="kv-list" style={{padding: "0 4px"}}>
        <div className="kv-row"><div className="k">Amount<small>Source</small></div>
          <div className="v mono">{fmtUSD(sourceUSD)}</div><div></div></div>
        <div className="kv-row"><div className="k">You will receive</div>
          <div className="v mono" style={{fontSize: 15, fontWeight: 600, color: "var(--ink)"}}>{fmtUSD(finalUSD)}</div><div></div></div>
        <div className="kv-row"><div className="k">Destination</div>
          <div className="v mono">{type === "fiat" ? card.number : (destAddr ? shortAddr(destAddr) : "—")}</div><div></div></div>
        <div className="kv-row"><div className="k">{type === "fiat" ? "Payout ID" : "Transaction ID"}</div>
          <div className="v mono">{txId}</div><div></div></div>
        <div className="kv-row"><div className="k">Estimated arrival</div>
          <div className="v">{type === "fiat" ? "1–2 business days" : "~2 seconds"}</div><div></div></div>
      </div>

      <div style={{display: "flex", gap: 8, marginTop: 22, justifyContent: "center"}}>
        <button className="btn">View withdrawal details <I.external width="13" height="13"/></button>
        <button className="btn btn-primary" onClick={onDone}>Back to dashboard <I.arrowRight width="13" height="13"/></button>
      </div>
    </>
  );
}

// =============== Sidebar summary ===============
function SidebarSummary({ step, type, token, balances, numAmount, totalUSD, sourceUSD, card, fiatAmount, fxFee, networkFee, serviceFee, finalUSD, destAddr }) {
  if (step === 0) {
    return (
      <>
        <div className="summary-line"><span className="muted">Type</span><span className="v">{type === "all" ? "Withdraw all" : type === "token" ? "Specific token" : "Convert to fiat"}</span></div>
        <div className="summary-line"><span className="muted">Available</span><span className="v">{fmtUSD(totalUSD)}</span></div>
        <div style={{fontSize: 12, color: "var(--muted)", marginTop: 14, lineHeight: 1.5}}>
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
          <div className="summary-line"><span className="muted">FX fee</span><span className="v">−{fmtUSD(fxFee)}</span></div>
          <div className="summary-line"><span className="muted">Service fee</span><span className="v">−{fmtUSD(serviceFee)}</span></div>
          <div className="summary-line"><span className="muted">Currency</span><span className="v">{card.currency}</span></div>
        </>
      ) : (
        <>
          <div className="summary-line"><span className="muted">Network fee</span><span className="v">−{fmtUSD(networkFee)}</span></div>
          <div className="summary-line"><span className="muted">Network</span><span className="v">Solana</span></div>
        </>
      )}
      <div className="summary-total" style={{marginTop: 14}}>
        <div className="lbl">You receive</div>
        <div className="v">{fmtUSD(Math.max(finalUSD, 0))}</div>
        {type === "fiat" && (
          <div className="muted" style={{fontSize: 12, marginTop: 4, fontFamily: "Geist Mono", fontVariantNumeric: "tabular-nums"}}>
            ≈ {fmtAmt(Math.max(finalUSD, 0) * (card.currency === "USD" ? 1 : card.currency === "KZT" ? 458.4 : 25320), card.currency === "USD" ? 2 : 0)} {card.currency}
          </div>
        )}
      </div>
    </>
  );
}

Object.assign(window, { WithdrawPage });
