import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');

  .slk-root {
    --cream: #F7F4EF;
    --ink: #0F0E0C;
    --ink2: #2C2A25;
    --muted: #7A7468;
    --border: rgba(15,14,12,0.1);
    --red: #D44B2A;
    --red-light: #FAF0EC;
    --green: #1A7A52;
    --green-light: #E8F5EF;
    --card-bg: #FFFFFF;
    --surface: #F0EDE8;
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--ink);
    font-size: 16px;
    line-height: 1.6;
    overflow-x: hidden;
    box-sizing: border-box;
  }
  .slk-root *, .slk-root *::before, .slk-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* NAV */
  .slk-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.25rem 3rem;
    background: rgba(247,244,239,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 0.5px solid var(--border);
  }
  .slk-logo {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800;
    letter-spacing: -0.02em; text-decoration: none; color: var(--ink);
    background: none; border: none; cursor: pointer;
  }
  .slk-logo-mark {
    width: 34px; height: 34px; border-radius: 8px;
    background: var(--ink); color: var(--cream);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700;
  }
  .slk-logo-pay { color: var(--red); }
  .slk-nav-links { display: flex; align-items: center; gap: 2rem; }
  .slk-nav-links a { text-decoration: none; color: var(--muted); font-size: 14px; transition: color 0.2s; }
  .slk-nav-links a:hover { color: var(--ink); }
  .slk-nav-cta {
    background: var(--ink); color: var(--cream);
    padding: 0.55rem 1.4rem; border-radius: 100px;
    font-size: 14px; font-weight: 500;
    text-decoration: none; transition: background 0.2s; border: none; cursor: pointer;
  }
  .slk-nav-cta:hover { background: var(--red); }

  /* HERO */
  .slk-hero {
    padding: 10rem 3rem 5rem;
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;
  }
  .slk-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--surface); border-radius: 100px;
    padding: 0.35rem 1rem; font-size: 12px; font-weight: 500;
    color: var(--muted); margin-bottom: 1.5rem;
    border: 0.5px solid var(--border);
  }
  .slk-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); }
  .slk-hero-h1 {
    font-family: 'Syne', sans-serif; font-size: 4.2rem;
    font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 1.5rem;
  }
  .slk-hero-h1 em { font-style: normal; color: var(--red); }
  .slk-hero-p { font-size: 1.05rem; color: var(--muted); line-height: 1.7; margin-bottom: 2.5rem; max-width: 440px; }
  .slk-hero-actions { display: flex; align-items: center; gap: 1rem; }
  .slk-btn-primary {
    background: var(--red); color: white;
    padding: 0.8rem 2rem; border-radius: 100px;
    font-size: 15px; font-weight: 500;
    text-decoration: none; transition: all 0.2s; border: none; cursor: pointer; display: inline-block;
  }
  .slk-btn-primary:hover { background: #B83E22; transform: translateY(-1px); }
  .slk-btn-ghost {
    color: var(--ink); font-size: 15px;
    text-decoration: none; display: flex; align-items: center; gap: 6px;
    padding: 0.8rem 1rem; background: none; border: none; cursor: pointer;
  }
  .slk-btn-ghost:hover { color: var(--red); }

  /* HERO VISUAL */
  .slk-hero-visual { position: relative; }
  .slk-dashboard-card {
    background: var(--card-bg); border: 0.5px solid var(--border);
    border-radius: 20px; padding: 1.5rem;
    box-shadow: 0 4px 40px rgba(0,0,0,0.08);
  }
  .slk-dash-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
  .slk-dash-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600; color: var(--ink); }
  .slk-dash-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .slk-new-link-btn {
    background: var(--red); color: white;
    padding: 0.35rem 0.9rem; border-radius: 100px;
    font-size: 12px; font-weight: 500; border: none; cursor: pointer;
  }
  .slk-metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 1rem; }
  .slk-metric { background: var(--surface); border-radius: 12px; padding: 0.875rem 1rem; }
  .slk-metric-label { font-size: 11px; color: var(--muted); margin-bottom: 6px; }
  .slk-metric-value { font-family: 'DM Mono', monospace; font-size: 1.5rem; font-weight: 500; letter-spacing: -0.02em; }
  .slk-metric-tag { font-size: 11px; margin-top: 4px; font-weight: 500; }
  .slk-tag-up { color: var(--green); }
  .slk-tag-info { color: var(--muted); }
  .slk-mini-chart { height: 32px; margin-top: 8px; display: flex; align-items: flex-end; gap: 2px; }
  .slk-mini-bar { flex: 1; border-radius: 2px 2px 0 0; background: var(--red); opacity: 0.15; }
  .slk-mini-bar.slk-active { opacity: 0.9; }

  .slk-token-row { display: flex; align-items: center; gap: 10px; padding: 0.6rem 0; border-bottom: 0.5px solid var(--border); }
  .slk-token-row:last-child { border-bottom: none; }
  .slk-token-icon {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--surface); display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500;
  }
  .slk-token-name { flex: 1; font-size: 13px; }
  .slk-token-name small { display: block; font-size: 11px; color: var(--muted); }
  .slk-token-amount { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500; }
  .slk-token-pct { font-size: 11px; color: var(--muted); text-align: right; }

  @keyframes slkFloatPill { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  .slk-pill-float {
    position: absolute; top: -1rem; right: -1.5rem;
    background: var(--green); color: white;
    border-radius: 100px; padding: 0.5rem 1rem;
    font-size: 13px; font-weight: 500;
    display: flex; align-items: center; gap: 6px;
    box-shadow: 0 4px 16px rgba(26,122,82,0.3);
    animation: slkFloatPill 3s ease-in-out infinite;
  }
  .slk-pill-float2 {
    position: absolute; bottom: -1rem; left: -1.5rem;
    background: var(--card-bg); border: 0.5px solid var(--border);
    border-radius: 100px; padding: 0.5rem 1rem;
    font-size: 12px; color: var(--ink);
    display: flex; align-items: center; gap: 6px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    animation: slkFloatPill 3s ease-in-out 1.5s infinite;
  }
  .slk-settle-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); }

  /* STATS */
  .slk-stats-strip {
    border-top: 0.5px solid var(--border); border-bottom: 0.5px solid var(--border);
    background: var(--surface); padding: 2rem 3rem;
    display: grid; grid-template-columns: repeat(4, 1fr);
  }
  .slk-stat-item { text-align: center; padding: 0 1rem; border-right: 0.5px solid var(--border); }
  .slk-stat-item:last-child { border-right: none; }
  .slk-stat-num { font-family: 'Syne', sans-serif; font-size: 2.5rem; font-weight: 800; letter-spacing: -0.03em; color: var(--ink); line-height: 1; }
  .slk-stat-num span { color: var(--red); }
  .slk-stat-desc { font-size: 13px; color: var(--muted); margin-top: 4px; }

  /* SECTIONS */
  .slk-section { max-width: 1200px; margin: 0 auto; padding: 6rem 3rem; }
  .slk-section-eyebrow { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); font-weight: 500; margin-bottom: 1rem; }
  .slk-section-title { font-family: 'Syne', sans-serif; font-size: 2.8rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 1rem; }
  .slk-section-sub { font-size: 1.05rem; color: var(--muted); max-width: 480px; line-height: 1.7; }
  .slk-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: flex-end; }

  /* STEPS */
  .slk-steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-top: 4rem; }
  .slk-step-card {
    background: var(--card-bg); border: 0.5px solid var(--border);
    border-radius: 20px; padding: 2rem;
    transition: border-color 0.2s, transform 0.2s;
    opacity: 0; transform: translateY(20px);
  }
  .slk-step-card.slk-visible { opacity: 1; transform: translateY(0); transition: opacity 0.5s ease, transform 0.5s ease, border-color 0.2s; }
  .slk-step-card:hover { border-color: rgba(15,14,12,0.25); transform: translateY(-3px); }
  .slk-step-num { font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500; color: var(--muted); margin-bottom: 1.5rem; }
  .slk-step-icon {
    width: 48px; height: 48px; border-radius: 12px;
    background: var(--red-light); display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;
  }
  .slk-step-icon svg { width: 22px; height: 22px; stroke: var(--red); fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .slk-step-card h3 { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; }
  .slk-step-card p { font-size: 14px; color: var(--muted); line-height: 1.65; }

  /* FEATURES */
  .slk-features-section { background: var(--surface); padding: 6rem 0; }
  .slk-features-inner { max-width: 1200px; margin: 0 auto; padding: 0 3rem; }
  .slk-features-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
  .slk-feature-list { margin-top: 2.5rem; }
  .slk-feature-item { display: flex; gap: 1rem; margin-bottom: 1.75rem; }
  .slk-feature-dot {
    width: 36px; height: 36px; min-width: 36px; border-radius: 10px;
    background: var(--red-light); display: flex; align-items: center; justify-content: center; margin-top: 2px;
  }
  .slk-feature-dot svg { width: 16px; height: 16px; stroke: var(--red); fill: none; stroke-width: 2; stroke-linecap: round; }
  .slk-feature-item h4 { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; margin-bottom: 4px; }
  .slk-feature-item p { font-size: 14px; color: var(--muted); line-height: 1.6; }

  /* MOCKUP */
  .slk-links-mockup {
    background: var(--card-bg); border: 0.5px solid var(--border);
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 4px 40px rgba(0,0,0,0.07);
  }
  .slk-mockup-header {
    background: var(--surface); padding: 1rem 1.5rem;
    border-bottom: 0.5px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .slk-mockup-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; }
  .slk-mockup-filters { display: flex; gap: 6px; }
  .slk-filter-pill {
    padding: 0.25rem 0.75rem; border-radius: 100px;
    font-size: 11px; font-weight: 500; cursor: pointer;
    border: 0.5px solid var(--border); background: transparent; color: var(--muted);
    transition: all 0.15s;
  }
  .slk-filter-pill.slk-active { background: var(--ink); color: var(--cream); border-color: var(--ink); }
  .slk-link-row {
    display: grid; grid-template-columns: auto 1fr auto auto;
    gap: 1rem; align-items: center;
    padding: 0.875rem 1.5rem; border-bottom: 0.5px solid var(--border);
  }
  .slk-link-row:last-child { border-bottom: none; }
  .slk-status-badge { padding: 0.2rem 0.6rem; border-radius: 100px; font-size: 11px; font-weight: 500; white-space: nowrap; }
  .slk-status-paid { background: var(--green-light); color: var(--green); }
  .slk-status-pending { background: #FEF3C7; color: #92400E; }
  .slk-status-expired { background: #FEE2E2; color: #991B1B; }
  .slk-link-desc { font-size: 13px; font-weight: 500; }
  .slk-link-customer { font-size: 11px; color: var(--muted); margin-top: 2px; font-family: 'DM Mono', monospace; }
  .slk-link-amount { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500; text-align: right; }
  .slk-link-token { font-size: 11px; color: var(--muted); }
  .slk-open-btn {
    padding: 0.3rem 0.75rem; border-radius: 8px;
    font-size: 12px; border: 0.5px solid var(--border);
    background: transparent; cursor: pointer; color: var(--ink);
  }

  /* TOKENS SECTION */
  .slk-tokens-section { background: var(--ink); padding: 5rem 0; }
  .slk-tokens-inner { max-width: 1200px; margin: 0 auto; padding: 0 3rem; }
  .slk-tokens-eyebrow { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(247,244,239,0.4); font-weight: 500; margin-bottom: 1rem; }
  .slk-tokens-title { font-family: 'Syne', sans-serif; font-size: 2.8rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 1rem; color: var(--cream); }
  .slk-tokens-sub { font-size: 1.05rem; color: rgba(247,244,239,0.55); max-width: 480px; line-height: 1.7; }
  .slk-tokens-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; margin-top: 4rem; background: rgba(247,244,239,0.08); border-radius: 20px; overflow: hidden; }
  .slk-token-card { background: var(--ink2); padding: 2.5rem 2rem; transition: background 0.2s; opacity: 0; transform: translateY(20px); }
  .slk-token-card.slk-visible { opacity: 1; transform: translateY(0); transition: opacity 0.5s ease, transform 0.5s ease, background 0.2s; }
  .slk-token-card:hover { background: #3A3830; }
  .slk-tc-icon { font-size: 2rem; margin-bottom: 1.25rem; }
  .slk-tc-name { font-family: 'Syne', sans-serif; font-size: 1.25rem; font-weight: 800; color: var(--cream); letter-spacing: -0.02em; margin-bottom: 0.4rem; }
  .slk-tc-full { font-size: 13px; color: rgba(247,244,239,0.45); margin-bottom: 1rem; }
  .slk-tc-share {
    display: inline-block; padding: 0.25rem 0.75rem;
    border-radius: 100px; border: 0.5px solid rgba(247,244,239,0.15);
    font-size: 12px; color: rgba(247,244,239,0.6); font-family: 'DM Mono', monospace;
  }

  /* PROOF */
  .slk-proof-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 4rem; }
  .slk-proof-card {
    background: var(--card-bg); border: 0.5px solid var(--border);
    border-radius: 20px; padding: 2rem;
    opacity: 0; transform: translateY(20px);
  }
  .slk-proof-card.slk-visible { opacity: 1; transform: translateY(0); transition: opacity 0.5s ease, transform 0.5s ease; }
  .slk-proof-stars { color: var(--red); font-size: 14px; margin-bottom: 1rem; }
  .slk-proof-text { font-size: 14px; color: var(--ink); line-height: 1.7; margin-bottom: 1.5rem; font-style: italic; }
  .slk-proof-author { display: flex; align-items: center; gap: 10px; }
  .slk-proof-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--surface); display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 600; color: var(--ink);
  }
  .slk-proof-name { font-size: 13px; font-weight: 600; }
  .slk-proof-role { font-size: 11px; color: var(--muted); }

  /* CTA */
  .slk-cta-section { background: var(--red); padding: 6rem 3rem; text-align: center; position: relative; overflow: hidden; }
  .slk-cta-section::before {
    content: 'S1lk PAY'; position: absolute;
    font-family: 'Syne', sans-serif; font-size: 18rem; font-weight: 800;
    color: rgba(255,255,255,0.04); white-space: nowrap;
    top: 50%; left: 50%; transform: translate(-50%,-50%);
    letter-spacing: -0.05em; pointer-events: none;
  }
  .slk-cta-section h2 { font-family: 'Syne', sans-serif; font-size: 3.5rem; font-weight: 800; color: white; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 1rem; }
  .slk-cta-section p { color: rgba(255,255,255,0.7); font-size: 1.05rem; margin-bottom: 2.5rem; }
  .slk-btn-white {
    background: white; color: var(--red);
    padding: 0.9rem 2.5rem; border-radius: 100px;
    font-size: 15px; font-weight: 600;
    text-decoration: none; display: inline-block; transition: all 0.2s; border: none; cursor: pointer;
  }
  .slk-btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }

  /* FOOTER */
  .slk-footer { background: var(--ink); padding: 4rem 3rem 2rem; }
  .slk-footer-inner { max-width: 1200px; margin: 0 auto; }
  .slk-footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
  .slk-footer-brand p { font-size: 13px; color: rgba(247,244,239,0.45); margin-top: 0.75rem; line-height: 1.65; max-width: 260px; }
  .slk-footer-col h4 { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: rgba(247,244,239,0.8); margin-bottom: 1rem; }
  .slk-footer-col a { display: block; font-size: 13px; color: rgba(247,244,239,0.45); text-decoration: none; margin-bottom: 0.6rem; transition: color 0.2s; }
  .slk-footer-col a:hover { color: var(--cream); }
  .slk-footer-bottom { border-top: 0.5px solid rgba(247,244,239,0.1); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; }
  .slk-footer-bottom p { font-size: 12px; color: rgba(247,244,239,0.3); }

  @keyframes slkFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  .slk-hero-copy { animation: slkFadeUp 0.7s ease both; }
  .slk-hero-visual-wrap { animation: slkFadeUp 0.7s 0.2s ease both; }

  @media (max-width: 900px) {
    .slk-hero { grid-template-columns: 1fr; padding-top: 7rem; }
    .slk-hero-h1 { font-size: 2.8rem; }
    .slk-steps-grid { grid-template-columns: 1fr; }
    .slk-features-layout { grid-template-columns: 1fr; }
    .slk-stats-strip { grid-template-columns: 1fr 1fr; }
    .slk-tokens-grid { grid-template-columns: 1fr; }
    .slk-proof-grid { grid-template-columns: 1fr; }
    .slk-footer-top { grid-template-columns: 1fr 1fr; }
    .slk-nav { padding: 1rem 1.5rem; }
    .slk-section { padding: 4rem 1.5rem; }
    .slk-two-col { grid-template-columns: 1fr; }
  }
`;

// ── Small reusable pieces ──────────────────────────────────────────────────

const Logo = ({ light = false }) => (
  <span className="slk-logo" style={light ? { color: "#F7F4EF" } : {}}>
    <span className="slk-logo-mark">S</span>
    S1lk <span className="slk-logo-pay">PAY</span>
  </span>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
);

// ── Animated section observer hook ─────────────────────────────────────────

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll(".slk-step-card, .slk-proof-card, .slk-token-card");
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("slk-visible"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ── Data ───────────────────────────────────────────────────────────────────

const STATS = [
  { num: "~", accent: "2.1", suffix: "s", desc: "Average settlement time" },
  { num: "", accent: "5", suffix: "+", desc: "Supported crypto assets" },
  { num: "", accent: "∞", suffix: "", desc: "Borderless, global reach" },
  { num: "", accent: "0", suffix: "", desc: "Setup fees, forever" },
];

const STEPS = [
  {
    num: "01 / 04", title: "Create a payment link",
    desc: "Set the amount, choose the currency you want to receive (fiat or crypto), add a description and deadline. Your link or QR code is ready instantly.",
    icon: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>
  },
  {
    num: "02 / 04", title: "Customer pays in crypto",
    desc: "Your customer pays using any supported asset — USDC, USDT, SOL, KZTE/EVO, or PEPE. They scan the QR or click the link and pay from their wallet in one tap.",
    icon: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h2v2H7zM15 7h2v2h-2zM7 15h2v2H7zM11 11h2v2h-2zM15 15h2v2h-2z"/></>
  },
  {
    num: "03 / 04", title: "Auto-conversion if needed",
    desc: "If the customer pays with a different asset than your preferred settlement currency, our system handles the conversion automatically — no manual swaps, no rate risk.",
    icon: <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
  },
  {
    num: "04 / 04", title: "Receive your preferred currency",
    desc: "Funds land in your wallet as your chosen currency — stablecoin, SOL, or fiat. Withdraw anytime or let balances accumulate across payment links.",
    icon: <polyline points="20 6 9 17 4 12"/>
  },
];

const FEATURES = [
  {
    title: "Auto-conversion & fiat settlement",
    desc: "Customers pay in any crypto. We convert automatically and settle into your preferred currency — fiat, stablecoin, or native token — with no manual steps.",
    icon: <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
  },
  {
    title: "Multi-asset support",
    desc: "Accept USDC, USDT, SOL, KZTE/EVO, PEPE, and more. Merchants set what they receive; customers pay with whatever they hold.",
    icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  },
  {
    title: "Global, borderless payments",
    desc: "Remove bank wires, FX delays, and cross-border friction. Payments settle in seconds regardless of where your customer is in the world.",
    icon: <><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>
  },
  {
    title: "Unified merchant dashboard",
    desc: "Track income by asset, monitor pending vs settled payments, export CSVs for accounting, and manage all your payment links in one place.",
    icon: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></>
  },
];

const LINK_FILTERS = ["All 10", "Pending 3", "Paid 6"];
const PAYMENT_LINKS = [
  { status: "paid",    desc: "Annual subscription", customer: "Acme Co. · pl_l42ps733",      amount: "$49.00",    token: "USDC" },
  { status: "paid",    desc: "Custom integration",  customer: "Northwind · pl_ckd2gnie",      amount: "$1,200.00", token: "SOL"  },
  { status: "pending", desc: "Audit report",         customer: "Pied Piper · pl_05bqyenj",    amount: "$320.00",   token: "USDT" },
  { status: "pending", desc: "Q2 license renewal",   customer: "Wonka Labs · pl_aznz1clz",    amount: "$480.00",   token: "SOL"  },
  { status: "expired", desc: "Setup fee",            customer: "Stark Industries · pl_pgy1r06x", amount: "$2,500.00", token: "USDC" },
];

const TOKENS = [
  { icon: "$",  name: "USDC",  full: "USD Coin · Circle",      tag: "Stablecoin"      },
  { icon: "₮",  name: "USDT",  full: "Tether USD · Tether",    tag: "Stablecoin"      },
  { icon: "◎",  name: "SOL",   full: "Solana · Solana Labs",   tag: "Native asset"    },
  { icon: "K",  name: "KZTE",  full: "EVO · Regional asset",   tag: "Local currency"  },
  { icon: "🐸", name: "PEPE",  full: "Pepe · Meme token",      tag: "Community asset" },
];

const TESTIMONIALS = [
  { quote: "My client in Singapore paid in SOL and I received USD straight to my account. No FX desk, no wire delays. This is what cross-border payments should have always been.", initials: "MC", name: "Marcus Chen",  role: "Agency founder, APAC"  },
  { quote: "We invoice enterprise clients in USDT but settle internally in fiat. S1lk PAY handles the whole conversion flow — it cut our finance team's reconciliation work in half.", initials: "AP", name: "Anya Patel",   role: "CFO, Globex Corp"      },
  { quote: "Our customers aren't all crypto-native, but scanning a QR code is easy enough for anyone. The fact that they can pay in PEPE and we get USDC is wild — and it just works.", initials: "JV", name: "Jamie Vance",  role: "Co-founder, Vandelay"  },
];

const FOOTER_LINKS = {
  Product:    ["Dashboard", "Payment Links", "Auto-conversion", "Analytics"],
  Developers: ["API docs", "Webhooks", "Status page"],
  Company:    ["About", "Privacy", "Terms", "Contact"],
};

const DASHBOARD_TOKEN_ROWS = [
  { icon: "◎", name: "SOL",  sub: "Solana",   amount: "$1,200", pct: "67%" },
  { icon: "₮", name: "USDT", sub: "Tether",   amount: "$348",   pct: "19%" },
  { icon: "$", name: "USDC", sub: "USD Coin", amount: "$237",   pct: "13%" },
];

const HERO_BARS = [
  { h: "40%"  }, { h: "55%"  }, { h: "35%"  }, { h: "70%", active: true },
  { h: "45%"  }, { h: "100%", active: true }, { h: "60%" },
];

// ── Main component ─────────────────────────────────────────────────────────

export function LandingPage() {
  const [activeFilter, setActiveFilter] = useState(0);
  const revealRef = useReveal();

  const statusClass = (s) =>
    s === "paid" ? "slk-status-paid" : s === "pending" ? "slk-status-pending" : "slk-status-expired";
  const statusLabel = (s) =>
    s === "paid" ? "Paid" : s === "pending" ? "Pending" : "Expired";

  return (
    <div className="slk-root">
      <style>{styles}</style>

      {/* ── NAV ── */}
      <nav className="slk-nav">
        <Logo />
        <div className="slk-nav-links">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#tokens">Supported assets</a>
          <a href="#pricing">For business</a>
        </div>
        <a href="#cta" className="slk-nav-cta">Get started →</a>
      </nav>

      {/* ── HERO ── */}
      <div className="slk-hero">
        <div className="slk-hero-copy">
          <div className="slk-hero-eyebrow">
            <span className="slk-badge-dot" />
            B2B &amp; B2C · Global payment infrastructure
          </div>
          <h1 className="slk-hero-h1">
            Accept crypto. <em>Settle in fiat.</em>
          </h1>
          <p className="slk-hero-p">
            S1lk PAY lets merchants create payment links or QR codes in seconds. Customers pay in any supported crypto asset — we handle conversion automatically and settle funds into your preferred currency, whether fiat or stable.
          </p>
          <div className="slk-hero-actions">
            <a href="#cta" className="slk-btn-primary">Start for free</a>
            <a href="#how" className="slk-btn-ghost">
              See how it works
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="slk-hero-visual-wrap">
          <div className="slk-hero-visual">
            {/* Top pill */}
            <div className="slk-pill-float">
              <CheckIcon />
              $1,200 settled → USD in 2.1s
            </div>

            {/* Dashboard card */}
            <div className="slk-dashboard-card">
              <div className="slk-dash-header">
                <div>
                  <div className="slk-dash-title">Dashboard</div>
                  <div className="slk-dash-sub">Sandbox Merchant · Solana Mainnet</div>
                </div>
                <button className="slk-new-link-btn">+ New link</button>
              </div>

              <div className="slk-metrics-grid">
                {/* Total received */}
                <div className="slk-metric">
                  <div className="slk-metric-label">Total received</div>
                  <div className="slk-metric-value">$1,785</div>
                  <div className="slk-metric-tag slk-tag-up">↑ +18.4% vs last 14d</div>
                  <div className="slk-mini-chart">
                    {HERO_BARS.map((b, i) => (
                      <div key={i} className={`slk-mini-bar${b.active ? " slk-active" : ""}`} style={{ height: b.h }} />
                    ))}
                  </div>
                </div>
                {/* Successful payments */}
                <div className="slk-metric">
                  <div className="slk-metric-label">Successful payments</div>
                  <div className="slk-metric-value">6/10</div>
                  <div className="slk-metric-tag slk-tag-up">↑ 86% success rate</div>
                  <div className="slk-mini-chart">
                    {[60,40,80,55,90,70,100].map((h, i) => (
                      <div key={i} className={`slk-mini-bar${i === 4 ? " slk-active" : ""}`} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                {/* Avg settlement */}
                <div className="slk-metric">
                  <div className="slk-metric-label">Avg settlement</div>
                  <div className="slk-metric-value">~2.1s</div>
                  <div className="slk-metric-tag slk-tag-up">↓ 0.4s faster</div>
                </div>
                {/* Pending */}
                <div className="slk-metric">
                  <div className="slk-metric-label">Pending</div>
                  <div className="slk-metric-value">$875</div>
                  <div className="slk-metric-tag slk-tag-info">3 awaiting payment</div>
                </div>
              </div>

              {/* Token rows */}
              <div style={{ marginTop: "1rem", borderTop: "0.5px solid var(--border)", paddingTop: "1rem" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Income by token
                </div>
                {DASHBOARD_TOKEN_ROWS.map((t) => (
                  <div key={t.name} className="slk-token-row">
                    <div className="slk-token-icon">{t.icon}</div>
                    <div className="slk-token-name">{t.name}<small>{t.sub}</small></div>
                    <div>
                      <div className="slk-token-amount">{t.amount}</div>
                      <div className="slk-token-pct">{t.pct}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom pill */}
            <div className="slk-pill-float2">
              <span className="slk-settle-dot" />
              Northwind paid SOL → settled as USD
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      <div className="slk-stats-strip">
        {STATS.map((s, i) => (
          <div key={i} className="slk-stat-item">
            <div className="slk-stat-num">
              {s.num}<span>{s.accent}</span>{s.suffix}
            </div>
            <div className="slk-stat-desc">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="slk-section" ref={revealRef}>
        <div className="slk-section-eyebrow">How it works</div>
        <div className="slk-two-col">
          <div>
            <h2 className="slk-section-title">From payment link<br />to fiat — in seconds</h2>
          </div>
          <div>
            <p className="slk-section-sub">
              No bank wires. No crypto complexity for your customers. Create a link, let them pay in any supported asset, and receive your preferred currency — automatically converted and settled.
            </p>
          </div>
        </div>
        <div className="slk-steps-grid">
          {STEPS.map((step) => (
            <div key={step.num} className="slk-step-card">
              <div className="slk-step-num">{step.num}</div>
              <div className="slk-step-icon">
                <svg viewBox="0 0 24 24">{step.icon}</svg>
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <div className="slk-features-section" id="features">
        <div className="slk-features-inner">
          <div className="slk-features-layout">
            {/* Left: feature list */}
            <div>
              <div className="slk-section-eyebrow">Features</div>
              <h2 className="slk-section-title">Payment infrastructure for the borderless economy</h2>
              <div className="slk-feature-list">
                {FEATURES.map((f) => (
                  <div key={f.title} className="slk-feature-item">
                    <div className="slk-feature-dot">
                      <svg viewBox="0 0 24 24">{f.icon}</svg>
                    </div>
                    <div>
                      <h4>{f.title}</h4>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: payment links mockup */}
            <div>
              <div className="slk-links-mockup">
                <div className="slk-mockup-header">
                  <div className="slk-mockup-title">Payment links</div>
                  <div className="slk-mockup-filters">
                    {LINK_FILTERS.map((label, i) => (
                      <button
                        key={label}
                        className={`slk-filter-pill${activeFilter === i ? " slk-active" : ""}`}
                        onClick={() => setActiveFilter(i)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                {PAYMENT_LINKS.map((link, i) => (
                  <div key={i} className="slk-link-row">
                    <span className={`slk-status-badge ${statusClass(link.status)}`}>
                      {statusLabel(link.status)}
                    </span>
                    <div>
                      <div className="slk-link-desc">{link.desc}</div>
                      <div className="slk-link-customer">{link.customer}</div>
                    </div>
                    <div className="slk-link-amount">
                      {link.amount}
                      <div className="slk-link-token">{link.token}</div>
                    </div>
                    <button className="slk-open-btn">Open →</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TOKENS ── */}
      <div className="slk-tokens-section" id="tokens" ref={revealRef}>
        <div className="slk-tokens-inner">
          <div className="slk-tokens-eyebrow">Supported assets</div>
          <div className="slk-two-col" style={{ marginBottom: "0" }}>
            <h2 className="slk-tokens-title">Five assets.<br />One checkout.<br />Any currency out.</h2>
            <p className="slk-tokens-sub">
              Customers pay in the asset they hold. You choose what currency you want to receive — we handle the conversion and settlement automatically.
            </p>
          </div>
          <div className="slk-tokens-grid">
            {TOKENS.map((t) => (
              <div key={t.name} className="slk-token-card">
                <div className="slk-tc-icon">{t.icon}</div>
                <div className="slk-tc-name">{t.name}</div>
                <div className="slk-tc-full">{t.full}</div>
                <span className="slk-tc-share">{t.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <section className="slk-section" ref={revealRef}>
        <div className="slk-section-eyebrow">What merchants say</div>
        <h2 className="slk-section-title">Built for businesses operating globally in crypto</h2>
        <div className="slk-proof-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.initials} className="slk-proof-card">
              <div className="slk-proof-stars">★★★★★</div>
              <p className="slk-proof-text">"{t.quote}"</p>
              <div className="slk-proof-author">
                <div className="slk-proof-avatar">{t.initials}</div>
                <div>
                  <div className="slk-proof-name">{t.name}</div>
                  <div className="slk-proof-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="slk-cta-section" id="cta">
        <h2>The world pays in crypto.<br />You receive what you want.</h2>
        <p>Free to set up. No monthly fees. First payment link in under a minute.</p>
        <a href="#" className="slk-btn-white">Start accepting payments →</a>
      </div>

      {/* ── FOOTER ── */}
      <footer className="slk-footer">
        <div className="slk-footer-inner">
          <div className="slk-footer-top">
            <div className="slk-footer-brand">
              <Logo light />
              <p>Borderless crypto payment infrastructure for businesses and individuals. Accept any asset, settle in any currency.</p>
            </div>
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading} className="slk-footer-col">
                <h4>{heading}</h4>
                {links.map((l) => <a key={l} href="#">{l}</a>)}
              </div>
            ))}
          </div>
          <div className="slk-footer-bottom">
            <p>© 2026 S1lk PAY. Borderless payment infrastructure.</p>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11 }}>sandbox@s1lk.pay</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
