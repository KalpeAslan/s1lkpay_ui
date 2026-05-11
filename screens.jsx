/* global React, I, TOKENS, fmtAmt, fmtUSD, fmtToken, shortHash, shortAddr, uid, relTime, fmtDate, fmtDateTime, QR, TokenLogo, TokenChip, Sparkline, AreaChart, StatusPill, CopyBtn, Countdown, useNow, api, queryClient, useAuthCtx, useAppCtx */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
const { useState } = React;

// ─── Shared helpers ────────────────────────────────────────────────────────────

function LoadingRows({ cols = 6, rows = 5 }) {
  return Array.from({ length: rows }, (_, i) => (
    <tr key={i}>
      {Array.from({ length: cols }, (_, j) => (
        <td key={j}><div className="skeleton" style={{ height: 14, borderRadius: 4, background: "var(--surface-2)", width: j === 0 ? 60 : "80%" }}/></td>
      ))}
    </tr>
  ));
}

function PageLoader() {
  return <div style={{ padding: 48, textAlign: "center", color: "var(--muted)" }}>Loading…</div>;
}

function PageError({ message = "Something went wrong." }) {
  return (
    <div style={{ padding: 48, textAlign: "center" }}>
      <div style={{ color: "var(--danger, #e54)" }}>{message}</div>
    </div>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar() {
  const { logout } = useAuthCtx();
  const location = useLocation();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["payment-links"],
    queryFn: () => api.getLinks(),
    select: (d) => Number(d.counts?.find(c => c.status === "pending")?.count || 0),
  });
  const pending = data || 0;

  const items = [
    { path: "/dashboard", label: "Dashboard",    icon: <I.home className="sb-icon"/> },
    { path: "/links",     label: "Payment Links", icon: <I.link className="sb-icon"/>, badge: pending || null },
    { path: "/payments",  label: "Payments",      icon: <I.receipt className="sb-icon"/> },
    { path: "/wallet",    label: "Wallet",        icon: <I.wallet className="sb-icon"/> },
    { path: "/withdraw",  label: "Withdraw",      icon: <I.send className="sb-icon"/> },
    { path: "/settings",  label: "Settings",      icon: <I.cog className="sb-icon"/> },
  ];

  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-logo"><span>S</span></div>
        <div className="sb-name">S1lk <b>PAY</b></div>
      </div>
      <div className="sb-section sb-label">Menu</div>
      <nav className="sb-nav">
        {items.map(it => (
          <button key={it.path}
            className={"sb-item" + (location.pathname.startsWith(it.path) ? " active" : "")}
            onClick={() => navigate(it.path)}
            title={it.label}
          >
            {it.icon}
            <span className="sb-label">{it.label}</span>
            {it.badge ? <span className="sb-badge">{it.badge}</span> : null}
          </button>
        ))}
      </nav>
      <div className="sb-foot">
        <div className="sb-mode sb-foot-text">
          <span className="sb-mode-dot"></span> Solana · Mainnet
        </div>
        <UserInfo onLogout={logout}/>
      </div>
    </aside>
  );
}

function UserInfo({ onLogout }) {
  const { data: user } = useQuery({
    queryKey: ["settings"],
    queryFn: api.getSettings,
  });
  const name = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.businessName || user.email : "…";
  const email = user?.email || "";
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className="sb-account" style={{ cursor: "pointer" }} onClick={onLogout} title="Sign out">
      <div className="sb-avatar">{initials || "?"}</div>
      <div className="sb-account-text">
        <b>{name}</b>
        <span>{email}</span>
      </div>
    </div>
  );
}

// ─── Topbar ────────────────────────────────────────────────────────────────────

function Topbar({ sidebarStyle, setSidebarStyle }) {
  const { onCreate } = useAppCtx();
  const navigate = useNavigate();
  const location = useLocation();

  const crumbs = (() => {
    const p = location.pathname;
    if (p.startsWith("/links/")) return ["Payment links", "Link detail"];
    if (p === "/links")     return ["Payment links"];
    if (p === "/payments")  return ["Payments"];
    if (p === "/settings")  return ["Settings"];
    if (p === "/wallet")    return ["Wallet"];
    if (p === "/withdraw")  return ["Wallet", "Withdraw"];
    return ["Home"];
  })();

  const onViewClient = async () => {
    try {
      const { links } = await api.getLinks({ status: "pending" });
      if (links.length > 0) navigate("/pay/" + links[0].slug);
    } catch {}
  };

  return (
    <div className="topbar">
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <span key={i}>
            {i === crumbs.length - 1 ? <b>{c}</b> : <>{c} <span style={{opacity:.5}}>/</span></>}
          </span>
        ))}
      </div>
      <div className="topbar-spacer"/>
      <div className="search">
        <I.search width="14" height="14"/>
        <input placeholder="Search links, customers, hashes…"/>
        <span className="kbd">⌘K</span>
      </div>
      <button className="icon-btn" title="Toggle sidebar"
        onClick={() => setSidebarStyle(sidebarStyle === "expanded" ? "rail" : "expanded")}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7">
          <rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>
        </svg>
      </button>
      <button className="icon-btn" title="Notifications"><I.bell width="16" height="16"/></button>
      <button className="icon-btn" title="Help"><I.help width="16" height="16"/></button>
      <button className="btn" onClick={onViewClient} title="Preview the public payment page">
        <I.eye width="14" height="14"/> View as client
      </button>
      <button className="btn btn-primary" onClick={onCreate}>
        <I.plus width="14" height="14"/> Create link
      </button>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ onCreate, onOpenLink, onViewAll }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.dashboard,
  });

  if (isLoading) return <PageLoader/>;
  if (isError) return <PageError/>;

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

  const labels = incomeByDay.map(d => fmtDate(d.date, { month: "short", day: "numeric" }));
  const values = incomeByDay.map(d => d.amount);
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
        <div style={{display: "flex", gap: 8}}>
          <button className="btn"><I.download width="14" height="14"/> Export</button>
          <button className="btn btn-accent" onClick={onCreate}><I.plus width="14" height="14"/> New payment link</button>
        </div>
      </div>

      <div className="kpi-row">
        <div className="card kpi">
          <div className="lbl">Total received</div>
          <div className="val">{fmtUSD(totalReceived)}</div>
          <div className={"delta " + (growthPercent >= 0 ? "up" : "down")}>
            {growthPercent >= 0 ? <I.arrowUp width="12" height="12"/> : <I.arrowDown width="12" height="12"/>}
            {" "}{Math.abs(growthPercent)}% vs last 14d
          </div>
          <div className="kpi-spark"><Sparkline data={spark1}/></div>
        </div>
        <div className="card kpi">
          <div className="lbl">Successful payments</div>
          <div className="val">{successfulPayments}<small>of {totalLinks}</small></div>
          <div className="delta up"><I.arrowUp width="12" height="12"/> {successRate}% success rate</div>
          <div className="kpi-spark"><Sparkline data={spark2}/></div>
        </div>
        <div className="card kpi">
          <div className="lbl">Pending</div>
          <div className="val">{fmtUSD(pendingAmount)}</div>
          <div className="delta flat">{pendingCount} awaiting payment</div>
          <div className="kpi-spark"><Sparkline data={spark3} color="var(--muted-2)"/></div>
        </div>
        <div className="card kpi">
          <div className="lbl">Avg settlement</div>
          <div className="val">~2.1<small>sec</small></div>
          <div className="delta up"><I.arrowDown width="12" height="12"/> 0.4s faster</div>
          <div className="kpi-spark"><Sparkline data={[3.1, 2.9, 2.7, 2.5, 2.6, 2.4, 2.3, 2.2, 2.1, 2.1]}/></div>
        </div>
      </div>

      <div className="grid-2" style={{marginBottom: 18}}>
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
            <AreaChart series={series} height={240}/>
          </div>
        </div>
        <div className="card">
          <div className="card-h">
            <div><h3>Income by token</h3><div className="sub">All time</div></div>
          </div>
          <div className="card-pad">
            <TokenBreakdown incomeByToken={incomeByToken}/>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <div><h3>Recent activity</h3><div className="sub">Latest payment links and transactions</div></div>
          <button className="btn btn-sm" onClick={onViewAll}>View all</button>
        </div>
        <table className="tbl">
          <thead><tr>
            <th>Status</th><th>Description</th><th>Customer</th><th>Amount</th><th>Token</th><th>Date</th><th></th>
          </tr></thead>
          <tbody>
            {recentActivity.length === 0 && (
              <tr><td colSpan="7"><div className="empty"><h4>No activity yet</h4>Create your first payment link to get started.</div></td></tr>
            )}
            {recentActivity.map(l => (
              <tr key={l.id} onClick={() => onOpenLink(l.id)} style={{cursor:"pointer"}}>
                <td><StatusPill status={l.status}/></td>
                <td>{l.description}</td>
                <td className="muted">{l.customer}</td>
                <td className="amt">{fmtUSD(l.amount)}</td>
                <td><TokenChip sym={l.token}/></td>
                <td className="muted">{relTime(l.paid || l.created)}</td>
                <td className="right muted"><I.chevron width="14" height="14"/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function TokenBreakdown({ incomeByToken = [] }) {
  const map = {};
  for (const { token, amount } of incomeByToken) map[token] = amount;
  const syms = ["USDC", "USDT", "SOL"];

  if (incomeByToken.length === 0) {
    return <div className="empty" style={{padding: "24px 0"}}><h4>No paid links yet</h4></div>;
  }

  return (
    <div style={{display: "flex", flexDirection: "column", gap: 14}}>
      <div style={{display: "flex", height: 10, borderRadius: 999, overflow: "hidden", background: "var(--surface-2)"}}>
        {syms.map(sym => <div key={sym} style={{flex: map[sym] || 0, background: sym === "USDC" ? "oklch(0.58 0.16 250)" : sym === "USDT" ? "oklch(0.55 0.12 165)" : "oklch(0.65 0.22 320)"}}/>)}
      </div>
      {incomeByToken.map(({ token, amount, percent }) => (
        <div key={token} style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10}}>
          <div style={{display: "flex", alignItems: "center", gap: 10}}>
            <TokenLogo sym={token}/>
            <div>
              <div style={{fontWeight: 500, fontSize: 13.5}}>{token}</div>
              <div style={{fontSize: 12, color: "var(--muted)"}}>{TOKENS[token]?.name || token}</div>
            </div>
          </div>
          <div style={{textAlign: "right"}}>
            <div className="mono" style={{fontWeight: 500, fontVariantNumeric: "tabular-nums"}}>{fmtUSD(amount)}</div>
            <div style={{fontSize: 12, color: "var(--muted)"}}>{percent}%</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Payment Links list ─────────────────────────────────────────────────────────

function PaymentLinksList({ onCreate, onOpenLink }) {
  const [filter, setFilter] = useState("all");
  const [tokFilter, setTokFilter] = useState("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["payment-links", { status: filter, token: tokFilter }],
    queryFn: () => api.getLinks({ status: filter, token: tokFilter }),
  });

  const links = data?.links || [];
  const counts = data?.counts || [];
  const total = data?.total || 0;

  const countFor = (status) => Number(counts.find(c => c.status === status)?.count || 0);

  const exportUrl = api.exportLinksUrl();

  return (
    <>
      <div className="page-h">
        <div>
          <h1>Payment links</h1>
          <p>Manage all your generated payment links and their status.</p>
        </div>
        <div style={{display: "flex", gap: 8}}>
          <a href={exportUrl} download className="btn"><I.download width="14" height="14"/> Export CSV</a>
          <button className="btn btn-primary" onClick={onCreate}><I.plus width="14" height="14"/> Create link</button>
        </div>
      </div>

      <div className="filter-bar">
        <button className={"fchip" + (filter === "all" ? " active" : "")} onClick={() => setFilter("all")}>
          All <span className="muted">{total}</span>
        </button>
        {["pending", "paid", "expired"].map(s => (
          <button key={s} className={"fchip" + (filter === s ? " active" : "")} onClick={() => setFilter(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}{" "}
            <span className="muted">{countFor(s)}</span>
          </button>
        ))}
        <div style={{width: 1, height: 22, background: "var(--line)", margin: "0 4px"}}/>
        <button className={"fchip" + (tokFilter === "all" ? " active" : "")} onClick={() => setTokFilter("all")}>All tokens</button>
        {["USDC", "USDT", "SOL"].map(t => (
          <button key={t} className={"fchip" + (tokFilter === t ? " active" : "")} onClick={() => setTokFilter(t)}>
            <TokenLogo sym={t}/> {t}
          </button>
        ))}
        <div style={{flex: 1}}/>
        <button className="fchip"><I.filter width="12" height="12"/> More filters</button>
      </div>

      <div className="card" style={{padding: 0}}>
        <table className="tbl">
          <thead><tr>
            <th>Status</th><th>Description</th><th>Customer</th><th>Amount</th><th>Created</th><th>Deadline</th><th className="right">Actions</th>
          </tr></thead>
          <tbody>
            {isLoading && <LoadingRows cols={7}/>}
            {isError && <tr><td colSpan="7"><div className="empty"><h4>Failed to load</h4>Please try again.</div></td></tr>}
            {!isLoading && !isError && links.length === 0 && (
              <tr><td colSpan="7"><div className="empty"><h4>No links match these filters</h4>Try clearing some filters or create a new payment link.</div></td></tr>
            )}
            {links.map(l => (
              <tr key={l.id} onClick={() => onOpenLink(l.id)} style={{cursor:"pointer"}}>
                <td><StatusPill status={l.status}/></td>
                <td>
                  <div style={{fontWeight: 500}}>{l.description}</div>
                  <div className="muted" style={{fontSize: 12}}>{l.id}</div>
                </td>
                <td className="muted">{l.customer}</td>
                <td>
                  <div className="amt">{fmtUSD(l.amount)}</div>
                  <div className="muted" style={{fontSize: 12}}>{fmtToken(l.tokenAmount, l.token)}</div>
                </td>
                <td className="muted">{fmtDate(l.created)}</td>
                <td className="muted">
                  {l.status === "pending" && l.deadline ? <Countdown to={l.deadline} compact/> :
                   l.status === "expired" ? "Expired " + relTime(l.deadline) :
                   l.paid ? "Paid " + relTime(l.paid) : l.deadline ? fmtDate(l.deadline) : "—"}
                </td>
                <td className="right">
                  <button className="btn btn-sm" onClick={(e) => { e.stopPropagation(); onOpenLink(l.id); }}>
                    Open <I.chevron width="12" height="12"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── Payments analytics page ────────────────────────────────────────────────────

function PaymentsPage() {
  const [days, setDays] = useState(14);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["payments", days],
    queryFn: () => api.payments(days),
  });

  if (isLoading) return <PageLoader/>;
  if (isError) return <PageError/>;

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

  const labels = incomeByDay.map(d => fmtDate(d.date, { month: "short", day: "numeric" }));
  const values = incomeByDay.map(d => d.amount);

  return (
    <>
      <div className="page-h">
        <div>
          <h1>Payments</h1>
          <p>Income overview across all payment links.</p>
        </div>
        <div style={{display: "flex", gap: 8}}>
          {[14, 30, 90].map(d => (
            <button key={d} className={"btn" + (days === d ? " btn-primary" : "")} onClick={() => setDays(d)}>
              {d}d
            </button>
          ))}
          <button className="btn"><I.download width="14" height="14"/> Export</button>
        </div>
      </div>

      <div className="kpi-row">
        <div className="card kpi">
          <div className="lbl">Total income</div>
          <div className="val">{fmtUSD(totalIncome)}</div>
          <div className={"delta " + (growthPercent >= 0 ? "up" : "down")}>
            {growthPercent >= 0 ? <I.arrowUp width="12" height="12"/> : <I.arrowDown width="12" height="12"/>}
            {" "}{Math.abs(growthPercent)}%
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
          <div className="delta up"><I.arrowUp width="12" height="12"/> per transaction</div>
        </div>
      </div>

      <div className="grid-2" style={{marginBottom: 18}}>
        <div className="card">
          <div className="card-h"><div><h3>Income by day</h3><div className="sub">Last {days} days</div></div></div>
          <div className="chart-wrap"><AreaChart series={{labels, values}} height={220}/></div>
        </div>
        <div className="card">
          <div className="card-h"><div><h3>Income by token</h3></div></div>
          <div className="card-pad"><TokenBreakdown incomeByToken={incomeByToken}/></div>
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <div><h3>All payments</h3><div className="sub">{successfulPayments} successful transactions</div></div>
        </div>
        <table className="tbl">
          <thead><tr>
            <th>Tx hash</th><th>Description</th><th>Customer</th><th>Amount</th><th>Token</th><th>Paid on</th>
          </tr></thead>
          <tbody>
            {transactions.length === 0 && (
              <tr><td colSpan="6"><div className="empty"><h4>No transactions yet</h4></div></td></tr>
            )}
            {transactions.map((t, i) => (
              <tr key={i}>
                <td className="mono" style={{fontSize: 12.5}}>{shortHash(t.txHash || "")}</td>
                <td>{t.description}</td>
                <td className="muted">{t.customerName || "—"}</td>
                <td className="amt">{fmtUSD(Number(t.amount))}</td>
                <td><TokenChip sym={t.token}/></td>
                <td className="muted">{t.paidOn ? fmtDateTime(t.paidOn) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── Settings ──────────────────────────────────────────────────────────────────

function SettingsPage({ toast }) {
  const qc = useQueryClient();
  const [tab, setTab] = useState("business");

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: api.getSettings,
  });

  const mutation = useMutation({
    mutationFn: api.updateSettings,
    onSuccess: (updated) => {
      qc.setQueryData(["settings"], updated);
      toast && toast("Settings saved");
    },
  });

  if (isLoading) return <PageLoader/>;

  const s = settings || {};

  return (
    <>
      <div className="page-h"><div><h1>Settings</h1><p>Manage your S1lk PAY account and payout preferences.</p></div></div>
      <div className="card card-pad">
        <div className="settings-grid">
          <div className="settings-side">
            {[
              ["business", "Business profile"],
              ["wallet", "Payout wallet"],
              ["tokens", "Accepted tokens"],
              ["notifications", "Notifications"],
              ["developers", "Developers"],
              ["team", "Team"],
            ].map(([id, label]) => (
              <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>{label}</button>
            ))}
          </div>
          <div>
            {tab === "business" && (
              <BusinessTab settings={s} onSave={(data) => mutation.mutate(data)} saving={mutation.isPending}/>
            )}
            {tab === "wallet" && (
              <WalletTab settings={s} onSave={(data) => mutation.mutate(data)} saving={mutation.isPending}/>
            )}
            {tab === "tokens" && (
              <TokensTab settings={s} onSave={(data) => mutation.mutate(data)} saving={mutation.isPending}/>
            )}
            {tab === "notifications" && (
              <div className="kv-list">
                <div className="kv-row"><div className="k">Email on payment<small>Receive an email when a link is paid.</small></div><div className="v">On</div><button className="toggle on"/></div>
                <div className="kv-row"><div className="k">Webhooks<small>POST to your endpoint on payment events.</small></div><div className="v">Off</div><button className="toggle"/></div>
              </div>
            )}
            {tab === "developers" && (
              <div className="kv-list">
                <div className="kv-row"><div className="k">Publishable key</div><div className="v mono">pk_test_3kF92m…s1lk</div><button className="btn btn-sm">Copy</button></div>
                <div className="kv-row"><div className="k">Secret key</div><div className="v mono">sk_test_••••••••••••</div><button className="btn btn-sm">Reveal</button></div>
                <div className="kv-row"><div className="k">Webhook URL</div><div className="v muted">Not configured</div><button className="btn btn-sm">Add</button></div>
              </div>
            )}
            {tab === "team" && (
              <div className="empty"><h4>Just you for now</h4>Invite teammates to share access to this account.<div style={{marginTop: 12}}><button className="btn btn-primary"><I.plus width="14" height="14"/> Invite teammate</button></div></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function BusinessTab({ settings, onSave, saving }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const startEdit = () => { setForm({ businessName: settings.businessName || "", supportEmail: settings.supportEmail || "", website: settings.website || "" }); setEditing(true); };
  const save = () => { onSave(form); setEditing(false); };

  if (!editing) return (
    <div className="kv-list">
      <div className="kv-row"><div className="k">Business name<small>Shown to customers on payment pages.</small></div><div className="v">{settings.businessName || <span className="muted">Not set</span>}</div><button className="btn btn-sm" onClick={startEdit}>Edit</button></div>
      <div className="kv-row"><div className="k">Support email</div><div className="v">{settings.supportEmail || <span className="muted">Not set</span>}</div><button className="btn btn-sm" onClick={startEdit}>Edit</button></div>
      <div className="kv-row"><div className="k">Website</div><div className="v">{settings.website || <span className="muted">Not set</span>}</div><button className="btn btn-sm" onClick={startEdit}>Add</button></div>
    </div>
  );

  return (
    <div>
      <div className="field"><label>Business name</label><input className="input" value={form.businessName} onChange={e => setForm(f => ({...f, businessName: e.target.value}))}/></div>
      <div className="field"><label>Support email</label><input className="input" type="email" value={form.supportEmail} onChange={e => setForm(f => ({...f, supportEmail: e.target.value}))}/></div>
      <div className="field"><label>Website</label><input className="input" type="url" value={form.website} onChange={e => setForm(f => ({...f, website: e.target.value}))}/></div>
      <div style={{display: "flex", gap: 8, marginTop: 8}}>
        <button className="btn" onClick={() => setEditing(false)}>Cancel</button>
        <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
      </div>
    </div>
  );
}

function WalletTab({ settings, onSave, saving }) {
  const [editing, setEditing] = useState(false);
  const [addr, setAddr] = useState(settings.walletAddress || "");

  const save = () => { onSave({ walletAddress: addr }); setEditing(false); };

  return (
    <div className="kv-list">
      <div className="kv-row">
        <div className="k">Payout wallet<small>Funds settle directly to this Solana address.</small></div>
        <div className="v mono" style={{fontSize: 12}}>
          {editing
            ? <input className="input mono" value={addr} onChange={e => setAddr(e.target.value)} placeholder="Solana wallet address"/>
            : (settings.walletAddress ? shortAddr(settings.walletAddress) : <span className="muted">Not set</span>)}
        </div>
        {editing
          ? <div style={{display:"flex",gap:6}}><button className="btn btn-sm" onClick={() => setEditing(false)}>Cancel</button><button className="btn btn-sm btn-primary" onClick={save} disabled={saving}>{saving ? "…" : "Save"}</button></div>
          : <button className="btn btn-sm" onClick={() => { setAddr(settings.walletAddress || ""); setEditing(true); }}>Change</button>}
      </div>
      <div className="kv-row">
        <div className="k">Network<small>Mainnet — Solana</small></div>
        <div className="v">{settings.network || "Solana · Mainnet"}</div>
        <div></div>
      </div>
    </div>
  );
}

function TokensTab({ settings, onSave, saving }) {
  const accepted = settings.acceptedTokens || ["USDC", "USDT", "SOL"];
  const toggle = (sym) => {
    const next = accepted.includes(sym) ? accepted.filter(t => t !== sym) : [...accepted, sym];
    onSave({ acceptedTokens: next });
  };
  return (
    <div className="kv-list">
      {["USDC", "USDT", "SOL"].map(sym => (
        <div key={sym} className="kv-row">
          <div className="k" style={{display: "flex", alignItems: "center", gap: 10}}>
            <TokenLogo sym={sym} size={24}/>
            <div>{TOKENS[sym].name}<small>{sym} on Solana</small></div>
          </div>
          <div className="v">{accepted.includes(sym) ? "Accepted" : "Not accepted"}</div>
          <button className={"toggle" + (accepted.includes(sym) ? " on" : "")} onClick={() => toggle(sym)} disabled={saving}/>
        </div>
      ))}
    </div>
  );
}

// ─── Create Link Modal ──────────────────────────────────────────────────────────

function CreateLinkModal({ onClose, onCreate, toast }) {
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
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-h">
          <div>
            <h2>{step === 0 ? "New payment link" : "Review and create"}</h2>
            <p>{step === 0 ? "Configure what you'd like to receive." : "Confirm the details before generating the link."}</p>
          </div>
          <button className="icon-btn" onClick={onClose}><I.close width="16" height="16"/></button>
        </div>
        <div className="steps">
          <div className={"step " + (step >= 0 ? (step === 0 ? "cur" : "done") : "")}/>
          <div className={"step " + (step >= 1 ? (step === 1 ? "cur" : "done") : "")}/>
        </div>
        <div className="modal-body" style={{paddingTop: 18}}>
          {step === 0 ? (
            <>
              <div className="field">
                <label>Amount <small>USD-pegged</small></label>
                <div className="amount-input">
                  <input value={amount} onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} inputMode="decimal" placeholder="0.00"/>
                  <div className="tok-pick"><TokenLogo sym={token}/>{token}</div>
                </div>
                <div className="tok-options">
                  {["USDC", "USDT", "SOL"].map(t => (
                    <button key={t} type="button" className={"tok-opt" + (token === t ? " active" : "")} onClick={() => setToken(t)}>
                      <TokenLogo sym={t}/> {t}
                    </button>
                  ))}
                </div>
                {token === "SOL" && amt > 0 && (
                  <div style={{fontSize: 12, color: "var(--muted)", marginTop: 4}}>
                    ≈ {fmtToken(tokAmt, "SOL")} at current rate (${TOKENS.SOL.rate.toFixed(2)}/SOL)
                  </div>
                )}
              </div>
              <div className="field">
                <label>Payment deadline</label>
                <div style={{display: "flex", gap: 6, flexWrap: "wrap"}}>
                  {[1, 3, 7, 14, 30].map(d => (
                    <button key={d} type="button" className={"tok-opt" + (deadlineDays === d ? " active" : "")} onClick={() => setDeadlineDays(d)}>
                      {d} day{d > 1 ? "s" : ""}
                    </button>
                  ))}
                </div>
                <div style={{fontSize: 12, color: "var(--muted)", marginTop: 6}}>Link expires on {fmtDateTime(deadline)}</div>
              </div>
              <div className="field">
                <label>Description <small>optional</small></label>
                <input className="input" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Pro plan — June"/>
              </div>
              <div className="field">
                <label>Customer note <small>optional</small></label>
                <textarea className="textarea" value={customerNote} onChange={e => setCustomerNote(e.target.value)} placeholder="Any extra info to show on the payment page"/>
              </div>
            </>
          ) : (
            <div>
              <div style={{textAlign: "center", padding: "12px 0 20px"}}>
                <div style={{fontSize: 13, color: "var(--muted)"}}>You'll receive</div>
                <div style={{fontSize: 40, fontWeight: 600, fontFamily: "Geist Mono", letterSpacing: "-0.02em"}}>{fmtUSD(amt)}</div>
                <div style={{color: "var(--muted)", fontSize: 13, marginTop: 4}}>≈ {fmtToken(tokAmt, token)} on Solana</div>
              </div>
              <div className="summary-grid">
                <div><div className="k">Token</div><div className="v"><TokenChip sym={token}/></div></div>
                <div><div className="k">Network</div><div className="v">Solana · Mainnet</div></div>
                <div><div className="k">Business</div><div className="v">{businessName}</div></div>
                <div><div className="k">Deadline</div><div className="v mono">{fmtDate(deadline, {month: "short", day: "numeric", year: "numeric"})}</div></div>
                {description && (<div style={{gridColumn: "1 / -1"}}><div className="k">Description</div><div className="v">{description}</div></div>)}
                {customerNote && (<div style={{gridColumn: "1 / -1"}}><div className="k">Customer note</div><div className="v" style={{color:"var(--muted)"}}>{customerNote}</div></div>)}
              </div>
            </div>
          )}
        </div>
        <div className="modal-foot">
          {step === 0 ? (
            <>
              <button className="btn" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" disabled={!(amt > 0)} onClick={() => setStep(1)}>
                Continue <I.chevron width="14" height="14"/>
              </button>
            </>
          ) : (
            <>
              <button className="btn" onClick={() => setStep(0)}>Back</button>
              <button className="btn btn-accent" onClick={submit} disabled={mutation.isPending}>
                {mutation.isPending ? "Creating…" : "Generate payment link"} <I.chevron width="14" height="14"/>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Link Detail ────────────────────────────────────────────────────────────────

function LinkDetail({ linkId, onBack, onSimulated, toast }) {
  const navigate = useNavigate();
  const { data: link, isLoading, isError } = useQuery({
    queryKey: ["payment-link", linkId],
    queryFn: () => api.getLink(linkId),
  });

  const simulateMutation = useMutation({
    mutationFn: () => api.simulateLink(linkId),
    onSuccess: () => onSimulated(linkId),
    onError: (err) => toast && toast("Error: " + err.message),
  });

  if (isLoading) return <PageLoader/>;
  if (isError || !link) return <PageError message="Payment link not found."/>;

  const url = link.payUrl || `https://pay.s1lk.app/${link.slug}`;
  const isPending = link.status === "pending";
  const isPaid = link.status === "paid";

  return (
    <>
      <div className="page-h">
        <div style={{display: "flex", alignItems: "center", gap: 12}}>
          <button className="btn" onClick={onBack}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
            All links
          </button>
          <div>
            <h1 style={{fontSize: 22}}>{link.description}</h1>
            <p className="mono" style={{fontSize: 12, color: "var(--muted)"}}>{link.id}</p>
          </div>
        </div>
        <div style={{display: "flex", gap: 8}}>
          <StatusPill status={link.status}/>
          {isPending && (
            <button className="btn btn-accent" onClick={() => simulateMutation.mutate()} disabled={simulateMutation.isPending}>
              <I.play width="12" height="12"/> {simulateMutation.isPending ? "Simulating…" : "Simulate payment"}
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="link-stage">
          <div className="qr-wrap">
            {link.qrCode
              ? <img src={link.qrCode} width={240} height={240} alt="QR code"/>
              : <QR value={url} size={240}/>}
            <div className="qr-cap">Scan with any Solana wallet</div>
          </div>
          <div>
            <div className="summary-grid" style={{marginBottom: 16}}>
              <div style={{gridColumn: "1 / -1"}}>
                <div className="k">Amount</div>
                <div className="v amount mono">{fmtUSD(link.amount)}</div>
                <div style={{color: "var(--muted)", fontSize: 13, marginTop: 2}}>≈ {fmtToken(link.tokenAmount, link.token)} on Solana</div>
              </div>
              <div><div className="k">Status</div><div className="v"><StatusPill status={link.status}/></div></div>
              <div><div className="k">{isPaid ? "Paid on" : "Deadline"}</div>
                <div className="v mono">
                  {isPaid ? fmtDateTime(link.paid) : (link.deadline ? fmtDate(link.deadline, {month: "short", day: "numeric", year: "numeric"}) : "No deadline")}
                </div>
              </div>
              <div><div className="k">Created</div><div className="v mono">{fmtDateTime(link.created)}</div></div>
              <div><div className="k">Token</div><div className="v"><TokenChip sym={link.token}/></div></div>
            </div>

            <div className="field">
              <label>Payment link</label>
              <div className="link-row">
                <div className="url">{url}</div>
                <CopyBtn value={url} label="Copy link" className=""/>
                <button onClick={() => navigate("/pay/" + link.slug)}>
                  <I.external width="14" height="14"/> Open
                </button>
              </div>
            </div>

            {isPending && link.deadline && (
              <div className="field" style={{marginTop: 4}}>
                <label>Expires in</label>
                <Countdown to={link.deadline}/>
              </div>
            )}

            {isPaid && link.txHash && (
              <div className="field">
                <label>Transaction hash</label>
                <div className="link-row">
                  <div className="url mono">{link.txHash}</div>
                  <CopyBtn value={link.txHash} label="Copy"/>
                  <button><I.external width="14" height="14"/> Solscan</button>
                </div>
              </div>
            )}

            {link.customerNote && (
              <div className="field">
                <label>Customer note</label>
                <div style={{padding: 12, background: "var(--surface-2)", borderRadius: 10, color: "var(--muted)", fontSize: 13}}>{link.customerNote}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Public / Client Pay Page ───────────────────────────────────────────────────

function PublicPay({ slug, onExit, onPaid }) {
  const [stage, setStage] = useState("ready");
  const [wallet, setWallet] = useState(null);

  const { data: link, isLoading, isError } = useQuery({
    queryKey: ["public-link", slug],
    queryFn: () => api.publicLink(slug),
  });

  const confirmMutation = useMutation({
    mutationFn: ({ txHash }) => api.confirmPayment(slug, { txHash }),
    onSuccess: (updated) => {
      setStage("success");
      onPaid && onPaid(updated.id);
    },
  });

  if (isLoading) return (
    <div className="public-wrap">
      <div className="view-banner"><I.eye width="14" height="14"/> Viewing public payment page<button onClick={onExit}>← Back to dashboard</button></div>
      <div style={{display:"grid",placeItems:"center",height:400,color:"var(--muted)"}}>Loading…</div>
    </div>
  );

  if (isError || !link) return (
    <div className="public-wrap">
      <div className="view-banner"><button onClick={onExit}>← Back to dashboard</button></div>
      <div style={{display:"grid",placeItems:"center",height:400,color:"var(--muted)"}}>Link not found or expired.</div>
    </div>
  );

  const url = link.payUrl || `https://pay.s1lk.app/${link.slug}`;

  const startPay = () => setStage("wallets");
  const pickWallet = (w) => {
    setWallet(w);
    setStage("paying");
    const fakeTxHash = Array.from({ length: 44 }, () => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]).join("");
    setTimeout(() => confirmMutation.mutate({ txHash: fakeTxHash }), 2600);
  };

  return (
    <div className="public-wrap">
      <div className="view-banner">
        <I.eye width="14" height="14"/> Viewing public payment page
        <button onClick={onExit}>← Back to dashboard</button>
      </div>
      <div className="public-top">
        <div className="brand"><div className="sb-logo"><span>S</span></div> S1lk <b style={{color: "var(--accent)"}}>PAY</b></div>
        <div style={{color: "var(--muted)", fontSize: 12, display: "flex", alignItems: "center", gap: 6}}>
          <I.shield width="14" height="14"/> Secure checkout on Solana
        </div>
      </div>

      <div className="public-card">
        {stage === "ready" && (
          <>
            <div className="top">
              <div className="merchant-logo">{(link.businessName || "S")[0]}</div>
              <div className="biz">
                <b>{link.businessName || "S1lk Merchant"}</b>
                <small>Payment request · {link.id}</small>
              </div>
            </div>
            <div className="amt-block">
              <div className="lbl">Amount due</div>
              <div className="amt">{fmtUSD(link.amount)}</div>
              <div style={{color: "var(--muted)", fontSize: 13, marginTop: 4}}>
                ≈ {fmtToken(link.tokenAmount, link.token)} · <TokenChip sym={link.token}/>
              </div>
            </div>
            <div className="desc">{link.description}</div>
            {link.deadline && (
              <div className="deadline">
                <span>Pay before</span>
                <b>{fmtDate(link.deadline, {month: "short", day: "numeric", hour: "numeric", minute: "2-digit"})}</b>
              </div>
            )}
            <div className="pay-actions">
              <button className="btn btn-accent" onClick={startPay}>Pay with Solana wallet<I.chevron width="14" height="14"/></button>
              <div className="pay-divider">or scan to pay</div>
            </div>
            <div className="public-qr">
              {link.qrCode ? <img src={link.qrCode} width={160} height={160} alt="QR"/> : <QR value={url} size={160}/>}
              <small>Scan with Phantom, Solflare, or Backpack</small>
            </div>
            <div className="public-foot">
              <div className="secure-row"><I.shield width="12" height="12"/> Powered by S1lk PAY</div>
              <div>Need help?</div>
            </div>
          </>
        )}

        {stage === "wallets" && (
          <>
            <div className="top">
              <div className="merchant-logo">{(link.businessName || "S")[0]}</div>
              <div className="biz">
                <b>Choose a wallet</b>
                <small>Pay {fmtToken(link.tokenAmount, link.token)} to {link.businessName || "S1lk Merchant"}</small>
              </div>
            </div>
            <div style={{padding: "18px 22px 4px"}}>
              <div className="wallet-list">
                {[
                  { id: "phantom",  name: "Phantom",  icon: "P", cls: "w-phantom",  meta: "Detected on this device" },
                  { id: "solflare", name: "Solflare", icon: "S", cls: "w-solflare", meta: "Most popular" },
                  { id: "backpack", name: "Backpack", icon: "B", cls: "w-backpack", meta: "" },
                ].map(w => (
                  <button key={w.id} className="wallet-row" onClick={() => pickWallet(w)}>
                    <div className={"wallet-ico " + w.cls}>{w.icon}</div>
                    <div><div className="name">{w.name}</div>{w.meta && <div className="meta">{w.meta}</div>}</div>
                    <I.chevron className="chevron" width="14" height="14"/>
                  </button>
                ))}
              </div>
              <div style={{textAlign: "center", marginTop: 14}}>
                <button className="btn btn-ghost btn-sm" onClick={() => setStage("ready")}>Back</button>
              </div>
            </div>
            <div className="public-foot">
              <div className="secure-row"><I.shield width="12" height="12"/> No funds leave your wallet until you sign</div>
            </div>
          </>
        )}

        {stage === "paying" && (
          <>
            <div className="paying-stage">
              <div className="paying-orb">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16M14 6l6 6-6 6"/></svg>
              </div>
              <h3>Waiting for confirmation…</h3>
              <p>Approve the transaction in {wallet ? wallet.name : "your wallet"} to send {fmtToken(link.tokenAmount, link.token)}.</p>
              <div className="tx-hash">tx: confirming… · pending</div>
            </div>
            <div className="public-foot">
              <div className="secure-row"><I.shield width="12" height="12"/> Securing on Solana</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setStage("ready")}>Cancel</button>
            </div>
          </>
        )}

        {stage === "success" && (
          <>
            <div className="success-stage">
              <div className="check-orb"><I.check width="36" height="36"/></div>
              <h2>Payment complete</h2>
              <p>{fmtToken(link.tokenAmount, link.token)} sent to {link.businessName || "S1lk Merchant"}. A receipt has been emailed.</p>
              <div className="receipt">
                <div className="rrow"><span>Amount</span><b className="mono">{fmtUSD(link.amount)} ({fmtToken(link.tokenAmount, link.token)})</b></div>
                <div className="rrow"><span>To</span><b className="mono">{shortAddr(link.walletAddr || "FzKv…ax9L")}</b></div>
                <div className="rrow"><span>Network</span><b>Solana · Mainnet</b></div>
                <div className="rrow"><span>Settled</span><b className="mono">{new Date().toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit", second: "2-digit"})}</b></div>
              </div>
              <div style={{display: "flex", gap: 8, marginTop: 10}}>
                <button className="btn btn-sm"><I.download width="14" height="14"/> Receipt</button>
                <button className="btn btn-sm"><I.external width="14" height="14"/> View on Solscan</button>
              </div>
            </div>
            <div className="public-foot">
              <div className="secure-row"><I.shield width="12" height="12"/> Powered by S1lk PAY</div>
              <button className="btn btn-ghost btn-sm" onClick={onExit}>Back to merchant view</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

Object.assign(window, {
  Sidebar, Topbar,
  Dashboard, PaymentLinksList, PaymentsPage, SettingsPage,
  CreateLinkModal, LinkDetail, PublicPay,
});
