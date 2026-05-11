/* global React */
const { useState, useEffect, useRef, useMemo } = React;

// =============== Icons (inline SVG) ===============
const I = {
  home: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>),
  link: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 14a4 4 0 005.66 0l3-3a4 4 0 10-5.66-5.66L11.5 7"/><path d="M14 10a4 4 0 00-5.66 0l-3 3a4 4 0 105.66 5.66L12.5 17"/></svg>),
  plus: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14"/></svg>),
  receipt: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 3v18l2-1.5L9 21l2-1.5L13 21l2-1.5L17 21l2-1.5V3l-2 1.5L15 3l-2 1.5L11 3 9 4.5 7 3z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>),
  cog: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 110-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1A2 2 0 117 5l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V3a2 2 0 114 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1H21a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z"/></svg>),
  search: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>),
  bell: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 004 0"/></svg>),
  help: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.5 2.5 0 015 0c0 2-2.5 2-2.5 4"/><path d="M12 17h.01"/></svg>),
  arrowUp: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12l7-7 7 7M12 19V5"/></svg>),
  arrowDown: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 12l-7 7-7-7M12 5v14"/></svg>),
  copy: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg>),
  check: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12l5 5L20 7"/></svg>),
  external: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M19 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h5"/></svg>),
  close: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 6L6 18M6 6l12 12"/></svg>),
  chevron: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 6l6 6-6 6"/></svg>),
  shield: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
  eye: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>),
  filter: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 6h18M6 12h12M10 18h4"/></svg>),
  download: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 4v12M6 10l6 6 6-6"/><path d="M4 20h16"/></svg>),
  more: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>),
  play: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M7 5l12 7-12 7z"/></svg>),
  wallet: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 7a2 2 0 012-2h12a2 2 0 012 2v2"/><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M21 13h-3a2 2 0 100 4h3"/></svg>),
  send: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>),
  arrowLeft: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>),
  arrowRight: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M12 5l7 7-7 7"/></svg>),
  lock: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>),
  warn: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18h.01"/></svg>),
  card: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>),
  swap: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7 4v16M7 4l-3 3M7 4l3 3"/><path d="M17 20V4M17 20l-3-3M17 20l3-3"/></svg>),
  qr: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v3M14 21h7"/></svg>),
};

// =============== Helpers ===============
const TOKENS = {
  USDC: { sym: "USDC", name: "USD Coin",       chain: "Solana", rate: 1.00 },
  USDT: { sym: "USDT", name: "Tether USD",     chain: "Solana", rate: 1.00 },
  SOL:  { sym: "SOL",  name: "Solana",         chain: "Solana", rate: 152.40 },
  KZTE: { sym: "KZTE", name: "EVO Stablecoin", chain: "Solana", rate: 0.00218 },
  PEPE: { sym: "PEPE", name: "Pepe",           chain: "Solana", rate: 0.0000094 },
};

function fmtAmt(n, decimals = 2) {
  if (!isFinite(n)) return "0";
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function fmtUSD(n) { return "$" + fmtAmt(n, 2); }
function fmtToken(n, sym) {
  const d = sym === "SOL" ? 3 : 2;
  return fmtAmt(n, d) + " " + sym;
}
function shortHash(s) {
  if (!s) return "";
  return s.slice(0, 4) + "…" + s.slice(-4);
}
function shortAddr(s) {
  if (!s) return "";
  return s.slice(0, 4) + "…" + s.slice(-4);
}
function uid(prefix = "pl") {
  return prefix + "_" + Math.random().toString(36).slice(2, 10);
}
function hash32(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s ^ (s >>> 15), 2246822519) + 0x9e3779b9) >>> 0;
    s ^= s >>> 13;
    return ((s >>> 0) % 1_000_000) / 1_000_000;
  };
}
function relTime(d) {
  const ms = Date.now() - new Date(d).getTime();
  const s = Math.round(ms / 1000);
  if (s < 60) return s + "s ago";
  const m = Math.round(s / 60);
  if (m < 60) return m + "m ago";
  const h = Math.round(m / 60);
  if (h < 48) return h + "h ago";
  const dd = Math.round(h / 24);
  return dd + "d ago";
}
function fmtDate(d, opts = {}) {
  const o = { month: "short", day: "numeric", ...opts };
  return new Date(d).toLocaleDateString("en-US", o);
}
function fmtDateTime(d) {
  return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

// =============== Fake QR ===============
function QR({ value, size = 240, color = "#0a0a0a" }) {
  const N = 29;
  const cell = size / N;
  const cells = useMemo(() => {
    const grid = Array.from({ length: N }, () => Array(N).fill(false));
    // finder patterns at three corners
    const draw = (r, c) => {
      for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) {
        const onBorder = i === 0 || i === 6 || j === 0 || j === 6;
        const inner = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        if (onBorder || inner) grid[r + i][c + j] = true;
      }
    };
    draw(0, 0); draw(0, N - 7); draw(N - 7, 0);
    // alignment pattern (bottom right area)
    for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
      const onBorder = i === 0 || i === 4 || j === 0 || j === 4;
      const inner = i === 2 && j === 2;
      if (onBorder || inner) grid[N - 9 + i][N - 9 + j] = true;
    }
    // timing patterns
    for (let i = 8; i < N - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }
    // data fill from hash
    const rand = rng(hash32(value || "x"));
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const inFinder = (r < 8 && c < 8) || (r < 8 && c >= N - 8) || (r >= N - 8 && c < 8);
      const inAlign = r >= N - 9 && c >= N - 9;
      if (inFinder || inAlign) continue;
      if (r === 6 || c === 6) continue;
      grid[r][c] = rand() > 0.50;
    }
    return grid;
  }, [value]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} shapeRendering="crispEdges" aria-label="QR code">
      <rect width={size} height={size} fill="#fff"/>
      {cells.map((row, r) => row.map((v, c) => v ? (
        <rect key={r + "_" + c} x={c * cell + 0.5} y={r * cell + 0.5} width={cell - 0.5} height={cell - 0.5} fill={color} rx={cell * 0.18}/>
      ) : null))}
    </svg>
  );
}

// =============== Token UI ===============
function TokenLogo({ sym, size }) {
  const map = { USDC: "$", USDT: "₮", SOL: "◎", KZTE: "₸", PEPE: "P" };
  const style = size ? { width: size, height: size, fontSize: Math.round(size * 0.45), flex: `0 0 ${size}px` } : {};
  return <span className={"tk-logo tk-" + sym} style={style}>{map[sym] || sym[0]}</span>;
}
function TokenChip({ sym }) {
  return (<span className="tk"><TokenLogo sym={sym}/>{sym}</span>);
}

// =============== Sparkline / Chart ===============
function Sparkline({ data, color = "var(--accent)", height = 32, width = 120 }) {
  if (!data || !data.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const pts = data.map((v, i) => [i * stepX, height - ((v - min) / range) * (height - 4) - 2]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const area = d + ` L ${width.toFixed(1)},${height} L 0,${height} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" width="100%" height={height}>
      <path d={area} fill={color} opacity="0.12"/>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

function AreaChart({ series, height = 240 }) {
  // series: { labels: [], values: [], values2: [] }
  const W = 720, H = height;
  const padL = 36, padR = 12, padT = 14, padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const vals = series.values;
  const max = Math.max(...vals, 1);
  const min = 0;
  const stepX = innerW / (vals.length - 1);
  const xs = vals.map((_, i) => padL + i * stepX);
  const ys = vals.map(v => padT + innerH - ((v - min) / (max - min || 1)) * innerH);

  // smooth-ish
  const linePath = xs.map((x, i) => {
    if (i === 0) return `M ${x},${ys[i]}`;
    const px = xs[i - 1], py = ys[i - 1];
    const cx1 = px + stepX / 2, cy1 = py;
    const cx2 = x - stepX / 2, cy2 = ys[i];
    return `C ${cx1},${cy1} ${cx2},${cy2} ${x},${ys[i]}`;
  }).join(" ");
  const area = linePath + ` L ${xs[xs.length - 1]},${padT + innerH} L ${xs[0]},${padT + innerH} Z`;

  // grid lines (4)
  const grid = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    y: padT + t * innerH,
    val: max - t * (max - min),
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img">
      <defs>
        <linearGradient id="areagrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {grid.map((g, i) => (
        <g key={i}>
          <line x1={padL} y1={g.y} x2={W - padR} y2={g.y} stroke="var(--line-2)" strokeWidth="1" strokeDasharray={i === grid.length - 1 ? "0" : "2,3"}/>
          <text x={padL - 8} y={g.y + 4} fontSize="10" textAnchor="end" fill="var(--muted)" fontFamily="Geist Mono">
            {g.val >= 1000 ? (g.val / 1000).toFixed(1) + "k" : g.val.toFixed(0)}
          </text>
        </g>
      ))}
      <path d={area} fill="url(#areagrad)"/>
      <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2"/>
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r={i === xs.length - 1 ? 4 : 0} fill="var(--accent)" stroke="white" strokeWidth="2"/>
      ))}
      {series.labels.map((l, i) => (i % 2 === 0) ? (
        <text key={i} x={xs[i]} y={H - 8} fontSize="10.5" textAnchor="middle" fill="var(--muted)" fontFamily="Geist">{l}</text>
      ) : null)}
    </svg>
  );
}

// =============== Pill / Buttons ===============
function StatusPill({ status }) {
  const map = {
    paid: { cls: "paid", label: "Paid" },
    pending: { cls: "pending", label: "Awaiting payment" },
    expired: { cls: "expired", label: "Expired" },
    failed: { cls: "failed", label: "Failed" },
  };
  const s = map[status] || map.pending;
  return <span className={"pill " + s.cls}>{s.label}</span>;
}

function CopyBtn({ value, label = "Copy", className = "btn btn-sm", onCopy }) {
  const [done, setDone] = useState(false);
  return (
    <button className={className} onClick={() => {
      try { navigator.clipboard?.writeText(value); } catch {}
      setDone(true);
      onCopy && onCopy();
      setTimeout(() => setDone(false), 1400);
    }}>
      {done ? <I.check width="14" height="14"/> : <I.copy width="14" height="14"/>}
      {done ? "Copied" : label}
    </button>
  );
}

// =============== Countdown ===============
function useNow(intervalMs = 1000) {
  const [n, setN] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setN(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return n;
}
function Countdown({ to, compact }) {
  const now = useNow(1000);
  const ms = Math.max(0, new Date(to).getTime() - now);
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (x) => x.toString().padStart(2, "0");
  if (compact) return <span className="mono">{d > 0 ? `${d}d ` : ""}{pad(h)}:{pad(m)}:{pad(sec)}</span>;
  return (
    <div className="countdown">
      <div className="seg"><b>{d}</b><small>days</small></div>
      <div className="sep">:</div>
      <div className="seg"><b>{pad(h)}</b><small>hrs</small></div>
      <div className="sep">:</div>
      <div className="seg"><b>{pad(m)}</b><small>min</small></div>
      <div className="sep">:</div>
      <div className="seg"><b>{pad(sec)}</b><small>sec</small></div>
    </div>
  );
}

// =============== Toast ===============
function useToasts() {
  const [items, setItems] = useState([]);
  const push = (msg) => {
    const id = Math.random().toString(36).slice(2);
    setItems(x => [...x, { id, msg }]);
    setTimeout(() => setItems(x => x.filter(t => t.id !== id)), 2400);
  };
  const node = (
    <div className="toast-wrap">
      {items.map(t => <div key={t.id} className="toast"><I.check width="14" height="14"/>{t.msg}</div>)}
    </div>
  );
  return [node, push];
}

Object.assign(window, {
  I, TOKENS,
  fmtAmt, fmtUSD, fmtToken, shortHash, shortAddr, uid, hash32, rng,
  relTime, fmtDate, fmtDateTime,
  QR, TokenLogo, TokenChip, Sparkline, AreaChart,
  StatusPill, CopyBtn, Countdown, useNow, useToasts,
});
