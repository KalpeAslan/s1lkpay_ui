import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client.js";
import { fmtDate } from "../lib/fmtDate.js";
import { fmtDateTime } from "../lib/fmtDateTime.js";
import { fmtUSD } from "../lib/fmtUSD.js";
import { shortHash } from "../lib/shortHash.js";
import { AreaChart } from "./AreaChart.jsx";
import { IconArrowDown } from "./icons/IconArrowDown.jsx";
import { IconArrowUp } from "./icons/IconArrowUp.jsx";
import { IconDownload } from "./icons/IconDownload.jsx";
import { PageError } from "./PageError.jsx";
import { PageLoader } from "./PageLoader.jsx";
import { TokenBreakdown } from "./TokenBreakdown.jsx";
import { TokenChip } from "./TokenChip.jsx";

export function PaymentsPage() {
  const [days, setDays] = useState(14);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["payments", days],
    queryFn: () => api.payments(days),
  });

  if (isLoading) return <PageLoader />;
  if (isError) return <PageError />;

  const {
    totalIncome = 0,
    growthPercent = 0,
    successfulPayments = 0,
    totalLinks = 0,
    pendingPayments = 0,
    pendingAmount = 0,
    avgPayment = 0,
    incomeByDay = [],
    incomeByToken = [],
    transactions = [],
  } = data;

  const labels = incomeByDay.map((d) => fmtDate(d.date, { month: "short", day: "numeric" }));
  const values = incomeByDay.map((d) => d.amount);

  return (
    <>
      <div className="page-h">
        <div>
          <h1>Payments</h1>
          <p>Income overview across all payment links.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[14, 30, 90].map((d) => (
            <button key={d} className={"btn" + (days === d ? " btn-primary" : "")} onClick={() => setDays(d)}>
              {d}d
            </button>
          ))}
          <button className="btn">
            <IconDownload width="14" height="14" /> Export
          </button>
        </div>
      </div>

      <div className="kpi-row">
        <div className="card kpi">
          <div className="lbl">Total income</div>
          <div className="val">{fmtUSD(totalIncome)}</div>
          <div className={"delta " + (growthPercent >= 0 ? "up" : "down")}>
            {growthPercent >= 0 ? <IconArrowUp width="12" height="12" /> : <IconArrowDown width="12" height="12" />}
            {Math.abs(growthPercent)}%
          </div>
        </div>
        <div className="card kpi">
          <div className="lbl">Successful payments</div>
          <div className="val">{successfulPayments}</div>
          <div className="delta up">Across {totalLinks} links</div>
        </div>
        <div className="card kpi">
          <div className="lbl">Pending payments</div>
          <div className="val">{pendingPayments}</div>
          <div className="delta flat">{fmtUSD(pendingAmount)} awaiting</div>
        </div>
        <div className="card kpi">
          <div className="lbl">Avg payment</div>
          <div className="val">{fmtUSD(avgPayment)}</div>
          <div className="delta up">
            <IconArrowUp width="12" height="12" /> per transaction
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 18 }}>
        <div className="card">
          <div className="card-h">
            <div>
              <h3>Income by day</h3>
              <div className="sub">Last {days} days</div>
            </div>
          </div>
          <div className="chart-wrap">
            <AreaChart series={{ labels, values }} height={220} />
          </div>
        </div>
        <div className="card">
          <div className="card-h">
            <div>
              <h3>Income by token</h3>
            </div>
          </div>
          <div className="card-pad">
            <TokenBreakdown incomeByToken={incomeByToken} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <div>
            <h3>All payments</h3>
            <div className="sub">{successfulPayments} successful transactions</div>
          </div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Tx hash</th>
              <th>Description</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Token</th>
              <th>Paid on</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && (
              <tr>
                <td colSpan="6">
                  <div className="empty">
                    <h4>No transactions yet</h4>
                  </div>
                </td>
              </tr>
            )}
            {transactions.map((t, i) => (
              <tr key={i}>
                <td className="mono" style={{ fontSize: 12.5 }}>
                  {shortHash(t.txHash || "")}
                </td>
                <td>{t.description}</td>
                <td className="muted">{t.customerName || "—"}</td>
                <td className="amt">{fmtUSD(Number(t.amount))}</td>
                <td>
                  <TokenChip sym={t.token} />
                </td>
                <td className="muted">{t.paidOn ? fmtDateTime(t.paidOn) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
