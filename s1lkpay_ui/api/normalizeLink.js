export function normalizeLink(l) {
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
    walletAddr: l.walletAddress || l.user?.walletAddress || "",
    txHash: l.txHash || null,
    tokenAddress: l.tokenAddress || null,
    tokenDecimals: Number.isFinite(l.tokenDecimals) ? l.tokenDecimals : 6,
    businessName: l.businessName || l.user?.businessName || "",
    payUrl: l.payUrl || `https://pay.s1lk.app/${l.slug}`,
    qrCode: l.qrCode || null,
    network: l.network || "Solana · Mainnet",
  };
}
