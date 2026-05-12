import { apiFetch } from "./apiFetch.js";

async function safeFetch(path) {
  try {
    return await apiFetch(path);
  } catch {
    return null;
  }
}

export async function fetchWalletOverview() {
  const [record, balanceData, txList] = await Promise.all([
    safeFetch("/wallet"),
    safeFetch("/wallet/balance"),
    safeFetch("/wallet/transactions"),
  ]);

  const publicKey = balanceData?.publicKey ?? record?.publicKey ?? "";
  const balances = Array.isArray(balanceData?.balances)
    ? balanceData.balances.map((b) => ({
        sym: b.symbol,
        amount: b.balance,
        pending: 0,
      }))
    : [];

  const rawTx = Array.isArray(txList) ? txList : [];
  const transactions = rawTx.map((t, i) => ({
    id: t.txHash ?? `tx-${i}`,
    desc: "On-chain activity",
    from: "—",
    amount: 0,
    sym: "SOL",
    t: t.blockTime != null ? new Date(t.blockTime).getTime() : null,
    txHash: t.txHash,
  }));

  return {
    walletAddress: publicKey,
    balances,
    transactions,
    custodialWallet: record,
  };
}
