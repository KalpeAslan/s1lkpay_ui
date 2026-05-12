import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client.js";
import { fmtDate } from "../lib/fmtDate.js";
import { fmtUSD } from "../lib/fmtUSD.js";
import { relTime } from "../lib/relTime.js";
import { AreaChart } from "./AreaChart.jsx";
import { IconArrowDown } from "./icons/IconArrowDown.jsx";
import { IconArrowUp } from "./icons/IconArrowUp.jsx";
import { IconChevron } from "./icons/IconChevron.jsx";
import { IconDownload } from "./icons/IconDownload.jsx";
import { IconPlus } from "./icons/IconPlus.jsx";
import { PageError } from "./PageError.jsx";
import { PageLoader } from "./PageLoader.jsx";
import { Sparkline } from "./Sparkline.jsx";
import { StatusPill } from "./StatusPill.jsx";
import { TokenBreakdown } from "./TokenBreakdown.jsx";
import { TokenChip } from "./TokenChip.jsx";

export function Dashboard({ onCreate, onOpenLink, onViewAll }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.dashboard,
  });

  if (isLoading) return <PageLoader />;
  if (isError) return <PageError />;

  const {
    totalReceived = 0,
    growthPercent = 0,
    successfulPayments = 0,
    totalLinks = 0,
    successRate = 0,
    pendingAmount = 0,
    pendingCount = 0,
    incomeByDay = [],
    incomeByToken = [],
    recentActivity = [],
  } = data;

  const labels = incomeByDay.map((d) => fmtDate(d.date, { month: "short", day: "numeric" }));
  const values = incomeByDay.map((d) => d.amount);
  const series = { labels, values };

  const spark1 = values.slice(-10);
  const spark2 = [4, 6, 5, 9, 7, 11, 9, 12, 10, 14];
  const spark3 = [12, 10, 11, 9, 10, 8, 9, 7, 8, 6];

  return (
    <>
      <div className="page-h">
        <div>
          <h1>Welcome back</h1>
          <p>Here's what's happening with your crypto payments today.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn">
            <IconDownload width="14" height="14" /> Export
          </button>
          <button className="btn btn-accent" onClick={onCreate}>
            <IconPlus width="14" height="14" /> New payment link
          </button>
        </div>
      </div>

      <div className="kpi-row">
        <div className="card kpi">
          <div className="lbl">Total received</div>
          <div className="val">{fmtUSD(totalReceived)}</div>
          <div className={"delta " + (growthPercent >= 0 ? "up" : "down")}>
            {growthPercent >= 0 ? <IconArrowUp width="12" height="12" /> : <IconArrowDown width="12" height="12" />}{" "}
            {Math.abs(growthPercent)}% vs last 14d
          </div>
          <div className="kpi-spark">
            <Sparkline data={spark1} />
          </div>
        </div>
        <div className="card kpi">
          <div className="lbl">Successful payments</div>
          <div className="val">
            {successfulPayments}
            <small>of {totalLinks}</small>
          </div>
          <div className="delta up">
            <IconArrowUp width="12" height="12" /> {successRate}% success rate
          </div>
          <div className="kpi-spark">
            <Sparkline data={spark2} />
          </div>
        </div>
        <div className="card kpi">
          <div className="lbl">Pending</div>
          <div className="val">{fmtUSD(pendingAmount)}</div>
          <div className="delta flat">{pendingCount} awaiting payment</div>
          <div className="kpi-spark">
            <Sparkline data={spark3} color="var(--muted-2)" />
          </div>
        </div>
        <div className="card kpi">
          <div className="lbl">Avg settlement</div>
          <div className="val">
            ~2.1<small>sec</small>
          </div>
          <div className="delta up">
            <IconArrowDown width="12" height="12" /> 0.4s faster
          </div>
          <div className="kpi-spark">
            <Sparkline data={[3.1, 2.9, 2.7, 2.5, 2.6, 2.4, 2.3, 2.2, 2.1, 2.1]} />
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 18 }}>
        <div className="card">
          <div className="card-h">
            <div>
              <h3>Income</h3>
              <div className="sub">Last 14 days · USD equivalent</div>
            </div>
            <div className="chart-tabs">
              <button className="active">Daily</button>
              <button>Weekly</button>
              <button>Monthly</button>
            </div>
          </div>
          <div className="chart-wrap">
            <AreaChart series={series} height={240} />
          </div>
        </div>
        <div className="card">
          <div className="card-h">
            <div>
              <h3>Income by token</h3>
              <div className="sub">All time</div>
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
            <h3>Recent activity</h3>
            <div className="sub">Latest payment links and transactions</div>
          </div>
          <button className="btn btn-sm" onClick={onViewAll}>
            View all
          </button>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Status</th>
              <th>Description</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Token</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.length === 0 && (
              <tr>
                <td colSpan="7">
                  <div className="empty">
                    <h4>No activity yet</h4>Create your first payment link to get started.
                  </div>
                </td>
              </tr>
            )}
            {recentActivity.map((l) => (
              <tr key={l.id} onClick={() => onOpenLink(l.id)} style={{ cursor: "pointer" }}>
                <td>
                  <StatusPill status={l.status} />
                </td>
                <td>{l.description}</td>
                <td className="muted">{l.customer}</td>
                <td className="amt">{fmtUSD(l.amount)}</td>
                <td>
                  <TokenChip sym={l.token} />
                </td>
                <td className="muted">{relTime(l.paid || l.created)}</td>
                <td className="right muted">
                  <IconChevron width="14" height="14" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
