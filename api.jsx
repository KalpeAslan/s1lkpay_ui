import { QueryClient } from "@tanstack/react-query";

const BASE = "http://localhost:3000";

export function getToken() { return localStorage.getItem("s1lk_token"); }
export function setToken(t) { localStorage.setItem("s1lk_token", t); }
export function clearToken() { localStorage.removeItem("s1lk_token"); }

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function apiFetch(path, options = {}) {
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = Array.isArray(err.message) ? err.message[0] : (err.message || `HTTP ${res.status}`);
    throw new Error(msg);
  }
  return res.json();
}

function normalizeLink(l) {
  if (!l) return null;
  return {
    id: l.id,
    slug: l.slug,
    created: l.createdAt ? new Date(l.createdAt).getTime() : null,
    deadline: l.deadline ? new Date(l.deadline).getTime() : null,
    paid: l.paidAt ? new Date(l.paidAt).getTime() : null,
    amount: Number(l.amount),
    tokenAmount: Number(l.cryptoAmount),
    token: l.token,
    description: l.description || "",
    customer: l.customerName || "—",
    customerNote: l.customerNote || "",
    status: l.status,
    walletAddr: l.walletAddress || "",
    txHash: l.txHash || null,
    businessName: l.businessName || l.user?.businessName || "",
    payUrl: l.payUrl || `https://pay.s1lk.app/${l.slug}`,
    qrCode: l.qrCode || null,
    network: l.network || "Solana · Mainnet",
  };
}

export const api = {
  // Auth
  login: (data) => apiFetch("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  me: () => apiFetch("/auth/me"),

  // Dashboard
  dashboard: () => apiFetch("/dashboard").then((d) => ({
    ...d,
    recentActivity: (d.recentActivity || []).map(normalizeLink),
  })),

  // Payment links
  getLinks: (params = {}) => {
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v && v !== "all"));
    const q = new URLSearchParams(clean).toString();
    return apiFetch("/payment-links" + (q ? "?" + q : "")).then((d) => ({
      ...d,
      links: (d.links || []).map(normalizeLink),
    }));
  },
  createLink: (data) => apiFetch("/payment-links", { method: "POST", body: JSON.stringify(data) })
    .then(normalizeLink),
  getLink: (id) => apiFetch("/payment-links/" + id).then(normalizeLink),
  simulateLink: (id) => apiFetch("/payment-links/" + id + "/simulate", { method: "POST" })
    .then(normalizeLink),
  exportLinksUrl: () => BASE + "/payment-links/export",

  // Payments analytics
  payments: (days) => apiFetch("/payments" + (days ? "?days=" + days : "")),

  // Settings
  getSettings: () => apiFetch("/settings"),
  updateSettings: (data) => apiFetch("/settings", { method: "PUT", body: JSON.stringify(data) }),

  // Wallet
  wallet: () => apiFetch("/wallet"),

  // Withdrawals
  createWithdrawal: (data) => apiFetch("/withdrawals", { method: "POST", body: JSON.stringify(data) }),
  getWithdrawals: () => apiFetch("/withdrawals"),

  // Public pay (no auth required)
  publicLink: (slug) => apiFetch("/pay/" + slug).then(normalizeLink),
  confirmPayment: (slug, data) => apiFetch("/pay/" + slug + "/confirm", { method: "POST", body: JSON.stringify(data) }),
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

Object.assign(window, { api, queryClient, getToken, setToken, clearToken });
