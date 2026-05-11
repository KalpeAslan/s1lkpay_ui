import { apiFetch, BASE } from "./apiFetch.js";
import { normalizeLink } from "./normalizeLink.js";
import { fetchWalletOverview } from "./walletOverview.js";

export const api = {
  login: (data) => apiFetch("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  me: () => apiFetch("/auth/me"),

  dashboard: () =>
    apiFetch("/dashboard").then((d) => ({
      ...d,
      recentActivity: (d.recentActivity || []).map(normalizeLink),
    })),

  getLinks: async (params = {}) => {
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v && v !== "all"));
    const q = new URLSearchParams(clean).toString();
    const d = await apiFetch("/payment-links" + (q ? "?" + q : ""));
    return { ...d, links: (d.links || []).map(normalizeLink) };
  },
  createLink: (data) => apiFetch("/payment-links", { method: "POST", body: JSON.stringify(data) }).then(normalizeLink),
  getLink: (id) => apiFetch("/payment-links/" + id).then(normalizeLink),
  simulateLink: (id) => apiFetch("/payment-links/" + id + "/simulate", { method: "POST" }).then(normalizeLink),
  exportLinksUrl: () => BASE + "/payment-links/export",

  payments: (days) => apiFetch("/payments" + (days ? "?days=" + days : "")),

  getSettings: () => apiFetch("/settings"),
  updateSettings: (data) => apiFetch("/settings", { method: "PUT", body: JSON.stringify(data) }),

  /** Balances + txs + `custodialWallet` record from GET /wallet (when present). */
  wallet: () => fetchWalletOverview(),
  /** Raw custodial wallet row: id, publicKey, encryptedPrivateKey, userId, createdAt */
  walletRecord: () => apiFetch("/wallet"),
  /** Decrypted export — use only after explicit user confirmation. */
  exportWallet: () => apiFetch("/wallet/export"),
  createCustodialWallet: () => apiFetch("/wallet", { method: "POST" }),

  createWithdrawal: (data) => apiFetch("/withdrawals", { method: "POST", body: JSON.stringify(data) }),
  getWithdrawals: () => apiFetch("/withdrawals"),

  publicLink: (slug) => apiFetch("/pay/" + slug).then(normalizeLink),
  confirmPayment: (slug, data) => apiFetch("/pay/" + slug + "/confirm", { method: "POST", body: JSON.stringify(data) }),
};
