import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { TOKENS } from "../constants/tokens.js";
import { api } from "../api/client.js";
import { queryClient } from "../api/queryClient.js";
import { fmtUSD } from "../lib/fmtUSD.js";
import { tokenUSD } from "../lib/tokenUSD.js";
import { useAppCtx } from "../hooks/useAppCtx.jsx";
import { IconArrowLeft } from "./icons/IconArrowLeft.jsx";
import { IconArrowRight } from "./icons/IconArrowRight.jsx";
import { IconCheck } from "./icons/IconCheck.jsx";
import { SidebarSummary } from "./SidebarSummary.jsx";
import { StepAssets } from "./StepAssets.jsx";
import { StepDestination } from "./StepDestination.jsx";
import { StepDone } from "./StepDone.jsx";
import { StepReview } from "./StepReview.jsx";
import { StepType } from "./StepType.jsx";

export function WithdrawPage() {
  const navigate = useNavigate();
  const { toast } = useAppCtx();
  const { data: walletData, isLoading } = useQuery({
    queryKey: ["wallet"],
    queryFn: api.wallet,
  });

  const balances = walletData?.balances || [];

  const [step, setStep] = useState(0);
  const [type, setType] = useState("all");
  const [token, setToken] = useState("USDC");
  const [amount, setAmount] = useState("");
  const [destAddr, setDestAddr] = useState("");
  const [card, setCard] = useState({
    holder: "Sandbox Merchant Ltd.",
    number: "•••• •••• •••• 2841",
    country: "United States",
    currency: "USD",
  });
  const [addCard, setAddCard] = useState(false);

  const totalUSD = balances.reduce((a, b) => a + tokenUSD(b.sym, b.amount), 0);
  const numAmount = parseFloat(amount) || 0;
  const sourceUSD = type === "all" ? totalUSD : tokenUSD(token, numAmount);

  const fxRates = { USD: 1, KZT: 458.4, VND: 25320 };
  void fxRates;
  const fxFee = sourceUSD * 0.0095;
  const serviceFee = type === "fiat" ? sourceUSD * 0.0125 : 0;
  const networkFee = type === "fiat" ? 0 : token === "SOL" ? 0.000005 * TOKENS.SOL.rate : 0.04;
  const finalUSD = type === "fiat" ? sourceUSD - fxFee - serviceFee : sourceUSD - networkFee;

  const txId = useMemo(() => "wd_" + Math.random().toString(36).slice(2, 12), []);

  const createWithdrawal = useMutation({
    mutationFn: () =>
      api.createWithdrawal({
        type,
        sourceAmount: sourceUSD,
        token: type !== "all" ? token : undefined,
        destinationAddress: type !== "fiat" ? destAddr : undefined,
        cardNumber: type === "fiat" ? card.number : undefined,
        cardHolder: type === "fiat" ? card.holder : undefined,
        currency: type === "fiat" ? card.currency : undefined,
        finalAmount: Math.max(finalUSD, 0),
      }),
    onSuccess: () => {
      toast("Withdrawal initiated");
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      setStep(4);
    },
  });

  const next = () => {
    if (step === 3) {
      createWithdrawal.mutate();
    } else {
      setStep((s) => Math.min(s + 1, 4));
    }
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

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

  if (isLoading) {
    return <div style={{ padding: 48, textAlign: "center", color: "var(--muted)" }}>Loading wallet…</div>;
  }

  return (
    <>
      <div className="page-h">
        <div>
          <h1>Withdraw funds</h1>
          <p>Move funds out of your S1lk PAY wallet — to another wallet or your bank.</p>
        </div>
        <div className="mono" style={{ color: "var(--muted)", fontSize: 13 }}>
          Available ·{" "}
          <b style={{ color: "var(--ink)", fontWeight: 600 }}>{fmtUSD(totalUSD)}</b>
        </div>
      </div>

      <div className="withdraw-stepper">
        {steps.map((s, i) => (
          <div key={i} className={"withdraw-step" + (i === step ? " cur" : i < step ? " done" : "")}>
            <div className="n">{i < step ? <IconCheck width="12" height="12" /> : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="withdraw-card">
          <div className="withdraw-main">
            {step === 0 && <StepType type={type} setType={setType} />}
            {step === 1 && (
              <StepAssets
                type={type}
                balances={balances}
                totalUSD={totalUSD}
                token={token}
                setToken={setToken}
                amount={amount}
                setAmount={setAmount}
              />
            )}
            {step === 2 && (
              <StepDestination
                type={type}
                destAddr={destAddr}
                setDestAddr={setDestAddr}
                card={card}
                setCard={setCard}
                addCard={addCard}
                setAddCard={setAddCard}
              />
            )}
            {step === 3 && (
              <StepReview
                type={type}
                token={token}
                balances={balances}
                numAmount={numAmount}
                totalUSD={totalUSD}
                sourceUSD={sourceUSD}
                destAddr={destAddr}
                card={card}
                fxFee={fxFee}
                networkFee={networkFee}
                serviceFee={serviceFee}
                finalUSD={finalUSD}
              />
            )}
            {step === 4 && (
              <StepDone
                type={type}
                sourceUSD={sourceUSD}
                finalUSD={finalUSD}
                destAddr={destAddr}
                card={card}
                txId={txId}
                onDone={() => navigate("/dashboard")}
              />
            )}

            {step < 4 && (
              <div style={{ display: "flex", gap: 8, marginTop: 28, justifyContent: "space-between" }}>
                <button className="btn" onClick={step === 0 ? () => navigate("/dashboard") : back}>
                  <IconArrowLeft width="14" height="14" /> {step === 0 ? "Cancel" : "Back"}
                </button>
                <button className="btn btn-primary" disabled={!canContinue() || createWithdrawal.isPending} onClick={next}>
                  {step === 3 ? (createWithdrawal.isPending ? "Submitting…" : "Confirm withdrawal") : "Continue"} <IconArrowRight width="14" height="14" />
                </button>
              </div>
            )}
          </div>

          <div className="withdraw-side">
            <h4>Summary</h4>
            <SidebarSummary
              step={step}
              type={type}
              token={token}
              balances={balances}
              numAmount={numAmount}
              totalUSD={totalUSD}
              sourceUSD={sourceUSD}
              card={card}
              fxFee={fxFee}
              networkFee={networkFee}
              serviceFee={serviceFee}
              finalUSD={finalUSD}
            />
          </div>
        </div>
      </div>
    </>
  );
}
