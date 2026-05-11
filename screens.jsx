/* global React, I, TOKENS, fmtAmt, fmtUSD, fmtToken, shortHash, shortAddr, uid, relTime, fmtDate, fmtDateTime, QR, TokenLogo, TokenChip, Sparkline, AreaChart, StatusPill, CopyBtn, Countdown, useNow */
const { useState, useEffect, useMemo, useRef } = React;

// =============== Seed data ===============
function seedLinks() {
  const now = Date.now();
  const day = 86400_000;
  const customers = ["Acme Co.", "Globex", "Northwind", "Initech", "Pied Piper", "Hooli", "Stark Industries", "Wayne Ent.", "Wonka Labs", "Vandelay"];
  const descs = ["Annual subscription", "Pro plan — June", "Custom integration", "Design retainer", "Audit report", "Hosting credit", "Setup fee", "Logo & brand pack", "Q2 license renewal", "Onboarding workshop"];
  const tokens = ["USDC", "USDT", "SOL"];
  const statuses = ["paid", "paid", "paid", "paid", "pending", "pending", "expired", "paid", "pending", "paid"];
  return statuses.map((status, i) => {
    const tok = tokens[i % tokens.length];
    const created = now - (i * 1.3 + 0.5) * day;
    const deadline = created + (i % 3 === 0 ? 14 : 7) * day;
    const amount = [49, 199, 1200, 89, 320, 75, 2500, 149, 480, 99][i];
    const tokAmt = tok === "SOL" ? amount / TOKENS.SOL.rate : amount;
    return {
      id: uid(),
      created,
      deadline: status === "paid" ? deadline : (status === "expired" ? now - day : deadline),
      paid: status === "paid" ? Math.min(now - 60_000, created + Math.floor(Math.random() * 0.4 * day)) : null,
      amount, // USD-equivalent
      tokenAmount: tokAmt,
      token: tok,
      description: descs[i],
      customer: customers[i],
      customerNote: i % 4 === 0 ? "Thanks for the quick turnaround!" : "",
      status,
      walletAddr: "FzKv" + Math.random().toString(36).slice(2, 10) + "Hq" + Math.random().toString(36).slice(2, 6),
      txHash: status === "paid" ? Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10) : null,
    };
  });
}

function buildDailyIncome(links) {
  const days = 14;
  const out = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400_000);
    const dayMs = d.getTime();
    let total = 0;
    for (const l of links) {
      if (l.status !== "paid") continue;
      const t = l.paid || l.created;
      if (t >= dayMs && t < dayMs + 86400_000) total += l.amount;
    }
    // ensure non-zero shape for chart
    out.push({ date: d, total });
  }
  // sprinkle some baseline if all zeros
  if (out.every(x => x.total === 0)) {
    out.forEach((x, i) => x.total = 80 + Math.sin(i / 2) * 40 + Math.random() * 60);
  }
  return out;
}

// =============== Sidebar ===============
function Sidebar({ route, setRoute, links, style }) {
  const pending = links.filter(l => l.status === "pending").length;
  const items = [
    { id: "home", label: "Dashboard", icon: <I.home className="sb-icon"/> },
    { id: "links", label: "Payment Links", icon: <I.link className="sb-icon"/>, badge: pending || null },
    { id: "payments", label: "Payments", icon: <I.receipt className="sb-icon"/> },
    { id: "wallet", label: "Wallet", icon: <I.wallet className="sb-icon"/> },
    { id: "withdraw", label: "Withdraw", icon: <I.send className="sb-icon"/> },
    { id: "settings", label: "Settings", icon: <I.cog className="sb-icon"/> },
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
          <button key={it.id}
            className={"sb-item" + (route === it.id ? " active" : "")}
            onClick={() => setRoute(it.id)}
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
        <div className="sb-account">
          <div className="sb-avatar">SM</div>
          <div className="sb-account-text">
            <b>Sandbox Merchant</b>
            <span>sandbox@s1lk.pay</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

// =============== Topbar ===============
function Topbar({ crumbs, onCreate, onViewClient, sidebarStyle, setSidebarStyle }) {
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

// =============== Dashboard ===============
function Dashboard({ links, onCreate, onOpenLink }) {
  const totalReceived = links.filter(l => l.status === "paid").reduce((a, l) => a + l.amount, 0);
  const pending = links.filter(l => l.status === "pending");
  const paid = links.filter(l => l.status === "paid");
  const pendingAmt = pending.reduce((a, l) => a + l.amount, 0);
  const successRate = links.length ? Math.round(paid.length / links.filter(l => l.status !== "pending").length * 100) : 0;

  const daily = useMemo(() => buildDailyIncome(links), [links]);
  const labels = daily.map(d => fmtDate(d.date, { month: "short", day: "numeric" }));
  const values = daily.map(d => d.total);
  const series = { labels, values };

  const spark1 = values.slice(-10);
  const spark2 = [4, 6, 5, 9, 7, 11, 9, 12, 10, 14];
  const spark3 = [12, 10, 11, 9, 10, 8, 9, 7, 8, 6];

  const recent = [...links].sort((a, b) => (b.paid || b.created) - (a.paid || a.created)).slice(0, 6);

  return (
    <>
      <div className="page-h">
        <div>
          <h1>Welcome back, Sandbox</h1>
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
          <div className="delta up"><I.arrowUp width="12" height="12"/> +18.4% vs last 14d</div>
          <div className="kpi-spark"><Sparkline data={spark1}/></div>
        </div>
        <div className="card kpi">
          <div className="lbl">Successful payments</div>
          <div className="val">{paid.length}<small>of {links.length}</small></div>
          <div className="delta up"><I.arrowUp width="12" height="12"/> {successRate}% success rate</div>
          <div className="kpi-spark"><Sparkline data={spark2}/></div>
        </div>
        <div className="card kpi">
          <div className="lbl">Pending</div>
          <div className="val">{fmtUSD(pendingAmt)}</div>
          <div className="delta flat">{pending.length} awaiting payment</div>
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
            <TokenBreakdown links={links}/>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <div><h3>Recent activity</h3><div className="sub">Latest payment links and transactions</div></div>
          <button className="btn btn-sm" onClick={() => onOpenLink && onOpenLink("__all__")}>View all</button>
        </div>
        <table className="tbl">
          <thead><tr>
            <th>Status</th><th>Description</th><th>Customer</th><th>Amount</th><th>Token</th><th>Date</th><th></th>
          </tr></thead>
          <tbody>
            {recent.map(l => (
              <tr key={l.id} onClick={() => onOpenLink(l)}>
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

function TokenBreakdown({ links }) {
  const totals = { USDC: 0, USDT: 0, SOL: 0 };
  for (const l of links) if (l.status === "paid") totals[l.token] += l.amount;
  const total = totals.USDC + totals.USDT + totals.SOL || 1;
  return (
    <div style={{display: "flex", flexDirection: "column", gap: 14}}>
      <div style={{display: "flex", height: 10, borderRadius: 999, overflow: "hidden", background: "var(--surface-2)"}}>
        <div style={{flex: totals.USDC, background: "oklch(0.58 0.16 250)"}}/>
        <div style={{flex: totals.USDT, background: "oklch(0.55 0.12 165)"}}/>
        <div style={{flex: totals.SOL,  background: "oklch(0.65 0.22 320)"}}/>
      </div>
      {["USDC", "USDT", "SOL"].map(sym => (
        <div key={sym} style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10}}>
          <div style={{display: "flex", alignItems: "center", gap: 10}}>
            <TokenLogo sym={sym}/>
            <div>
              <div style={{fontWeight: 500, fontSize: 13.5}}>{sym}</div>
              <div style={{fontSize: 12, color: "var(--muted)"}}>{TOKENS[sym].name}</div>
            </div>
          </div>
          <div style={{textAlign: "right"}}>
            <div className="mono" style={{fontWeight: 500, fontVariantNumeric: "tabular-nums"}}>{fmtUSD(totals[sym])}</div>
            <div style={{fontSize: 12, color: "var(--muted)"}}>{Math.round(totals[sym] / total * 100)}%</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// =============== Payment Links list ===============
function PaymentLinksList({ links, onCreate, onOpenLink }) {
  const [filter, setFilter] = useState("all");
  const [tokFilter, setTokFilter] = useState("all");
  const filtered = links.filter(l =>
    (filter === "all" || l.status === filter) &&
    (tokFilter === "all" || l.token === tokFilter)
  );
  return (
    <>
      <div className="page-h">
        <div>
          <h1>Payment links</h1>
          <p>Manage all your generated payment links and their status.</p>
        </div>
        <div style={{display: "flex", gap: 8}}>
          <button className="btn"><I.download width="14" height="14"/> Export CSV</button>
          <button className="btn btn-primary" onClick={onCreate}><I.plus width="14" height="14"/> Create link</button>
        </div>
      </div>

      <div className="filter-bar">
        <button className={"fchip" + (filter === "all" ? " active" : "")} onClick={() => setFilter("all")}>All <span className="muted">{links.length}</span></button>
        <button className={"fchip" + (filter === "pending" ? " active" : "")} onClick={() => setFilter("pending")}>Pending <span className="muted">{links.filter(l => l.status === "pending").length}</span></button>
        <button className={"fchip" + (filter === "paid" ? " active" : "")} onClick={() => setFilter("paid")}>Paid <span className="muted">{links.filter(l => l.status === "paid").length}</span></button>
        <button className={"fchip" + (filter === "expired" ? " active" : "")} onClick={() => setFilter("expired")}>Expired <span className="muted">{links.filter(l => l.status === "expired").length}</span></button>
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
            {filtered.map(l => (
              <tr key={l.id} onClick={() => onOpenLink(l)}>
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
                  {l.status === "pending" ? <Countdown to={l.deadline} compact/> :
                   l.status === "expired" ? "Expired " + relTime(l.deadline) :
                   l.paid ? "Paid " + relTime(l.paid) : fmtDate(l.deadline)}
                </td>
                <td className="right">
                  <button className="btn btn-sm" onClick={(e) => { e.stopPropagation(); onOpenLink(l); }}>
                    Open <I.chevron width="12" height="12"/>
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="7"><div className="empty"><h4>No links match these filters</h4>Try clearing some filters or create a new payment link.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

// =============== Payments analytics page ===============
function PaymentsPage({ links }) {
  const paid = links.filter(l => l.status === "paid");
  const pending = links.filter(l => l.status === "pending");
  const totalIncome = paid.reduce((a, l) => a + l.amount, 0);
  const daily = useMemo(() => buildDailyIncome(links), [links]);
  const labels = daily.map(d => fmtDate(d.date, { month: "short", day: "numeric" }));
  const values = daily.map(d => d.total);
  return (
    <>
      <div className="page-h">
        <div>
          <h1>Payments</h1>
          <p>Income overview across all payment links.</p>
        </div>
        <div style={{display: "flex", gap: 8}}>
          <button className="btn">Last 14 days <I.chevron width="12" height="12"/></button>
          <button className="btn"><I.download width="14" height="14"/> Export</button>
        </div>
      </div>

      <div className="kpi-row">
        <div className="card kpi">
          <div className="lbl">Total income</div>
          <div className="val">{fmtUSD(totalIncome)}</div>
          <div className="delta up"><I.arrowUp width="12" height="12"/> +12.6%</div>
        </div>
        <div className="card kpi">
          <div className="lbl">Successful payments</div>
          <div className="val">{paid.length}</div>
          <div className="delta up">Across {paid.length + pending.length} links</div>
        </div>
        <div className="card kpi">
          <div className="lbl">Pending payments</div>
          <div className="val">{pending.length}</div>
          <div className="delta flat">{fmtUSD(pending.reduce((a, l) => a + l.amount, 0))} awaiting</div>
        </div>
        <div className="card kpi">
          <div className="lbl">Avg payment</div>
          <div className="val">{fmtUSD(paid.length ? totalIncome / paid.length : 0)}</div>
          <div className="delta up"><I.arrowUp width="12" height="12"/> +$4.20</div>
        </div>
      </div>

      <div className="grid-2" style={{marginBottom: 18}}>
        <div className="card">
          <div className="card-h"><div><h3>Income by day</h3><div className="sub">Last 14 days</div></div></div>
          <div className="chart-wrap"><AreaChart series={{labels, values}} height={220}/></div>
        </div>
        <div className="card">
          <div className="card-h"><div><h3>Income by token</h3></div></div>
          <div className="card-pad"><TokenBreakdown links={links}/></div>
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <div><h3>All payments</h3><div className="sub">{paid.length} successful transactions</div></div>
        </div>
        <table className="tbl">
          <thead><tr>
            <th>Tx hash</th><th>Description</th><th>Customer</th><th>Amount</th><th>Token</th><th>Paid on</th>
          </tr></thead>
          <tbody>
            {paid.map(l => (
              <tr key={l.id}>
                <td className="mono" style={{fontSize: 12.5}}>{shortHash(l.txHash || "abcdef1234567890")}</td>
                <td>{l.description}</td>
                <td className="muted">{l.customer}</td>
                <td className="amt">{fmtUSD(l.amount)}</td>
                <td><TokenChip sym={l.token}/></td>
                <td className="muted">{fmtDateTime(l.paid)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// =============== Settings ===============
function SettingsPage({ tweak, setTweak }) {
  const [tab, setTab] = useState("business");
  const [autoConvert, setAutoConvert] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [webhooks, setWebhooks] = useState(false);
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
              <div className="kv-list">
                <div className="kv-row"><div className="k">Business name<small>Shown to customers on payment pages.</small></div><div className="v">Sandbox Merchant</div><button className="btn btn-sm">Edit</button></div>
                <div className="kv-row"><div className="k">Logo</div><div className="v"><div className="merchant-logo" style={{width: 36, height: 36, fontSize: 14}}>S</div></div><button className="btn btn-sm">Replace</button></div>
                <div className="kv-row"><div className="k">Support email</div><div className="v">support@sandbox.s1lk.pay</div><button className="btn btn-sm">Edit</button></div>
                <div className="kv-row"><div className="k">Website</div><div className="v muted">Not set</div><button className="btn btn-sm">Add</button></div>
              </div>
            )}
            {tab === "wallet" && (
              <div className="kv-list">
                <div className="kv-row"><div className="k">Payout wallet<small>Funds settle directly to this Solana address.</small></div><div className="v mono">7Fk…q2pN</div><button className="btn btn-sm">Change</button></div>
                <div className="kv-row"><div className="k">Auto-convert to USDC<small>Convert SOL payments to USDC on receipt.</small></div><div className="v">{autoConvert ? "Enabled" : "Disabled"}</div><button className={"toggle" + (autoConvert ? " on" : "")} onClick={() => setAutoConvert(v => !v)}/></div>
                <div className="kv-row"><div className="k">Network<small>Mainnet — Solana</small></div><div className="v">Mainnet</div><button className="btn btn-sm">Switch</button></div>
              </div>
            )}
            {tab === "tokens" && (
              <div className="kv-list">
                {["USDC", "USDT", "SOL"].map(sym => (
                  <div key={sym} className="kv-row">
                    <div className="k" style={{display: "flex", alignItems: "center", gap: 10}}>
                      <TokenLogo sym={sym} size={24}/>
                      <div>{TOKENS[sym].name}<small>{sym} on Solana</small></div>
                    </div>
                    <div className="v">Accepted</div>
                    <button className="toggle on"/>
                  </div>
                ))}
              </div>
            )}
            {tab === "notifications" && (
              <div className="kv-list">
                <div className="kv-row"><div className="k">Email on payment<small>Receive an email when a link is paid.</small></div><div className="v">{emailNotif ? "On" : "Off"}</div><button className={"toggle" + (emailNotif ? " on" : "")} onClick={() => setEmailNotif(v => !v)}/></div>
                <div className="kv-row"><div className="k">Webhooks<small>POST to your endpoint on payment events.</small></div><div className="v">{webhooks ? "On" : "Off"}</div><button className={"toggle" + (webhooks ? " on" : "")} onClick={() => setWebhooks(v => !v)}/></div>
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

// =============== Create Link Modal ===============
function CreateLinkModal({ onClose, onCreate }) {
  const [step, setStep] = useState(0); // 0 form, 1 review
  const [amount, setAmount] = useState("199.00");
  const [token, setToken] = useState("USDC");
  const [deadlineDays, setDeadlineDays] = useState(7);
  const [businessName, setBusinessName] = useState("Sandbox Merchant");
  const [description, setDescription] = useState("");
  const [customerNote, setCustomerNote] = useState("");

  const amt = parseFloat(amount) || 0;
  const tokAmt = token === "SOL" ? amt / TOKENS.SOL.rate : amt;
  const deadline = Date.now() + deadlineDays * 86400_000;

  const submit = () => {
    onCreate({
      id: uid(),
      created: Date.now(),
      deadline,
      paid: null,
      amount: amt,
      tokenAmount: tokAmt,
      token,
      description: description || "Payment request",
      customer: "—",
      customerNote,
      businessName,
      status: "pending",
      walletAddr: "FzKv" + Math.random().toString(36).slice(2, 10),
      txHash: null,
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
                    ≈ {fmtToken(tokAmt, "SOL")} at current rate ($ {TOKENS.SOL.rate.toFixed(2)}/SOL)
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
                <label>Business name <small>optional · shown to customer</small></label>
                <input className="input" value={businessName} onChange={e => setBusinessName(e.target.value)}/>
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
                <div style={{fontSize: 40, fontWeight: 600, fontFamily: "Geist Mono", letterSpacing: "-0.02em"}}>
                  {fmtUSD(amt)}
                </div>
                <div style={{color: "var(--muted)", fontSize: 13, marginTop: 4}}>
                  ≈ {fmtToken(tokAmt, token)} on Solana
                </div>
              </div>
              <div className="summary-grid">
                <div><div className="k">Token</div><div className="v"><TokenChip sym={token}/></div></div>
                <div><div className="k">Network</div><div className="v">Solana · Mainnet</div></div>
                <div><div className="k">Business</div><div className="v">{businessName || "—"}</div></div>
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
              <button className="btn btn-accent" onClick={submit}>
                Generate payment link <I.chevron width="14" height="14"/>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// =============== Link Created / Detail screen ===============
function LinkDetail({ link, onBack, onSimulate }) {
  const url = "https://pay.s1lk.app/" + link.id;
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
          {isPending && <button className="btn btn-accent" onClick={onSimulate}><I.play width="12" height="12"/> Simulate payment</button>}
        </div>
      </div>

      <div className="card">
        <div className="link-stage">
          <div className="qr-wrap">
            <QR value={url} size={240}/>
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
                <div className="v mono">{isPaid ? fmtDateTime(link.paid) : fmtDate(link.deadline, {month: "short", day: "numeric", year: "numeric"})}</div>
              </div>
              <div><div className="k">Created</div><div className="v mono">{fmtDateTime(link.created)}</div></div>
              <div><div className="k">Token</div><div className="v"><TokenChip sym={link.token}/></div></div>
            </div>

            <div className="field">
              <label>Payment link</label>
              <div className="link-row">
                <div className="url">{url}</div>
                <CopyBtn value={url} label="Copy link" className="" />
                <button onClick={() => window.dispatchEvent(new CustomEvent("s1lk:open-public", { detail: { link } }))}>
                  <I.external width="14" height="14"/> Open
                </button>
              </div>
            </div>

            {isPending && (
              <div className="field" style={{marginTop: 4}}>
                <label>Expires in</label>
                <Countdown to={link.deadline}/>
              </div>
            )}

            {isPaid && (
              <div className="field">
                <label>Transaction hash</label>
                <div className="link-row">
                  <div className="url mono">{link.txHash || "5z9f8…2k1p"}xN3hQ…ax9Lp</div>
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

// =============== Public / Client Pay Page ===============
function PublicPay({ link, onExit, onPaid }) {
  const [stage, setStage] = useState("ready"); // ready, wallets, paying, success
  const [wallet, setWallet] = useState(null);
  const now = useNow(1000);
  const url = "https://pay.s1lk.app/" + link.id;

  const startPay = () => setStage("wallets");
  const pickWallet = (w) => {
    setWallet(w);
    setStage("paying");
    setTimeout(() => {
      setStage("success");
      onPaid && onPaid(link.id);
    }, 2600);
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
                <b>{link.businessName || "Sandbox Merchant"}</b>
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
            <div className="deadline">
              <span>Pay before</span>
              <b>{fmtDate(link.deadline, {month: "short", day: "numeric", hour: "numeric", minute: "2-digit"})}</b>
            </div>
            <div className="pay-actions">
              <button className="btn btn-accent" onClick={startPay}>
                Pay with Solana wallet
                <I.chevron width="14" height="14"/>
              </button>
              <div className="pay-divider">or scan to pay</div>
            </div>
            <div className="public-qr">
              <QR value={url} size={160}/>
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
                <small>Pay {fmtToken(link.tokenAmount, link.token)} to {link.businessName || "Sandbox Merchant"}</small>
              </div>
            </div>
            <div style={{padding: "18px 22px 4px"}}>
              <div className="wallet-list">
                {[
                  { id: "phantom", name: "Phantom", icon: "P", cls: "w-phantom", meta: "Detected on this device" },
                  { id: "solflare", name: "Solflare", icon: "S", cls: "w-solflare", meta: "Most popular" },
                  { id: "backpack", name: "Backpack", icon: "B", cls: "w-backpack", meta: "" },
                ].map(w => (
                  <button key={w.id} className="wallet-row" onClick={() => pickWallet(w)}>
                    <div className={"wallet-ico " + w.cls}>{w.icon}</div>
                    <div>
                      <div className="name">{w.name}</div>
                      {w.meta && <div className="meta">{w.meta}</div>}
                    </div>
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
              <div className="tx-hash">tx: 5z9f8gQpW2eR…3hQax9Lp · pending</div>
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
              <p>{fmtToken(link.tokenAmount, link.token)} sent to {link.businessName || "Sandbox Merchant"}. A receipt has been emailed.</p>
              <div className="receipt">
                <div className="rrow"><span>Amount</span><b className="mono">{fmtUSD(link.amount)} ({fmtToken(link.tokenAmount, link.token)})</b></div>
                <div className="rrow"><span>To</span><b className="mono">{shortAddr(link.walletAddr || "FzKv2hQpw9ax9Lp")}</b></div>
                <div className="rrow"><span>Transaction</span><b className="mono">5z9f…ax9Lp</b></div>
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
  seedLinks, buildDailyIncome,
  Sidebar, Topbar,
  Dashboard, PaymentLinksList, PaymentsPage, SettingsPage,
  CreateLinkModal, LinkDetail, PublicPay,
});
