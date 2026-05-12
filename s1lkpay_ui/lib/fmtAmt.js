export function fmtAmt(n, decimals = 2) {
  if (!isFinite(n)) return "0";
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
